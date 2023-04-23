'use client'

import Login from '@/components/login'
import { Menu, Transition } from '@headlessui/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Fragment } from 'react'

export default function Home() {
	const { data: session } = useSession()

	return (
		<>
			<HeroContainer>
				{/* Hero section */}
				<div className="h-full px-2 py-20 mx-auto mb-20 text-white sm:mb-32 max-w-7xl sm:px-6 lg:px-8">
					<div className="container">
						<h1 className="text-3xl sm:text-5xl sm:leading-[1.25] font-bold mb-6">
							Discover and create your perfect collections
						</h1>
						<p className="mb-10 text-lg">
							Experience entertainment your way - build and organize your own collections of movies, TV shows, and books. Share your collections with friends and family.
						</p>
						{!session?.user && (
							<Menu as="div" className="relative ml-3">
								<Menu.Button className="cta">
									Get started
								</Menu.Button>
								<Transition
									as={Fragment}
									enter="transition ease-out duration-100"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>
									<Menu.Items className="absolute top-0 z-10 w-48 ml-2 font-semibold text-black rounded-md shadow-lg translate-x-36 bg-gold ring-1 ring-black ring-opacity-5 focus:outline-none">
										<Login redirectUrl="/collections" />
									</Menu.Items>
								</Transition>
							</Menu>
						)}
						{session?.user && (
							<Link href="/collections">
								<button className="cta">
									Get Started
								</button>
							</Link>
						)}
					</div>
				</div>
			</HeroContainer>

			<div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
				{/* Featured Collections section */}
				<div className="mb-20 sm:mb-32">
					<h2 className="mb-10 text-3xl font-bold">Popular Collections</h2>
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
						<div className="overflow-hidden rounded-lg shadow-lg bg-blue/40">
							<picture>
								<img className="object-cover w-full h-64" src="https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=400" alt="Collection 1" />
							</picture>
							<div className="p-6">
								<h3 className="mb-2 text-xl font-semibold">Movie Night</h3>
								<p>
									Lights, camera, collection! Discover a wide range of movies and get ideas for your next movie marathon.
								</p>
							</div>
						</div>
						<div className="overflow-hidden rounded-lg shadow-lg bg-blue/40">
							<picture>
								<img className="object-cover w-full h-64" src="https://images.unsplash.com/photo-1513719172228-06ca20578d80?w=400" alt="Collection 2" />
							</picture>
							<div className="p-6">
								<h3 className="mb-2 text-xl font-semibold">Sci-Fi</h3>
								<p>A collection of mind-bending sci-fi movies and TV shows that will keep you on the edge of your seat.</p>
							</div>
						</div>
						<div className="overflow-hidden rounded-lg shadow-lg bg-blue/40">
							<picture>
								<img className="object-cover w-full h-64" src="https://images.unsplash.com/photo-1600904290455-241ce18f78bb?w=400" alt="Collection 3" />
							</picture>
							<div className="p-6">
								<h3 className="mb-2 text-xl font-semibold">&apos;Must Read&apos; Books</h3>
								<p>
									Create your own library of must-read books and get lost in a world of stories and ideas
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Benefits section */}
				<div className="mb-20 sm:mb-32">
					<h2 className="mb-10 text-3xl font-bold">Why Gallery-Me?</h2>
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
						<div>
							<h3 className="mb-4 text-xl font-semibold">Easy Organization</h3>
							<p>Organize your collections easily and efficiently with our intuitive interface.</p>
						</div>
						<div>
							<h3 className="mb-4 text-xl font-semibold">Personalized Recommendations</h3>
							<p>Get recommendations based on your interests and previous collections.</p>
						</div>
						<div>
							<h3 className="mb-4 text-xl font-semibold">Share with Friends</h3>
							<p>Share your collections with friends and family on social media.</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

function HeroContainer({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<div className="sm:hidden" style={{ background: 'center / cover no-repeat url("https://images.unsplash.com/photo-1524169358666-79f22534bc6e?w=640")' }}>
				{children}
			</div>
			<div className="hidden sm:block md:hidden" style={{ background: 'center / cover no-repeat url("https://images.unsplash.com/photo-1524169358666-79f22534bc6e?w=768")' }}>
				{children}
			</div>
			<div className="hidden md:block lg:hidden" style={{ background: 'center / cover no-repeat url("https://images.unsplash.com/photo-1524169358666-79f22534bc6e?w=1024")' }}>
				{children}
			</div>
			<div className="hidden lg:block" style={{ background: 'center / cover no-repeat url("https://images.unsplash.com/photo-1524169358666-79f22534bc6e?w=1400")' }}>
				{children}
			</div>
		</div>
	)
}
