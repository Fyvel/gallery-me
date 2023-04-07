'use client'

import CollectionSelector from '@/components/collection-selector'
import useOnScreen from '@/hooks/use-on-screen'
import { commonParams } from '@/lib/tmdb'
import { Dialog, Transition } from '@headlessui/react'
import { EyeIcon, FolderPlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Fragment, useEffect, useRef, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import MovieDetailsPage from './[id]/page'

const fetchPopularMovies = (url: string) => fetch(url).then(res => res.json())

export default function Movies() {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedMovieId, setSelectedMovieId] = useState<number | string>()
	const [showCollectionSelector, setShowCollectionSelector] = useState(false)
	const { data, setSize, isLoading, } = useSWRInfinite<Movies>((index, prev) => (prev && prev.length)
		? null
		: `/api/movies/popular?page=${+index + 1}`, fetchPopularMovies)
	const [movies, setMovies] = useState<Movie[]>([])

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
		if (!isVisible || isLoading) return
		setSize(prev => prev + 1)
	}, [isLoading, isVisible, setSize])

	useEffect(() => {
		if (!data?.length) return
		setMovies(data.map(x => x?.results).flat().filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i))
	}, [data])

	const handleAddToGallery = (movieId: number | string) => {
		setSelectedMovieId(movieId)
		setShowCollectionSelector(true)
	}

	return (
		<div className="mx-auto max-w-7xl px-2 pt-4 sm:px-6 lg:px-8 h-full relative">
			{isLoading && (<p className="text-center mt-6">Loading...</p>)}
			<ul className="grid grid-cols-posters justify-center lg:justify-between gap-4 snap-y snap-proximity overflow-scroll overscroll-y-auto h-[100vh] md:h-[calc(100vh-155px)]">
				{movies?.map((movie, idx) => (
					<li key={movie.id} className="h-full w-full flex flex-col border-2 items-center justify-between border-slate-300 text-gold rounded-lg shadow-md border-solid gap-4 sm:snap-start">
						<div
							onClick={() => handleMovieClick(movie.id)}
							className="group relative w-full transition-all duration-200">
							<picture className="w-full group-hover:opacity-50">
								<source
									srcSet={`https://image.tmdb.org/t/p/w500/${movie.poster_path}?${commonParams}`}
									media="(min-width: 768px)"
								/>
								<source
									srcSet={`https://image.tmdb.org/t/p/w400/${movie.poster_path}?${commonParams}`}
									media="(min-width: 640px)"
								/>
								<img
									src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}?${commonParams}`}
									alt={movie.title}
									className="h-full sm:h-96 w-full object-cover rounded-t-md max-w-[256px]"
									loading={!idx ? 'eager' : 'lazy'} />
							</picture>
							<div className="hidden absolute group-hover:grid w-full h-full top-0 group-hover:cursor-pointer">
								<EyeIcon className="w-20 h-20 place-self-center group-hover:fill-blue transition-all duration-200" />
							</div>
						</div>
						<div className="flex h-full w-full items-start gap-2 py-2 px-4">
							<div className="flex flex-col h-full w-full items-start justify-between gap-2">
								<p className="text-xl font-semibold text-ellipsis">{movie.title}</p>
								<p className="text-sm">{movie.release_date}</p>
							</div>
							<FolderPlusIcon onClick={() => handleAddToGallery(movie.id)} className="h-10 w-10 ml-3 icon-cta" />
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
						<div className="fixed mt-16 inset-0 bg-transparent mx-auto max-w-7xl h-full sm:h-[calc(100%-152px)]">
							<XMarkIcon
								onClick={handleModalClose}
								className="absolute cursor-pointer h-12 w-h-12 z-10 top-2 right-4 sm:right-8 lg:right-10 fill-orange"
							/>
							<MovieDetailsPage params={{ id: `${selectedMovieId}` }} />
						</div>
					</Transition.Child>
				</Dialog >
			</Transition>

			{showCollectionSelector && selectedMovieId &&
				<CollectionSelector id={selectedMovieId} type="movies" onClose={() => setShowCollectionSelector(false)} />
			}

		</div>
	)
}