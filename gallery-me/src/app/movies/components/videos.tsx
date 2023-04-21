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
			<div className="relative h-full px-2 mx-auto overflow-y-auto max-w-7xl sm:px-6 lg:px-8 bg-nightblue">
				<p className="mt-6 text-center">Loading...</p>
			</div>
		)

	if (!movieVideos.length)
		return (
			<div className="relative h-full px-2 mx-auto overflow-y-auto max-w-7xl sm:px-6 lg:px-8 bg-nightblue">
				<p className="mt-6 text-center">Nothing available at this point</p>
			</div>
		)

	return (
		<Slider items={movieVideos} className="grid grid-flow-col grid-rows-1 gap-4 mt-2 overflow-x-auto">
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
			{video.site === 'Vimeo' && (
				<iframe
					src={`https://player.vimeo.com/video/${video.key}`}
					className="rounded-t-md h-[200px]"
					allowFullScreen
					loading="lazy" />
			)}
			<div className="flex flex-col flex-grow p-2">
				<p className="flex-grow text-xl font-bold">{video.name}</p>
				<p className="">{video.type}</p>
			</div>
		</div>
	</div>
}
