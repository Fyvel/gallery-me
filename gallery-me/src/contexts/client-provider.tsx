'use client'

import Pwa from '@/components/pwa'
import { Toaster } from 'react-hot-toast'

export default function ClientProvider() {
	return (
		<>
			<Toaster position="top-right" />
			<Pwa />
		</>
	)
}