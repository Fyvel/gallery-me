import GlobalMetaTags from '@/components/global-meta-tags'

export default function Head() {
	return (
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/library.svg" />
			<GlobalMetaTags />
			<title>Gallery Me</title>
			<meta name="description" content="My gallery of everything" />
			<meta name="keywords" content="gallery, movies, tv shows, books, collections, ratings, list" />
		</head>
	)
}