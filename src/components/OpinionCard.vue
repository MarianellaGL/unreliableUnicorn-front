<script setup lang="ts">
import { ref, computed } from 'vue'
import { voteApi } from '@/services/api'
import type { TopOpinionResponse, VoteType } from '@/types/api'

const props = defineProps<{
  opinion: TopOpinionResponse
  rank: number
}>()

const localVotes = ref({
  upvotes: props.opinion.upvotes || 0,
  downvotes: props.opinion.downvotes || 0,
  lol_votes: props.opinion.lol_votes || 0,
  wtf_votes: props.opinion.wtf_votes || 0,
})

const userVote = ref<VoteType | null>(null)
const voting = ref(false)

const totalVotes = computed(() => {
  return (
    localVotes.value.upvotes +
    localVotes.value.downvotes +
    localVotes.value.lol_votes +
    localVotes.value.wtf_votes
  )
})

const getRankBadgeClass = (rank: number) => {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return 'rank-default'
}

const handleVote = async (voteType: VoteType) => {
  if (voting.value) return

  // Optimistic update
  const previousVotes = { ...localVotes.value }
  const previousUserVote = userVote.value

  // Remove previous vote if exists
  if (userVote.value) {
    const voteKey = `${userVote.value === 'up' ? 'upvotes' : userVote.value === 'down' ? 'downvotes' : userVote.value === 'lol' ? 'lol_votes' : 'wtf_votes'}` as keyof typeof localVotes.value
    localVotes.value[voteKey]--
  }

  // Add new vote (or remove if same)
  if (userVote.value === voteType) {
    userVote.value = null
  } else {
    const voteKey = `${voteType === 'up' ? 'upvotes' : voteType === 'down' ? 'downvotes' : voteType === 'lol' ? 'lol_votes' : 'wtf_votes'}` as keyof typeof localVotes.value
    localVotes.value[voteKey]++
    userVote.value = voteType
  }

  voting.value = true

  try {
    await voteApi.voteOnOpinion(props.opinion.id, {
      vote_type: voteType,
      voter_identifier: `user_${Date.now()}`,
    })
  } catch (err) {
    // Revert on error
    localVotes.value = previousVotes
    userVote.value = previousUserVote
    console.error('Error voting:', err)
  } finally {
    voting.value = false
  }
}

const getMethodEmoji = (method: string) => {
  if (method.includes('gpt')) return '🤖'
  if (method.includes('claude')) return '🧠'
  if (method.includes('gemini')) return '✨'
  return '🦄'
}
</script>

<template>
  <div class="opinion-card">
    <div class="opinion-header">
      <div class="rank-badge" :class="getRankBadgeClass(rank)">
        <span v-if="rank === 1">🥇</span>
        <span v-else-if="rank === 2">🥈</span>
        <span v-else-if="rank === 3">🥉</span>
        <span v-else>#{{ rank }}</span>
      </div>
      <div class="opinion-meta">
        <h3 class="movie-title">{{ opinion.movie_title }}</h3>
        <div class="meta-info">
          <span class="absurdity-score" :title="'Absurdity Score: ' + opinion.absurdity_score">
            {{ getMethodEmoji(opinion.generation_method) }} Absurdity: {{ opinion.absurdity_score.toFixed(1) }}
          </span>
          <span class="total-votes">{{ totalVotes }} votes</span>
        </div>
      </div>
    </div>

    <div class="opinion-content">
      <p class="opinion-text">{{ opinion.content }}</p>
    </div>

    <div class="voting-section">
      <button
        @click="handleVote('up')"
        :class="['vote-btn', 'vote-up', { active: userVote === 'up' }]"
        :disabled="voting"
      >
        <span class="vote-icon">👍</span>
        <span class="vote-count">{{ localVotes.upvotes }}</span>
      </button>

      <button
        @click="handleVote('down')"
        :class="['vote-btn', 'vote-down', { active: userVote === 'down' }]"
        :disabled="voting"
      >
        <span class="vote-icon">👎</span>
        <span class="vote-count">{{ localVotes.downvotes }}</span>
      </button>

      <button
        @click="handleVote('lol')"
        :class="['vote-btn', 'vote-lol', { active: userVote === 'lol' }]"
        :disabled="voting"
      >
        <span class="vote-icon">😂</span>
        <span class="vote-count">{{ localVotes.lol_votes }}</span>
      </button>

      <button
        @click="handleVote('wtf')"
        :class="['vote-btn', 'vote-wtf', { active: userVote === 'wtf' }]"
        :disabled="voting"
      >
        <span class="vote-icon">🤯</span>
        <span class="vote-count">{{ localVotes.wtf_votes }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.opinion-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.opinion-card:hover {
  border-color: var(--primary);
  box-shadow: 0 8px 30px rgba(147, 51, 234, 0.2);
}

.opinion-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.rank-badge {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  border: 2px solid;
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #000;
  border-color: #ffd700;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.rank-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  color: #000;
  border-color: #c0c0c0;
  box-shadow: 0 4px 15px rgba(192, 192, 192, 0.4);
}

.rank-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #e6a75c 100%);
  color: #000;
  border-color: #cd7f32;
  box-shadow: 0 4px 15px rgba(205, 127, 50, 0.4);
}

.rank-default {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-color: var(--border);
  font-size: 1rem;
}

.opinion-meta {
  flex: 1;
}

.movie-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.meta-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.absurdity-score {
  background: rgba(236, 72, 153, 0.2);
  color: var(--secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  border: 1px solid var(--secondary);
  font-weight: 600;
}

.total-votes {
  color: var(--text-secondary);
}

.opinion-content {
  margin-bottom: 1.5rem;
}

.opinion-text {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1rem;
}

.voting-section {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.vote-btn {
  flex: 1;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border: 2px solid var(--border);
  border-radius: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.vote-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.vote-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.vote-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.vote-btn:active:not(:disabled) {
  transform: translateY(0);
}

.vote-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.vote-icon {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.vote-btn:hover:not(:disabled) .vote-icon {
  transform: scale(1.2);
}

.vote-count {
  font-size: 0.9rem;
}

.vote-btn.vote-up.active {
  background: rgba(16, 185, 129, 0.2);
  border-color: var(--success);
  color: var(--success);
}

.vote-btn.vote-down.active {
  background: rgba(239, 68, 68, 0.2);
  border-color: var(--error);
  color: var(--error);
}

.vote-btn.vote-lol.active {
  background: rgba(245, 158, 11, 0.2);
  border-color: var(--accent);
  color: var(--accent);
}

.vote-btn.vote-wtf.active {
  background: rgba(147, 51, 234, 0.2);
  border-color: var(--primary);
  color: var(--primary);
}

@media (max-width: 768px) {
  .opinion-card {
    padding: 1rem;
  }

  .movie-title {
    font-size: 1.1rem;
  }

  .voting-section {
    gap: 0.5rem;
  }

  .vote-btn {
    min-width: 70px;
    padding: 0.625rem 0.75rem;
  }

  .vote-icon {
    font-size: 1rem;
  }

  .vote-count {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .opinion-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .rank-badge {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .voting-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .vote-btn {
    min-width: unset;
  }
}
</style>
