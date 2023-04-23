import ErrorBoundary from '@/components/error-boundary'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-full px-2 pt-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
			<ErrorBoundary>{children}</ErrorBoundary>
		</div>
	)
}