import MovieFilters from '@/app/movies/components/filters'

type FilterSelectorProps = {
	pathname: string | null;
	onClose: () => void;
}
export default function FilterSelector({ onClose, pathname }: FilterSelectorProps) {
	switch (pathname) {
		case '/movies':
			return (
				<MovieFilters
					onClose={onClose}
					initial={{
						route: 'movies/popular',
						filters: { genres: [] },
					}} />
			)
		default:
			return (
				<button role="button" onClick={onClose}>No filters available here</button>
			)
	}
}