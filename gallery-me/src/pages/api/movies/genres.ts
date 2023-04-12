import { getMovieGenres } from '@/lib/tmdb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Movies>) {
	const genres = (await getMovieGenres())?.genres
	res.status(200).json(genres)
}
