const tmdbUrl = 'https://api.themoviedb.org/3'
const tmdbApiKey = process.env.TMDB_API_KEY
const language = 'en-Au'

export const commonParams = `api_key=${tmdbApiKey}&language=${language}`

export const getMovie = async (id: string) => {
	const response = await fetch(`${tmdbUrl}/movie/${id}?${commonParams}`)
	const data = await response.json()
	return data
}

export const getPopularMovies = async (page = 1) => {
	const response = await fetch(`${tmdbUrl}/movie/popular?${commonParams}&page=${page}`)
	const data = await response.json()
	return data
}

export const getTopRatedMovies = async (page = 1) => {
	const response = await fetch(`${tmdbUrl}/movie/top_rated?${commonParams}&page=${page}`)
	const data = await response.json()
	return data
}

export const getUpcomingMovies = async (page = 1) => {
	const response = await fetch(`${tmdbUrl}/movie/upcoming?${commonParams}&page=${page}`)
	const data = await response.json()
	return data
}

export const getPoster = async (image: string) => {
	const response = await fetch(`https://image.tmdb.org/t/p/w500/${image}`)
	const data = await response.blob()
	return data
}