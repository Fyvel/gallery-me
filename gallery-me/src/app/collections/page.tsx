'use client'

import { useSession } from 'next-auth/react'
import { ArrowLongRightIcon, BookOpenIcon, FilmIcon, NoSymbolIcon, RectangleStackIcon, TvIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { db, DbCollections } from '@/config/firebase'
import { query, collection, orderBy } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import Link from 'next/link'

export default function Collections() {
	const { data: session } = useSession()
	const router = useRouter()

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
				return <FilmIcon className="h-36 w-36" aria-hidden="true" />
			case 'tv-shows':
				return <TvIcon className="h-36 w-36" aria-hidden="true" />
			case 'books':
				return <BookOpenIcon className="h-36 w-36" aria-hidden="true" />
			default:
				return <RectangleStackIcon className="h-36 w-36" aria-hidden="true" />
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
					{!loading && lists?.docs.length === 0 && (
						<li className="h-full w-full flex flex-col border-2 items-center justify-between border-slate-300 py-2 px-4 rounded-lg shadow-md border-solid gap-4">
							<NoSymbolIcon className="h-36 w-36 fill-gold" />
							<h2 className="text-center">Your gallery is empty.</h2>
							<Link href="/movies" className="flex items-center text-blue">Start a new collection <ArrowLongRightIcon className="h-6 w-6 ml-2" /></Link>
						</li>
					)}
					{lists?.docs
						.map(doc => ({ id: doc.id, ...doc.data() } as Collection))
						.sort((a, b) => {
							if (a.type === b.type)
								return b.createdAt - a.createdAt
							return a.type.localeCompare(b.type)
						})
						.map((list) => (
							<li
								key={list.id}
								onClick={() => router.push(`/collections/${list.id}`)}
								className="group h-full w-full flex flex-col border-2 items-center justify-center border-slate-300 text-white py-2 px-4 hover:font-semibold rounded-lg shadow-md hover:bg-nightblue border-solid hover:cursor-pointer hover:border-blue">
								{getIcon(list.type)}
								<h2 className="group-hover:text-blue">{list.name}</h2>
							</li>
						))}
				</ul>
			</div>
		</>
	)
}