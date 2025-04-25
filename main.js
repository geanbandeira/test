// Main Application Script - Type: Module

// Import Web Components
import './components/core/ranking-logo.js';
import './components/core/ai-navigation.js';
import './components/core/ai-search-widget.js';
import './components/interactive/ai-recommendations.js';
import './components/interactive/real-time-rankings.js';
import './components/interactive/ai-comparison-tool.js';
import './components/advanced/ai-assistant.js';
import './components/advanced/ar-preview.js';
import './components/advanced/interactive-methodology.js';

// Initialize Three.js for Hero Section
const initHeroCanvas = () => {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  // Check if WebGL is supported
  if (!WEBGL.isWebGL2Available()) {
    canvas.style.display = 'none';
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Particles
  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

    sizes[i] = Math.random() * 3 + 1;

    colors[i * 3] = 0.1 + Math.random() * 0.4;
    colors[i * 3 + 1] = 0.1 + Math.random() * 0.4;
    colors[i * 3 + 2] = 0.6 + Math.random() * 0.4;
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  // Camera position
  camera.position.z = 500;

  // Animation
  const animate = () => {
    requestAnimationFrame(animate);

    particleSystem.rotation.x += 0.0005;
    particleSystem.rotation.y += 0.001;

    renderer.render(scene, camera);
  };

  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

// Theme Toggle Functionality
const initThemeToggle = () => {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
};

// Voice Search Functionality
const initVoiceSearch = () => {
  const voiceSearchBtn = document.getElementById('voiceSearchBtn');
  if (!voiceSearchBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceSearchBtn.style.display = 'none';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  voiceSearchBtn.addEventListener('click', () => {
    try {
      recognition.start();
      voiceSearchBtn.innerHTML = '<i class="fas fa-microphone-alt animate-pulse"></i>';
      voiceSearchBtn.setAttribute('aria-label', 'Ouvindo...');
    } catch (e) {
      console.error('Voice recognition error:', e);
    }
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const searchInput = document.querySelector('ai-search-widget input');
    
    if (searchInput) {
      searchInput.value = transcript;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    voiceSearchBtn.innerHTML = '<i class="fas fa-microphone-alt"></i>';
    voiceSearchBtn.setAttribute('aria-label', 'Pesquisa por voz');
  };

  recognition.onend = () => {
    voiceSearchBtn.innerHTML = '<i class="fas fa-microphone-alt"></i>';
    voiceSearchBtn.setAttribute('aria-label', 'Pesquisa por voz');
  };
};

// Mobile Menu Toggle
const initMobileMenu = () => {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.querySelector('.mobile-nav');
  
  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.setAttribute('aria-hidden', isExpanded);
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });
};

// Scroll Header Effect
const initScrollHeader = () => {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      header.classList.remove('scrolled');
      return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.classList.add('scrolled', 'header-hidden');
    } else if (currentScroll < lastScroll) {
      header.classList.add('scrolled');
      header.classList.remove('header-hidden');
    }
    
    lastScroll = currentScroll;
  });
};

// Smooth Scrolling for Anchor Links
const initSmoothScrolling = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// Lazy Loading for Images
const initLazyLoading = () => {
  const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
  
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(lazyImage => {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(lazyImage => {
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove('lazy');
    });
  }
};

// Initialize Current Year in Footer
const initCurrentYear = () => {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
};

// Initialize All Components
const initApp = () => {
  // Hide loading screen
  const appLoading = document.getElementById('appLoading');
  if (appLoading) {
    setTimeout(() => {
      appLoading.classList.add('hidden');
      setTimeout(() => appLoading.remove(), 300);
    }, 500);
  }

  // Initialize components
  initHeroCanvas();
  initThemeToggle();
  initVoiceSearch();
  initMobileMenu();
  initScrollHeader();
  initSmoothScrolling();
  initLazyLoading();
  initCurrentYear();

  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        registration => console.log('ServiceWorker registration successful'),
        err => console.log('ServiceWorker registration failed: ', err)
      );
    });
  }
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for testing purposes
export {
  initHeroCanvas,
  initThemeToggle,
  initVoiceSearch,
  initMobileMenu,
  initScrollHeader,
  initSmoothScrolling,
  initLazyLoading,
  initCurrentYear,
  initApp
};
