'use client'

import VideoPlayer from '@/components/video-player'
import { commonParams } from '@/lib/tmdb'
import useSWR from 'swr'

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

	if (!movie) return null

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
					<div className="p-4 flex flex-col gap-6">
						<div>
							<h1 className="text-3xl font-bold mb-3">{movie.title} <span className='font-normal text-3xl opacity-50'>({new Date(movie.release_date)?.getFullYear()})</span></h1>
							<p className="text-xl opacity-80 italic">{movie.tagline}</p>
						</div>
						<div className="flex flex-row justify-around">
							<div className="flex flex-row gap-2 items-center">
								<p className="text-2xl font-bold">{(movie.vote_average * 10).toFixed(0)}%</p>
								<p className="text-md opacity-80">User score</p>
							</div>
							{movieVideos?.length && (
								<div className="flex flex-row gap-2 items-center">
									<VideoPlayer
										video={movieVideos.filter(mv => mv.name === 'Official Trailer')[0]}
										text="Play Trailer" />
								</div>
							)}
						</div>
						<p className="text-xl text-center">{movie.genres?.map(genre => (genre.name)).join(' - ')}</p>
						{/* CTA - Add to playlist | Add to favorites | Add to watchlist */}
						{/* Rate */}
						{/* Date / Genres / Duration */}
						<div>
							<h2 className="text-2xl font-bold mb-3">Overview</h2>
							<p className="text-md">{movie.overview}</p>
						</div>
					</div>
				</div>
				<div className="rounded-lg border-slate-300 border-2 col-span-3">
					<div className="p-4">
						<h1 className="text-2xl font-bold">Cast</h1>
					</div>
				</div>
				<div className="rounded-lg border-slate-300 border-2 col-span-3">
					<div className="p-4">
						<h1 className="text-2xl font-bold">Related videos</h1>
					</div>
				</div>
				<div className="rounded-lg border-slate-300 border-2 col-span-3">
					<div className="p-4">
						<h1 className="text-2xl font-bold">Recommendations</h1>
					</div>
				</div>
			</div>
			<pre className='overflow-auto'>
				{JSON.stringify(movie, null, 2)}
			</pre>
		</div>
	)
}
