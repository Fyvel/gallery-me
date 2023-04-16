import { searchMovies } from '@/lib/tmdb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Movies>) {
	const movies = (await searchMovies({
		query: req.query.terms as string,
		page: (req.query.page || '1') as string
	}))
	res.status(200).json(movies)
}
