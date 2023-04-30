/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV !== 'production',
	exclude: [
		// add buildExcludes here
		({ asset, compilation }) => {
			if (
				asset.name.startsWith('server/') ||
				asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/)
			) {
				return true
			}
			if (process.env.NODE_ENV !== 'production' && !asset.name.startsWith('static/runtime/')) {
				return true
			}
			return false
		}
	],
})
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		appDir: true,
	},
}

module.exports = withPWA(nextConfig)
