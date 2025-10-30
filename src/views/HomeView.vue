<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <div class="container">
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="title-main">Welcome to</span>
            <span class="title-highlight">UnreliableUnicorn</span>
          </h1>
          <p class="hero-description">
            Where movie reviews meet absurdity! Discover films with a unique blend of
            genuine critiques and hilariously unreliable AI-generated opinions.
          </p>
          <div class="hero-buttons">
            <RouterLink to="/discover" class="btn btn-primary">
              Start Discovering
            </RouterLink>
            <RouterLink to="/top-opinions" class="btn btn-secondary">
              View Top Opinions
            </RouterLink>
          </div>
        </div>
        <div class="hero-visual">
          <div class="unicorn-card">
            <div class="card-glow"></div>
            <span class="unicorn-emoji">🦄</span>
          </div>
        </div>
      </section>

      <section class="features">
        <h2 class="section-title">What Can You Do?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎬</div>
            <h3 class="feature-title">Random Discovery</h3>
            <p class="feature-description">
              Get random movie recommendations with a mix of real reviews and absurd AI opinions
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3 class="feature-title">Smart Search</h3>
            <p class="feature-description">
              Search through our database to find specific movies and their hilarious takes
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⭐</div>
            <h3 class="feature-title">Top Opinions</h3>
            <p class="feature-description">
              Browse the most absurd and highly-voted AI-generated movie opinions
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👍</div>
            <h3 class="feature-title">Vote & Share</h3>
            <p class="feature-description">
              React with up, down, LOL, or WTF votes on the most ridiculous opinions
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem 0;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  min-height: 60vh;
  margin-bottom: 6rem;
}

.hero-content {
  animation: fadeInUp 0.8s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.title-main {
  display: block;
  color: var(--text-secondary);
  font-size: 2rem;
  font-weight: 600;
}

.title-highlight {
  display: block;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.8;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
  display: inline-block;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(147, 51, 234, 0.6);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--primary);
}

.btn-secondary:hover {
  background: var(--primary);
  transform: translateY(-2px);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 1s ease 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.unicorn-card {
  position: relative;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px var(--shadow);
  animation: float 3s ease-in-out infinite;
}

.card-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
  border-radius: 24px;
  opacity: 0.5;
  filter: blur(20px);
  z-index: -1;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.unicorn-emoji {
  font-size: 10rem;
  animation: rotate 6s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.features {
  margin-top: 4rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--text-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--border);
  transition: all 0.3s;
  cursor: default;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary);
  box-shadow: 0 8px 30px rgba(147, 51, 234, 0.3);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 968px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-visual {
    order: -1;
  }

  .unicorn-card {
    width: 250px;
    height: 250px;
  }

  .unicorn-emoji {
    font-size: 8rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .title-main {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .title-main {
    font-size: 1.2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .btn {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }

  .unicorn-card {
    width: 200px;
    height: 200px;
  }

  .unicorn-emoji {
    font-size: 6rem;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
