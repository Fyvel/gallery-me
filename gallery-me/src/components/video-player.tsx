import { PlayIcon } from '@heroicons/react/24/solid'

type VideoPlayerProps = {
	video: MovieVideo,
	text: string,
}
export default function VideoPlayer({ video, text }: VideoPlayerProps) {
	return (
		<>
			{video && (
				<div className="flex flex-row gap-2 justify-center items-center hover:cursor-pointer">
					<PlayIcon className="h-8 w-8 hover:fill-gold" />
					<p className="text-md opacity-80">{text}</p>
				</div>
			)}
		</>
	)
}
