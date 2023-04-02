import { DbCollections } from '@/config/firebase'
import { adminDb } from '@/config/firebase-admin'
import admin from 'firebase-admin'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
	response: string,
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
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
	await adminDb.collection('users')
		.doc(session?.user?.email)
		.collection(DbCollections.Galleries)
		.add(collection)

	res.status(200).json({ response: 'Collection created' })
}