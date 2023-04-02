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
				<div className="relative px-10 p-6 flex-auto bg-zinc-800 text-white select-none">
					<label className="block text-sm md:text-md mb-1" htmlFor="type" aria-required>Type*</label>
					<select className="max-w-sm shadow appearance-none border rounded w-full py-2 px-1 mb-4"
						name="type" defaultValue={defaultValues?.type || ''} required>
						<option value="" disabled>- Type of collection -</option>
						<option value="movies">Movies</option>
						<option value="tv-shows">Tv Shows</option>
						<option value="books">Books</option>
					</select>
					<label className="block text-sm md:text-md mb-1" htmlFor="name" aria-required>Name*</label>
					<input className="max-w-sm shadow appearance-none border rounded w-full py-2 px-1 mb-4" name="name" defaultValue={defaultValues?.name || ''} maxLength={20} required />
					<label className="block text-sm md:text-md cursor-pointer" htmlFor="isPublic">Public</label>
					<input className="h-6 w-6 cursor-pointer" id="isPublic" name="isPublic" type="checkbox" defaultChecked={defaultValues?.isPublic !== undefined ? defaultValues.isPublic : true} />
				</div>
				<div className="bg-jet flex items-center justify-end px-10 p-6 border-t border-solid border-gray-300 rounded-b-lg">
					<button className="cta" type="submit">Create</button>
				</div>
			</form>
		</Modal>
	)
}
