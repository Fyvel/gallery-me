'use client'

import Slider from '@/components/slider'
import useSWR from 'swr'

type VideosProps = {
	movieId: number,
}
export default function Videos({ movieId }: VideosProps) {
	const { data: movieVideos } = useSWR<MovieVideo[]>(`/api/movies/${movieId}/videos`, { fallback: [] })
	if (!movieVideos)
		return (
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full relative bg-nightblue overflow-y-auto">
				<p className="text-center mt-6">Loading...</p>
			</div>
		)

	if (!movieVideos.length)
		return (
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full relative bg-nightblue overflow-y-auto">
				<p className="text-center mt-6">Nothing available at this point</p>
			</div>
		)

	return (
		<Slider items={movieVideos} className="grid gap-4 grid-flow-col grid-rows-1 overflow-x-auto mt-2">
			{video => (<VideoCard key={video.id} video={video} />)}
		</Slider>
	)
}

function VideoCard({ video }: { video: MovieVideo }) {
	return <div key={video.id} className="grid-cols-none sm:grid-cols-1 sm:grid-rows-none sm:grid-auto-cols-min min-w-min snap-start">
		<div className="flex flex-col rounded-lg border-2 border-white w-[268px] sm:w-[300px] h-full">
			{video.site === 'YouTube' && (
				<iframe
					src={`https://www.youtube.com/embed/${video.key}`}
					className="rounded-t-md h-[200px]"
					allowFullScreen
					loading="lazy" />
			)}
			<div className="flex flex-col p-2 flex-grow">
				<p className="text-xl font-bold flex-grow">{video.name}</p>
				<p className="">{video.type}</p>
			</div>
		</div>
	</div>
}
