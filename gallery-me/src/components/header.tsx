'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Bars3Icon, MagnifyingGlassIcon, PowerIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { signOut, useSession } from 'next-auth/react'
import { Fragment, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Login from '@/components/login'

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

	useEffect(() => {
		if (!pathname) return
		setNavigation(prev => prev.map(
			item => ({
				...item,
				current: pathname.includes(item.href)
			})
		))
	}, [pathname])

	return (
		<header className="bg-jet fixed w-full z-[1000]">
			<Disclosure as="nav" className="relative">
				{({ open }) => (
					<>
						<div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
							<div className="relative flex items-center justify-between h-16">
								<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
									{/* Mobile menu button */}
									<Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:bg-jet/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
										<span className="sr-only">Open main menu</span>
										{open ? (
											<XMarkIcon className="block w-6 h-6" aria-hidden="true" />
										) : (
											<Bars3Icon className="block w-6 h-6" aria-hidden="true" />
										)}
									</Disclosure.Button>
								</div>
								<div className="flex items-center justify-center flex-1 sm:justify-start">
									<div className="flex items-center flex-shrink-0">
										<Link href="/">
											<span className="sr-only">Gallery Me</span>
											<Image className="block transition-all duration-200 lg:hidden hover:rotate-45" src="/library.svg" alt="" width={40} height={40} priority />
											<Image className="hidden transition-all duration-200 lg:block hover:rotate-45" src="/library.svg" alt="" width={50} height={50} priority />
										</Link>
									</div>
									<div className="hidden w-full sm:ml-6 sm:block">
										<div className="flex justify-center gap-4 lg:gap-6">
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
															'rounded-md px-3 py-2 text-sm font-medium transition-all duration-200'
														)}
														aria-current={item.current ? 'page' : undefined}
													>
														{item.name}
													</a>
												))}
										</div>
									</div>
								</div>
								<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
									<button type="button" className="transition-all duration-200 rounded-full hover:scale-125">
										<span className="sr-only">Open main menu</span>
										<MagnifyingGlassIcon className="w-6 h-6" aria-hidden="true" />
									</button>
									{/* Profile dropdown */}
									{session
										? (
											<button
												className="relative ml-3 group"
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
											<Menu as="div" className="relative ml-3">
												<div>
													<Menu.Button className="flex text-sm transition-all duration-200 bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue/50 hover:scale-125">
														<span className="sr-only">Login</span>
														<UserCircleIcon className="w-6 h-6 transition-all duration-200 rotate-180 hover:rotate-0 group-hover:scale-125" />
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
						<Disclosure.Panel className="absolute z-50 w-full sm:hidden bg-jet">
							<div className="px-2 pt-2 pb-3 space-y-1">
								{navigation.map((item) => (
									<Disclosure.Button
										key={item.name}
										as="a"
										href={item.href}
										className={classNames(
											item.current
												? 'bg-nightblue italic'
												: 'hover:font-bold hover:bg-nightblue',
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
		</header>
	)
}
