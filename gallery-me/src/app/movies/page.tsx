'use client'

import { commonParams } from '@/lib/tmdb'
import useSWRInfinite from 'swr/infinite'

const fetchPopularMovies = (url: string) => fetch(url).then(res => res.json())

const getKey = (index: number, previousPageData: Movie[]) => (previousPageData && !previousPageData?.length)
	? null
	: `/api/popular?page=${index + 1}`

export const metadata = {
	title: 'Movies',
}

export default function Movies() {
	const { data, size, setSize, isLoading, } = useSWRInfinite<Movie[]>(
		getKey,
		fetchPopularMovies)
	const movies = data?.flat()
	const isLoadingMore = isLoading || (size > 0 && movies && typeof movies[size - 1] === 'undefined')
	const isEmpty = data?.[0]?.length === 0
	const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 20)

	return (
		<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full">
			{isLoading && (<p>Loading...</p>)}
			{movies && (
				<>
					<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
						{movies.map(movie => (
							<li key={movie.id} className="h-full w-full flex flex-col border-2 items-center justify-between border-slate-300 text-gold rounded-lg shadow-md border-solid gap-4">
								<picture className='w-full'>
									<img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}?${commonParams}`} alt={movie.title} className="h-96 w-full object-cover rounded-lg" />
								</picture>
								<div className="flex flex-col h-full items-center justify-between gap-2 py-2 px-4 ">
									<p className="text-xl font-semibold text-center">{movie.title}</p>
									<p className="text-sm">{movie.release_date}</p>
								</div>
							</li>
						))}
					</ul>

					<button className='cta'
						disabled={isLoadingMore || isReachingEnd}
						onClick={() => setSize(size + 1)}
					>
						{isLoadingMore
							? 'loading...'
							: isReachingEnd
								? 'no more issues'
								: 'load more'}
					</button>
				</>
			)}
		</div>
	)
}