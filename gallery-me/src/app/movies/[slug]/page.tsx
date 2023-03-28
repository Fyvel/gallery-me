'use client'
import '@/utils/StringExtensions'
import '@/utils/NumberExtensions'

import VideoPlayer from '@/components/video-player'
import { commonParams } from '@/lib/tmdb'
import useSWR from 'swr'
import { BookmarkIcon, ChevronDownIcon, FolderPlusIcon, HeartIcon } from '@heroicons/react/24/solid'

const fetchMovieDetails = (url: string) => fetch(url).then(res => res.json())
const fetchMovieVideos = (url: string) => fetch(url).then(res => res.json())

type MovieDetailsProps = {
	params: {
		slug: string;
	}
}
export default function MovieDetails({ params: { slug: id } }: MovieDetailsProps) {
	const { data: movie } = useSWR<Movie>(`/api/movies/${id}`, fetchMovieDetails)
	const { data: movieVideos } = useSWR<MovieVideo[]>(`/api/movies/${id}/videos`, fetchMovieVideos)

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
											video={movieVideos.filter(mv => mv.name?.toLowerCase().search('trailer'))[0]}
											text="Play Trailer" />
									</div>
								</>
							)}
						</div>
						<p className="text-xl opacity-80 italic mb-6">{movie.tagline}</p>
						<div className="flex flex-row justify-evenly gap-6 mb-6 text-center text-xs sm:text-sm">
							<div className="flex flex-col gap-2 items-center">
								<FolderPlusIcon className="icon-cta h-10 w-10" />
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
					<h1 className="text-2xl font-bold">Cast</h1>
					<div className="text-center flex flex-col items-center mt-4 cursor-pointer">
						<p className="text-center">See cast and crew</p>
						<ChevronDownIcon className="h-6 w-6 animate-pulse duration-100" />
					</div>
				</div>
				<div className="rounded-lg border-slate-300 border-2 col-span-3 p-4">
					<h1 className="text-2xl font-bold">Related videos</h1>
					<div className="text-center flex flex-col items-center mt-4 cursor-pointer">
						<p className="text-center">See related videos</p>
						<ChevronDownIcon className="h-6 w-6 animate-pulse duration-100" />
					</div>
				</div>
				<div className="rounded-lg border-slate-300 border-2 col-span-3 p-4">
					<h1 className="text-2xl font-bold">Recommendations</h1>
					<div className="text-center flex flex-col items-center mt-4 cursor-pointer">
						<p className="text-center">You may also like</p>
						<ChevronDownIcon className="h-6 w-6 animate-pulse duration-100" />
					</div>
				</div>
			</div>
		</div>
	)
}
