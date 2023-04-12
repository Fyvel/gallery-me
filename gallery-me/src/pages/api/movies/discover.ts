import { searchMovies } from '@/lib/tmdb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Movies>) {
	const movies = (await searchMovies({}))
	res.status(200).json(movies)
}
