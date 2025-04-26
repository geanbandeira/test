/**
 * RankTop - Plataforma de Rankings Inteligentes
 * Arquivo principal JavaScript - Versão 2025.1
 * 
 * Tecnologias utilizadas:
 * - Web Components
 * - Three.js para gráficos 3D
 * - WebAssembly para cálculos pesados
 * - API de Inteligência Artificial
 * - Realidade Aumentada
 */

// ==========================================================================
// Módulos e Importações
// ==========================================================================
import { Analytics } from './modules/analytics.js';
import { AIAssistant } from './modules/ai-assistant.js';
import { ParticleSystem } from './modules/particles.js';
import { ComparisonEngine } from './modules/comparison.js';

// ==========================================================================
// Classes Principais
// ==========================================================================
class RankTopApp {
  constructor() {
    this.init();
  }

  async init() {
    // Inicializa módulos principais
    this.analytics = new Analytics('rt_ai_2025_analytics');
    this.aiAssistant = new AIAssistant('rt_ai_2025_prod_v2');
    this.particleSystem = new ParticleSystem('heroCanvas');
    this.comparisonEngine = new ComparisonEngine();
    
    // Configura eventos globais
    this.setupEventListeners();
    
    // Carrega dados iniciais
    await this.loadInitialData();
    
    // Esconde tela de carregamento
    this.hideLoadingScreen();
    
    // Registra Service Worker
    this.registerServiceWorker();
  }

