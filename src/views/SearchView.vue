<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { movieApi } from '@/services/api'
import type { MovieResponse } from '@/types/api'

const searchQuery = ref('')
const movies = ref<MovieResponse[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searched = ref(false)

const searchMovies = async () => {
  if (!searchQuery.value.trim()) return

  loading.value = true
  error.value = null
  searched.value = true

  try {
    movies.value = await movieApi.search(searchQuery.value, 20)
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to search movies. Please try again.'
    console.error('Error searching movies:', err)
  } finally {
    loading.value = false
  }
}

const handleSubmit = (e: Event) => {
  e.preventDefault()
  searchMovies()
}

const getPosterUrl = (posterUrl: string | null) => {
  if (!posterUrl) return null

  // Check if it's already a full URL
  if (posterUrl.startsWith('http')) {
    return posterUrl
  }

  // Otherwise, construct TMDB URL
  return `https://image.tmdb.org/t/p/w300${posterUrl}`
}

const formatDate = (date: string) => {
  return new Date(date).getFullYear()
}
</script>

<template>
  <div class="search">
    <div class="container">
      <div class="search-header">
        <h1 class="page-title">Search Movies</h1>
        <p class="page-description">
          Find specific movies from our collection
        </p>
      </div>

      <form @submit="handleSubmit" class="search-form">
        <div class="search-input-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Enter movie title..."
            class="search-input"
            :disabled="loading"
          />
          <button
            type="submit"
            :disabled="loading || !searchQuery.trim()"
            class="search-button"
          >
            <span v-if="!loading">🔍 Search</span>
            <span v-else>Searching...</span>
          </button>
        </div>
      </form>

      <div v-if="error" class="error-message">
        ⚠️ {{ error }}
      </div>

      <transition name="fade">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Searching movies...</p>
        </div>

        <div v-else-if="searched && movies.length === 0" class="empty-state">
          <span class="empty-icon">🎬</span>
          <h3>No movies found</h3>
          <p>Try a different search term</p>
        </div>

        <div v-else-if="movies.length > 0" class="results">
          <div class="results-header">
            <h2>Found {{ movies.length }} movie{{ movies.length !== 1 ? 's' : '' }}</h2>
          </div>
          <div class="movies-grid">
            <RouterLink
              v-for="movie in movies"
              :key="movie.id"
              :to="`/movie/${movie.id}`"
              class="movie-item"
            >
              <div class="movie-poster">
                <img
                  v-if="getPosterUrl(movie.poster_url)"
                  :src="getPosterUrl(movie.poster_url)"
                  :alt="movie.title"
                  class="poster-img"
                />
                <div v-else class="poster-placeholder">
                  <span>🎬</span>
                </div>
                <div class="movie-overlay">
                  <div v-if="movie.vote_average" class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</div>
                </div>
              </div>
              <div class="movie-details">
                <h3 class="movie-title">{{ movie.title }}</h3>
                <p class="movie-year">{{ formatDate(movie.release_date) }}</p>
                <div class="movie-genres">
                  <span v-for="genre in movie.genres.slice(0, 2)" :key="genre.id" class="genre">
                    {{ genre.name }}
                  </span>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.search {
  padding: 2rem 0;
  position: relative;
  z-index: 1;
}

.search-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.page-description {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.coming-soon-banner {
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background: rgba(245, 158, 11, 0.1);
  border: 2px solid var(--accent);
  border-radius: 12px;
  color: var(--accent);
  font-weight: 600;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.link-highlight {
  color: var(--primary-light);
  text-decoration: underline;
  font-weight: 700;
}

.link-highlight:hover {
  color: var(--primary);
}

.search-form {
  max-width: 800px;
  margin: 0 auto 3rem;
}

.search-input-wrapper {
  display: flex;
  gap: 1rem;
  background: var(--bg-secondary);
  padding: 0.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
  transition: border-color 0.3s;
}

.search-input-wrapper:focus-within {
  border-color: var(--primary);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.875rem 1rem;
  color: var(--text-primary);
  font-size: 1.1rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-button {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.search-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
}

.search-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--error);
  color: var(--error);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 5rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
}

.results {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.results-header {
  margin-bottom: 2rem;
}

.results-header h2 {
  font-size: 1.5rem;
  color: var(--text-secondary);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}

.movie-item {
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: all 0.3s;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
}

.movie-item:hover {
  transform: translateY(-8px);
  border-color: var(--primary);
  box-shadow: 0 8px 30px rgba(147, 51, 234, 0.3);
}

.movie-poster {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  opacity: 0.3;
}

.movie-overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
}

.rating {
  background: rgba(0, 0, 0, 0.8);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  color: var(--accent);
  backdrop-filter: blur(10px);
}

.movie-details {
  padding: 1rem;
}

.movie-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-year {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.movie-genres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.genre {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  border: 1px solid var(--border);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .search-input-wrapper {
    flex-direction: column;
    gap: 0.5rem;
  }

  .search-button {
    width: 100%;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }
}
</style>
