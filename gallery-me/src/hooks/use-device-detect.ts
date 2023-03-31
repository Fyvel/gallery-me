import { useState, useEffect } from 'react'

export default function useDeviceDetect(){
	const [isMobile, setMobile] = useState(false)
	const [isTablet, setTablet] = useState(false)
	const [isDesktop, setDesktop] = useState(false)
	const [isBrowser, setBrowser] = useState(false)

	useEffect(() => {
		const userAgent = navigator.userAgent
		const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))
		const tablet = Boolean(userAgent.match(/Tablet|iPad/i))
		const desktop = Boolean(userAgent.match(/Windows|Macintosh|Linux/i))
		const browser = Boolean(userAgent.match(/Chrome|Firefox|Safari/i))

		setMobile(mobile)
		setTablet(tablet)
		setDesktop(desktop)
		setBrowser(browser)
	}, [])

	return { isMobile, isTablet, isDesktop, isBrowser }
}