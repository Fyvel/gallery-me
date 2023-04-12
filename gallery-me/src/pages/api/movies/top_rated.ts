import { getTopRatedMovies } from '@/lib/tmdb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Movies>) {
	const movies = (await getTopRatedMovies(+(req.query?.page || 1)))
	res.status(200).json(movies)
}
