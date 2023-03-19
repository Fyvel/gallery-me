import { XMarkIcon } from '@heroicons/react/24/solid'

type ModalProps = {
	children: React.ReactNode,
	onClose: () => void,
	title?: string,
}
export default function Modal({ children, onClose, title }: ModalProps) {

	const handleClose = () => { onClose && onClose() }

	return (
		<div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-500/70">
			<div className="relative my-6 mx-auto w-full max-w-xl">
				<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
					<div className="px-10 flex items-center justify-between p-6 border-b border-solid border-gray-300 rounded-t bg-jet text-white">
						<h3 className="text-3xl font=semibold">{title}</h3>
						<button role="button" className="bg-transparent" onClick={() => handleClose()}>
							<XMarkIcon className="h-8 w-8 hover:bg-gray-300 hover:text-orange rounded-full" />
						</button>
					</div>
					{children}
				</div>
			</div>
		</div>
	)
}