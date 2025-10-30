<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { movieApi } from '@/services/api'
import type { RandomMovieResponse } from '@/types/api'
import MovieCard from '@/components/MovieCard.vue'

const route = useRoute()
const router = useRouter()

const movie = ref<RandomMovieResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadMovie = async () => {
  const movieId = parseInt(route.params.id as string)

  if (isNaN(movieId)) {
    error.value = 'Invalid movie ID'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    movie.value = await movieApi.getById(movieId)
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to load movie. Please try again.'
    console.error('Error loading movie:', err)
  } finally {
    loading.value = false
  }
}

const handleReviewSubmitted = () => {
  console.log('Review submitted, reloading movie...')
  loadMovie()
}

const handleOpinionSubmitted = () => {
  console.log('Opinion submitted, reloading movie...')
  loadMovie()
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadMovie()
})
</script>

<template>
  <div class="movie-detail">
    <div class="container">
      <button @click="goBack" class="back-button">
        ← Back to Search
      </button>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading movie details...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p class="error-message">{{ error }}</p>
        <button @click="loadMovie" class="retry-button">
          🔄 Try Again
        </button>
      </div>

      <MovieCard
        v-else-if="movie"
        :movie="movie"
        @review-submitted="handleReviewSubmitted"
        @opinion-submitted="handleOpinionSubmitted"
      />
    </div>
  </div>
</template>

<style scoped>
.movie-detail {
  padding: 2rem 0;
  position: relative;
  z-index: 1;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border);
  color: var(--text-primary);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 2rem;
}

.back-button:hover {
  border-color: var(--primary);
  transform: translateX(-4px);
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.2);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  min-height: 50vh;
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

.error-icon {
  font-size: 5rem;
  opacity: 0.5;
}

.error-state h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.error-message {
  color: var(--error);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.retry-button {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(147, 51, 234, 0.6);
}

@media (max-width: 768px) {
  .back-button {
    font-size: 0.9rem;
    padding: 0.625rem 1.25rem;
  }

  .error-state h2 {
    font-size: 1.5rem;
  }

  .error-message {
    font-size: 1rem;
  }
}
</style>
