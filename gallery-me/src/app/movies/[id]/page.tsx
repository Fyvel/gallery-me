'use client'
import '@/utils/StringExtensions'
import '@/utils/NumberExtensions'

import useSWR from 'swr'
import { useState } from 'react'
import { BookmarkIcon, ChevronDownIcon, ChevronUpIcon, FolderPlusIcon, HeartIcon } from '@heroicons/react/24/solid'
import { Disclosure, Transition } from '@headlessui/react'
import VideoPlayer from '@/components/video-player'
import Credits from '@/app/movies/components/credits'
import Videos from '@/app/movies/components/videos'
import Recommendations from '@/app/movies/components/recommendations'
import CollectionSelector from '@/components/collection-selector'

const fetchMovieDetails = (url: string) => fetch(url).then(res => res.json())
const fetchMovieVideos = (url: string) => fetch(url).then(res => res.json())

type MovieDetailsProps = {
	params: {
		id: string;
	}
}
export default function MovieDetails({ params: { id } }: MovieDetailsProps) {
	const { data: movie } = useSWR<Movie>(`/api/movies/${id}`, fetchMovieDetails)
	const { data: movieVideos } = useSWR<MovieVideo[]>(`/api/movies/${id}/videos`, fetchMovieVideos)

	const [loadCredits, setLoadCredits] = useState(false)
	const [loadVideos, setLoadVideos] = useState(false)
	const [loadRecommendations, setLoadRecommendations] = useState(false)
	const [showCollectionSelector, setShowCollectionSelector] = useState(false)

	const handleAddToGallery = () => {
		setShowCollectionSelector(true)
	}

	if (!movie)
		return (
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full relative bg-nightblue overflow-y-auto">
				<p className="text-center mt-6">Loading...</p>
			</div>
		)

	return (
		<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full relative bg-nightblue overflow-y-auto">
			<div className="gap-4 flex flex-col md:grid md:grid-flow-row-dense md:grid-cols-3">
				<div className="rounded-lg border-slate-300 border-2 col-span-1">
					<picture className="group-hover:opacity-50">
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
							className="h-full w-full object-cover rounded-md"
							loading="eager" />
					</picture>
				</div>
				<div className="rounded-lg border-slate-300 border-2 col-span-2">
					<div className="p-4 flex flex-col">
						<h1 className="text-3xl font-bold mb-3">{movie.title} <span className='font-normal text-3xl opacity-50'>({movie.release_date
							? new Date(movie.release_date)?.getFullYear()
							: 'TBD'})</span></h1>
						<div className="tracking-tight flex flex-col gap-2 mb-6 md:flex-row md:flex-wrap md:items-center md:gap-4">
							<p>{movie.release_date
								? new Date(movie.release_date).toLocaleDateString('fr-FR')
								: 'To Be Defined'}</p>
							{!!movie.runtime && <>
								<hr className="hidden md:block w-2 h-2 bg-slate-300 border-0 rounded" />
								<p className="whitespace-nowrap"> {movie.runtime.toDuration()}</p>
							</>}
							<hr className="hidden md:block w-2 h-2 bg-slate-300 border-0 rounded" />
							<p> {movie.genres?.map(genre => (genre.name)).join(', ')}</p>
						</div>
						<div className="flex flex-row justify-around mb-6">
							<div className="flex flex-row gap-2 items-center">
								<p className="text-2xl font-bold">{(movie.vote_average * 10).toFixed(0)}%</p>
								<p className="text-md opacity-80">User score</p>
							</div>
							{!!movieVideos?.length && (
								<>
									<hr className="w-1 h-12 mx-2 bg-slate-300 border-0 rounded" />
									<div className="flex flex-row gap-2 items-center">
										<VideoPlayer
											video={movieVideos
												?.filter(mv => mv.type === 'Trailer' && mv.official)
												?.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime())[0]}
											text="Play Trailer" />
									</div>
								</>
							)}
						</div>
						<p className="text-xl opacity-80 italic mb-6">{movie.tagline}</p>
						<div className="flex flex-row justify-evenly gap-6 mb-6 text-center text-xs sm:text-sm">
							<div className="flex flex-col gap-2 items-center">
								<FolderPlusIcon className="icon-cta h-10 w-10" onClick={() => handleAddToGallery()} />
								Add to collection
							</div>
							<div className="flex flex-col gap-2 items-center">
								<HeartIcon className="icon-cta h-10 w-10" />
								Mark as favorite
							</div>
							<div className="flex flex-col gap-2 items-center">
								<BookmarkIcon className="icon-cta h-10 w-10" />
								Add to watchlist
							</div>
						</div>
						<h2 className="text-2xl font-bold mb-3">Overview</h2>
						<p className="text-md">{movie.overview}</p>
					</div>
				</div>
				<div className="rounded-lg border-slate-300 border-2 col-span-3 p-4">
					<h1 className="text-2xl font-bold">Credits</h1>
					<Disclosure>
						{!loadCredits && (
							<Disclosure.Button className="w-full text-center flex flex-col items-center mt-4 cursor-pointer" onClick={() => setLoadCredits(true)}>
								<p className="text-center">See cast and crew</p>
								<ChevronDownIcon className="h-6 w-6 animate-pulse duration-100" />
							</Disclosure.Button>
						)}
						<Transition
							enter="transition duration-100 ease-out"
							enterFrom="transform scale-95 opacity-0"
							enterTo="transform scale-100 opacity-100"
							leave="transition duration-75 ease-out"
							leaveFrom="transform scale-100 opacity-100"
							leaveTo="transform scale-95 opacity-0">
							<Disclosure.Panel>
								<Credits movieId={movie.id} />
							</Disclosure.Panel>
						</Transition>
						{loadCredits && (
							<Disclosure.Button className="w-full text-center flex flex-col items-center mt-4 cursor-pointer" onClick={() => setLoadCredits(false)}>
								<ChevronUpIcon className="h-6 w-6 animate-pulse duration-100" />
								<p className="text-center">See less</p>
							</Disclosure.Button>
						)}
					</Disclosure>
				</div>
				<div className="rounded-lg border-slate-300 border-2 col-span-3 p-4">
					<h1 className="text-2xl font-bold">Related videos</h1>
					<Disclosure>
						{!loadVideos && (
							<Disclosure.Button className="w-full text-center flex flex-col items-center mt-4 cursor-pointer" onClick={() => setLoadVideos(true)}>
								<p className="text-center">See related videos</p>
								<ChevronDownIcon className="h-6 w-6 animate-pulse duration-100" />
							</Disclosure.Button>
						)}
						<Transition
							enter="transition duration-100 ease-out"
							enterFrom="transform scale-95 opacity-0"
							enterTo="transform scale-100 opacity-100"
							leave="transition duration-75 ease-out"
							leaveFrom="transform scale-100 opacity-100"
							leaveTo="transform scale-95 opacity-0">
							<Disclosure.Panel>
								<Videos movieId={movie.id} />
							</Disclosure.Panel>
						</Transition>
						{loadVideos && (
							<Disclosure.Button className="w-full text-center flex flex-col items-center mt-4 cursor-pointer" onClick={() => setLoadVideos(false)}>
								<ChevronUpIcon className="h-6 w-6 animate-pulse duration-100" />
								<p className="text-center">See less</p>
							</Disclosure.Button>
						)}
					</Disclosure>
				</div>
				<div className="rounded-lg border-slate-300 border-2 col-span-3 p-4">
					<h1 className="text-2xl font-bold">Recommendations</h1>
					<Disclosure>
						{!loadRecommendations && (
							<Disclosure.Button className="w-full text-center flex flex-col items-center mt-4 cursor-pointer" onClick={() => setLoadRecommendations(true)}>
								<p className="text-center">You may also like</p>
								<ChevronDownIcon className="h-6 w-6 animate-pulse duration-100" />
							</Disclosure.Button>
						)}
						<Transition
							enter="transition duration-100 ease-out"
							enterFrom="transform scale-95 opacity-0"
							enterTo="transform scale-100 opacity-100"
							leave="transition duration-75 ease-out"
							leaveFrom="transform scale-100 opacity-100"
							leaveTo="transform scale-95 opacity-0">
							<Disclosure.Panel>
								<Recommendations movieId={movie.id} />
							</Disclosure.Panel>
						</Transition>
						{loadRecommendations && (
							<Disclosure.Button className="w-full text-center flex flex-col items-center mt-4 cursor-pointer" onClick={() => setLoadRecommendations(false)}>
								<ChevronUpIcon className="h-6 w-6 animate-pulse duration-100" />
								<p className="text-center">See less</p>
							</Disclosure.Button>
						)}
					</Disclosure>
				</div>
			</div>
			{showCollectionSelector &&
				<CollectionSelector id={id} type="movies" onClose={() => setShowCollectionSelector(false)} />
			}
		</div>
	)
}
