import { Transition, Dialog } from '@headlessui/react'
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, Fragment } from 'react'
import YouTube from 'react-youtube'
import Vimeo from '@u-wave/react-vimeo'

type VideoPlayerProps = {
	video: MovieVideo,
	text: string,
}
export default function VideoPlayer({ video, text }: VideoPlayerProps) {
	const [isOpen, setIsOpen] = useState(false)

	const youtubeOpts = {
		width: '100%',
		height: '500px',
		playerVars: {
			autoplay: 1,
		},
	}

	return (
		<>
			{video && (
				<div className="flex flex-row gap-2 justify-center items-center hover:cursor-pointer" onClick={() => setIsOpen(true)}>
					<PlayIcon className="h-8 w-8 hover:fill-gold" />
					<p className="text-md opacity-80">{text}</p>
				</div>
			)}
			<Transition show={isOpen} as={Fragment}>
				<Dialog
					className="relative z-50"
					open={isOpen}
					onClose={() => setIsOpen(false)}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-200"
						leave="ease-in duration-200"
						leaveFrom="opacity-200"
						leaveTo="opacity-0"
					>
						<div className="group fixed mt-16 inset-0 bg-nightblue/80 mx-auto max-w-7xl">
							{video?.site === 'YouTube' && video?.key && (
								<YouTube videoId={video.key} opts={youtubeOpts} />
							)}
							{video?.site === 'Vimeo' && video?.key && (
								<Vimeo video={video.key} autoplay responsive />
							)}
							<XMarkIcon
								onClick={() => setIsOpen(false)}
								className="group-hover:flex hidden cursor-pointer h-12 w-12 z-10 mt-4 fill-orange mx-auto bg-slate-50 rounded-full"
							/>
						</div>
					</Transition.Child>
				</Dialog >
			</Transition>
		</>
	)
}
