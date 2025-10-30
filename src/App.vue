<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Prevent body scroll when menu is open
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <nav class="nav">
          <RouterLink to="/" class="logo" @click="closeMobileMenu">
            <span class="logo-icon">🦄</span>
            <span class="logo-text">UnreliableUnicorn</span>
          </RouterLink>

          <button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="Toggle menu">
            <span class="hamburger" :class="{ open: mobileMenuOpen }"></span>
          </button>

          <!-- Mobile menu overlay -->
          <div v-if="mobileMenuOpen" class="menu-overlay" @click="closeMobileMenu"></div>

          <div class="nav-links" :class="{ open: mobileMenuOpen }">
            <RouterLink to="/" class="nav-link" @click="closeMobileMenu">Home</RouterLink>
            <RouterLink to="/discover" class="nav-link" @click="closeMobileMenu">Discover</RouterLink>
            <RouterLink to="/search" class="nav-link" @click="closeMobileMenu">Search</RouterLink>
            <RouterLink to="/top-opinions" class="nav-link" @click="closeMobileMenu">Top Opinions</RouterLink>
            <RouterLink to="/upload" class="nav-link nav-link-highlight" @click="closeMobileMenu">Upload Movie</RouterLink>
          </div>
        </nav>
      </div>
    </header>

    <main class="main">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 UnreliableUnicorn - Where movie opinions are delightfully absurd</p>
      </div>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #9333ea;
  --primary-dark: #7c3aed;
  --primary-light: #a855f7;
  --secondary: #ec4899;
  --accent: #f59e0b;
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --border: #475569;
  --success: #10b981;
  --error: #ef4444;
  --shadow: rgba(0, 0, 0, 0.3);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, var(--bg-primary) 0%, #1a1a2e 100%);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
}

.header {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 4px 6px var(--shadow);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: bold;
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.logo-text {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  position: relative;
  z-index: 101;
}

.hamburger {
  display: block;
  width: 25px;
  height: 2px;
  background: var(--text-primary);
  position: relative;
  transition: background 0.3s;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 2px;
  background: var(--text-primary);
  transition: transform 0.3s;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  top: 8px;
}

.hamburger.open {
  background: transparent;
}

.hamburger.open::before {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.open::after {
  transform: rotate(-45deg) translate(6px, -6px);
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  position: relative;
  padding: 0.5rem 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  transition: width 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-light);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link-highlight {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: white !important;
}

.nav-link-highlight::after {
  display: none;
}

.nav-link-highlight:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
}

.menu-overlay {
  display: none;
}

.main {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  padding: 2rem 0;
  text-align: center;
  color: var(--text-muted);
  margin-top: auto;
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
  .mobile-menu-btn {
    display: block;
  }

  .menu-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 99;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 70%;
    max-width: 300px;
    background: var(--bg-secondary);
    flex-direction: column;
    align-items: flex-start;
    padding: 5rem 2rem 2rem;
    gap: 1.5rem;
    transition: right 0.3s ease;
    box-shadow: -4px 0 6px var(--shadow);
    z-index: 100;
    overflow-y: auto;
  }

  .nav-links.open {
    right: 0;
  }

  .nav-link {
    font-size: 1.2rem;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }

  .logo-icon {
    font-size: 2.5rem;
  }
}
</style>
