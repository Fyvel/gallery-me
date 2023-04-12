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

export const getTopRatedMovies = async (page = 1) => {
	const response = await fetch(`${tmdbUrl}/3/movie/top_rated?${commonParams}&page=${page}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const getUpcomingMovies = async (page = 1) => {
	const response = await fetch(`${tmdbUrl}/3/movie/upcoming?${commonParams}&page=${page}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const getNowPlayingMovies = async (page = 1) => {
	const response = await fetch(`${tmdbUrl}/3/movie/now_playing?${commonParams}&page=${page}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const getMovieGenres = async () => {
	const response = await fetch(`${tmdbUrl}/3/genre/movie/list?${commonParams}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}

export const searchMovies = async (params: Record<string, string>, page = 1) => {
	params['api_key'] = tmdbApiKey!
	params['language'] = language
	params['page'] = `${page}`
	const searchParams = new URLSearchParams(params)
	const response = await fetch(`${tmdbUrl}/3/discover/movie?${encodeURIComponent(searchParams.toString())}`,
		{ headers: { 'Content-Type': 'application/json' } }
	)
	const data = await response.json()
	return data
}
