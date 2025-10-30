export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_url: string | null
  backdrop_url: string | null
  release_date: string
  runtime: number | null
  vote_average: number | null
  vote_count: number | null
  genres: Genre[]
}

export interface RandomMovieResponse extends Movie {
  real_review: string
  fake_opinion: string
}

export interface MovieResponse extends Movie {}

export interface OpinionCreate {
  author_name?: string
  content: string
}

export interface OpinionResponse {
  id: number
  movie_id: number
  movie_title: string
  author_name: string
  content: string
  created_at: string
}

export interface TopOpinionResponse {
  id: number
  movie_id: number
  movie_title: string
  content: string
  absurdity_score: number
  generation_method: string
  upvotes: number
  downvotes: number
  lol_votes: number
  wtf_votes: number
}

export type VoteType = 'up' | 'down' | 'lol' | 'wtf'

export interface VoteCreate {
  vote_type: VoteType
  voter_identifier?: string
}

export interface VoteResponse {
  id: number
  opinion_id: number
  vote_type: VoteType
}

export interface MovieUpload {
  title: string
  original_title: string
  overview: string
  release_date: string
  runtime: number
  poster_url: string
  backdrop_url: string
  genre_names: string[]
}

export interface MovieUploadResponse {
  id: number
  title: string
  original_title: string
  overview: string
  release_date: string
  runtime: number
  poster_url: string
  backdrop_url: string
  vote_average: number | null
  vote_count: number | null
  genres: Genre[]
}

export interface ReviewCreate {
  author: string
  content: string
  rating: string
}

export interface ReviewResponse {
  id: number
  movie_id: number
  movie_title: string
  source: string
  author: string
  content: string
  rating: string
  created_at: string
}
