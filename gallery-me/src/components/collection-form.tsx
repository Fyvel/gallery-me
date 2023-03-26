'use client'

import { useSession } from 'next-auth/react'
import Modal from './modal'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { DbCollections, db } from '@/config/firebase'
import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'

type CollectionFormProps = {
	onClose: () => void,
}
export default function CollectionForm(props: CollectionFormProps) {
	const { data: session } = useSession()
	const router = useRouter()

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		event.stopPropagation()
		const { name, type } = event.target as typeof event.target & {
			name: { value: string },
			type: { value: string },
		}
		if (!name.value || !type.value || !session?.user?.email) return
		await addDoc(collection(db, DbCollections.Users, session.user.email, DbCollections.Galleries), {
			userId: session.user.email,
			createdAt: serverTimestamp(),
			name: name.value,
			type: type.value,
		})
		props.onClose && props.onClose()
		router.push(`/${type.value}`)
	}

	return (
		<Modal {...props} title="New Collection">
			<form onSubmit={handleSubmit}>
				<div className="relative px-10 p-6 flex-auto bg-gray-800 text-white">
					<label className="block text-sm md:text-md mb-1" htmlFor="type" aria-required>Type*</label>
					<select className="max-w-sm shadow appearance-none border rounded w-full py-2 px-1 mb-4"
						name="type" defaultValue="" required>
						<option value="" disabled>- Type of collection -</option>
						<option value="movies">Movies</option>
						<option value="tv-shows">Tv Shows</option>
						<option value="books">Books</option>
					</select>
					<label className="block text-sm md:text-md mb-1" htmlFor="name" aria-required>Name*</label>
					<input className="max-w-sm shadow appearance-none border rounded w-full py-2 px-1 mb-4" name="name" maxLength={20} required />
				</div>
				<div className="bg-jet flex items-center justify-end px-10 p-6 border-t border-solid border-gray-300 rounded-b">
					<button className="cta" type="submit">
						Submit
					</button>
				</div>
			</form>
		</Modal>
	)
}
