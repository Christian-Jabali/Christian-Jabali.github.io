// Video loaded callback
function videoLoaded() {
  // Video has loaded, we can potentially hide loader sooner
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    setTimeout(hideLoader, 500);
  }
}

// Optimized loading for mobile - show content faster
document.addEventListener('DOMContentLoaded', function() {
  // Initialize components immediately
  generateProjectCards();
  initMobileMenu();
  
  // Load non-critical components after a short delay
  setTimeout(initProjectSlider, 500);
  
  // Hide loader much sooner on mobile
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // On mobile, hide loader after shorter time (800ms max)
    setTimeout(hideLoader, 800);
  } else {
    // On desktop, use normal timing
    window.addEventListener('load', function() {
      setTimeout(hideLoader, 1000);
    });
  }
  
  // Header background toggle on scroll
  window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });
});

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
    
    // Remove loader from DOM after fadeout
    setTimeout(function() {
      if (loader.parentNode) {
        loader.remove();
      }
    }, 500);
  }
}

// Animate Skills
let skillsAnimated = false;
window.addEventListener('scroll', () => {
  const skillsSection = document.querySelector('.skills');
  if (!skillsSection) return;
  
  const top = skillsSection.getBoundingClientRect().top;
  if (top < window.innerHeight && !skillsAnimated) {
    skillsAnimated = true;
    const skills = document.querySelectorAll('.skill');
    skills.forEach((skill, index) => {
      setTimeout(() => {
        const circle = skill.querySelector('.progress');
        const span = skill.querySelector('span');
        const percent = skill.getAttribute('data-percent');
        let count = 0;
        const offset = 314 - (314 * percent) / 100;
        const interval = setInterval(() => {
          if (count >= percent) {
            clearInterval(interval);
          } else {
            count++;
            span.textContent = `${count}%`;
          }
        }, 2000 / percent);
        circle.style.strokeDashoffset = offset;
        circle.style.transition = 'stroke-dashoffset 1.5s ease';
      }, index * 200);
    });
  }
});

// Generate project cards
function generateProjectCards() {
  const projectSlider = document.getElementById('project-slider');
  if (!projectSlider) return;
  
  // Clear existing content
  projectSlider.innerHTML = '';
  
  for (let i = 1; i <= 14; i++) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
      <h4>Project ${i}</h4>
      <p>Short description of Project ${i}.</p>
      <a href="#" class="btn">View Project</a>
    `;
    projectSlider.appendChild(projectCard);
  }
}

// Function to check if screen is small
function isSmallScreen() {
  return window.innerWidth <= 768;
}

// Project Auto Scroll with Pause - Disabled for small screens
function initProjectSlider() {
  const slider = document.getElementById('project-slider');
  if (!slider) return;
  
  // Don't initialize auto-scroll for small screens
  if (isSmallScreen()) {
    return;
  }
  
  let scrollStep = 1;
  let autoScroll;
  let isScrollingRight = true;
  
  function startAutoScroll() {
    autoScroll = setInterval(() => {
      // Check if we've reached the end or beginning
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5) {
        isScrollingRight = false;
      } else if (slider.scrollLeft <= 5) {
        isScrollingRight = true;
      }
      
      // Scroll in the appropriate direction
      if (isScrollingRight) {
        slider.scrollLeft += scrollStep;
      } else {
        slider.scrollLeft -= scrollStep;
      }
    }, 25);
  }
  
  function stopAutoScroll() { 
    clearInterval(autoScroll); 
  }
  
  slider.addEventListener('mouseover', stopAutoScroll);
  slider.addEventListener('mouseout', startAutoScroll);
  
  // Pause auto-scroll when user interacts with the slider
  slider.addEventListener('mousedown', stopAutoScroll);
  slider.addEventListener('touchstart', stopAutoScroll);
  
  // Resume auto-scroll when user stops interacting
  slider.addEventListener('mouseup', startAutoScroll);
  slider.addEventListener('touchend', startAutoScroll);
  
  // Initialize auto-scroll
  startAutoScroll();
}

// ======== Mobile Hamburger Toggle ========
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('overlay');
  
  if (!hamburger || !nav || !overlay) return;

  function openMenu() {
    hamburger.classList.add('active');
    nav.classList.add('open');
    overlay.classList.add('show');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
    overlay.classList.remove('show');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    if (nav.classList.contains('open')) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', closeMenu);
  
  // Close menu when clicking on nav links
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Close menu if screen is resized to desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}