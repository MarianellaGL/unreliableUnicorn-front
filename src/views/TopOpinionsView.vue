<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { opinionApi } from '@/services/api'
import type { TopOpinionResponse } from '@/types/api'
import OpinionCard from '@/components/OpinionCard.vue'

const opinions = ref<TopOpinionResponse[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadTopOpinions = async () => {
  loading.value = true
  error.value = null

  try {
    opinions.value = await opinionApi.getTop(20)
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to load top opinions. Please try again.'
    console.error('Error loading top opinions:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTopOpinions()
})
</script>

<template>
  <div class="top-opinions">
    <div class="container">
      <div class="header">
        <h1 class="page-title">Top Absurd Opinions</h1>
        <p class="page-description">
          The most ridiculous AI-generated movie opinions, ranked by absurdity and community votes
        </p>
      </div>

      <div v-if="error" class="error-message">
        ⚠️ {{ error }}
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading the most absurd opinions...</p>
      </div>

      <div v-else-if="opinions.length > 0" class="opinions-list">
        <TransitionGroup name="list">
          <OpinionCard
            v-for="(opinion, index) in opinions"
            :key="opinion.id"
            :opinion="opinion"
            :rank="index + 1"
          />
        </TransitionGroup>
      </div>

      <div v-else-if="!loading" class="empty-state">
        <span class="empty-icon">🦄</span>
        <h3>No opinions yet</h3>
        <p>Check back later for absurd takes on movies!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-opinions {
  padding: 2rem 0;
  position: relative;
  z-index: 1;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.page-description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
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

.opinions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }
}
</style>
