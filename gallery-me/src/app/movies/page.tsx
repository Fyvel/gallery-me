'use client'

import useOnScreen from '@/hooks/use-on-screen'
import { commonParams } from '@/lib/tmdb'
import { useEffect, useRef } from 'react'
import useSWRInfinite from 'swr/infinite'

const fetchPopularMovies = (url: string) => fetch(url).then(res => res.json())

const getKey = (index: number, previousPageData: Movie[]) => (previousPageData && !previousPageData?.length)
	? null
	: `/api/popular?page=${index + 1}`

export const metadata = {
	title: 'Movies',
}

export default function Movies() {
	const { data, size, setSize, isLoading, } = useSWRInfinite<Movie[]>(getKey, fetchPopularMovies)
	const movies = data?.flat()
	const isLoadingMore = isLoading || (size > 0 && movies && typeof movies[size - 1] === 'undefined')
	const isEmpty = data?.[0]?.length === 0
	const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 20)

	const ref = useRef<HTMLLIElement>(null)
	const isVisible = useOnScreen(ref)

	useEffect(() => {
		if (!isVisible || isReachingEnd || isLoadingMore || isLoading) return
		setSize(prev => prev + 1)
	}, [isLoading, isLoadingMore, isReachingEnd, isVisible, setSize])

	return (
		<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full">
			{isLoading && (<p className='text-center mt-6'>Loading...</p>)}
			<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-6 snap-y snap-proximity overflow-scroll overscroll-y-auto h-[100vh] md:h-[calc(100vh-200px)]">
				{movies?.map((movie, idx) => (
					<li key={movie.id} className="h-full w-full flex flex-col border-2 items-center justify-between border-slate-300 text-gold rounded-lg shadow-md border-solid gap-4 sm:snap-start">
						<picture className='w-full'>
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
								className="h-full sm:h-96 w-full object-cover rounded-lg"
								loading={!idx ? 'eager' : 'lazy'} />
						</picture>
						<div className="flex flex-col h-full items-center justify-between gap-2 py-2 px-4 ">
							<p className="text-xl font-semibold text-center">{movie.title}</p>
							<p className="text-sm">{movie.release_date}</p>
						</div>
					</li>
				))}
				<li ref={ref} />
			</ul>
		</div>
	)
}