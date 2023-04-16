import MovieFilters from '@/app/movies/components/filters'

type FilterSelectorProps = {
	onChange: () => void;
	onClose: () => void;
}
export default function FilterSelector({ onChange, onClose }: FilterSelectorProps) {
	// check if current page is Movies
	// if so, render the movie filter selector
	// if not, render the tv show filter selector

	switch (window.location.pathname) {
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
				<>
					<button role="button" onClick={onClose}>No filters available here</button>
				</>
			)
	}
}