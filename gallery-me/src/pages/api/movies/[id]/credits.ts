import type { NextApiRequest, NextApiResponse } from 'next'
import { getMovieCredits } from '@/lib/tmdb'

export default async function handler(req: NextApiRequest, res: NextApiResponse<MovieCredits | ApiError>) {
	if (!req.query.id)
		return res.status(400).json({ code: 400, message: 'Missing id' })
	const response = (await getMovieCredits(+req.query.id)) as MovieCredits
	const credits = {
		...response,
		crew: response.crew
			?.sort((a, b) => {
				const jobOrder = [
					'Director', 'Producer', 'Story',
					'Screenplay', 'Editor', 'Cinematographer',
					'Production Designer', 'Art Director',
				]
				const aJobIndex = jobOrder.includes(a.job) ? jobOrder.indexOf(a.job) : Infinity
				const bJobIndex = jobOrder.includes(b.job) ? jobOrder.indexOf(b.job) : Infinity
				if (aJobIndex === bJobIndex)
					return a.name.localeCompare(b.name)
				return aJobIndex - bJobIndex
			})
			.reduce((acc, curr) => {
				const index = acc.findIndex(crew => crew.id === curr.id)
				if (index === -1) {
					acc.push({ ...curr })
				} else {
					acc[index].job = `${acc[index].job}, ${curr.job}`
				}
				return acc
			}, [] as MovieCrew[])
	}
	res.status(200).json(credits)
}
