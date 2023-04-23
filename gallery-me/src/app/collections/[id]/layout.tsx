export async function generateMetadata({ params }: { params: { id: string } }) {
	// TODO: figure out how to get the collection name here
	return {
		title: 'Collection',
	}
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative h-full px-2 py-4 mx-auto overflow-y-auto max-w-7xl sm:px-6 lg:px-8 bg-nightblue">
			{children}
		</div>
	)
}
