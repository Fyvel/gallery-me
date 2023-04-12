import Slider from '@/components/slider'
import Image from 'next/image'
import useSWR from 'swr'

const fetchMovieCredits = (url: string) => fetch(url).then(res => res.json())

type CreditsProps = {
	movieId: number;
}
export default function Credits({ movieId }: CreditsProps) {
	const { data: movieCredits } = useSWR<MovieCredits>(`/api/movies/${movieId}/credits`, fetchMovieCredits)

	if (!movieCredits)
		return (
			<div className="relative h-full px-2 mx-auto overflow-y-auto max-w-7xl sm:px-6 lg:px-8 bg-nightblue">
				<p className="mt-6 text-center">Loading...</p>
			</div>
		)

	if (!movieCredits.cast?.length && !movieCredits.crew?.length)
		return (
			<div className="relative h-full px-2 mx-auto overflow-y-auto max-w-7xl sm:px-6 lg:px-8 bg-nightblue">
				<p className="mt-6 text-center">Nothing available at this point</p>
			</div>
		)

	return (
		<>
			{!!movieCredits.cast?.length && <h2 className="mt-6 text-xl opacity-80">Cast</h2>}
			<Slider items={movieCredits.cast} className="grid grid-flow-col grid-rows-1 gap-4 mt-2 overflow-x-auto">
				{cast => (<CastCard key={cast.id} cast={cast} />)}
			</Slider>
			{!!movieCredits.crew?.length && <h2 className="mt-6 text-xl opacity-80">Crew</h2>}
			<Slider items={movieCredits.crew} className="grid grid-flow-col grid-rows-1 gap-4 mt-2 overflow-x-auto">
				{crew => (<CrewCard key={crew.id} crew={crew} />)}
			</Slider>
		</>
	)
}

function CastCard({ cast }: { cast: MovieCast }) {
	return (
		<div key={cast.id} className="grid-cols-none sm:grid-cols-1 sm:grid-rows-none sm:grid-auto-cols-min min-w-min snap-start">
			<div className="flex flex-col rounded-lg border-2 border-white w-[200px] h-full">
				{cast.profile_path
					? (
						<picture>
							<source
								srcSet={`https://image.tmdb.org/t/p/w300${cast.profile_path}`}
								media="(min-width: 768px)" />
							<source
								srcSet={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
								media="(min-width: 640px)" />
							<img
								src={`https://image.tmdb.org/t/p/w400${cast.profile_path}`}
								alt={cast.name}
								className="object-cover w-full h-full rounded-t-md"
								loading="lazy" />
						</picture>
					)
					: <Image className="rounded-t-md h-[294px]" src="/no-image-person.svg" alt={cast.name} width={200} height={300} />}
				<div className="flex flex-col flex-grow p-2">
					<p className="text-xl font-bold">{cast.name}</p>
					<p className="flex-grow">{cast.character}</p>
					<p className="text-sm opacity-50">{cast.known_for_department}</p>
				</div>
			</div>
		</div>
	)
}

function CrewCard({ crew }: { crew: MovieCrew }) {
	return (
		<div key={crew.id} className="grid-cols-none sm:grid-cols-1 sm:grid-rows-none sm:grid-auto-cols-min min-w-min snap-start">
			<div className="flex flex-col rounded-lg border-2 border-white w-[200px] h-full">
				{crew.profile_path
					? (
						<picture>
							<source
								srcSet={`https://image.tmdb.org/t/p/w300${crew.profile_path}`}
								media="(min-width: 768px)"
							/>
							<source
								srcSet={`https://image.tmdb.org/t/p/w200${crew.profile_path}`}
								media="(min-width: 640px)"
							/>
							<img
								src={`https://image.tmdb.org/t/p/w400${crew.profile_path}`}
								alt={crew.name}
								className="object-cover w-full h-full rounded-t-md"
								loading="lazy" />
						</picture>
					)
					: <Image className="rounded-t-md h-[294px]" src="/no-image-person.svg" alt={crew.name} width={200} height={300} />
				}
				<div className="flex flex-col flex-grow p-2">
					<p className="text-xl font-bold">{crew.name}</p>
					<p className="flex-grow">{crew.job}</p>
					<p className="text-sm opacity-50">{crew.known_for_department}</p>
				</div>
			</div>
		</div>
	)
}