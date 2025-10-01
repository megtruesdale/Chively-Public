// Small interactions: mobile nav, counter, and form success
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');
if (navToggle){
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    primaryNav.style.display = expanded ? 'none' : 'flex';
    
    // Toggle icon between hamburger and X
    const icon = navToggle.querySelector('i');
    if (icon) {
      if (expanded) {
        icon.className = 'fas fa-bars';
      } else {
        icon.className = 'fas fa-times';
      }
    }
  });
}

// Waitlist count animation
const counterEl = document.getElementById('waitlist-count');
if (counterEl){
  const target = parseInt(counterEl.dataset.target, 10) || 2500;
  let cur = Math.max(0, target - 200);
  const tick = () => {
    cur += Math.ceil((target - cur) / 12);
    counterEl.textContent = cur.toLocaleString() + '+';
    if (cur < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Google Sheets signup handling
const form = document.getElementById('waitlist-form');
const successToast = document.getElementById('form-success');
const errorToast = document.getElementById('form-error');

// reCAPTCHA configuration
const RECAPTCHA_SITE_KEY = '6LfoddorAAAAAFbdQZJmtx1tyvy2AOZij4AaE5Du';

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Hide any previous messages
    if (successToast) successToast.style.display = 'none';
    if (errorToast) errorToast.style.display = 'none';
    
    // Validate reCAPTCHA
    if (typeof grecaptcha === 'undefined') {
      if (errorToast) {
        errorToast.textContent = 'reCAPTCHA failed to load. Please refresh the page and try again.';
        errorToast.style.display = 'block';
        setTimeout(() => {
          errorToast.style.display = 'none';
        }, 5000);
      }
      return;
    }
    
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      if (errorToast) {
        errorToast.textContent = 'Please complete the reCAPTCHA verification.';
        errorToast.style.display = 'block';
        setTimeout(() => {
          errorToast.style.display = 'none';
        }, 5000);
      }
      return;
    }
    
    // Get form data
    const formData = new FormData(form);
    
    // Add reCAPTCHA response to form data
    formData.append('g-recaptcha-response', recaptchaResponse);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Joining...';
    submitButton.disabled = true;
    
    // Submit to Google Sheets
    fetch(form.action, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
    .then(() => {
      // Show success message
      if (successToast) {
        successToast.style.display = 'block';
        // Hide success message after 5 seconds
        setTimeout(() => {
          successToast.style.display = 'none';
        }, 5000);
      }
      
      // Reset form and reCAPTCHA
      form.reset();
      grecaptcha.reset();
    })
    .catch((error) => {
      console.error('Error:', error);
      // Show error message
      if (errorToast) {
        errorToast.style.display = 'block';
        // Hide error message after 5 seconds
        setTimeout(() => {
          errorToast.style.display = 'none';
        }, 5000);
      }
    })
    .finally(() => {
      // Reset button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
  });
}

// How It Works Section Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const steps = entry.target.querySelectorAll('.step');
      steps.forEach((step, index) => {
        setTimeout(() => {
          step.classList.add('animate');
        }, index * 200);
      });
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe the how-it-works section
const howItWorksSection = document.querySelector('.how-it-works');
if (howItWorksSection) {
  observer.observe(howItWorksSection);
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.log('Target not found:', href);
    }
  });
});
