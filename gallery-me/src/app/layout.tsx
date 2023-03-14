import './globals.css'
import { Sono } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
import GlobalMetaTags from '@/components/global-meta-tags'
import Pwa from '@/components/pwa'
import Header from '@/components/header'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import SessionProvider from '@/contexts/session-provider'

const galleryMeFont = Sono({
	subsets: ['latin'],
	variable: '--font-gallery-me',
})

export const metadata = {
	title: 'Gallery Me',
	description: 'My gallery of everything',
	keywords: 'gallery, movies, tv shows, books, collections, ratings, list',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession(authOptions)
	
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/library.svg" />
				<GlobalMetaTags />
			</head>
			<body className={`${galleryMeFont.variable} font-sans`}>
				<Pwa />
				<SessionProvider session={session}>
					<Header />
					<div>{children}</div>
				</SessionProvider>
			</body>
		</html>
	)
}
