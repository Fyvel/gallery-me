import MovieSearch from '@/app/movies/components/search'

type SearchSelectorProps = {
	onChange: () => void;
	onClose: () => void;
}

export default function SearchSelector({ onChange, onClose }: SearchSelectorProps) {
	switch (window.location.pathname) {
		case '/movies':
			return (
				<MovieSearch onClose={onClose} />
			)
		default:
			return (
				<>
					<button role="button" onClick={onClose}>No filters available here</button>
				</>
			)
	}
}