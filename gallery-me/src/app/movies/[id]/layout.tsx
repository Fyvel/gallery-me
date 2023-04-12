import ErrorBoundary from '@/components/error-boundary'
import { getMovie } from '@/lib/tmdb'

export async function generateMetadata({ params }: { params: { id: string } }) {
	const movie = await getMovie(+params.id)
	return {
		title: `Movies | ${movie.title}`,
	}
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<ErrorBoundary>{children}</ErrorBoundary>
	)
}
