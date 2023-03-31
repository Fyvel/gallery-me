import type { NextApiRequest, NextApiResponse } from 'next'
import { getMovie } from '@/lib/tmdb'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Movie[] | ApiError>) {
	if (!req.query.id)
		return res.status(400).json({ code: 400, message: 'Missing id' })
	const movies = (await getMovie(+req.query.id))
	res.status(200).json(movies)
}
