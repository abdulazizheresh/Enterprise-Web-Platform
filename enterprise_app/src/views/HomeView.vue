<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="text-center">
          <div class="logo-container">
            <div class="logo-glow"></div>
            <img src="/logo.svg" alt="Enterprise Platform" class="logo" />
          </div>

          <h1 class="hero-title">
            Enterprise <span class="text-gradient">Platform</span>
          </h1>

          <p class="hero-description">
            Modern cloud-native enterprise platform built with Vue.js and Node.js.
            Featuring real-time monitoring, advanced security, and scalable Azure infrastructure.
          </p>

          <div class="hero-buttons">
            <router-link to="/auth/register" class="btn btn-primary">Get Started</router-link>
            <router-link to="/auth/login" class="btn btn-secondary">Sign In</router-link>
          </div>
        </div>
      </div>

      <div class="floating-element floating-left"></div>
      <div class="floating-element floating-right"></div>
    </section>

    <!-- Features Section -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Built for the Cloud</h2>
          <p class="section-description">Enterprise-grade features powered by Microsoft Azure infrastructure</p>
        </div>

        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card">
            <div class="feature-icon" :class="feature.iconClass">
              <component :is="feature.icon" class="w-8 h-8" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="section bg-white dark:bg-gray-800">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Modern Technology Stack</h2>
          <p class="section-description">Built with cutting-edge technologies for optimal performance</p>
        </div>

        <div class="tech-grid">
          <div v-for="tech in techStack" :key="tech.name" class="tech-item">
            <div class="tech-icon">
              <component :is="tech.icon" class="w-8 h-8 text-gray-700 dark:text-gray-300" />
            </div>
            <span class="tech-name">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Live Demo Section -->
    <section class="demo-section">
      <div class="container text-center">
        <h2 class="demo-title">See It In Action</h2>
        <p class="demo-description">
          Experience the power of our enterprise platform with real-time data and live monitoring
        </p>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ stats.activeUsers.toLocaleString() }}</div>
            <div class="stat-label">Active Users</div>
            <div class="stat-change">{{ stats.growthRate }}% growth</div>
          </div>

          <div class="stat-card">
            <div class="stat-value">{{ stats.responseTime }}ms</div>
            <div class="stat-label">Avg Response</div>
            <div class="stat-change">{{ stats.uptime }}% uptime</div>
          </div>

          <div class="stat-card">
            <div class="stat-value">{{ stats.requests.toLocaleString() }}</div>
            <div class="stat-label">Daily Requests</div>
            <div class="stat-change">Last 24 hours</div>
          </div>
        </div>

        <div class="demo-buttons">
          <router-link to="/auth/register" class="btn btn-white">Start Free Trial</router-link>
          <a href="/api/health" target="_blank" class="btn btn-outline-white">View API Status</a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="brand-info">
              <span class="brand-name">Enterprise Platform</span>
            </div>
            <p class="brand-description">
              Modern cloud-native enterprise platform demonstrating advanced Azure infrastructure and full-stack
              development skills.
            </p>
          </div>

          <div class="footer-links">
            <div>
              <h3 class="link-title">Platform</h3>
              <ul class="link-list">
                <li><router-link to="/auth/login" class="link">Dashboard</router-link></li>
                <li><a href="/api/health" target="_blank" class="link">Health Monitor</a></li>
                <li><a href="/api/docs" target="_blank" class="link">API Docs</a></li>
              </ul>
            </div>

            <div>
              <h3 class="link-title">Resources</h3>
              <ul class="link-list">
                <li><a href="#" class="link">Documentation</a></li>
                <li><a href="#" class="link">Architecture</a></li>
                <li><a href="#" class="link">Security</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="text-gray-400 text-sm">
            © {{ currentYear }} Enterprise Platform. Built with Vue.js & Azure Cloud.
          </p>
          <div class="flex items-center mt-4 md:mt-0 space-x-6 text-sm text-gray-400">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              All Systems Operational
            </div>
            <div>Version {{ appVersion }}</div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  ChartBarIcon,
  ShieldCheckIcon,
  CloudIcon,
  BoltIcon,
  PresentationChartLineIcon,
  DevicePhoneMobileIcon
} from '@heroicons/vue/24/outline'
import { APP_VERSION } from '@/utils/constants'

const currentYear = new Date().getFullYear()
const appVersion = APP_VERSION

const stats = ref({
  activeUsers: 1247,
  responseTime: 145,
  uptime: 99.9,
  requests: 45678,
  growthRate: 12.5
})

const features = ref([
  {
    title: 'Real-time Monitoring',
    description: 'Live dashboard with system metrics, performance analytics, and instant alerts',
    icon: ChartBarIcon,
    iconClass: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Enterprise Security',
    description: 'Multi-factor authentication, Azure AD integration, and OWASP compliance',
    icon: ShieldCheckIcon,
    iconClass: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
  },
  {
    title: 'Cloud Native',
    description: 'Auto-scaling Azure containers with load balancing and global CDN',
    icon: CloudIcon,
    iconClass: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
  },
  {
    title: 'Real-time Updates',
    description: 'WebSocket connections for instant notifications and live data streams',
    icon: BoltIcon,
    iconClass: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
  },
  {
    title: 'Advanced Analytics',
    description: 'Interactive charts, performance metrics, and business intelligence',
    icon: PresentationChartLineIcon,
    iconClass: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
  },
  {
    title: 'Progressive Web App',
    description: 'Offline support, push notifications, and native app experience',
    icon: DevicePhoneMobileIcon,
    iconClass: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
  }
])

