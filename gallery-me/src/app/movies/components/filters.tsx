'use client'

import { useState } from 'react'
import useSWR from 'swr'

export type FiltersType = {
	listType: 'now-playing' | 'popular' | 'top-rated' | 'upcoming' | '',
	search: {
		genres: number[],
		year?: number,
		certification?: string,
		page?: number,
		sortBy?: 'popularity.asc' |
		'popularity.desc' |
		'release_date.asc' |
		'release_date.desc' |
		'revenue.asc' |
		'revenue.desc' |
		'primary_release_date.asc' |
		'primary_release_date.desc' |
		'original_title.asc' |
		'original_title.desc' |
		'vote_average.asc' |
		'vote_average.desc' |
		'vote_count.asc' |
		'vote_count.desc'
	}
}

const fetchMoviesGenres = (url: string) => fetch(url).then(res => res.json())

type MovieFilterProps = {
	onChange: (args: FiltersType) => void;
	initial: FiltersType,
}
export default function MovieFilters({ onChange, initial }: MovieFilterProps) {
	const [filters, setFilters] = useState<FiltersType>(initial)
	const { data: genres } = useSWR<MovieGenre[]>('/api/movies/genres', fetchMoviesGenres)

	const handleChange = async (change: FiltersType) => {
		setFilters(change)
		onChange(change)
	}
	return (
		<div className="flex flex-col mb-4">
			<div className="grid m-auto mb-4 sm:grid-cols-3 sm:gap-4">
				<div className="flex flex-col gap-2">
					<label>Category:</label>
					<select className="w-full max-w-sm px-1 py-2 mb-4 border rounded shadow appearance-none"
						value={filters.listType}
						onChange={(e) => handleChange({
							...filters,
							listType: e.target.value as FiltersType['listType']
						})}
					>
						<option value="popular">Popular</option>
						<option value="now_playing">Now Playing</option>
						<option value="top_rated">Top Rated</option>
						<option value="upcoming">Upcoming</option>
					</select>
				</div>
				<div className="flex flex-col gap-2">
					<label>Year:</label>
					<select className="w-full max-w-sm px-1 py-2 mb-4 border rounded shadow appearance-none"
						value={filters.search.year || new Date().getFullYear()}
						onChange={(e) => handleChange({
							...filters,
							search: {
								...filters.search,
								year: +e.target.value,
							}
						})}
					>
						{[...new Array(125)]
							.map((_, i) => new Date().getFullYear() - i)
							.map(year => <option key={year} value={year}>{year}</option>)}
					</select>

				</div>
				<div className="flex flex-col gap-2">
					<label>Sort By:</label>
					<select className="w-full max-w-sm px-1 py-2 mb-4 border rounded shadow appearance-none"
						value={filters.search.sortBy}
						onChange={(e) => handleChange({
							...filters,
							search: {
								...filters.search,
								sortBy: e.target.value as FiltersType['search']['sortBy'],
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
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex flex-wrap justify-center w-full gap-x-4 gap-y-2">
					{genres?.map(genre => (
						<span key={genre.id} className="flex items-center gap-2 p-2 border-2 border-solid rounded-lg">
							<label className="block text-sm cursor-pointer md:text-md" htmlFor={`${genre.id}`}>{genre.name}</label>
							<input
								id={`${genre.id}`}
								className="w-6 h-6 cursor-pointer"
								name={genre.name}
								type="checkbox"
								checked={filters.search.genres.includes(genre.id)}
								onChange={(e) =>
									handleChange({
										...filters,
										search: {
											...filters.search,
											genres: filters.search.genres.indexOf(+e.target.id) >= 0
												? filters.search.genres.filter(x => x !== +e.target.id)
												: [...filters.search.genres, +e.target.id],
										}
									})
								}
							/>
						</span>
					))}
				</div>
			</div>
			<button className="py-4 hover:font-semibold text-orange" role="button" onClick={() => handleChange(initial)}>Reset filters</button>
		</div>
	)
}
