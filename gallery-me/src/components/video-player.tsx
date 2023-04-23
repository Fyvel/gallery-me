'use client'

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
				<div className="flex flex-row items-center justify-center gap-2 hover:cursor-pointer" onClick={() => setIsOpen(true)}>
					<PlayIcon className="w-8 h-8 hover:fill-gold" />
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
						<div className="fixed inset-0 w-full mx-auto mt-16 group bg-nightblue/80 max-w-7xl">
							{video?.site === 'YouTube' && video?.key && (
								<YouTube videoId={video.key} opts={youtubeOpts} />
							)}
							{video?.site === 'Vimeo' && video?.key && (
								<Vimeo video={video.key} autoplay responsive />
							)}
							<div className="flex justify-center w-full">
								<XMarkIcon
									onClick={() => setIsOpen(false)}
									className="z-10 hidden w-12 h-12 mt-4 rounded-full cursor-pointer group-hover:flex fill-orange bg-slate-50"
								/>
							</div>
						</div>
					</Transition.Child>
				</Dialog >
			</Transition>
		</>
	)
}
