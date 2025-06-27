document.addEventListener("DOMContentLoaded", function() {
      const nameItems = document.querySelectorAll('.name-item');
      const cards = document.querySelectorAll('.course-card');
      const scrollIndicator = document.querySelector('.scroll-indicator');
      let currentIndex = 0;
      let autoScrollInterval;
      let isAutoScrolling = true;
      let isHovered = false;
      let isTransitioning = false;

      // Show the first card by default
      if (cards.length > 0) {
        cards[0].classList.add('active');
        nameItems[0].classList.add('active');
      }

      // Auto-scroll function
      function autoScroll() {
        if (!isHovered && isAutoScrolling && !isTransitioning) {
          isTransitioning = true;
          
          // Remove active class from current items
          nameItems.forEach(item => item.classList.remove('active'));
          cards.forEach(card => card.classList.remove('active'));
          
          // Move to next item with proper wrapping
          currentIndex = (currentIndex + 1) % nameItems.length;
          
          // Add active class to new items
          nameItems[currentIndex].classList.add('active');
          cards[currentIndex].classList.add('active');
          
          // Ensure the active name is visible in the list
          nameItems[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          
          // Reset transition flag after animation completes
          setTimeout(() => {
            isTransitioning = false;
          }, 600);
        }
      }

      // Start auto-scroll
      function startAutoScroll() {
        if (window.innerWidth > 900) {
          if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
          }
          
          autoScrollInterval = setInterval(autoScroll, 3000);
          
          if (scrollIndicator) {
            scrollIndicator.style.opacity = '0.7';
            scrollIndicator.textContent = 'Auto-scrolling...';
          }
        }
      }

      // Stop auto-scroll
      function stopAutoScroll() {
        if (autoScrollInterval) {
          clearInterval(autoScrollInterval);
          autoScrollInterval = null;
        }
        
        if (scrollIndicator) {
          scrollIndicator.style.opacity = '0.3';
          scrollIndicator.textContent = 'Paused';
        }
      }

      // Switch to specific card
      function switchToCard(index) {
        if (!isTransitioning) {
          isTransitioning = true;
          
          // Remove active class from all items and cards
          nameItems.forEach(item => item.classList.remove('active'));
          cards.forEach(card => card.classList.remove('active'));
          
          // Add active class to the target item and corresponding card
          nameItems[index].classList.add('active');
          cards[index].classList.add('active');
          currentIndex = index;
          
          // Reset transition flag
          setTimeout(() => {
            isTransitioning = false;
          }, 600);
        }
      }

      // Resume auto-scroll with delay
      function resumeAutoScroll() {
        setTimeout(() => {
          if (!isHovered && isAutoScrolling && window.innerWidth > 900) {
            startAutoScroll();
          }
        }, 1500);
      }

      // Initialize auto-scroll
      startAutoScroll();

      // Manual navigation
      nameItems.forEach((item, index) => {
        // Mouse enter event for desktop
        item.addEventListener('mouseenter', function() {
          if (window.innerWidth > 900) {
            isHovered = true;
            stopAutoScroll();
            switchToCard(index);
          }
        });

        // Mouse leave event for desktop
        item.addEventListener('mouseleave', function() {
          if (window.innerWidth > 900) {
            isHovered = false;
            resumeAutoScroll();
          }
        });

        // Click event for mobile
        item.addEventListener('click', function() {
          if (window.innerWidth <= 900) {
            switchToCard(index);
          }
        });
      });

      // Resume auto-scroll when mouse leaves the section
      document.querySelector('.courses-section').addEventListener('mouseleave', function() {
        if (window.innerWidth > 900) {
          isHovered = false;
          resumeAutoScroll();
        }
      });

      // Window resize handling
      window.addEventListener('resize', function() {
        stopAutoScroll();
        
        if (window.innerWidth <= 900) {
          isAutoScrolling = false;
          isHovered = false;
        } else {
          isAutoScrolling = true;
          if (!isHovered) {
            setTimeout(startAutoScroll, 500);
          }
        }
      });

      // Visibility change handling
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          stopAutoScroll();
        } else if (!isHovered && window.innerWidth > 900 && isAutoScrolling) {
          setTimeout(startAutoScroll, 1000);
        }
      });

      // Pause auto-scroll when user scrolls manually
      let scrollTimeout;
      window.addEventListener('scroll', function() {
        if (window.innerWidth > 900) {
          stopAutoScroll();
          
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }
          
          scrollTimeout = setTimeout(() => {
            if (!isHovered && isAutoScrolling) {
              startAutoScroll();
            }
          }, 2000);
        }
      });
    });
