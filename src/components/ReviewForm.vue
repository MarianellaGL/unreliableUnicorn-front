<script setup lang="ts">
import { ref } from 'vue'
import { movieApi } from '@/services/api'
import type { ReviewCreate } from '@/types/api'

const props = defineProps<{
  movieId: number
  movieTitle: string
}>()

const emit = defineEmits<{
  reviewSubmitted: []
}>()

const showForm = ref(false)
const form = ref<ReviewCreate>({
  author: 'Anonymous',
  content: '',
  rating: '',
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const handleSubmit = async () => {
  error.value = null

  if (!form.value.content.trim()) {
    error.value = 'Please write a review'
    return
  }

  if (!form.value.rating.trim()) {
    error.value = 'Please provide a rating'
    return
  }

  loading.value = true

  try {
    await movieApi.submitReview(props.movieId, form.value)
    success.value = true

    // Reset form after success
    setTimeout(() => {
      form.value = {
        author: 'Anonymous',
        content: '',
        rating: '',
      }
      success.value = false
      showForm.value = false
      emit('reviewSubmitted')
    }, 2000)
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to submit review. Please try again.'
    console.error('Error submitting review:', err)
  } finally {
    loading.value = false
  }
}

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) {
    error.value = null
    success.value = false
  }
}
</script>

<template>
  <div class="review-form-container">
    <button @click="toggleForm" class="toggle-btn">
      <span v-if="!showForm">✍️ Write a Review</span>
      <span v-else>✕ Cancel</span>
    </button>

    <transition name="slide-down">
      <div v-if="showForm" class="review-form">
        <h3 class="form-title">Share Your Thoughts on "{{ movieTitle }}"</h3>

        <div v-if="success" class="success-message">
          ✓ Review submitted successfully!
        </div>

        <div v-if="error" class="error-message">
          ⚠️ {{ error }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="author" class="form-label">Your Name</label>
            <input
              id="author"
              v-model="form.author"
              type="text"
              class="form-input"
              placeholder="Anonymous"
            />
          </div>

          <div class="form-group">
            <label for="rating" class="form-label">Rating *</label>
            <input
              id="rating"
              v-model="form.rating"
              type="text"
              class="form-input"
              placeholder="9/10 or ⭐⭐⭐⭐⭐"
              required
            />
          </div>

          <div class="form-group">
            <label for="content" class="form-label">Your Review *</label>
            <textarea
              id="content"
              v-model="form.content"
              class="form-textarea"
              placeholder="This movie was incredible! The cinematography and acting were top-notch..."
              rows="4"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="submit-btn"
          >
            <span v-if="!loading">📝 Submit Review</span>
            <span v-else>Submitting...</span>
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.review-form-container {
  margin-top: 2rem;
}

.toggle-btn {
  width: 100%;
  padding: 1rem;
  background: var(--bg-tertiary);
  border: 2px solid var(--border);
  color: var(--text-primary);
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-btn:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.2);
}

.review-form {
  margin-top: 1.5rem;
  background: var(--bg-tertiary);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--border);
}

.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.success-message {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--success);
  color: var(--success);
  padding: 0.875rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  animation: slideIn 0.3s ease;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--error);
  color: var(--error);
  padding: 0.875rem;
  border-radius: 8px;
  margin-bottom: 1rem;
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

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  width: 100%;
  background: var(--bg-secondary);
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

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(147, 51, 234, 0.6);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .review-form {
    padding: 1rem;
  }

  .form-title {
    font-size: 1.1rem;
  }

  .toggle-btn,
  .submit-btn {
    font-size: 1rem;
  }
}
</style>
