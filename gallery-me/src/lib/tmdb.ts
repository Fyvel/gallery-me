const tmdbUrl = 'https://api.themoviedb.org'
const tmdbApiKey = process.env.TMDB_API_KEY
const tmdbAccessToken = process.env.TMDB_ACCESS_TOKEN
const language = 'en-AU'

export const commonParams = `api_key=${tmdbApiKey}&language=${language}`

export const getMovie = async (id: number) => {
	const response = await fetch(`${tmdbUrl}/3/movie/${id}?${commonParams}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const getMovieVideos = async (id: number) => {
	const response = await fetch(`${tmdbUrl}/3/movie/${id}/videos?${commonParams}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const getMovieCredits = async (id: number) => {
	const response = await fetch(`${tmdbUrl}/3/movie/${id}/credits?${commonParams}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const getMovieRecommendations = async (id: number) => {
	const response = await fetch(`${tmdbUrl}/3/movie/${id}/recommendations?${commonParams}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const getPopularMovies = async (page = 1) => {
	const response = await fetch(`${tmdbUrl}/3/movie/popular?${commonParams}&page=${page}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const createList = async (name: string, description: string, accessToken: string) => {
	const response = await fetch(`${tmdbUrl}/4/list?${commonParams}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
			body: JSON.stringify({ name, description, iso_639_1: 'en' }),
		}
	)
	const data = await response.json()
	return data
}

export const addMovieToList = async (listId: number, movieId: number) => {
	const response = await fetch(`${tmdbUrl}/4/list/${listId}/items?${commonParams}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ items: [{ media_id: movieId, media_type: 'movie' }] }),
		}
	)
	const data = await response.json()
	return data
}
