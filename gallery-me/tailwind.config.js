/** @type {import('tailwindcss').Config} */

const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-gallery-me)', ...fontFamily.sans],
			},
		},
		colors: {
			...colors,
			current: 'currentColor',
			'blue': '#2BA5F7',
			'gold': '#E09B2D',
			'orange': '#F95428',
			'jet': '#0a1c21',
			'white': '#FFFFFF',
			'green': '#6cab0d',
		},
	},
	plugins: [],
}
