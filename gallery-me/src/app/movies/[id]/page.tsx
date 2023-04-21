'use client'

import '@/utils/StringExtensions'
import '@/utils/NumberExtensions'

import useSWR from 'swr'
import { Fragment, useState } from 'react'
import { BookmarkIcon, ChevronDownIcon, ChevronUpIcon, FolderPlusIcon, HeartIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import VideoPlayer from '@/components/video-player'
import Credits from '@/app/movies/components/credits'
import Videos from '@/app/movies/components/videos'
import Recommendations from '@/app/movies/components/recommendations'
import CollectionSelector from '@/components/collection-selector'
import { useSession } from 'next-auth/react'
import Login from '@/components/login'

const fetchMovieDetails = (url: string) => fetch(url).then(res => res.json())
const fetchMovieVideos = (url: string) => fetch(url).then(res => res.json())

type MovieDetailsProps = {
	params: {
		id: string;
	}
}
export default function MovieDetails({ params: { id } }: MovieDetailsProps) {
	const { data: session } = useSession()
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
			<div className="relative h-full px-2 pt-4 mx-auto overflow-y-auto max-w-7xl sm:px-6 lg:px-8 bg-nightblue">
				<p className="mt-6 text-center">Loading...</p>
			</div>
		)

	return (
		<div className="relative h-full px-2 pt-4 mx-auto overflow-y-auto max-w-7xl sm:px-6 lg:px-8 bg-nightblue">
			<div className="flex flex-col gap-4 md:grid md:grid-flow-row-dense md:grid-cols-3">
				<div className="col-span-1 border-2 rounded-lg border-slate-300">
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
							className="object-cover w-full h-full rounded-md"
							loading="eager" />
					</picture>
				</div>
				<div className="col-span-2 border-2 rounded-lg border-slate-300">
					<div className="flex flex-col p-4">
						<h1 className="mb-3 text-3xl font-bold">{movie.title} <span className='text-3xl font-normal opacity-50'>({movie.release_date
							? new Date(movie.release_date)?.getFullYear()
							: 'TBD'})</span></h1>
						<div className="flex flex-col gap-2 mb-6 tracking-tight md:flex-row md:flex-wrap md:items-center md:gap-4">
							<p>{movie.release_date
								? new Date(movie.release_date).toLocaleDateString('fr-FR')
								: 'To Be Defined'}</p>
							{!!movie.runtime && <>
								<hr className="hidden w-2 h-2 border-0 rounded md:block bg-slate-300" />
								<p className="whitespace-nowrap"> {movie.runtime.toDuration()}</p>
							</>}
							<hr className="hidden w-2 h-2 border-0 rounded md:block bg-slate-300" />
							<p> {movie.genres?.map(genre => (genre.name)).join(', ')}</p>
						</div>
						<div className="flex flex-row justify-around mb-6">
							<div className="flex flex-row items-center gap-2">
								<p className="text-2xl font-bold">{(movie.vote_average * 10).toFixed(0)}%</p>
								<p className="text-md opacity-80">User score</p>
							</div>
							{!!movieVideos?.length && (
								<>
									<hr className="w-1 h-12 mx-2 border-0 rounded bg-slate-300" />
									<div className="flex flex-row items-center gap-2">
										<VideoPlayer
											video={movieVideos
												?.filter(mv => mv.type === 'Trailer')
												?.sort((a, b) => (a.official === b.official) ? 0 : a.official ? -1 : 1)
												?.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime())[0]}
											text="Play Trailer" />
									</div>
								</>
							)}
						</div>
						<p className="mb-6 text-xl italic opacity-80">{movie.tagline}</p>

						{!!session?.user
							? (
								<div className="flex flex-row gap-6 mb-6 text-xs text-center justify-evenly sm:text-sm">
									<div className="flex flex-col items-center gap-2">
										<FolderPlusIcon className="w-10 h-10 icon-cta" onClick={() => handleAddToGallery()} />
										Add to collection
									</div>
									<div className="flex flex-col items-center gap-2">
										<HeartIcon className="w-10 h-10 icon-cta" />
										Mark as favorite
									</div>
									<div className="flex flex-col items-center gap-2">
										<BookmarkIcon className="w-10 h-10 icon-cta" />
										Add to watchlist
									</div>
								</div>
							)
							: (
								<div className="flex flex-row gap-6 mb-6 text-xs sm:text-sm sm:justify-center">
									<Menu as="div" className="relative">
										<div>
											<Menu.Button className="flex flex-col items-center gap-2">
												<span className="sr-only">Sign in</span>
												<UserCircleIcon className="w-10 h-10 transition-all duration-200 rotate-180 icon-cta hover:rotate-0" />
												Sign in
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-100"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="absolute top-0 z-10 w-48 ml-2 font-semibold text-black translate-x-12 rounded-md shadow-lg bg-gold focus:outline-none">
												<Login />
											</Menu.Items>
										</Transition>
									</Menu>
								</div>)
						}
						<h2 className="mb-3 text-2xl font-bold">Overview</h2>
						<p className="text-md">{movie.overview}</p>
					</div>
				</div>
				<div className="col-span-3 p-4 border-2 rounded-lg border-slate-300">
					<h1 className="text-2xl font-bold">Credits</h1>
					<Disclosure>
						{!loadCredits && (
							<Disclosure.Button className="flex flex-col items-center w-full mt-4 text-center cursor-pointer" onClick={() => setLoadCredits(true)}>
								<p className="text-center">See cast and crew</p>
								<ChevronDownIcon className="w-6 h-6 duration-100 animate-pulse" />
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
								<Credits movieId={+movie.id} />
							</Disclosure.Panel>
						</Transition>
						{loadCredits && (
							<Disclosure.Button className="flex flex-col items-center w-full mt-4 text-center cursor-pointer" onClick={() => setLoadCredits(false)}>
								<ChevronUpIcon className="w-6 h-6 duration-100 animate-pulse" />
								<p className="text-center">See less</p>
							</Disclosure.Button>
						)}
					</Disclosure>
				</div>
				<div className="col-span-3 p-4 border-2 rounded-lg border-slate-300">
					<h1 className="text-2xl font-bold">Related videos</h1>
					<Disclosure>
						{!loadVideos && (
							<Disclosure.Button className="flex flex-col items-center w-full mt-4 text-center cursor-pointer" onClick={() => setLoadVideos(true)}>
								<p className="text-center">See related videos</p>
								<ChevronDownIcon className="w-6 h-6 duration-100 animate-pulse" />
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
								<Videos movieId={+movie.id} />
							</Disclosure.Panel>
						</Transition>
						{loadVideos && (
							<Disclosure.Button className="flex flex-col items-center w-full mt-4 text-center cursor-pointer" onClick={() => setLoadVideos(false)}>
								<ChevronUpIcon className="w-6 h-6 duration-100 animate-pulse" />
								<p className="text-center">See less</p>
							</Disclosure.Button>
						)}
					</Disclosure>
				</div>
				<div className="col-span-3 p-4 border-2 rounded-lg border-slate-300">
					<h1 className="text-2xl font-bold">Recommendations</h1>
					<Disclosure>
						{!loadRecommendations && (
							<Disclosure.Button className="flex flex-col items-center w-full mt-4 text-center cursor-pointer" onClick={() => setLoadRecommendations(true)}>
								<p className="text-center">You may also like</p>
								<ChevronDownIcon className="w-6 h-6 duration-100 animate-pulse" />
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
								<Recommendations movieId={+movie.id} />
							</Disclosure.Panel>
						</Transition>
						{loadRecommendations && (
							<Disclosure.Button className="flex flex-col items-center w-full mt-4 text-center cursor-pointer" onClick={() => setLoadRecommendations(false)}>
								<ChevronUpIcon className="w-6 h-6 duration-100 animate-pulse" />
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
