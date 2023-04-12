'use client'

import { useSession } from 'next-auth/react'
import Modal from '@/components/modal'
import { FormEvent } from 'react'
import toast from 'react-hot-toast'

type CollectionFormProps = {
	defaultValues?: {
		name?: string,
		type?: CollectionType,
		isPublic?: boolean,
	},
	onClose: () => void,
}
export default function CollectionForm({ onClose, defaultValues }: CollectionFormProps) {
	const { data: session } = useSession()

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		event.stopPropagation()
		const { name, type, isPublic } = event.target as typeof event.target & {
			name: { value: string },
			type: { value: string },
			isPublic: { checked: boolean },
		}
		if (!name.value || !type.value || !session?.user?.email) return

		const result = await fetch('/api/galleries', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: session.user.email,
				name: name.value,
				type: type.value,
				isPublic: isPublic.checked,
				session,
			})
		})
		if (result.ok) {
			toast.success('Collection created')
		} else {
			toast.error('Failed to create collection')
		}
		onClose?.()
	}

	return (
		<Modal onClose={onClose} title="New Collection">
			<form onSubmit={handleSubmit} autoComplete="off">
				<div className="relative flex-auto p-6 px-10 text-white select-none bg-zinc-800">
					<label className="block mb-1 text-sm md:text-md" htmlFor="type" aria-required>Type*</label>
					<select className="w-full max-w-sm px-1 py-2 mb-4 border rounded shadow appearance-none"
						name="type" defaultValue={defaultValues?.type || ''} required>
						<option value="" disabled>- Type of collection -</option>
						<option value="movies">Movies</option>
						<option value="tv-shows">Tv Shows</option>
						<option value="books">Books</option>
					</select>
					<label className="block mb-1 text-sm md:text-md" htmlFor="name" aria-required>Name*</label>
					<input className="w-full max-w-sm px-1 py-2 mb-4 border rounded shadow appearance-none" name="name" defaultValue={defaultValues?.name || ''} maxLength={20} required />
					<label className="block text-sm cursor-pointer md:text-md" htmlFor="isPublic">Public</label>
					<input className="w-6 h-6 cursor-pointer" id="isPublic" name="isPublic" type="checkbox" defaultChecked={defaultValues?.isPublic !== undefined ? defaultValues.isPublic : true} />
				</div>
				<div className="flex items-center justify-end p-6 px-10 border-t border-gray-300 border-solid rounded-b-lg bg-jet">
					<button className="cta" type="submit">Create</button>
				</div>
			</form>
		</Modal>
	)
}
