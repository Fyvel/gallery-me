'use client'

import { useSession } from 'next-auth/react'
import { collection, orderBy, query } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { DbCollections, db } from '@/config/firebase'
import { BookOpenIcon, FilmIcon, PlusIcon, RectangleStackIcon, TvIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CollectionForm from '@/components/collection-form'

export const metadata = {
	title: 'Collections',
}

export default function Collections() {
	const { data: session } = useSession()
	const router = useRouter()
	const [createNew, setCreateNew] = useState(false)

	const [lists, loading] = useCollection(
		session?.user && query(
			collection(db, DbCollections.Users, session.user.email!, DbCollections.Galleries),
			orderBy('createdAt', 'desc')
		)
	)

	useEffect(() => {
		if (!session?.user?.email)
			router.replace('/')
	}, [session, router])

	const getIcon = (type: string) => {
		switch (type) {
			case 'movies':
				return <FilmIcon className="group-hover:fill-blue h-36 w-36" aria-hidden="true" />
			case 'tv-shows':
				return <TvIcon className="group-hover:fill-blue h-36 w-36" aria-hidden="true" />
			case 'books':
				return <BookOpenIcon className="group-hover:fill-blue h-36 w-36" aria-hidden="true" />
			default:
				return <RectangleStackIcon className="group-hover:fill-blue h-36 w-36" aria-hidden="true" />
		}
	}

	return (
		<>
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full">
				<h1 className="text-3xl font-bold my-10">My Collections</h1>
				<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{loading && (
						<li className="h-full w-full flex flex-col border-2 items-center justify-between border-slate-300 text-gold py-2 px-4 rounded-lg shadow-md border-solid gap-4">
							<svg className="animate-spin h-36 w-36" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Loading...
						</li>
					)}
					{lists?.docs.map(list => (
						<li key={list.id} className="h-full w-full flex flex-col border-2 items-center justify-center border-slate-300 text-white py-2 px-4 hover:font-semibold rounded-lg shadow-md hover:bg-blue/10 border-solid">
							{getIcon(list.data().type)}
							{list.data().name}
						</li>
					))}
					<li>
						<button
							onClick={() => setCreateNew(true)}
							className={`${loading
								? 'text-transparent'
								: 'border-dashed border-slate-300 text-white border-2 hover:font-semibold hover:bg-blue/10 hover:border-solid group shadow-md'} 
								h-full w-full flex flex-col items-center justify-between py-2 px-4 rounded-lg`}>
							<PlusIcon className="group-hover:fill-blue h-36 w-36" aria-hidden="true" />
							Create New Collection
						</button>
					</li>
				</ul>
			</div>
			{createNew && (
				<CollectionForm onClose={() => setCreateNew(false)} />
			)}
		</>
	)
}