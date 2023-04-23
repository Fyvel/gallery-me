import GlobalMetaTags from '@/components/global-meta-tags'

export default function Head() {
	return (
		<>
			<GlobalMetaTags />
			<link rel="preconnect" href="https://image.tmdb.org" />
			<title>Collections</title>
			<meta name="description" content="Browse your gallery" />
		</>
	)
}