  setupEventListeners() {
    // Toggle de tema
    document.getElementById('themeToggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    // Pesquisa por voz
    document.getElementById('voiceSearchBtn').addEventListener('click', () => {
      this.startVoiceSearch();
    });

    // Menu mobile
    document.getElementById('mobileMenuToggle').addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Eventos de scroll
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Eventos de redimensionamento
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  async loadInitialData() {
    try {
      // Carrega dados em paralelo
      await Promise.all([
        this.loadFeaturedCategories(),
        this.loadLiveRankings(),
        this.loadPersonalizedRecommendations()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      this.showErrorState();
    }
  }

  async loadFeaturedCategories() {
    const response = await fetch('/api/v3/categories/featured');
    const data = await response.json();
    this.renderCategories(data);
  }

  async loadLiveRankings() {
    const response = await fetch('/api/v3/rankings/live');
    const data = await response.json();
    this.renderRankings(data);
  }

  async loadPersonalizedRecommendations() {
    const response = await fetch('/api/v3/recommendations/personalized');
    const data = await response.json();
    this.renderRecommendations(data);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.analytics.trackEvent('theme_change', { theme: newTheme });
  }

  async startVoiceSearch() {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported');
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.processVoiceSearch(transcript);
      };
      
      recognition.start();
      this.analytics.trackEvent('voice_search_start');
    } catch (error) {
      console.error('Voice search error:', error);
      this.showToast('Pesquisa por voz não disponível', 'error');
    }
  }

  toggleMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileNav');
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    toggle.setAttribute('aria-expanded', !isExpanded);
    menu.setAttribute('aria-hidden', isExpanded);
    
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  handleScroll() {
    const header = document.getElementById('mainHeader');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  handleResize() {
    this.particleSystem.resize();
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('appLoading');
    loadingScreen.classList.add('hidden');
    
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    }
  }

  renderCategories(categories) {
    const container = document.querySelector('.categories-grid');
    if (!container) return;
    
    container.innerHTML = categories.map(category => `
      <div class="category-card">
        <div class="category-icon">
          <img src="${category.icon}" alt="${category.name}">
        </div>
        <h3 class="category-title">${category.name}</h3>
        <p class="category-count">${category.count} rankings</p>
        <a href="${category.link}" class="category-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    `).join('');
  }

  renderRankings(rankings) {
    const container = document.querySelector('.rankings-grid');
    if (!container) return;
    
    container.innerHTML = rankings.map(ranking => `
      <div class="ranking-card">
        <div class="ranking-badge">#${ranking.position}</div>
        <div class="ranking-content">
          <h3 class="ranking-title">${ranking.title}</h3>
          <p class="ranking-description">${ranking.description}</p>
        </div>
        <div class="ranking-trend">
          ${this.getTrendIcon(ranking.trend)}
        </div>
      </div>
    `).join('');
  }

  renderRecommendations(recommendations) {
    const container = document.querySelector('.recommendations-grid');
    if (!container) return;
    
    container.innerHTML = recommendations.map(rec => `
      <div class="recommendation-card">
        <img src="${rec.image}" alt="${rec.title}" loading="lazy">
        <div class="recommendation-content">
          <h3>${rec.title}</h3>
          <p>${rec.description}</p>
          <div class="recommendation-meta">
            <span class="rating">${this.generateStars(rec.rating)}</span>
            <a href="${rec.link}" class="btn btn-link">Ver detalhes</a>
          </div>
        </div>
      </div>
    `).join('');
  }

  getTrendIcon(trend) {
    const icons = {
      up: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7V17M17 7H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`,
      down: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7 7L17 17M17 17V7M17 17H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
      neutral: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`
    };
    
    return icons[trend] || icons.neutral;
  }

  generateStars(rating) {
    const fullStars = '★'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '½' : '';
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return `${fullStars}${halfStar}${emptyStars}`;
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  showErrorState() {
    const containers = [
      '.categories-grid',
      '.rankings-grid',
      '.recommendations-grid'
    ];
    
    containers.forEach(selector => {
      const container = document.querySelector(selector);
      if (container) {
        container.innerHTML = `
          <div class="error-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12V8ZM12 16H12.01H12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>Não foi possível carregar os dados. Tente recarregar a página.</p>
            <button class="btn btn-sm" onclick="window.location.reload()">Recarregar</button>
          </div>
        `;
      }
    });
  }
}

// ==========================================================================
// Inicialização da Aplicação
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Verifica preferência de tema
  const preferredTheme = localStorage.getItem('theme') || 
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', preferredTheme);
  
  // Inicia a aplicação
  new RankTopApp();
  
  // Atualiza o ano no footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Inicializa animação de digitação
  if (typeof Typed === 'function') {
    new Typed('.typed-text', {
      strings: ['Baseados em IA', 'Atualizados em Tempo Real', 'Personalizados para Você', 'Mais de 10.000 Categorias'],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true
    });
  }
});

// ==========================================================================
// Web Components
// ==========================================================================
// Componente de Logo Interativo
class RankingLogo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.interactive = this.hasAttribute('interactive');
    this.theme = this.getAttribute('theme') || 'auto';
  }

  connectedCallback() {
    this.render();
    if (this.interactive) {
      this.setupInteractivity();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: 32px;
          height: 32px;
        }
        
        .logo-container {
          width: 100%;
          height: 100%;
          transition: transform 0.3s ease;
        }
        
        .logo-svg {
          width: 100%;
          height: 100%;
        }
      </style>
      <div class="logo-container">
        <svg class="logo-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2L21 8L26 2H31V8L26 13L31 18V24L26 29L21 24L16 30L11 24L6 29L1 24V18L6 13L1 8V2L6 7L11 2L16 8Z" fill="currentColor"/>
          <path d="M16 8L21 13L16 18L11 13L16 8Z" fill="var(--color-accent)"/>
        </svg>
      </div>
    `;
  }

  setupInteractivity() {
    const container = this.shadowRoot.querySelector('.logo-container');
    
    container.addEventListener('mouseenter', () => {
      container.style.transform = 'rotate(15deg) scale(1.1)';
    });
    
    container.addEventListener('mouseleave', () => {
      container.style.transform = '';
    });
  }
}

customElements.define('ranking-logo', RankingLogo);

// ==========================================================================
// Exportação para testes
// ==========================================================================
export {
  RankTopApp,
  RankingLogo
};
