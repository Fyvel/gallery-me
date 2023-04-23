'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AdjustmentsHorizontalIcon, Bars3Icon, MagnifyingGlassIcon, PowerIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { signOut, useSession } from 'next-auth/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Login from '@/components/login'
import SearchActions from '@/components/search-actions'
import FilterSelector from '@/components/filter-selector'
import SearchSelector from '@/components/search-selector'
import useClickOutside from '@/hooks/use-click-outside'
import Modal from './modal'

const initialNavigation = [
	{ name: 'Movies', href: '/movies', current: true, private: false },
	{ name: 'Tv Shows', href: '/tv-shows', current: false, private: false },
	{ name: 'Books', href: '/books', current: false, private: false },
	{ name: 'My collections', href: '/collections', current: false, private: true },
]

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

export default function Header() {
	const { data: session } = useSession()
	const pathname = usePathname()
	const [navigation, setNavigation] = useState<typeof initialNavigation>(initialNavigation)
	const [showFilters, setShowFilters] = useState(false)
	const [showSearch, setShowSearch] = useState(false)

	const headerRef = useRef<HTMLHeadElement>(null)
	useClickOutside(headerRef, () => {
		setShowFilters(false)
		setShowSearch(false)
	})


	useEffect(() => {
		if (!pathname) return
		setNavigation(prev => prev.map(
			item => ({
				...item,
				current: pathname.includes(item.href)
			})
		))
	}, [pathname])

	const handleFitler = () => {
		setShowFilters(prev => !prev)
		setShowSearch(false)
	}

	const handleSearch = () => {
		setShowSearch(prev => !prev)
		setShowFilters(false)
	}

	const handleClose = (onClose?: () => void) => () => {
		setShowFilters(false)
		setShowSearch(false)
		onClose?.()
	}

	// prevent scroll when filters or search are open
	useEffect(() => {
		if (!showFilters && !showSearch) return

		const html = document.querySelector('html')
		if (!html) return

		html.style.overflow = 'hidden'
		return () => {
			html.style.overflow = 'auto'
		}
	}, [showFilters, showSearch])

	return (
		<header ref={headerRef} className="bg-jet fixed w-full z-[900]">
			<Disclosure as="nav" className="relative">
				{({ open }) => (
					<>
						<div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
							<div className="relative grid items-center justify-between h-16 grid-cols-3 sm:flex">
								<div className="inset-y-0 left-0 flex items-center sm:hidden">
									{/* Mobile menu button */}
									<Disclosure.Button className="flex text-sm transition-all duration-200 bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue/50 hover:scale-125">
										<span className="sr-only">Open main menu</span>
										{open
											? <XMarkIcon className="block w-6 h-6 transition-all duration-200 rotate-180 hover:rotate-0 group-hover:scale-125" aria-hidden="true" />
											: <Bars3Icon className="block w-6 h-6 transition-all duration-200 rotate-180 hover:rotate-0 group-hover:scale-125" aria-hidden="true" />
										}
									</Disclosure.Button>
								</div>
								<div className="flex items-center justify-center flex-1 sm:justify-start">
									<div className="flex items-center flex-shrink-0">
										<Link href="/">
											<span className="sr-only">Gallery Me</span>
											<Image className="transition-all duration-200 hover:rotate-45" src="/library.svg" alt="" width={40} height={40} priority />
										</Link>
									</div>
									<div className="hidden w-full sm:ml-6 sm:block">
										<div className="flex items-center gap-4 text-xs sm:text-sm md:text-md lg:gap-6">
											{navigation
												.filter(item => !item.private || (item.private && session))
												.map((item) => (
													<a
														key={item.name}
														href={item.href}
														className={classNames(
															item.current
																? 'bg-nightblue italic'
																: 'hover:font-semibold hover:scale-110 hover:bg-nightblue',
															'rounded-md px-3 py-2 font-medium transition-all duration-200'
														)}
														aria-current={item.current ? 'page' : undefined}
													>
														{item.name.replace(' ', '\u00a0')}
													</a>
												))}
										</div>
									</div>
								</div>
								<div className="inset-y-0 right-0 flex items-center gap-2 pr-2 md:gap-6 justify-self-end sm:static sm:inset-auto sm:ml-6 sm:pr-0">
									<div className="flex justify-end gap-2 md:gap-6 text-blue">
										<SearchActions pathname={pathname} onFilter={handleFitler} onSearch={handleSearch} />
									</div>
									{/* Profile dropdown */}
									{session
										? (
											<button
												className="relative group"
												type="button"
												onClick={() => signOut({ callbackUrl: window.location.origin })}>
												<span className="sr-only">Logout</span>
												<picture>
													<img
														className="object-cover w-6 h-6 rounded-full group-hover:opacity-20 group-hover:scale-125"
														src={session?.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name || 'Lorem Ipsum'}`}
														alt={session?.user?.name || 'Lorem Ipsum'} />
												</picture>
												<PowerIcon className="absolute top-0 hidden w-6 h-6 group-hover:block fill-orange" />
											</button>
										)
										: (
											<Menu as="div" className="relative">
												<div>
													<Menu.Button className="flex text-sm transition-all duration-200 bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue/50 hover:scale-125">
														<span className="sr-only">Login</span>
														<UserCircleIcon className="w-6 h-6 transition-all duration-200 rotate-180 hover:rotate-0 hover:scale-125" />
													</Menu.Button>
												</div>
												<Transition
													as={Fragment}
													enter="transition ease-out duration-100"
													enterFrom="transform opacity-0 scale-95"
													enterTo="transform opacity-100 scale-100"
													leave="transition ease-in duration-75"
													leaveFrom="transform opacity-100 scale-100"
													leaveTo="transform opacity-0 scale-95"
												>
													<Menu.Items className="absolute right-0 w-48 mt-2 font-semibold text-black origin-top-right rounded-md shadow-lg bg-gold ring-1 ring-black ring-opacity-5 focus:outline-none">
														<Login />
													</Menu.Items>
												</Transition>
											</Menu>
										)}
								</div>
							</div>
						</div>
						<Disclosure.Panel className="z-50 w-full border-b-2 bg-jet sm:hidden">
							<div className="px-2 pt-2 pb-3 space-y-1">
								{navigation
									.filter(item => !item.private || (item.private && session))
									.map((item) => (
										<Disclosure.Button
											key={item.name}
											as="a"
											href={item.href}
											className={classNames(
												item.current
													? 'bg-blue/50 italic'
													: 'hover:font-bold hover:bg-blue/50',
												'block rounded-md px-3 py-2 text-base font-medium'
											)}
											aria-current={item.current ? 'page' : undefined}
										>
											{item.name}
										</Disclosure.Button>
									))}
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<>
				{showFilters && (
					<Modal
						title={
							<h1 className="flex flex-row justify-center w-full gap-4 my-4 text-lg">
								<p>Filters</p>
								<AdjustmentsHorizontalIcon className="w-6 h-6" />
							</h1>
						}
						onClose={handleClose(close)}>
						<div className="px-4 bg-jet max-w-7xl sm:px-6 lg:px-8">
							<FilterSelector
								pathname={pathname}
								onClose={handleClose(close)} />
						</div>
					</Modal>
				)}
				{showSearch && (
					<Modal
						title={
							<h1 className="flex flex-row justify-center w-full gap-4 my-4 text-lg">
								<p>Search for a movie</p>
								<MagnifyingGlassIcon className="w-6 h-6" />
							</h1>
						}
						onClose={handleClose(close)}>
						<div className="px-4 bg-jet max-w-7xl sm:px-6 lg:px-8">
							<SearchSelector
								pathname={pathname}
								onClose={handleClose(close)} />
						</div>
					</Modal>
				)}
			</>
		</header>
	)
}
