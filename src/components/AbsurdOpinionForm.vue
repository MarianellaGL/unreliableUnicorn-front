<script setup lang="ts">
import { ref } from 'vue'
import { movieApi } from '@/services/api'
import type { OpinionCreate } from '@/types/api'

const props = defineProps<{
  movieId: number
  movieTitle: string
}>()

const emit = defineEmits<{
  opinionSubmitted: []
}>()

const showForm = ref(false)
const form = ref<OpinionCreate>({
  author_name: '',
  content: '',
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const handleSubmit = async () => {
  error.value = null

  if (!form.value.content.trim()) {
    error.value = 'Please write your absurd opinion'
    return
  }

  loading.value = true

  try {
    await movieApi.submitOpinion(props.movieId, form.value)
    success.value = true

    // Reset form after success
    setTimeout(() => {
      form.value = {
        author_name: '',
        content: '',
      }
      success.value = false
      showForm.value = false
      emit('opinionSubmitted')
    }, 2000)
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to submit opinion. Please try again.'
    console.error('Error submitting opinion:', err)
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
  <div class="opinion-form-container">
    <button @click="toggleForm" class="toggle-btn">
      <span v-if="!showForm">🦄 Share Your Absurd Opinion</span>
      <span v-else>✕ Cancel</span>
    </button>

    <transition name="slide-down">
      <div v-if="showForm" class="opinion-form">
        <h3 class="form-title">🤪 What's Your Most Absurd Take on "{{ movieTitle }}"?</h3>
        <p class="form-subtitle">
          Go wild! The more ridiculous, the better. Be creative, be absurd, be unreliable!
        </p>

        <div v-if="success" class="success-message">
          ✓ Your absurd opinion has been unleashed upon the world!
        </div>

        <div v-if="error" class="error-message">
          ⚠️ {{ error }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="author_name" class="form-label">Your Name (Optional)</label>
            <input
              id="author_name"
              v-model="form.author_name"
              type="text"
              class="form-input"
              placeholder="Anonymous Unicorn"
            />
          </div>

          <div class="form-group">
            <label for="content" class="form-label">Your Absurd Opinion *</label>
            <textarea
              id="content"
              v-model="form.content"
              class="form-textarea"
              placeholder="This movie was filmed entirely underwater by trained dolphins who majored in cinematography at the University of Atlantis..."
              rows="5"
              required
              maxlength="5000"
            ></textarea>
            <div class="char-count">
              {{ form.content.length }} / 5000 characters
            </div>
          </div>

          <div class="tips">
            <strong>💡 Tips for maximum absurdity:</strong>
            <ul>
              <li>Make outrageous claims about the production</li>
              <li>Invent fake behind-the-scenes stories</li>
              <li>Create impossible plot interpretations</li>
              <li>Add ridiculous conspiracy theories</li>
            </ul>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="submit-btn"
          >
            <span v-if="!loading">🚀 Unleash the Absurdity</span>
            <span v-else>Submitting...</span>
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.opinion-form-container {
  margin-top: 1.5rem;
}

.toggle-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
  border: none;
  color: white;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.5);
}

.opinion-form {
  margin-top: 1.5rem;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--secondary);
}

.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  font-style: italic;
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
  border-color: var(--secondary);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.char-count {
  text-align: right;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.tips {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  border: 1px solid var(--border);
}

.tips strong {
  color: var(--accent);
  display: block;
  margin-bottom: 0.5rem;
}

.tips ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.tips li {
  color: var(--text-secondary);
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.tips li::before {
  content: '🎪';
  position: absolute;
  left: 0;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.6);
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
  .opinion-form {
    padding: 1rem;
  }

  .form-title {
    font-size: 1.1rem;
  }

  .form-subtitle {
    font-size: 0.85rem;
  }

  .toggle-btn,
  .submit-btn {
    font-size: 1rem;
  }

  .tips {
    padding: 0.875rem;
  }

  .tips li {
    font-size: 0.9rem;
  }
}
</style>
