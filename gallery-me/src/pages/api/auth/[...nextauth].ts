import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
// import TwitterProvider from 'next-auth/providers/twitter'
// import GitHubProvider from 'next-auth/providers/github'
// import InstagramProvider from 'next-auth/providers/instagram'

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_SECRET!,
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
		}),
		// GitHubProvider({
		// 	clientId: process.env.GITHUB_ID!,
		// 	clientSecret: process.env.GITHUB_SECRET!,
		// }),
		// TwitterProvider({
		// 	clientId: process.env.TWITTER_CLIENT_ID!,
		// 	clientSecret: process.env.TWITTER_CLIENT_SECRET!,
		// }),
		// InstagramProvider({
		// 	clientId: process.env.INSTAGRAM_CLIENT_ID!,
		// 	clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
		// }),
	],
}
export default NextAuth(authOptions)