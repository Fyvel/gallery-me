type ApiError = {
	code: number;
	message: string;
}

type Movies = {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
}

type Movie = {
	id: number | string;
	title: string;
	poster_path: string;
	overview: string;
	release_date: string;
	vote_average: number;
	vote_count: number;
	tagline: string;
	genres: MovieGenre[];
	runtime: number;
	backdrop_path: string;
}

type MovieGenre = {
	id: number;
	name: string;
}

type MovieVideos = {
	id: number;
	results: MovieVideo[];
}

type MovieVideo = {
	id: string;
	key: string;
	name: string;
	site: string;
	type: string;
	published_at: string;
	official: boolean;
}

type MovieCredits = {
	id: number;
	cast: MovieCast[];
	crew: MovieCrew[];
}

type MovieCast = {
	id: number;
	name: string;
	character: string;
	profile_path: string;
	known_for_department: string;
}

type MovieCrew = {
	id: number;
	name: string;
	job: string;
	profile_path: string;
	known_for_department: string;
}

type MovieRecommendations = {
	id: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
}

type CollectionType = 'movies' | 'tv-shows' | 'books'

type Collection = {
	id: string;
	userId: string;
	name: string;
	type: CollectionType;
	createdAt: string | Timestamp;
	updatedAt?: string;
	isPublic: boolean;
	items?: CollectionItem[];
}

type CollectionItem = {
	createdAt: FieldValue;
} & Movie