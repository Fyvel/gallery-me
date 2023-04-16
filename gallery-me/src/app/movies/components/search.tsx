'use client'

import { useSearch } from '@/contexts/search-provider'
import useDebounce from '@/hooks/use-debounce'
import { ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

type MovieSearchProps = {
	onClose?: () => void
}
export default function MovieSearch({ onClose }: MovieSearchProps) {
	const { search, setSearch } = useSearch()
	const [searchTerm, setSearchTerm] = useState(search?.terms || '')

	const debounced = useDebounce(searchTerm)

	useEffect(() => {
		if (!debounced) {
			// setSearch({
			// 	terms: '',
			// 	route: 'movies/popular',
			// 	filters: { genres: [], page: 1 },
			// })
			return
		}
		setSearch({
			terms: debounced,
			route: 'movies/search',
			filters: { genres: [] },
		})
	}, [debounced, setSearch])

	return (
		<div className="flex flex-col mb-6">
			<h1 className="flex flex-row justify-center w-full gap-4 my-4 text-lg">
				<p>Search for a movie</p>
				<MagnifyingGlassIcon className="w-6 h-6" />
			</h1>
			<div className="w-full h-px bg-gray-400" />
			<div className="grid my-4">
				<div className="flex flex-col gap-2">
					<label>Search:</label>
					<input className="w-full max-w-md px-1 py-2 mb-4 border rounded shadow appearance-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
				</div>
			</div>
			{onClose && <>
				<div className="w-full h-px bg-gray-400" />
				<button className="flex flex-col items-center w-full my-4 text-center cursor-pointer text-gold" role="button"
					onClick={onClose}>
					<ChevronUpIcon className="w-6 h-6 duration-100 animate-pulse" />
					<p className="text-center">Close Search</p>
				</button>
			</>}
		</div>
	)
}