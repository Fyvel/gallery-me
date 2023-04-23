'use client'

import { DbCollections, db } from '@/config/firebase'
import { query, collection, orderBy } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Dialog } from '@headlessui/react'
import MovieDetailsPage from '@/app/movies/[id]/page'
// import TvShowDetailsPage from '@/app/tv-shows/[id]/page'
// import BookDetailsPage from '@/app/books/[id]/page'

type SelectedItem = { id?: number | string, type?: CollectionType }

type CollectionProps = {
	params: {
		id: string;
	}
}
export default function Collection({ params: { id } }: CollectionProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<SelectedItem>({})
	const { data: session } = useSession()

	const [items, loading] = useCollection(
		session && query(
			collection(db, DbCollections.Users, session.user?.email!, DbCollections.Galleries, id, DbCollections.Items),
			orderBy('createdAt', 'desc')
		)
	)

	useEffect(() => {
		if (!items?.docs.length) return
		console.log('items?.docs:', items.docs)
	}, [items])

	if (!session?.user?.email) return null

	const handleItemClick = (item: SelectedItem) => {
		setSelectedItem({ id: item.id, type: item.type })
		setIsOpen(true)
	}

	const handleModalClose = () => {
		setIsOpen(false)
	}

	return (
		<>
			{loading && (<p className="mt-6 text-center">Loading...</p>)}
			<ul className="grid justify-center gap-4 overflow-scroll grid-cols-posters lg:justify-between snap-y snap-proximity overscroll-y-auto">
				{items?.docs
					?.map(doc => ({ id: doc.id, ...doc.data() } as CollectionItem))
					?.map((item, idx) => (
						<li key={item.id} className="flex flex-col items-center justify-between w-full h-full max-h-[588px] gap-4 border-2 border-solid rounded-lg shadow-md self-baseline border-slate-300 text-gold lg:snap-start">
							<div
								onClick={() => handleItemClick({ ...item })}
								className="relative w-full transition-all duration-200 group">
								<picture className="w-full group-hover:opacity-50">
									<source
										srcSet={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
										media="(min-width: 768px)"
									/>
									<source
										srcSet={`https://image.tmdb.org/t/p/w400/${item.poster_path}`}
										media="(min-width: 640px)"
									/>
									<img
										src={`https://image.tmdb.org/t/p/w300/${item.poster_path}`}
										alt={item.title}
										className="h-full sm:h-96 w-full object-cover rounded-t-md max-w-[256px]"
										loading={!idx ? 'eager' : 'lazy'} />
								</picture>
								<div className="absolute top-0 hidden w-full h-full group-hover:grid group-hover:cursor-pointer">
									<EyeIcon className="w-20 h-20 transition-all duration-200 place-self-center group-hover:fill-blue" />
								</div>
							</div>
							<div className="flex items-start w-full h-full gap-2 px-4 py-2">
								<div className="flex flex-col items-start justify-between w-full h-full gap-2">
									<p className="text-xl font-semibold text-ellipsis">{item.title}</p>
									<p className="text-sm">{item.release_date}</p>
								</div>
							</div>
						</li>
					))}
			</ul>
			<Dialog
				className="relative z-[1000]"
				open={isOpen}
				onClose={handleModalClose}
			>
				<div className="fixed inset-0 h-full mx-auto max-w-7xl">
					<XMarkIcon
						onClick={handleModalClose}
						className="absolute z-10 h-12 cursor-pointer w-h-12 top-4 right-4 sm:right-8 lg:right-10 fill-orange"
					/>
					{selectedItem.type === 'movies' && (<MovieDetailsPage params={{ id: `${selectedItem.id}` }} />)}
					{selectedItem.type === 'tv-shows' && (<h1>{selectedItem.id}</h1>)}
					{selectedItem.type === 'books' && (<h1>{selectedItem.id}</h1>)}
				</div>
			</Dialog >
		</>
	)
}
