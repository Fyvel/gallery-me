import GlobalMetaTags from '@/components/global-meta-tags'

export default function Head() {
	return (
		<>
			<GlobalMetaTags />
			<title>Gallery Me</title>
			<meta name="description" content="My gallery of everything" />
			<meta name="keywords" content="gallery, movies, tv shows, books, collections, ratings, list" />
		</>
	)
}