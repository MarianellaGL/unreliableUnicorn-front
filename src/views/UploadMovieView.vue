<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { movieApi } from '@/services/api'
import type { MovieUpload } from '@/types/api'

const router = useRouter()

const form = ref<MovieUpload>({
  title: '',
  original_title: '',
  overview: '',
  release_date: '',
  runtime: 0,
  poster_url: '',
  backdrop_url: '',
  genre_names: [],
})

const genreInput = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const addGenre = () => {
  const genre = genreInput.value.trim()
  if (genre && !form.value.genre_names.includes(genre)) {
    form.value.genre_names.push(genre)
    genreInput.value = ''
  }
}

const removeGenre = (index: number) => {
  form.value.genre_names.splice(index, 1)
}

const handleSubmit = async () => {
  error.value = null

  // Validation
  if (!form.value.title || !form.value.overview || !form.value.release_date) {
    error.value = 'Please fill in all required fields'
    return
  }

  if (form.value.runtime <= 0) {
    error.value = 'Runtime must be greater than 0'
    return
  }

  loading.value = true

  try {
    const uploadedMovie = await movieApi.upload(form.value)
    success.value = true

    // Reset form
    setTimeout(() => {
      router.push('/discover')
    }, 2000)
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to upload movie. Please try again.'
    console.error('Error uploading movie:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="upload-movie">
    <div class="container">
      <div class="header">
        <h1 class="page-title">Upload Movie</h1>
        <p class="page-description">
          Add a new movie to the collection
        </p>
      </div>

      <div v-if="success" class="success-message">
        ✓ Movie uploaded successfully! Redirecting...
      </div>

      <div v-if="error" class="error-message">
        ⚠️ {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="upload-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="title" class="form-label">Title *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              class="form-input"
              placeholder="My Favorite Film"
              required
            />
          </div>

          <div class="form-group full-width">
            <label for="original_title" class="form-label">Original Title</label>
            <input
              id="original_title"
              v-model="form.original_title"
              type="text"
              class="form-input"
              placeholder="Mon Film Préféré"
            />
          </div>

          <div class="form-group full-width">
            <label for="overview" class="form-label">Overview *</label>
            <textarea
              id="overview"
              v-model="form.overview"
              class="form-textarea"
              placeholder="A captivating story about..."
              rows="4"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="release_date" class="form-label">Release Date *</label>
            <input
              id="release_date"
              v-model="form.release_date"
              type="date"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="runtime" class="form-label">Runtime (minutes) *</label>
            <input
              id="runtime"
              v-model.number="form.runtime"
              type="number"
              class="form-input"
              placeholder="120"
              min="1"
              required
            />
          </div>

          <div class="form-group full-width">
            <label for="poster_url" class="form-label">Poster URL</label>
            <input
              id="poster_url"
              v-model="form.poster_url"
              type="url"
              class="form-input"
              placeholder="https://example.com/poster.jpg"
            />
          </div>

          <div class="form-group full-width">
            <label for="backdrop_url" class="form-label">Backdrop URL</label>
            <input
              id="backdrop_url"
              v-model="form.backdrop_url"
              type="url"
              class="form-input"
              placeholder="https://example.com/backdrop.jpg"
            />
          </div>

          <div class="form-group full-width">
            <label for="genres" class="form-label">Genres</label>
            <div class="genre-input-wrapper">
              <input
                id="genres"
                v-model="genreInput"
                type="text"
                class="form-input"
                placeholder="Enter genre and press Add"
                @keypress.enter.prevent="addGenre"
              />
              <button
                type="button"
                @click="addGenre"
                class="btn-add-genre"
                :disabled="!genreInput.trim()"
              >
                Add Genre
              </button>
            </div>
            <div v-if="form.genre_names.length > 0" class="genres-list">
              <span
                v-for="(genre, index) in form.genre_names"
                :key="index"
                class="genre-tag"
              >
                {{ genre }}
                <button
                  type="button"
                  @click="removeGenre(index)"
                  class="remove-genre"
                  aria-label="Remove genre"
                >
                  ×
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary"
          >
            <span v-if="!loading">🎬 Upload Movie</span>
            <span v-else>Uploading...</span>
          </button>
          <button
            type="button"
            @click="router.push('/')"
            class="btn btn-secondary"
            :disabled="loading"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.upload-movie {
  padding: 2rem 0;
  position: relative;
  z-index: 1;
}

.header {
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

.success-message {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--success);
  color: var(--success);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
  animation: slideIn 0.3s ease;
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.upload-form {
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  background: var(--bg-tertiary);
  border: 2px solid var(--border);
  color: var(--text-primary);
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.genre-input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.btn-add-genre {
  padding: 0.875rem 1.5rem;
  background: var(--bg-tertiary);
  border: 2px solid var(--border);
  color: var(--text-primary);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-add-genre:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.btn-add-genre:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.genres-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.genre-tag {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-genre {
  background: none;
  border: none;
  color: var(--error);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: transform 0.2s;
}

.remove-genre:hover {
  transform: scale(1.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(147, 51, 234, 0.6);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .upload-form {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .genre-input-wrapper {
    flex-direction: column;
  }

  .btn-add-genre {
    width: 100%;
  }
}
</style>
