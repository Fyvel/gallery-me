type Movie = {
	id: number;
	title: string;
	poster_path: string;
	overview: string;
	release_date: string;
	vote_average: number;
	vote_count: number;
	tagline: string;
	genres: MovieGenre[];
}

type MovieGenre = {
	id: number;
	name: string;
}

type MovieVideo = {
	id: string;
	key: string;
	name: string;
	site: string;
	type: string;
	published_at: string;
}
