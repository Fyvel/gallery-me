import { discoverMovies } from '@/lib/tmdb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Movies>) {
	const movies = (await discoverMovies({ ...req.query as Record<string, string> }))
	res.status(200).json(movies)
}
