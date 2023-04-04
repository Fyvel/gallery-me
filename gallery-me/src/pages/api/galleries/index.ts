import { DbCollections } from '@/config/firebase'
import { adminDb } from '@/config/firebase-admin'
import admin from 'firebase-admin'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
	response: string | Collection[],
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const method = req.method


	switch (method) {
		case 'GET':
			const email = req.headers['user-email'] as string
			const galleryType = req.query.type as string
			if (!email) {
				res.status(400).json({ response: 'Invalid request' })
				return
			}
			const galleries = await adminDb.collection(DbCollections.Users)
				.doc(email)
				.collection(DbCollections.Galleries)
				.where('type', '==', galleryType)
				.orderBy('createdAt', 'desc')
				.get()
			const galleryData = galleries.docs.map(async (doc) => {
				const itemsSnapshot = await doc.ref.collection('items').get()
				const itemsData = itemsSnapshot.docs.map((itemDoc) => itemDoc.data())
				const gallery = ({ id: doc.id, ...doc.data() }) as Collection
				return {
					...gallery,
					items: itemsData as CollectionItem[],
				}
			})

			const galleryDataWithItems = await Promise.all(galleryData)

			res.status(200).json({ response: galleryDataWithItems })
			break

		case 'DELETE':
			break

		case 'POST':
			const { userId, name, type, isPublic, session } = req.body
			if (!session || !name || !type) {
				res.status(400).json({ response: 'Invalid request' })
				return
			}
			const collection: Omit<Collection, 'id'> = {
				userId,
				createdAt: admin.firestore.Timestamp.now(),
				name,
				type,
				isPublic,
			}
			await adminDb.collection(DbCollections.Users)
				.doc(session?.user?.email)
				.collection(DbCollections.Galleries)
				.add(collection)

			res.status(200).json({ response: 'Collection created' })
			break

		default:
			res.status(405).end(`Method ${method} Not Allowed`)
	}
}