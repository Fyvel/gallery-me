'use client'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import Slider from '@/components/slider'

const fetchMovieRecommendations = (url: string) => fetch(url).then(res => res.json())

type RecommendationsType = {
	movieId: number,
}
export default function Recommendations({ movieId }: RecommendationsType) {
	const { data: movieRecommendations } = useSWR<MovieRecommendations>(`/api/movies/${movieId}/recommendations`, fetchMovieRecommendations)

	if (!movieRecommendations)
		return (
			<div className="relative h-full px-2 mx-auto overflow-y-auto max-w-7xl sm:px-6 lg:px-8 bg-nightblue">
				<p className="mt-6 text-center">Loading...</p>
			</div>
		)

	if (!movieRecommendations.results.length)
		return (
			<div className="relative h-full px-2 mx-auto overflow-y-auto max-w-7xl sm:px-6 lg:px-8 bg-nightblue">
				<p className="mt-6 text-center">Nothing available at this point</p>
			</div>
		)


	return (
		<Slider items={movieRecommendations.results} className="grid grid-flow-col grid-rows-1 gap-4 mt-2 overflow-x-auto">
			{movie => (<RecommendationCard key={movie.id} movie={movie} />)}
		</Slider>
	)
}

function RecommendationCard({ movie }: { movie: Movie }) {
	return (
		<Link
			key={movie.id}
			className="grid-cols-none sm:grid-cols-1 sm:grid-rows-none sm:grid-auto-cols-min min-w-min snap-start"
			href={`/movies/${movie.id}`}>
			<div className="flex flex-col rounded-lg border-2 border-white w-[268px] sm:w-[300px] h-full">
				{movie.poster_path
					? (
						<picture className="w-full group-hover:opacity-50">
							<source
								srcSet={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
								media="(min-width: 768px)" />
							<source
								srcSet={`https://image.tmdb.org/t/p/w400/${movie.poster_path}`}
								media="(min-width: 640px)" />
							<img
								src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
								alt={movie.title}
								className="object-cover w-full h-full sm:h-96 rounded-t-md"
								loading="lazy" />
						</picture>
					)
					:
					<div className="relative h-[384px]">
						<Image src="/no-image-poster.svg" alt={movie.title} fill style={{ objectFit: 'scale-down' }} />
					</div>}
				<div className="flex flex-col flex-grow p-2">
					<p className="flex-grow text-xl font-bold">{movie.title}</p>
					<p className="">{movie.release_date || 'TBD'}</p>
				</div>
			</div>
		</Link>
	)
}
