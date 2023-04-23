'use client'

import { useSearch } from '@/contexts/search-provider'
import useDebounce from '@/hooks/use-debounce'
import { MouseEventHandler, useEffect, useState } from 'react'

type MovieSearchProps = {
	onClose: () => void
}
export default function MovieSearch({ onClose }: MovieSearchProps) {
	const { search, setSearch } = useSearch()
	const [searchTerm, setSearchTerm] = useState(search?.terms || '')

	const debounced = useDebounce(searchTerm)

	useEffect(() => {
		if (!debounced) return

		setSearch({
			terms: debounced,
			route: 'movies/search',
			filters: { genres: [] },
		})
	}, [debounced, setSearch])
	
	const handleClose: MouseEventHandler<HTMLButtonElement> = event => {
		event.preventDefault()
		event.stopPropagation()
		onClose()
	}

	return (
		<div className="flex flex-col">
			<div className="grid my-4">
				<div className="flex flex-col gap-2">
					<label>Search:</label>
					<input className="w-full max-w-md px-1 py-2 mb-4 border rounded shadow appearance-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
				</div>
			</div>
			<div className="w-full h-px bg-gray-400" />
			<button
				className="flex flex-col items-center w-full my-6 text-center duration-100 cursor-pointer text-blue animate-pulse"
				role="button"
				onClick={handleClose}>
				<p className="text-center">Search</p>
			</button>
		</div>
	)
}