const techStack = ref([
  { name: 'Vue.js 3', icon: CloudIcon },
  { name: 'Node.js', icon: CloudIcon },
  { name: 'Azure Cloud', icon: CloudIcon },
  { name: 'TypeScript', icon: CloudIcon },
  { name: 'PostgreSQL', icon: CloudIcon },
  { name: 'Redis', icon: CloudIcon }
])

let statsInterval = null

const updateStats = () => {
  stats.value.activeUsers += Math.floor(Math.random() * 10) - 5
  stats.value.responseTime += Math.floor(Math.random() * 20) - 10
  stats.value.requests += Math.floor(Math.random() * 100)

  stats.value.activeUsers = Math.max(1200, Math.min(1300, stats.value.activeUsers))
  stats.value.responseTime = Math.max(120, Math.min(200, stats.value.responseTime))
}

onMounted(() => {
  statsInterval = setInterval(updateStats, 3000)
})

onUnmounted(() => {
  if (statsInterval) clearInterval(statsInterval)
})
</script>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
  background: white;
  color: #1f2937;
}

.dark .hero-section {
  background: #1f2937;
  color: white;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.dark .hero-bg {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.hero-content {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 6rem 1rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
}

.logo-glow {
  position: absolute;
  inset: 0;
  background: #3b82f6;
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.3;
  animation: pulse 2s infinite;
}

.logo {
  position: relative;
  height: 5rem;
  width: 5rem;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 4rem;
  }
}

.text-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
}

.dark .hero-description {
  color: #d1d5db;
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}

@media (min-width: 640px) {
  .hero-buttons {
    flex-direction: row;
  }
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
  animation: bounce 3s infinite;
}

.floating-left {
  top: 5rem;
  left: 2.5rem;
  background: #bfdbfe;
}

.dark .floating-left {
  background: #1e40af;
}

.floating-right {
  bottom: 5rem;
  right: 2.5rem;
  width: 6rem;
  height: 6rem;
  background: #93c5fd;
  animation-delay: 1s;
}

.dark .floating-right {
  background: #1d4ed8;
}

.section {
  padding: 5rem 0;
  background: #f9fafb;
}

.dark .section {
  background: #111827;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
}

.dark .section-title {
  color: white;
}

.section-description {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 32rem;
  margin: 0 auto;
}

.dark .section-description {
  color: #d1d5db;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-0.5rem);
}

.dark .feature-card {
  background: #1f2937;
  border-color: #374151;
}

.feature-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  transition: all 0.3s ease;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.dark .feature-title {
  color: white;
}

.feature-description {
  color: #6b7280;
}

.dark .feature-description {
  color: #9ca3af;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

@media (min-width: 768px) {
  .tech-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .tech-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border-radius: 0.75rem;
  transition: background-color 0.3s ease;
}

.tech-item:hover {
  background: #f9fafb;
}

.dark .tech-item:hover {
  background: #374151;
}

.tech-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.dark .tech-icon {
  background: linear-gradient(135deg, #374151, #4b5563);
}

.tech-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  text-align: center;
}

.dark .tech-name {
  color: white;
}

.demo-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.demo-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
}

.demo-description {
  font-size: 1.25rem;
  color: #dbeafe;
  margin-bottom: 2rem;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-value {
  font-size: 1.875rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #dbeafe;
}

.stat-change {
  font-size: 0.75rem;
  color: #bfdbfe;
  margin-top: 0.25rem;
}

.demo-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}

@media (min-width: 640px) {
  .demo-buttons {
    flex-direction: row;
  }
}

.footer {
  background: #111827;
  color: white;
  padding: 4rem 0;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .footer-content {
    grid-template-columns: 2fr 1fr;
  }
}

.footer-brand {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .footer-brand {
    grid-column: span 1;
  }
}

.brand-info {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.brand-name {
  margin-left: 0.75rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.brand-description {
  color: #9ca3af;
  margin-bottom: 1.5rem;
  max-width: 28rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.link-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-list li {
  margin-bottom: 0.75rem;
}

.link {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #374151;
  margin-top: 3rem;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 2px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.dark .btn-secondary {
  background: #1f2937;
  color: #d1d5db;
  border-color: #4b5563;
}

.dark .btn-secondary:hover {
  background: #374151;
}

.btn-white {
  background: white;
  color: #3b82f6;
}

.btn-white:hover {
  background: #f3f4f6;
}

.btn-outline-white {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.btn-outline-white:hover {
  background: white;
  color: #3b82f6;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 0.6;
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}
</style>
