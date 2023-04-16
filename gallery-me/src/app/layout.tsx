import './globals.css'
import { Sono } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
import GlobalMetaTags from '@/components/global-meta-tags'
import Pwa from '@/components/pwa'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import SessionProvider from '@/contexts/session-provider'
import ClientProvider from '@/contexts/client-provider'
import SearchContextProvider from '@/contexts/search-provider'

const galleryMeFont = Sono({
	subsets: ['latin'],
	variable: '--font-sono',
})

export const metadata = {
	title: 'Gallery Me',
	description: 'My gallery of everything',
	keywords: 'gallery, movies, tv shows, books, collections, ratings, list',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession(authOptions)

	return (
		<html lang="en" className={galleryMeFont.className}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/library.svg" />
				<GlobalMetaTags />
			</head>
			<body className={`${galleryMeFont.variable} font-sans flex flex-col min-h-screen`}>
				<Pwa />
				<SearchContextProvider>
					<SessionProvider session={session}>
						<Header />
						<main className="flex-1 mt-16 bg-nightblue">
							<ClientProvider />
							{children}
						</main>
						<Footer />
					</SessionProvider>
				</SearchContextProvider>
			</body>
		</html>
	)
}
