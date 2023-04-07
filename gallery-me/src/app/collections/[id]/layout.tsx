export async function generateMetadata({ params }: { params: { id: string } }) {
	// TODO: figure out how to get the collection name here
	return {
		title: 'Collection',
	}
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>{children}</>
	)
}
