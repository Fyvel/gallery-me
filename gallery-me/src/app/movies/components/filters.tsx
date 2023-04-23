'use client'

import { MovieFiltersType, useSearch } from '@/contexts/search-provider'
import { MouseEventHandler, useRef } from 'react'
import useSWR from 'swr'

const fetchMoviesGenres = (url: string) => fetch(url).then(res => res.json())

type MovieFilterProps = {
	onClose: () => void,
	initial: MovieFiltersType,
}
export default function MovieFilters({ onClose, initial }: MovieFilterProps) {
	const { data: genres } = useSWR<MovieGenre[]>('/api/movies/genres', fetchMoviesGenres)
	const { search, setSearch } = useSearch()
	const currentSortBy = useRef(search?.filters?.sortBy || 'popularity.desc')

	const handleChange = async (change: MovieFiltersType) => {
		if (change.route === 'movies/popular')
			currentSortBy.current = 'popularity.desc'
		else if (change.route === 'movies/top-rated')
			currentSortBy.current = 'vote_average.desc'
		else if (change.route === 'movies/now-playing')
			currentSortBy.current = 'release_date.desc'
		else if (change.route === 'movies/upcoming')
			currentSortBy.current = 'release_date.desc'
		else if (change.route === 'movies/discover')
			change.filters.sortBy = change.filters.sortBy || currentSortBy.current

		setSearch(change)
	}

	const handleClose: MouseEventHandler<HTMLButtonElement> = event => {
		event.preventDefault()
		event.stopPropagation()
		onClose()
	}

	return (
		<div className="flex flex-col">
			<div className="grid my-4">
				<div className="flex flex-col gap-2">
					<label>Category:</label>
					<select className="w-full max-w-sm px-1 py-2 mb-4 border rounded shadow appearance-none"
						value={search?.route}
						onChange={(e) => handleChange({
							route: e.target.value as MovieFiltersType['route'],
							filters: {
								...search?.filters,
								genres: search?.filters?.genres || [],
							},
						})}>
						{search?.route === 'movies/discover' && <option value="movies/discover" disabled>- Discover -</option>}
						<option value="movies/popular">Popular</option>
						<option value="movies/now_playing">Now Playing</option>
						<option value="movies/top_rated">Top Rated</option>
						<option value="movies/upcoming">Upcoming</option>
					</select>
				</div>
				<div className="w-full h-px mt-2 mb-4 bg-gray-400" />
				<div className="flex flex-col gap-2 mb-4">
					<label>Genres:</label>
					<div className="flex flex-wrap w-full gap-x-4 gap-y-2">
						{genres?.map(genre => (
							<span key={genre.id} className="flex items-center gap-2 p-2 border-2 border-solid rounded-lg">
								<label className="block text-sm cursor-pointer md:text-md" htmlFor={`${genre.id}`}>{genre.name}</label>
								<input
									id={`${genre.id}`}
									className="w-6 h-6 cursor-pointer"
									name={genre.name}
									type="checkbox"
									checked={search?.filters.genres?.includes(genre.id) || false}
									onChange={(e) =>
										handleChange({
											route: 'movies/discover',
											filters: {
												...search?.filters,
												genres: (search?.filters.genres || []).indexOf(+e.target.id) >= 0
													? (search?.filters.genres || []).filter(x => x !== +e.target.id)
													: [...(search?.filters.genres || []), +e.target.id],
											}
										})
									}
								/>
							</span>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<label>Sort By:</label>
					<select className="w-full max-w-sm px-1 py-2 mb-4 border rounded shadow appearance-none"
						value={search?.filters?.sortBy}
						onChange={(e) => handleChange({
							route: 'movies/discover',
							filters: {
								...search?.filters,
								sortBy: e.target.value as MovieFiltersType['filters']['sortBy'],
								genres: search?.filters?.genres || [],
							}
						})}
					>
						<option value="popularity.desc">Popularity Descending</option>
						<option value="popularity.asc">Popularity Ascending</option>

						<option value="release_date.desc">Release Date Descending</option>
						<option value="release_date.asc">Release Date Ascending</option>

						<option value="vote_average.desc">Rating Descending</option>
						<option value="vote_average.asc">Rating Ascending</option>
					</select>
				</div>
				<div className="flex flex-col gap-2">
					<label>Year:</label>
					<select className="w-full max-w-sm px-1 py-2 mb-4 border rounded shadow appearance-none"
						value={search?.filters?.year || new Date().getFullYear()}
						onChange={(e) => handleChange({
							route: 'movies/discover',
							filters: {
								...search?.filters,
								year: +e.target.value,
								genres: search?.filters?.genres || [],
							}
						})}>
						{[...new Array(125)]
							.map((_, i) => new Date().getFullYear() - i)
							.map(year => <option key={year} value={year}>{year}</option>)}
					</select>
				</div>
				<button className="my-4 text-left hover:font-semibold text-gold" role="button"
					onClick={() => handleChange(initial)}>
					Reset filters
				</button>
			</div>
			<div className="w-full h-px bg-gray-400" />
			<button
				className="flex flex-col items-center w-full my-6 text-center duration-100 cursor-pointer text-blue animate-pulse"
				role="button"
				onClick={handleClose}>
				<p className="text-center">Apply Filters</p>
			</button>
		</div>
	)
}
