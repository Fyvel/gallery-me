import { XMarkIcon } from '@heroicons/react/24/solid'

type ModalProps = {
	children: React.ReactNode,
	onClose: () => void,
	title?: string | React.ReactNode,
}
export default function Modal({ children, onClose, title }: ModalProps) {

	const handleClose = () => { onClose && onClose() }

	return (
		<div className="fixed inset-0 z-[1000] flex justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-gray-500/70">
			<div className="relative w-full max-w-xl mx-auto my-6">
				<div className="relative flex flex-col w-full border-0 rounded-lg shadow-lg outline-none focus:outline-none">
					<div className="flex items-center justify-between p-6 px-10 text-white border-b border-gray-300 border-solid rounded-t-lg bg-jet">
						<h3 className="text-3xl font=semibold">{title}</h3>
						<button role="button" className="bg-transparent" onClick={() => handleClose()}>
							<XMarkIcon className="w-8 h-8 rounded-full hover:bg-gray-300 text-orange" />
						</button>
					</div>
					{children}
				</div>
			</div>
		</div>
	)
}