/**
 * National Geographic Article UI Rebuild
 * Feature: "Searching the Seabed for Florida's Ice Age Societies"
 * Interactive Logic & Application Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Reading Scroll Progress Bar & Floating Header
  // ==========================================
  const progressBar = document.getElementById('progress-bar');
  const floatingHeader = document.getElementById('floating-header');
  const heroSection = document.querySelector('.article-header');

  const updateScrollState = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (floatingHeader && heroSection) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (scrollTop > heroBottom - 50) {
        floatingHeader.classList.add('visible');
      } else {
        floatingHeader.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  // ==========================================
  // 2. Paleolandscape Map & Infographic Interactive Data
  // ==========================================
  const sitesData = {
    smith: {
      tag: "DISCOVERY OF 2024",
      name: "Dr. Morgan Smith's Offshore Dive Site",
      location: "5 miles off Florida coast",
      depth: "8 feet water + 30 inches seabed sediment",
      age: "7,000 – 8,500 Years Ago",
      artifacts: "Hand-sized stone scraper & ancient tree wood",
      desc: "In December 2024, Dr. Morgan Smith and his students sifted through 30 inches of shell sand to reach blue-gray terrestrial clay silt, discovering the first confirmed stone tool embedded in drowned Ice Age soil in this region."
    },
    mcfadden: {
      tag: "COASTAL CLOVIS SITE",
      name: "McFadden Beach (Texas Coast)",
      location: "Just outside present-day Houston, TX",
      depth: "Intertidal & shallow offshore surf zone",
      age: "11,000 – 13,000 Years Ago",
      artifacts: "Fluted Clovis arrowheads & extinct Ice Age fauna",
      desc: "Wave currents continuously erode and deposit ancient projectile points and fossilized mammoth bones from an inundated prehistoric camp situated directly on the submerged paleo-coastline."
    },
    trinity: {
      tag: "ACTIVE MMA CORING SURVEY",
      name: "Trinity River Submerged Paleo-Valley",
      location: "Offshore East Texas Continental Shelf",
      depth: "Sub-bottom acoustic profiling & piston coring",
      age: "10,000 – 15,000 Years Ago",
      artifacts: "Preserved paleosols, sediment cores & lithic flakes",
      desc: "Marine Minerals Administration scientists and tribal partners are surveying ghost river channels carved into bedrock, using core tubes to identify and protect buried Indigenous settlements before offshore infrastructure is built."
    },
    aucilla: {
      tag: "PRE-CLOVIS REVOLUTION",
      name: "Page-Ladson & Aucilla River Basin",
      location: "Aucilla River, 1 hr south of Tallahassee, FL",
      depth: "30-foot river sinkhole",
      age: "14,500+ Years Ago",
      artifacts: "Bifacial stone knife & butchered mastodon bones",
      desc: "Diving in dark water alongside alligators, archaeologists in 2016 recovered butchered mastodon remains proving humans populated the Southeast centuries earlier than previously accepted by American archaeology."
    },
    'thors-elbow': {
      tag: "DEEPWATER EXPLORATION",
      name: "Thor’s Elbow (Paleo-Suwannee River)",
      location: "125 miles offshore Northern Florida",
      depth: "130 feet underwater",
      age: "11,000 Years Ago",
      artifacts: "Inundated river terrace & prehistoric chert quarries",
      desc: "In 2009, archaeologist Andy Hemmings dove 130 feet to an ancient riverbank 125 miles out to sea, standing on ground where no human had walked in 11,000 years. Research teams now plan deepwater drone expeditions to continue surveying."
    }
  };

  const sitePins = document.querySelectorAll('.site-pin');
  const siteTag = document.getElementById('site-tag');
  const siteName = document.getElementById('site-name');
  const siteLocation = document.getElementById('site-location');
  const siteDepth = document.getElementById('site-depth');
  const siteAge = document.getElementById('site-age');
  const siteArtifacts = document.getElementById('site-artifacts');
  const siteDesc = document.getElementById('site-desc');

  sitePins.forEach(pin => {
    pin.addEventListener('click', () => {
      const siteKey = pin.getAttribute('data-site');
      const data = sitesData[siteKey];
      if (!data) return;

      sitePins.forEach(p => p.classList.remove('active-pin'));
      pin.classList.add('active-pin');

      if (siteTag) siteTag.textContent = data.tag;
      if (siteName) siteName.textContent = data.name;
      if (siteLocation) siteLocation.textContent = data.location;
      if (siteDepth) siteDepth.textContent = data.depth;
      if (siteAge) siteAge.textContent = data.age;
      if (siteArtifacts) siteArtifacts.textContent = data.artifacts;
      if (siteDesc) siteDesc.textContent = data.desc;
    });
  });

  // Map Timeline Toggle (Modern vs Late Ice Age -300ft)
  const toggleModern = document.getElementById('toggle-modern');
  const toggleIceAge = document.getElementById('toggle-iceage');
  const iceAgeShelf = document.getElementById('ice-age-shelf');
  const shelfBracket = document.querySelector('.shelf-bracket');

  if (toggleModern && toggleIceAge && iceAgeShelf) {
    toggleModern.addEventListener('click', () => {
      toggleModern.classList.add('active');
      toggleIceAge.classList.remove('active');
      iceAgeShelf.classList.add('hidden');
      if (shelfBracket) shelfBracket.style.opacity = '0';
    });

    toggleIceAge.addEventListener('click', () => {
      toggleIceAge.classList.add('active');
      toggleModern.classList.remove('active');
      iceAgeShelf.classList.remove('hidden');
      if (shelfBracket) shelfBracket.style.opacity = '1';
    });
  }

  // ==========================================
  // 3. Audio Narration Player Simulation
  // ==========================================
  const audioPlayer = document.getElementById('audio-player');
  const mainAudioBtn = document.getElementById('main-audio-btn');
  const floatAudioBtn = document.getElementById('float-audio-btn');
  const audioCloseBtn = document.getElementById('audio-close-btn');
  const audioPlayPauseBtn = document.getElementById('audio-play-pause-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const currentTimeDisplay = document.getElementById('audio-current-time');
  const scrubberFill = document.getElementById('audio-scrubber-fill');
  const scrubberContainer = document.getElementById('audio-scrubber-container');
  const speedBtn = document.getElementById('audio-speed-btn');

  let isPlaying = false;
  let currentAudioSeconds = 0;
  const totalAudioSeconds = 465; // 7 mins 45 secs
  let audioInterval = null;
  const speeds = [1.0, 1.25, 1.5];
  let speedIndex = 0;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const updateAudioUI = () => {
    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = formatTime(currentAudioSeconds);
    }
    if (scrubberFill) {
      const pct = (currentAudioSeconds / totalAudioSeconds) * 100;
      scrubberFill.style.width = `${pct}%`;
    }
  };

  const togglePlayAudio = () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      audioInterval = setInterval(() => {
        currentAudioSeconds += speeds[speedIndex];
        if (currentAudioSeconds >= totalAudioSeconds) {
          currentAudioSeconds = 0;
          togglePlayAudio();
        }
        updateAudioUI();
      }, 1000);
    } else {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      clearInterval(audioInterval);
    }
  };

  const openAudioPlayer = () => {
    if (audioPlayer) {
      audioPlayer.classList.add('active');
      audioPlayer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (!isPlaying) togglePlayAudio();
    }
  };

  if (mainAudioBtn) mainAudioBtn.addEventListener('click', openAudioPlayer);
  if (floatAudioBtn) floatAudioBtn.addEventListener('click', openAudioPlayer);

  if (audioCloseBtn) {
    audioCloseBtn.addEventListener('click', () => {
      if (isPlaying) togglePlayAudio();
      audioPlayer.classList.remove('active');
    });
  }

  if (audioPlayPauseBtn) {
    audioPlayPauseBtn.addEventListener('click', togglePlayAudio);
  }

  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      speedIndex = (speedIndex + 1) % speeds.length;
      speedBtn.textContent = `${speeds[speedIndex].toFixed(1)}x`;
    });
  }

  if (scrubberContainer) {
    scrubberContainer.addEventListener('click', (e) => {
      const rect = scrubberContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      currentAudioSeconds = pct * totalAudioSeconds;
      updateAudioUI();
    });
  }

  // ==========================================
  // 4. Text Size Adjuster
  // ==========================================
  const fontDecreaseBtn = document.getElementById('font-decrease-btn');
  const fontIncreaseBtn = document.getElementById('font-increase-btn');
  const fontSizeLabel = document.getElementById('font-size-label');
  const fontSizes = ['sm', 'md', 'lg', 'xl'];
  const fontLabels = ['85%', '100%', '115%', '130%'];
  let currentFontIdx = 1; // default 'md' (100%)

  const setFontSize = (idx) => {
    currentFontIdx = Math.max(0, Math.min(fontSizes.length - 1, idx));
    fontSizes.forEach(s => document.body.classList.remove(`font-size-${s}`));
    document.body.classList.add(`font-size-${fontSizes[currentFontIdx]}`);
    if (fontSizeLabel) {
      fontSizeLabel.textContent = fontLabels[currentFontIdx];
    }
  };

  if (fontDecreaseBtn) {
    fontDecreaseBtn.addEventListener('click', () => setFontSize(currentFontIdx - 1));
  }
  if (fontIncreaseBtn) {
    fontIncreaseBtn.addEventListener('click', () => setFontSize(currentFontIdx + 1));
  }

  // ==========================================
  // 5. Theme Switcher (Light / Dark)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('natgeo-theme') || 'theme-light';
  document.body.className = `${savedTheme} font-size-md`;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('theme-dark');
      const newTheme = isDark ? 'theme-light' : 'theme-dark';
      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add(newTheme);
      localStorage.setItem('natgeo-theme', newTheme);
      showToast(`Switched to ${isDark ? 'Editorial Light' : 'Obsidian Dark'} mode`);
    });
  }

  // ==========================================
  // 6. Toast Notifications
  // ==========================================
  const toast = document.getElementById('toast');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // ==========================================
  // 7. Share Modal & Copy Link
  // ==========================================
  const shareModal = document.getElementById('share-modal');
  const mainShareBtn = document.getElementById('main-share-btn');
  const floatShareBtn = document.getElementById('float-share-btn');
  const shareCloseBtn = document.getElementById('share-close-btn');
  const shareCopyBtn = document.getElementById('share-copy');
  const copyText = document.getElementById('copy-text');
  const shareX = document.getElementById('share-x');
  const shareFb = document.getElementById('share-fb');
  const shareLi = document.getElementById('share-li');

  const articleUrl = "https://www.nationalgeographic.com/environment/article/mapping-texas-florida-coasts-ancient-american-archaeology";
  const articleTitle = "Searching the Seabed for Florida’s Ice Age Societies | National Geographic";

  const openShareModal = () => {
    if (shareModal) shareModal.classList.add('active');
  };

  const closeShareModal = () => {
    if (shareModal) shareModal.classList.remove('active');
  };

  if (mainShareBtn) mainShareBtn.addEventListener('click', openShareModal);
  if (floatShareBtn) floatShareBtn.addEventListener('click', openShareModal);
  if (shareCloseBtn) shareCloseBtn.addEventListener('click', closeShareModal);

  if (shareCopyBtn) {
    shareCopyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(articleUrl).then(() => {
        if (copyText) copyText.textContent = "Copied!";
        showToast("Article link copied to clipboard!");
        setTimeout(() => {
          if (copyText) copyText.textContent = "Copy Link";
          closeShareModal();
        }, 1200);
      }).catch(() => {
        showToast("URL copied to clipboard");
      });
    });
  }

  if (shareX) {
    shareX.addEventListener('click', () => {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(articleUrl)}`;
      window.open(url, '_blank', 'width=600,height=450');
    });
  }

  if (shareFb) {
    shareFb.addEventListener('click', () => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
      window.open(url, '_blank', 'width=600,height=450');
    });
  }

  if (shareLi) {
    shareLi.addEventListener('click', () => {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
      window.open(url, '_blank', 'width=600,height=450');
    });
  }

  // ==========================================
  // 8. Bookmark / Save Button
  // ==========================================
  const mainSaveBtn = document.getElementById('main-save-btn');
  const floatSaveBtn = document.getElementById('float-save-btn');
  const saveBtnText = document.getElementById('save-btn-text');
  let isSaved = false;

  const toggleSaveArticle = () => {
    isSaved = !isSaved;
    if (isSaved) {
      if (saveBtnText) saveBtnText.textContent = "Saved ✓";
      if (mainSaveBtn) mainSaveBtn.style.color = "var(--ng-yellow)";
      if (floatSaveBtn) floatSaveBtn.style.color = "var(--ng-yellow)";
      showToast("Article saved to your NatGeo Reading List");
    } else {
      if (saveBtnText) saveBtnText.textContent = "Save";
      if (mainSaveBtn) mainSaveBtn.style.color = "";
      if (floatSaveBtn) floatSaveBtn.style.color = "";
      showToast("Article removed from your Reading List");
    }
  };

  if (mainSaveBtn) mainSaveBtn.addEventListener('click', toggleSaveArticle);
  if (floatSaveBtn) floatSaveBtn.addEventListener('click', toggleSaveArticle);

  // ==========================================
  // 9. Search Modal Overlay
  // ==========================================
  const searchModal = document.getElementById('search-modal');
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('search-input');
  const suggestionTags = document.querySelectorAll('.suggestion-tag');

  if (searchToggleBtn && searchModal) {
    searchToggleBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      if (searchInput) searchInput.focus();
    });
  }

  if (searchCloseBtn && searchModal) {
    searchCloseBtn.addEventListener('click', () => {
      searchModal.classList.remove('active');
    });
  }

  suggestionTags.forEach(tag => {
    tag.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = tag.textContent;
        searchInput.focus();
      }
    });
  });

  // ==========================================
  // 10. Lightbox Image Viewer
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const heroWrapper = document.getElementById('hero-media-wrapper');
  const heroImg = document.getElementById('hero-img');

  if (heroWrapper && lightbox && lightboxImg) {
    heroWrapper.addEventListener('click', () => {
      lightboxImg.src = heroImg.src;
      lightboxImg.alt = heroImg.alt;
      if (lightboxCaption) {
        const captionElem = document.querySelector('.caption-text');
        lightboxCaption.textContent = captionElem ? captionElem.textContent.trim() : heroImg.alt;
      }
      lightbox.classList.add('active');
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 11. Mobile Navigation Drawer
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (drawerCloseBtn && mobileDrawer) {
    drawerCloseBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  // Dismiss overlays on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchModal) searchModal.classList.remove('active');
      if (shareModal) shareModal.classList.remove('active');
      if (lightbox) lightbox.classList.remove('active');
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    }
  });

  // ==========================================
  // 12. Newsletter Form Submission
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterSuccess = document.getElementById('newsletter-success');
  const newsletterEmail = document.getElementById('newsletter-email');

  if (newsletterForm && newsletterSuccess) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      if (email) {
        newsletterForm.style.display = 'none';
        newsletterSuccess.classList.remove('hidden');
        showToast("Subscribed to Nat Geo Environment Newsletter!");
      }
    });
  }
});
