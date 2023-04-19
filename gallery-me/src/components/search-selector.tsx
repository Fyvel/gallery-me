import MovieSearch from '@/app/movies/components/search'

type SearchSelectorProps = {
	pathname: string | null;
	onClose: () => void;
}

export default function SearchSelector({ onClose, pathname }: SearchSelectorProps) {
	switch (pathname) {
		case '/movies':
			return (
				<MovieSearch onClose={onClose} />
			)
		default:
			return (
				<button role="button" onClick={onClose}>No search available here</button>
			)
	}
}