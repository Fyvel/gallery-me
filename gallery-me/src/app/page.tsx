import Link from 'next/link'

export default function Home() {
	return (
		<main className="bg-blue/10 flex-1">
			<HeroContainer>
				{/* Hero section */}
				<div className="text-white py-20 mb-20 sm:mb-32 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full">
					<div className="container">
						<h1 className="text-3xl sm:text-5xl sm:leading-[1.25] font-bold mb-6">
							Discover and create your perfect collections
						</h1>
						<p className="text-lg mb-10">
							Experience entertainment your way - build and organize your own collections of movies, TV shows, and books. Share your collections with friends and family.
						</p>
						<Link href="/collections">
							<button
								className="bg-blue text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:scale-110 transition-all duration-200 ease-in-out">
								Get Started
							</button>
						</Link>
					</div>
				</div>
			</HeroContainer>

			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-full">
				{/* Featured Collections section */}
				<div className="mb-20 sm:mb-32">
					<h2 className="text-3xl font-bold mb-10">Popular Collections</h2>
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
						<div className="rounded-lg overflow-hidden shadow-lg bg-blue/40">
							<picture>
								<img className="w-full h-64 object-cover" src="https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=400" alt="Collection 1" />
							</picture>
							<div className="p-6">
								<h3 className="text-xl font-semibold mb-2">Movie Night</h3>
								<p>
									Lights, camera, collection! Discover a wide range of movies and get ideas for your next movie marathon.
								</p>
							</div>
						</div>
						<div className="rounded-lg overflow-hidden shadow-lg bg-blue/40">
							<picture>
								<img className="w-full h-64 object-cover" src="https://images.unsplash.com/photo-1513719172228-06ca20578d80?w=400" alt="Collection 2" />
							</picture>
							<div className="p-6">
								<h3 className="text-xl font-semibold mb-2">Sci-Fi</h3>
								<p>A collection of mind-bending sci-fi movies and TV shows that will keep you on the edge of your seat.</p>
							</div>
						</div>
						<div className="rounded-lg overflow-hidden shadow-lg bg-blue/40">
							<picture>
								<img className="w-full h-64 object-cover" src="https://images.unsplash.com/photo-1600904290455-241ce18f78bb?w=400" alt="Collection 3" />
							</picture>
							<div className="p-6">
								<h3 className="text-xl font-semibold mb-2">&apos;Must Read&apos; Books</h3>
								<p>
									Create your own library of must-read books and get lost in a world of stories and ideas
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Benefits section */}
				<div className="mb-20 sm:mb-32">
					<h2 className="text-3xl font-bold mb-10">Why Gallery-Me?</h2>
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
						<div>
							<h3 className="text-xl font-semibold mb-4">Easy Organization</h3>
							<p>Organize your collections easily and efficiently with our intuitive interface.</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-4">Personalized Recommendations</h3>
							<p>Get recommendations based on your interests and previous collections.</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-4">Share with Friends</h3>
							<p>Share your collections with friends and family on social media.</p>
						</div>
					</div>
				</div>
			</div>
		</main>
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
