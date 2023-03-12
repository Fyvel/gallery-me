import './globals.css'
import GlobalMetaTags from '@/components/global-meta-tags'
import { Sono } from 'next/font/google'

const galleryMeFont = Sono({
	subsets: ['latin'],
	variable: '--font-gallery-me',
})

export const metadata = {
	title: 'Gallery Me',
	description: 'My gallery of everything',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/library-mask.svg" />
				<GlobalMetaTags />
			</head>
			<body className={`${galleryMeFont.variable} font-sans`}>
				{/* menu */}
				<div>Menu</div>
				<div>
					{children}
				</div>
				{/* footer */}
				<div>Footer</div>
			</body>
		</html>
	)
}
