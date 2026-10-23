/**
 * Balaji Online Centre & Kirana Store
 * Client Interactions, Search Filter, Modals, WhatsApp Link Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initLiveSearchAndFilters();
  initScrollNavActive();
  initModals();
});

// Mobile Navigation Drawer Toggle
function initMobileNav() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!mobileBtn || !drawer) return;

  const toggleDrawer = (open) => {
    if (open) {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  mobileBtn.addEventListener('click', () => toggleDrawer(true));
  if (closeBtn) {
    closeBtn.addEventListener('click', () => toggleDrawer(false));
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });
}

// Live Search & Category Filtering
function initLiveSearchAndFilters() {
  const searchInput = document.getElementById('liveSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const filterPills = document.querySelectorAll('.pill-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  const productCards = document.querySelectorAll('.product-card');

  let activeFilter = 'all';
  let searchTerm = '';

  const filterCards = () => {
    const term = searchTerm.toLowerCase().trim();

    // Filter Service Cards
    serviceCards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();

      const matchesSearch = term === '' || title.includes(term);
      const matchesFilter = activeFilter === 'all' || 
                            category.includes(activeFilter) ||
                            (activeFilter === 'service' && category.includes('service'));

      if (matchesSearch && matchesFilter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    // Filter Kirana Cards
    productCards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();

      const matchesSearch = term === '' || title.includes(term);
      const matchesFilter = activeFilter === 'all' || 
                            activeFilter === 'kirana' ||
                            category.includes(activeFilter);

      if (matchesSearch && matchesFilter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      if (clearBtn) {
        if (searchTerm.length > 0) {
          clearBtn.classList.add('visible');
        } else {
          clearBtn.classList.remove('visible');
        }
      }
      filterCards();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchTerm = '';
        clearBtn.classList.remove('visible');
        filterCards();
        searchInput.focus();
      }
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter') || 'all';
      filterCards();
    });
  });
}

// Active Nav highlight on scrolling (Optimized with requestAnimationFrame & passive listener)
function initScrollNavActive() {
  const sections = document.querySelectorAll('main, section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let currentId = '';
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
          const sectionHeight = section.offsetHeight;
          const sectionTop = section.offsetTop - 140;
          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentId = section.getAttribute('id');
          }
        });

        if (currentId) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else if (link.getAttribute('href')?.startsWith('#')) {
              link.classList.remove('active');
            }
          });
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// Modal handling
function initModals() {
  const qrBtn = document.getElementById('openQrModalBtn');
  if (qrBtn) {
    qrBtn.addEventListener('click', () => {
      openModal('qrModal');
    });
  }

  // Close modals on clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Open Service Booking / Inquiry Modal
let currentSelectedService = 'General Inquiry';

function openServiceModal(serviceName, description, iconSource) {
  currentSelectedService = serviceName;
  const nameEl = document.getElementById('modalServiceName');
  const descEl = document.getElementById('modalServiceDesc');
  const iconEl = document.getElementById('modalIcon');
  const detailsInput = document.getElementById('custDetails');

  if (nameEl) nameEl.textContent = serviceName;
  if (descEl) descEl.textContent = description || 'Fast & reliable assistance at Balaji Online Centre';
  if (iconEl) {
    if (iconSource && (iconSource.endsWith('.png') || iconSource.endsWith('.jpg') || iconSource.includes('/'))) {
      iconEl.innerHTML = `<img src="${iconSource}" alt="${serviceName}" style="width:32px;height:32px;object-fit:contain;">`;
    } else {
      iconEl.textContent = iconSource || '⚡';
    }
  }
  if (detailsInput) {
    detailsInput.placeholder = `Aapko ${serviceName} ke baare me kya jankari chahiye?`;
    detailsInput.value = '';
  }

  openModal('serviceModal');
}

// Handle Form Submit and redirect to pre-filled WhatsApp for Doctor Appointment
function handleInquirySubmit(event) {
  event.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const details = document.getElementById('custDetails').value.trim();

  const message = `Namaste Dr. Mohit Sharma, Mareez ka naam: *${name}* (Mobile: ${phone}). Sanjeevani Clinic me *${currentSelectedService}* ke liye appointment/paramarsh chahiye. ${details ? `Takleef/Details: ${details}` : ''}`;
  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/919876543210?text=${encodedMsg}`;

  showToast(`Booking WhatsApp Appointment for ${currentSelectedService}...`);
  closeModal('serviceModal');

  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 400);
}

// Order Kirana Item on WhatsApp directly
function orderKiranaItem(itemName) {
  const message = `Namaste Deepak Bhaiya, mujhe Balaji Kirana Store se *${itemName}* chahiye. Kripya rate aur availability batayein.`;
  const whatsappUrl = `https://wa.me/919753456789?text=${encodeURIComponent(message)}`;
  
  showToast(`Ordering ${itemName} on WhatsApp...`);
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 300);
}

// Toast notification helper
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}
