import './globals.css'
import { Sono } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession(authOptions)

	return (
		<html lang="en" className={galleryMeFont.className}>
			<body className={`${galleryMeFont.variable} font-sans max-h-screen`}>
				<SearchContextProvider>
					<SessionProvider session={session}>
						<div className="grid grid-cols-1 grid-rows-[auto_1fr_auto]">
							<Header />
							<main className="mt-16 bg-nightblue min-h-[calc(100vh_-_216px)] sm:min-h-[calc(100vh_-_152px)]">
								<ClientProvider />
								{children}
							</main>
							<Footer />
						</div>
					</SessionProvider>
				</SearchContextProvider>
			</body>
			<Pwa />
		</html>
	)
}
