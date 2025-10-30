<script setup lang="ts">
import { computed } from 'vue'
import type { RandomMovieResponse } from '@/types/api'
import ReviewForm from './ReviewForm.vue'
import AbsurdOpinionForm from './AbsurdOpinionForm.vue'

const props = defineProps<{
  movie: RandomMovieResponse
}>()

const emit = defineEmits<{
  reviewSubmitted: []
  opinionSubmitted: []
}>()

const handleReviewSubmitted = () => {
  console.log('Review submitted for movie:', props.movie.title)
  emit('reviewSubmitted')
}

const handleOpinionSubmitted = () => {
  console.log('Absurd opinion submitted for movie:', props.movie.title)
  emit('opinionSubmitted')
}

const posterUrl = computed(() => {
  if (!props.movie.poster_url) return null

  // Check if it's already a full URL
  if (props.movie.poster_url.startsWith('http')) {
    return props.movie.poster_url
  }

  // Otherwise, construct TMDB URL
  return `https://image.tmdb.org/t/p/w500${props.movie.poster_url}`
})

const backdropUrl = computed(() => {
  if (!props.movie.backdrop_url) return null

  // Check if it's already a full URL
  if (props.movie.backdrop_url.startsWith('http')) {
    return props.movie.backdrop_url
  }

  // Otherwise, construct TMDB URL
  return `https://image.tmdb.org/t/p/original${props.movie.backdrop_url}`
})

const formatRuntime = (minutes: number | null) => {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const formatDate = (date: string) => {
  return new Date(date).getFullYear()
}
</script>

<template>
  <div class="movie-card">
    <div v-if="backdropUrl" class="backdrop" :style="{ backgroundImage: `url(${backdropUrl})` }">
      <div class="backdrop-overlay"></div>
    </div>

    <div class="movie-content">
      <div class="movie-header">
        <div class="poster-container">
          <img
            v-if="posterUrl"
            :src="posterUrl"
            :alt="movie.title"
            class="poster"
            @error="(e) => { console.error('Image failed to load:', posterUrl); (e.target as HTMLImageElement).style.display = 'none' }"
          />
          <div v-else class="poster-placeholder">
            <span>🎬</span>
          </div>
        </div>
        <div class="movie-info">
          <h2 class="movie-title">{{ movie.title }}</h2>
          <div class="movie-meta">
            <span class="meta-item">{{ formatDate(movie.release_date) }}</span>
            <span class="meta-separator">•</span>
            <span class="meta-item">{{ formatRuntime(movie.runtime) }}</span>
            <span v-if="movie.vote_average" class="meta-separator">•</span>
            <span v-if="movie.vote_average" class="meta-item rating">⭐ {{ movie.vote_average.toFixed(1) }}</span>
          </div>
          <div class="genres">
            <span v-for="genre in movie.genres" :key="genre.id" class="genre-tag">
              {{ genre.name }}
            </span>
          </div>
        </div>
      </div>

      <div class="movie-overview">
        <h3 class="overview-title">Overview</h3>
        <p class="overview-text">{{ movie.overview }}</p>
      </div>

      <div class="opinions-section">
        <div class="opinion-card real">
          <div class="opinion-header">
            <span class="opinion-badge real-badge">✓ Real Review</span>
          </div>
          <p class="opinion-text">{{ movie.real_review }}</p>
        </div>

        <div class="opinion-card fake">
          <div class="opinion-header">
            <span class="opinion-badge fake-badge">🦄 Unreliable Opinion</span>
          </div>
          <p class="opinion-text">{{ movie.fake_opinion }}</p>
        </div>
      </div>

      <div v-if="movie.id" class="forms-section">
        <ReviewForm
          :movie-id="movie.id"
          :movie-title="movie.title"
          @review-submitted="handleReviewSubmitted"
        />

        <AbsurdOpinionForm
          :movie-id="movie.id"
          :movie-title="movie.title"
          @opinion-submitted="handleOpinionSubmitted"
        />
      </div>
      <div v-else class="no-forms-message">
        <p>⚠️ Movie ID is missing. Cannot submit reviews or opinions for this movie.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  position: relative;
  background: var(--bg-secondary);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px var(--shadow);
  border: 1px solid var(--border);
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.backdrop {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.backdrop-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, var(--bg-secondary) 100%);
}

.movie-content {
  padding: 2rem;
  position: relative;
}

.movie-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.poster-container {
  flex-shrink: 0;
}

.poster {
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--shadow);
  border: 2px solid var(--border);
}

.poster-placeholder {
  width: 200px;
  height: 300px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  opacity: 0.3;
  border: 2px solid var(--border);
}

.movie-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.movie-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
  flex-wrap: wrap;
}

.meta-separator {
  color: var(--text-muted);
}

.rating {
  color: var(--accent);
  font-weight: 600;
}

.genres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.genre-tag {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid var(--border);
}

.movie-overview {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(51, 65, 85, 0.5);
  border-radius: 12px;
  border: 1px solid var(--border);
}

.overview-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.overview-text {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1rem;
}

.no-opinions-message {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(245, 158, 11, 0.1);
  border: 2px solid var(--accent);
  border-radius: 12px;
  text-align: center;
}

.no-opinions-message p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.8;
}

.link-highlight {
  color: var(--primary-light);
  text-decoration: underline;
  font-weight: 700;
}

.link-highlight:hover {
  color: var(--primary);
}

.opinions-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.opinion-card {
  background: var(--bg-tertiary);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
  transition: all 0.3s;
}

.opinion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px var(--shadow);
}

.opinion-card.real {
  border-color: var(--success);
}

.opinion-card.fake {
  border-color: var(--secondary);
}

.opinion-header {
  margin-bottom: 1rem;
}

.opinion-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.real-badge {
  background: rgba(16, 185, 129, 0.2);
  color: var(--success);
  border: 1px solid var(--success);
}

.fake-badge {
  background: rgba(236, 72, 153, 0.2);
  color: var(--secondary);
  border: 1px solid var(--secondary);
}

.opinion-text {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1rem;
}

.forms-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.no-forms-message {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--error);
  border-radius: 12px;
  text-align: center;
}

.no-forms-message p {
  color: var(--error);
  margin: 0;
  font-size: 1rem;
}

@media (max-width: 968px) {
  .movie-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .movie-info {
    align-items: center;
  }

  .movie-title {
    font-size: 2rem;
  }

  .opinions-section {
    grid-template-columns: 1fr;
  }

  .forms-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .backdrop {
    height: 200px;
  }

  .movie-content {
    padding: 1.5rem;
  }

  .poster {
    width: 150px;
    height: 225px;
  }

  .movie-title {
    font-size: 1.75rem;
  }

  .movie-meta {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .movie-content {
    padding: 1rem;
  }

  .poster {
    width: 120px;
    height: 180px;
  }

  .movie-title {
    font-size: 1.5rem;
  }

  .genres {
    justify-content: center;
  }
}
</style>
