import { DbCollections } from '@/config/firebase'
import { adminDb } from '@/config/firebase-admin'
import admin from 'firebase-admin'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
	response: string | CollectionItem,
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const { galleryId, itemId } = req.query
	const email = req.headers['user-email'] as string
	const method = req.method

	if (!email || !galleryId || !itemId) {
		res.status(400).json({ response: 'Invalid request' })
		return
	}
	
	switch (method) {
		case 'GET':
			const item = await adminDb.collection('users')
				.doc(email)
				.collection(DbCollections.Galleries)
				.doc(galleryId as string)
				.collection(DbCollections.Items)
				.doc(itemId as string)
				.get()
			res.status(200).json({ response: item.data() as CollectionItem })
			break

		case 'DELETE':
			await adminDb.collection('users')
				.doc(email)
				.collection(DbCollections.Galleries)
				.doc(galleryId as string)
				.collection(DbCollections.Items)
				.doc(itemId as string)
				.delete()

			res.status(200).json({ response: 'Item removed' })
			break

		case 'POST':
			const { itemData } = req.body
			const newItem: CollectionItem = {
				createdAt: admin.firestore.Timestamp.now(),
				...itemData as Movie,
			}
			await adminDb.collection('users')
				.doc(email)
				.collection(DbCollections.Galleries)
				.doc(galleryId as string)
				.collection(DbCollections.Items)
				.doc(itemId as string)
				.set(newItem)

			res.status(200).json({ response: 'Item added' })
			break

		default:
			res.status(405).end(`Method ${method} Not Allowed`)
	}
}