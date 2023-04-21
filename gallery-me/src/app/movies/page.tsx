'use client'

import CollectionSelector from '@/components/collection-selector'
import useOnScreen from '@/hooks/use-on-screen'
import { Dialog, Transition, } from '@headlessui/react'
import { EyeIcon, FolderPlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Fragment, useEffect, useRef, useState } from 'react'
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

	const listingRef = useRef<HTMLUListElement>(null)
	const ref = useRef<HTMLLIElement>(null)
	const isVisible = useOnScreen(ref)

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
		document.body.scrollTo({ top: 0, behavior: 'smooth' })
		listingRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
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
			<ul ref={listingRef} className="grid grid-cols-posters justify-center lg:justify-between gap-4 snap-y snap-proximity overflow-scroll overscroll-y-auto h-[100vh] md:h-[calc(100vh-69px)]">
				{movies?.map((movie, idx) => (
					<li key={movie.id} className="flex flex-col items-center justify-between w-full h-full max-h-[588px] gap-4 border-2 border-solid rounded-lg shadow-md border-slate-300 text-gold sm:snap-start">
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
				<li ref={ref} className="border-2 border-transparent" />
			</ul>
			<Transition show={isOpen} as={Fragment}>
				<Dialog
					className="relative z-50"
					open={isOpen}
					onClose={handleModalClose}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-200"
						leave="ease-in duration-200"
						leaveFrom="opacity-200"
						leaveTo="opacity-0"
					>
						<div className="fixed mt-16 inset-0 bg-transparent mx-auto max-w-7xl h-[calc(100%-64px)]">
							<XMarkIcon
								onClick={handleModalClose}
								className="absolute z-10 h-12 cursor-pointer w-h-12 top-4 right-4 sm:right-8 lg:right-10 fill-orange"
							/>
							<MovieDetailsPage params={{ id: `${selectedMovieId}` }} />
						</div>
					</Transition.Child>
				</Dialog >
			</Transition>

			{showCollectionSelector && selectedMovieId &&
				<CollectionSelector id={selectedMovieId} type="movies" onClose={() => setShowCollectionSelector(false)} />
			}
		</>
	)
}