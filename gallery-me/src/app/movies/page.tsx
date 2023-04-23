'use client'

import CollectionSelector from '@/components/collection-selector'
import useOnScreen from '@/hooks/use-on-screen'
import { Dialog } from '@headlessui/react'
import { EyeIcon, FolderPlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import MovieDetailsPage from '@/app/movies/[id]/page'
import { useSearch } from '@/contexts/search-provider'
import { useSession } from 'next-auth/react'

export default function Movies() {
	const { data: session } = useSession()
	const { search, data, nextPage, isLoading } = useSearch()
	const [isOpen, setIsOpen] = useState(false)
	const [selectedMovieId, setSelectedMovieId] = useState<number | string>()
	const [showCollectionSelector, setShowCollectionSelector] = useState(false)
	const [movies, setMovies] = useState<Movie[]>([])
	const previousRoute = useRef(search?.route)

	const listingStartRef = useRef<HTMLDivElement>(null)
	const sentinelRef = useRef<HTMLLIElement>(null)
	const isVisible = useOnScreen(sentinelRef)

	const handleMovieClick = (movieId: number | string) => {
		setSelectedMovieId(movieId)
		setIsOpen(true)
		window.history.pushState({}, '', `/movies/${encodeURIComponent(movieId)}`)
	}

	const handleModalClose = () => {
		setIsOpen(false)
		window.history.pushState({}, '', '/movies')
	}

	useEffect(() => {
		if (search?.route === previousRoute.current) return
		previousRoute.current = search?.route
		setTimeout(() => {
			listingStartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}, 500)
	}, [search])

	useEffect(() => {
		if (!isVisible || isLoading) return
		nextPage(prev => prev + 1)
	}, [isLoading, isVisible, nextPage])

	useEffect(() => {
		if (!data?.length) return
		setMovies(data?.map(x => x?.results).flat().filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i))
	}, [data])

	const handleAddToGallery = (movieId: number | string) => {
		setSelectedMovieId(movieId)
		setShowCollectionSelector(true)
	}

	return (
		<>
			{isLoading && (<p className="mt-6 text-center">Loading...</p>)}
			{!isLoading && !movies?.length && (<p className="text-center mt-[25%]">No movies found.</p>)}
			<div ref={listingStartRef} className="border-2 border-transparent" />
			<ul className={'grid justify-center gap-4 overflow-scroll grid-cols-posters lg:justify-between snap-y snap-proximity overscroll-y-auto'}>
				{movies?.map((movie, idx) => (
					<li key={movie.id} className="flex flex-col items-center justify-between w-full h-full max-h-[588px] gap-4 border-2 border-solid rounded-lg shadow-md border-slate-300 text-gold lg:snap-start">
						<div
							onClick={() => handleMovieClick(movie.id)}
							className="relative w-full transition-all duration-200 group">
							<picture className="w-full group-hover:opacity-50">
								<source
									srcSet={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
									media="(min-width: 768px)"
								/>
								<source
									srcSet={`https://image.tmdb.org/t/p/w400/${movie.poster_path}`}
									media="(min-width: 640px)"
								/>
								<img
									src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
									alt={movie.title}
									className="h-full sm:h-96 w-full object-cover rounded-t-md max-w-[256px]"
									loading={!idx ? 'eager' : 'lazy'} />
							</picture>
							<div className="absolute top-0 hidden w-full h-full group-hover:grid group-hover:cursor-pointer">
								<EyeIcon className="w-20 h-20 transition-all duration-200 place-self-center group-hover:fill-blue" />
							</div>
						</div>
						<div className="flex items-start w-full h-full gap-2 px-4 py-2">
							<div className="flex flex-col items-start justify-between w-full h-full gap-2">
								<p className="text-xl font-semibold text-ellipsis">{movie.title}</p>
								<p className="text-sm">{movie.release_date}</p>
							</div>
							{!!session?.user && (
								<FolderPlusIcon onClick={() => handleAddToGallery(movie.id)} className="w-10 h-10 ml-3 icon-cta" />
							)}
						</div>
					</li>
				))}
				<li ref={sentinelRef} className="border-2 border-transparent" />
			</ul>

			<Dialog
				className="relative z-[1000]"
				open={isOpen}
				onClose={handleModalClose}
			>
				<div className="fixed inset-0 h-full mx-auto max-w-7xl">
					<XMarkIcon
						onClick={handleModalClose}
						className="absolute z-10 h-12 cursor-pointer w-h-12 top-4 right-4 sm:right-8 lg:right-10 fill-orange"
					/>
					<MovieDetailsPage params={{ id: `${selectedMovieId}` }} />
				</div>
			</Dialog>
			{showCollectionSelector && selectedMovieId &&
				<CollectionSelector id={selectedMovieId} type="movies" onClose={() => setShowCollectionSelector(false)} />
			}
		</>
	)
}