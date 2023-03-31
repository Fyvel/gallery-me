import type { NextApiRequest, NextApiResponse } from 'next'
import { getMovieVideos } from '@/lib/tmdb'

export default async function handler(req: NextApiRequest, res: NextApiResponse<MovieVideo[] | ApiError>) {
	if (!req.query.id)
		return res.status(400).json({ code: 400, message: 'Missing id' })
	const response = (await getMovieVideos(+req.query.id)).results as MovieVideo[]
	const videos = response.sort((a, b) => {
		const typeOrder = [
			'Trailer', 'Teaser', 'Clip',
			'Featurette', 'Behind the Scenes', 'Bloopers',
		]
		const aTypeIndex = typeOrder.includes(a.type) ? typeOrder.indexOf(a.type) : Infinity
		const bTypeIndex = typeOrder.includes(b.type) ? typeOrder.indexOf(b.type) : Infinity
		if (aTypeIndex === bTypeIndex)
			return a.name.localeCompare(b.name)
		return aTypeIndex - bTypeIndex
	})
	res.status(200).json(videos)
}
