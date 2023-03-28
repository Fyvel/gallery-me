import { useState, useEffect, RefObject } from 'react'

export default function useOnScreen(ref: RefObject<Element>, options?: IntersectionObserverInit) {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const onIntersect = ([entry]: IntersectionObserverEntry[]) => setIsVisible(entry.isIntersecting)
		const observer = new IntersectionObserver(onIntersect, options)

		if (!ref.current) return
		observer.observe(ref.current)

		return () => { observer.disconnect() }
	}, [options, ref])

	return isVisible
}
