const tmdbUrl = 'https://api.themoviedb.org/3'
const tmdbApiKey = process.env.TMDB_API_KEY
const language = 'en-AU'

export const commonParams = `api_key=${tmdbApiKey}&language=${language}`

export const getMovie = async (id: number) => {
	const response = await fetch(`${tmdbUrl}/movie/${id}?${commonParams}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const getMovieVideos = async (id: number) => {
	const response = await fetch(`${tmdbUrl}/movie/${id}/videos?${commonParams}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const getMovieCredits = async (id: number) => {
	const response = await fetch(`${tmdbUrl}/movie/${id}/credits?${commonParams}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const getMovieRecommendations = async (id: number) => {
	const response = await fetch(`${tmdbUrl}/movie/${id}/recommendations?${commonParams}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const getPopularMovies = async (page = 1) => {
	const response = await fetch(`${tmdbUrl}/movie/popular?${commonParams}&page=${page}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}
