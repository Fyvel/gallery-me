'use client'

import useOnScreen from '@/hooks/use-on-screen'
import { commonParams } from '@/lib/tmdb'
import { Dialog } from '@headlessui/react'
import { EyeIcon, FolderPlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import MovieDetailsPage from './[slug]/page'

const fetchPopularMovies = (url: string) => fetch(url).then(res => res.json())

const getKey = (index: number, previousPageData: Movie[]) => (previousPageData && !previousPageData?.length)
	? null
	: `/api/movies/popular?page=${index + 1}`

export const metadata = {
	title: 'Movies',
}

export default function Movies() {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedMovieId, setSelectedMovieId] = useState<number>()
	const { data, size, setSize, isLoading, } = useSWRInfinite<Movie[]>(getKey, fetchPopularMovies)
	const movies = data?.flat()
	const isLoadingMore = isLoading || (size > 0 && movies && typeof movies[size - 1] === 'undefined')
	const isEmpty = data?.[0]?.length === 0
	const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 20)

	const ref = useRef<HTMLLIElement>(null)
	const isVisible = useOnScreen(ref)

	const handleMovieClick = (movieId: number) => {
		setSelectedMovieId(movieId)
		setIsOpen(true)
		window.history.pushState({}, '', `/movies/${encodeURIComponent(movieId)}`)
	}

	const handleModalClose = () => {
		setIsOpen(false)
		window.history.pushState({}, '', '/movies')
	}

	useEffect(() => {
		if (!isVisible || isReachingEnd || isLoadingMore || isLoading) return
		setSize(prev => prev + 1)
	}, [isLoading, isLoadingMore, isReachingEnd, isVisible, setSize])

	const addToGallery = (movieId: number) => {
		console.log('Add to gallery', movieId)
	}

	return (
		<>
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full relative">
				{isLoading && (<p className="text-center mt-6">Loading...</p>)}
				<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 snap-y snap-proximity overflow-scroll overscroll-y-auto h-[100vh] md:h-[calc(100vh-155px)]">
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
										className="h-full sm:h-96 w-full object-cover rounded-t-md"
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
								<FolderPlusIcon onClick={() => addToGallery(movie.id)} className="h-10 w-10 ml-3 icon-cta" />
							</div>
						</li>
					))}
					<li ref={ref} />
				</ul>
			</div>
			<Dialog
				className="relative z-50"
				open={isOpen}
				onClose={handleModalClose}>
				<div className="fixed mt-16 inset-0 bg-transparent mx-auto max-w-7xl">
					<XMarkIcon
						onClick={handleModalClose}
						className="absolute cursor-pointer h-12 w-h-12 z-10 top-2 right-4 sm:right-8 lg:right-10 hover:fill-orange"
					/>
					<MovieDetailsPage params={{ slug: `${selectedMovieId}` }} />
				</div>
			</Dialog >
		</>
	)
}