<script setup lang="ts">
import { ref } from 'vue'
import { movieApi } from '@/services/api'
import type { RandomMovieResponse } from '@/types/api'
import MovieCard from '@/components/MovieCard.vue'

const movie = ref<RandomMovieResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const getRandomMovie = async () => {
  loading.value = true
  error.value = null

  try {
    movie.value = await movieApi.getRandom()
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to fetch movie. Please try again.'
    console.error('Error fetching random movie:', err)
  } finally {
    loading.value = false
  }
}

const handleReviewSubmitted = () => {
  console.log('Review submitted, fetching new random movie...')
  getRandomMovie()
}

const handleOpinionSubmitted = () => {
  console.log('Opinion submitted, fetching new random movie...')
  getRandomMovie()
}

// Load initial movie
getRandomMovie()
</script>

<template>
  <div class="discover">
    <div class="container">
      <div class="discover-header">
        <h1 class="page-title">Discover Movies</h1>
        <p class="page-description">
          Get random movie recommendations with a delightful mix of real reviews and absurdly unreliable opinions
        </p>
      </div>

      <div class="discover-controls">
        <button
          @click="getRandomMovie"
          :disabled="loading"
          class="btn btn-discover"
        >
          <span v-if="!loading">🎲 Discover Another</span>
          <span v-else>🔄 Loading...</span>
        </button>
      </div>

      <div v-if="error" class="error-message">
        ⚠️ {{ error }}
      </div>

      <transition name="slide-fade" mode="out-in">
        <div v-if="loading && !movie" class="loading-state">
          <div class="spinner"></div>
          <p>Finding an amazing movie...</p>
        </div>

        <MovieCard
          v-else-if="movie"
          :movie="movie"
          :key="movie.id"
          @review-submitted="handleReviewSubmitted"
          @opinion-submitted="handleOpinionSubmitted"
        />
      </transition>
    </div>
  </div>
</template>

<style scoped>
.discover {
  padding: 2rem 0;
  position: relative;
  z-index: 1;
}

.discover-header {
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
  max-width: 700px;
  margin: 0 auto;
}

.discover-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-discover {
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
}

.btn-discover:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(147, 51, 234, 0.6);
}

.btn-discover:disabled {
  opacity: 0.6;
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

.loading-state {
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

.slide-fade-enter-active {
  transition: all 0.4s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .btn-discover {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
}
</style>
