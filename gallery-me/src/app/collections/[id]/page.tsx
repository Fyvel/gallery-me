'use client'

import { DbCollections, db } from '@/config/firebase'
import { query, collection, orderBy } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { useCollection } from 'react-firebase-hooks/firestore'

type CollectionProps = {
	params: {
		id: string;
	}
}
export default function Collection({ params: { id } }: CollectionProps) {
	const { data: session } = useSession()

	const [items, loading] = useCollection(
		session && query(
			collection(db, DbCollections.Users, session.user?.email!, DbCollections.Galleries, id, DbCollections.Items),
			orderBy('createdAt', 'desc')
		)
	)

	if (!session?.user?.email) return null

	return (
		<pre>{
			JSON.stringify(
				items?.docs
					.map(doc => ({ id: doc.id, ...doc.data() } as Collection))
					.map(x => x.items?.map(i => i.title)), null, 2)
		}</pre>
	)
}