import type { NextApiRequest, NextApiResponse } from 'next'
import { getMovieRecommendations } from '@/lib/tmdb'

export default async function handler(req: NextApiRequest, res: NextApiResponse<MovieRecommendations | ApiError>) {
	if (!req.query.id)
		return res.status(400).json({ code: 400, message: 'Missing id' })
	const recommendations = (await getMovieRecommendations(+req.query.id))
	res.status(200).json(recommendations)
}
