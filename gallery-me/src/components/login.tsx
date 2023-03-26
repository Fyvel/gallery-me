'use client'

import { Menu } from '@headlessui/react'
import { signIn } from 'next-auth/react'

const signInOptions = [
	{ name: 'Google', provider: 'google' },
	{ name: 'Facebook', provider: 'facebook' },
]

type LoginProps = {
	redirectUrl?: string
}
export default function Login({ redirectUrl }: LoginProps) {
	return (
		<>
			<div className="text-center py-2">Sign in</div>
			{signInOptions.map((option) => (
				<Menu.Item key={option.name}>
					<button
						onClick={() => signIn(option.provider, {
							callbackUrl: redirectUrl
								? `${window.location.origin}${redirectUrl}`
								: undefined
						})}
						role="button"
						className="flex w-full px-4 py-2 rounded-md text-sm hover:bg-nightblue hover:text-white"
					>
						{option.name}
					</button>
				</Menu.Item>
			))}
		</>
	)
}