'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import useSWRInfinite from 'swr/infinite'

type SearchContextType = {
	search?: MovieFiltersType,
	setSearch: (value: MovieFiltersType) => void,
	data?: Movies[],
	page: number,
	nextPage: (size: number | ((_size: number) => number)) => void,
	isLoading: boolean,
	reset: () => void,
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const useSearch = () => {
	const context = useContext(SearchContext)
	if (!context) throw Error('SearchContext hasn\'t been provided!')
	return context
}

const fetchSearch = (url: string) => fetch(url).then(res => res.json())


type SearchContextProviderProps = {
	children: React.ReactNode,
}
export default function SearchContextProvider({ children }: SearchContextProviderProps) {
	const [search, setSearch] = useState<MovieFiltersType>()
	const initialSearch = useRef<MovieFiltersType>()

	const buildSearchQuery = (search?: MovieFiltersType, pageIndex?: number) => {
		const query = new URLSearchParams()
		query.append('page', `${pageIndex || 1}`)

		if (!search) {
			console.log('`${query}`:', `${query}`)
			return `${query}`
		}
		const { filters, terms } = search
		if (terms)
			query.append('terms', encodeURIComponent(terms))
		if (filters.genres?.length)
			query.append('with_genres', encodeURIComponent(filters.genres.join('|')))
		if (filters.year)
			query.append('year', filters.year.toString())
		if (filters.certification) {
			query.append('certification_country', 'AU')
			query.append('certification', filters.certification)
		}
		if (filters.sortBy)
			query.append('sort_by', filters.sortBy)
		console.log('`${query}`:', `${query}`)
		return `${query}`
	}
	const { data, setSize, isLoading } = useSWRInfinite<Movies>((index, prev) => (prev && prev.length)
		? null
		: `/api/${search?.route || 'movies/popular'}?${buildSearchQuery(search, +index + 1)}`, fetchSearch)

	useEffect(() => {
		if (initialSearch.current) return
		initialSearch.current = search
	}, [search])

	const reset = () => { setSearch(initialSearch.current) }

	return (
		<SearchContext.Provider value={{ search, setSearch, data, page: 1, nextPage: setSize, isLoading, reset }}>
			{children}
		</SearchContext.Provider>
	)
}

export type MovieFiltersType = {
	terms?: string,
	route: 'movies/now-playing'
	| 'movies/popular'
	| 'movies/top-rated'
	| 'movies/upcoming'
	| 'movies/discover'
	| 'movies/search',
	filters: {
		genres: number[],
		year?: number,
		certification?: string,
		sortBy?: 'popularity.asc'
		| 'popularity.desc'
		| 'release_date.asc'
		| 'release_date.desc'
		| 'revenue.asc'
		| 'revenue.desc'
		| 'primary_release_date.asc'
		| 'primary_release_date.desc'
		| 'original_title.asc'
		| 'original_title.desc'
		| 'vote_average.asc'
		| 'vote_average.desc'
		| 'vote_count.asc'
		| 'vote_count.desc'
	}
}