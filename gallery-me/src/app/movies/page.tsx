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
		<div className="relative h-full px-2 pt-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
			{isLoading && (<p className="mt-6 text-center">Loading...</p>)}
			<ul className="grid grid-cols-posters justify-center lg:justify-between gap-4 snap-y snap-proximity overflow-scroll overscroll-y-auto h-[100vh] md:h-[calc(100vh-155px)]">
				{movies?.map((movie, idx) => (
					<li key={movie.id} className="flex flex-col items-center justify-between w-full h-full max-h-[588px] gap-4 border-2 border-solid rounded-lg shadow-md border-slate-300 text-gold sm:snap-start">
						<div
							onClick={() => handleMovieClick(movie.id)}
							className="relative w-full transition-all duration-200 group">
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
							<div className="absolute top-0 hidden w-full h-full group-hover:grid group-hover:cursor-pointer">
								<EyeIcon className="w-20 h-20 transition-all duration-200 place-self-center group-hover:fill-blue" />
							</div>
						</div>
						<div className="flex items-start w-full h-full gap-2 px-4 py-2">
							<div className="flex flex-col items-start justify-between w-full h-full gap-2">
								<p className="text-xl font-semibold text-ellipsis">{movie.title}</p>
								<p className="text-sm">{movie.release_date}</p>
							</div>
							<FolderPlusIcon onClick={() => handleAddToGallery(movie.id)} className="w-10 h-10 ml-3 icon-cta" />
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

		</div>
	)
}