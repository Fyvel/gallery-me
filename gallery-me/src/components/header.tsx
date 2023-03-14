'use client'

import Link from "next/link"
import Image from "next/image"
import { Bars3Icon, MagnifyingGlassIcon, PowerIcon, UserCircleIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { signIn, signOut, useSession } from "next-auth/react"
import { Fragment } from "react"

const navigation = [
	{ name: 'Movies', href: '/movies', current: true },
	{ name: 'Tv Shows', href: '/tvshows', current: false },
	{ name: 'Books', href: '/books', current: false },
	{ name: 'My collections', href: '/my-collections', current: false },
]

const signInOptions = [
	{ name: 'Google', provider: 'google' },
	{ name: 'Facebook', provider: 'facebook' },
]

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

export default function Header() {
	const { data: session } = useSession()

	return (
		<header className="bg-jet text-gray">
			<Disclosure as="nav" className="bg-gray-800 relative">
				{({ open }) => (
					<>
						<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
							<div className="relative flex h-16 items-center justify-between">
								<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
									{/* Mobile menu button */}
									<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
										<span className="sr-only">Open main menu</span>
										{open ? (
											<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
										) : (
											<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
										)}
									</Disclosure.Button>
								</div>
								<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
									<div className="flex flex-shrink-0 items-center">
										<Link href="/">
											<span className="sr-only">Gallery Me</span>
											<Image className="block lg:hidden hover:rotate-45 transition-all duration-200" src="/library.svg" alt="" width={40} height={40} />
											<Image className="hidden lg:block hover:rotate-45 transition-all duration-200" src="/library.svg" alt="" width={50} height={50} />
										</Link>
									</div>
									<div className="hidden sm:ml-6 sm:block w-full">
										<div className="flex justify-center gap-2 md:gap-6">
											{navigation.map((item) => (
												<a
													key={item.name}
													href={item.href}
													className={classNames(
														item.current
															? 'bg-blue/10 italic'
															: 'hover:font-semibold hover:scale-110',
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
									<button type="button" className="rounded-full hover:scale-125 transition-all duration-200">
										<span className="sr-only">Open main menu</span>
										<MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
									</button>
									{/* Profile dropdown */}
									{session
										? (
											<button
												className="relative ml-3 group"
												type="button"
												onClick={() => signOut()}>
												<span className="sr-only">Logout</span>
												<picture>
													<img
														className='h-6 w-6 object-cover rounded-full group-hover:opacity-20 group-hover:scale-125'
														src={session?.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name || "Lorem Ipsum"}`}
														alt={session?.user?.name || "Lorem Ipsum"} />
												</picture>
												<PowerIcon className="h-6 w-6 absolute top-0 hidden group-hover:block fill-orange" />
											</button>
										)
										: (
											<Menu as="div" className="relative ml-3">
												<div>
													<Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue/50 hover:scale-125 transition-all duration-200">
														<span className="sr-only">Login</span>
														<UserCircleIcon className="rotate-180 h-6 w-6 hover:rotate-0 group-hover:scale-125 transition-all duration-200" />
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
													<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-jet shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
														<>
															<div className="text-center py-2">Sign in</div>
															{signInOptions.map((option) => (
																<Menu.Item key={option.name}>
																	<button
																		onClick={() => signIn(option.provider)}
																		role="button"
																		className='flex w-full px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-blue/10'
																	>
																		{option.name}
																	</button>
																</Menu.Item>
															))}
														</>
													</Menu.Items>
												</Transition>
											</Menu>
										)}
								</div>
							</div>
						</div>
						<Disclosure.Panel className="sm:hidden absolute z-50 bg-jet w-full">
							<div className="space-y-1 px-2 pt-2 pb-3">
								{navigation.map((item) => (
									<Disclosure.Button
										key={item.name}
										as="a"
										href={item.href}
										className={classNames(
											item.current ? 'bg-blue/10 italic' : 'hover:font-bold',
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
