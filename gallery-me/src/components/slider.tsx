import React, { useRef, RefObject, ReactNode, useState, Fragment } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import useDeviceDetect from '@/hooks/use-device-detect'

type SliderProps<T> = {
	items: T[],
	className?: string,
	children: (item: T) => ReactNode,
}
export default function Slider<T extends { id: string | number }>({ items, className, children }: SliderProps<T>) {
	const { isMobile } = useDeviceDetect()
	const ref = useRef<HTMLDivElement>(null)
	const [scrollButtons, setScrollButtons] = useState<'left' | 'right' | 'both' | 'none'>('right')

	const handleScroll = (ref: RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
		if (ref.current) {
			const scrollAmount = direction === 'left' ? -(ref.current.clientWidth - 200) : (ref.current.clientWidth - 200)
			ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
			if (direction === 'left' && Math.round(ref.current.scrollLeft) <= 100)
				setScrollButtons('right')
			else if (direction === 'right' && Math.round(ref.current.scrollLeft + ref.current.clientWidth) >= ref.current.scrollWidth)
				setScrollButtons('left')
			else
				setScrollButtons('both')
		}
	}

	return (
		<div className="flex flex-row w-full items-center">
			{!isMobile && items.length > 1 && (
				<button onClick={() => handleScroll(ref, 'left')} disabled={!['left', 'both'].includes(scrollButtons)}>
					<ChevronLeftIcon className={`h-10 w-10 ${!['left', 'both'].includes(scrollButtons) && 'opacity-20'}`} />
				</button>
			)}
			<div ref={ref} className={`${className} snap-x snap-proximity scroll-smooth`}>
				{items.map(item => (
					<Fragment key={item.id}>
						{children(item)}
					</Fragment>
				))}
			</div>
			{!isMobile && items.length > 1 && (
				<button onClick={() => handleScroll(ref, 'right')} disabled={!['right', 'both'].includes(scrollButtons)}>
					<ChevronRightIcon className={`h-10 w-10 ${!['right', 'both'].includes(scrollButtons) && 'opacity-20'}`} />
				</button>
			)}
		</div>
	)
}
