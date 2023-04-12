'use client'

import { useSession } from 'next-auth/react'
import Modal from '@/components/modal'
import { Switch } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { GlobeAsiaAustraliaIcon, LockClosedIcon, PlusIcon } from '@heroicons/react/24/solid'
import CollectionForm from '@/components/collection-form'
import useSWR from 'swr'
import toast from 'react-hot-toast'

const fetchMovieDetails = (url: string) => fetch(url).then(res => res.json())

type CollectionSelector = {
	id: number | string,
	type: CollectionType,
	onClose: () => void,

}
export default function CollectionSelector({ id, type, onClose }: CollectionSelector) {
	const { data: session } = useSession()
	const getUrl = () => {
		switch (type) {
			case 'movies':
				return { url: `/api/movies/${id}`, fetcher: fetchMovieDetails }
			case 'tv-shows':
				return { url: `/api/tv-shows/${id}`, fetcher: fetchMovieDetails }
			case 'books':
				return { url: `/api/books/${id}`, fetcher: fetchMovieDetails }
			default:
				return { url: '', fetcher: () => null }
		}
	}
	const { url, fetcher } = getUrl()
	const { data: item } = useSWR(url, fetcher)
	const { data: galleries, isLoading: loading, mutate } = useSWR(
		session?.user ? `/api/galleries?type=${type}` : null,
		(url: string) => fetch(url, { headers: { 'Content-Type': 'application/json', 'user-email': session?.user?.email || '' } }).then(res => res.json()))
	const [enabled, setEnabled] = useState<{ [key: string]: boolean }>({})
	const [createNew, setCreateNew] = useState(false)
	const [lists, setLists] = useState<Collection[]>([])

	useEffect(() => {
		if (!galleries?.response?.length) return
		setLists(galleries?.response || [])
		const newEnabled: { [key: string]: boolean } = {}
		for (const list of galleries.response) {
			const items = list.items
			newEnabled[list.id] = items.some((doc: CollectionItem) => doc.id === `${id}`)
		}
		setEnabled(newEnabled)		
	}, [galleries, id])

	const handleSwitchChange = async (collectionId: string) => {
		if (!session?.user?.email) return null
		const toggle = !enabled[collectionId]
		setEnabled({ ...enabled, [collectionId]: toggle })
		try {
			if (toggle) {
				const itemData: CollectionItem = {
					id: `${item.id}`,
					createdAt: '',
					title: item.title,
					poster_path: item.poster_path,
					overview: item.overview,
					release_date: item.release_date,
					vote_average: item.vote_average,
					vote_count: item.vote_count,
					tagline: item.tagline,
					genres: item.genres,
					runtime: item.runtime,
					backdrop_path: item.backdrop_path,
				}
				const result = await fetch(`/api/galleries/${collectionId}/items/${item.id}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'user-email': session.user.email,
					},
					body: JSON.stringify({ itemData })
				})
				if (result.ok) {
					toast.success('Item added')
				} else {
					throw new Error('Failed to add item')
				}
			}
			else {
				const result = await fetch(`/api/galleries/${collectionId}/items/${item.id}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'user-email': session.user.email,
					},
				})
				if (result.ok) {
					toast.success('Item removed')
				} else {
					throw new Error('Failed to remove item')
				}
			}
		} catch (error: Error | any) {
			toast.error(error?.message)
			setEnabled({ ...enabled, [collectionId]: !toggle })
		}
	}

	return (
		<Modal title="Add to..." onClose={onClose}>
			<>
				<div className="relative px-10 p-6 flex-auto bg-zinc-800 text-white min-h-[220px] select-none">
					{loading && (
						<div className="flex flex-col items-center gap-2">
							<svg className="animate-spin h-36 w-36" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Loading...
						</div>
					)}
					<ul className="flex flex-col gap-3">
						{lists?.map(list => (
							<li key={list.id} className="flex justify-between w-full">
								<Switch.Group>
									<div className="flex flex-row-reverse gap-4">
										<Switch.Label className="cursor-pointer">{list.name}</Switch.Label>
										<Switch
											checked={enabled[list.id]}
											onChange={() => handleSwitchChange(list.id)}
											className={`${enabled[list.id] ? 'bg-blue' : 'bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full`}>
											<span className="sr-only">Enable notifications</span>
											<span className={`${enabled[list.id] ? 'translate-x-6' : 'translate-x-1'}
												inline-block h-4 w-4 transform rounded-full bg-white transition`}
											/>
										</Switch>
									</div>
								</Switch.Group>
								{list.isPublic
									? <GlobeAsiaAustraliaIcon className="w-6 h-6 text-gray-400" />
									: <LockClosedIcon className="w-6 h-6 text-gray-400 opacity-50" />}
							</li>
						))}
					</ul>
				</div>
				<div className="flex items-center justify-start p-6 px-10 border-t border-solid rounded-b-lg bg-jet">
					<button className="flex gap-4 transition-all duration-200 hover:text-blue" type="button" onClick={() => setCreateNew(true)}>
						<PlusIcon className="w-6 h-6" />
						Create a new collection
					</button>
				</div>
				{createNew && (
					<CollectionForm onClose={() => {
						setCreateNew(false)
						mutate()
					}} defaultValues={{ type: 'movies' }} />
				)}
			</>
		</Modal>
	)
}