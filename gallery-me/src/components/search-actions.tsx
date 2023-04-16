import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'

type SearchActionsProps = {
	onSearch: () => void;
	onFilter: () => void;
}

export default function SearchActions({ onSearch, onFilter }: SearchActionsProps) {
	return (
		<div className="flex justify-end gap-2 md:gap-6 text-blue">
			<button type="button" className="transition-all duration-200 rounded-full hover:scale-125" onClick={onFilter}>
				<span className="sr-only">Open filters</span>
				<AdjustmentsHorizontalIcon className="w-6 h-6 icon-cta" aria-hidden="true" />
			</button>
			<button type="button" className="transition-all duration-200 rounded-full hover:scale-125" onClick={onSearch}>
				<span className="sr-only">Open search menu</span>
				<MagnifyingGlassIcon className="w-6 h-6 icon-cta" aria-hidden="true" />
			</button>
		</div>
	)
}