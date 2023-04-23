/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV !== 'production',
})
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		appDir: true,
	},
}

module.exports = withPWA(nextConfig)
