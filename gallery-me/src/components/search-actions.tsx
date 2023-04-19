import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'

type SearchActionsProps = {
	pathname: string | null;
	onSearch: () => void;
	onFilter: () => void;
}

export default function SearchActions({ onSearch, onFilter, pathname }: SearchActionsProps) {
	switch (pathname) {
		case '/movies':
			return (
				<>
					<button type="button" className="transition-all duration-200 rounded-full hover:scale-125" onClick={onFilter}>
						<span className="sr-only">Open filters</span>
						<AdjustmentsHorizontalIcon className="w-6 h-6 icon-cta" aria-hidden="true" />
					</button>
					<button type="button" className="transition-all duration-200 rounded-full hover:scale-125" onClick={onSearch}>
						<span className="sr-only">Open search menu</span>
						<MagnifyingGlassIcon className="w-6 h-6 icon-cta" aria-hidden="true" />
					</button>
				</>
			)
		default:
			return null
	}
}