import type { NextApiRequest, NextApiResponse } from 'next'
import { getMovieVideos } from '@/lib/tmdb'

export default async function handler(req: NextApiRequest, res: NextApiResponse<MovieVideo[]>) {
	const movies = (await getMovieVideos(req.query.id as string || '')).results
	res.status(200).json(movies)
}
