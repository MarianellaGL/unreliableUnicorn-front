import axios from 'axios'
import type {
  RandomMovieResponse,
  MovieResponse,
  OpinionCreate,
  OpinionResponse,
  TopOpinionResponse,
  VoteCreate,
  VoteResponse,
  MovieUpload,
  MovieUploadResponse,
  ReviewCreate,
  ReviewResponse,
} from '@/types/api'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://unreliableunicorn-api.onrender.com',
  timeout: 10000,
  headers: {
    'X-API-Key': import.meta.env.VITE_API_KEY || '',
  },
})

export const movieApi = {
  getRandom: async (): Promise<RandomMovieResponse> => {
    const { data } = await api.get<RandomMovieResponse>('/pelicula/random')
    return data
  },

  getById: async (movieId: number): Promise<RandomMovieResponse> => {
    const { data } = await api.get<RandomMovieResponse>(`/pelicula/${movieId}`)
    return data
  },

  search: async (query: string, limit: number = 10): Promise<MovieResponse[]> => {
    const { data } = await api.get<MovieResponse[]>('/pelicula/search', {
      params: { q: query, limit },
    })
    return data
  },

  submitOpinion: async (movieId: number, opinion: OpinionCreate): Promise<OpinionResponse> => {
    const { data } = await api.post<OpinionResponse>(`/pelicula/${movieId}/opinion`, opinion)
    return data
  },

  upload: async (movie: MovieUpload): Promise<MovieUploadResponse> => {
    const { data } = await api.post<MovieUploadResponse>('/pelicula/', movie)
    return data
  },

  submitReview: async (movieId: number, review: ReviewCreate): Promise<ReviewResponse> => {
    const { data } = await api.post<ReviewResponse>(`/pelicula/${movieId}/review`, review)
    return data
  },
}

export const opinionApi = {
  getTop: async (limit: number = 10): Promise<TopOpinionResponse[]> => {
    const { data } = await api.get<TopOpinionResponse[]>('/opiniones/top', {
      params: { limit },
    })
    return data
  },
}

export const voteApi = {
  voteOnOpinion: async (opinionId: number, vote: VoteCreate): Promise<VoteResponse> => {
    const { data } = await api.post<VoteResponse>(`/vote/opinion/${opinionId}`, vote)
    return data
  },

  voteOnUserOpinion: async (opinionId: number, vote: VoteCreate): Promise<VoteResponse> => {
    const { data } = await api.post<VoteResponse>(`/vote/user-opinion/${opinionId}`, vote)
    return data
  },
}

export default api
