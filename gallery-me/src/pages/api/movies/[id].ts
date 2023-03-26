import type { NextApiRequest, NextApiResponse } from 'next'
import { getMovie } from '@/lib/tmdb'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Movie[]>) {
	const movies = (await getMovie(req.query.id as string || ''))
	res.status(200).json(movies)
}
