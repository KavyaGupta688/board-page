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

      // Improved auto-scroll function with proper sequencing
      function autoScroll() {
        if (!isHovered && isAutoScrolling && !isTransitioning) {
          isTransitioning = true;
          
          // Remove active class from current items
          nameItems.forEach(i => i.classList.remove('active'));
          cards.forEach(c => c.classList.remove('active'));
          
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
          }, 600); // Match the CSS transition duration
        }
      }

      // Start auto-scroll with consistent timing
      function startAutoScroll() {
        if (window.innerWidth > 900) { // Only on desktop
          // Clear any existing interval first
          if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
          }
          
          autoScrollInterval = setInterval(() => {
            autoScroll();
          }, 3000); // Fixed 4-second interval
          
          scrollIndicator.style.opacity = '0.7';
          scrollIndicator.textContent = 'Auto-scrolling...';
        }
      }

      // Stop auto-scroll
      function stopAutoScroll() {
        if (autoScrollInterval) {
          clearInterval(autoScrollInterval);
          autoScrollInterval = null;
        }
        scrollIndicator.style.opacity = '0.3';
        scrollIndicator.textContent = 'Paused';
      }

      // Initialize auto-scroll
      startAutoScroll();

      // Manual navigation with improved hover handling
      nameItems.forEach((item, index) => {
        // Mouse enter event
        item.addEventListener('mouseenter', function() {
          if (window.innerWidth > 900) {
            isHovered = true;
            stopAutoScroll();
            
            // Only change if not already transitioning
            if (!isTransitioning) {
              isTransitioning = true;
              
              // Remove active class from all items and cards
              nameItems.forEach(i => i.classList.remove('active'));
              cards.forEach(c => c.classList.remove('active'));
              
              // Add active class to the current item and corresponding card
              this.classList.add('active');
              const targetId = this.getAttribute('data-target');
              const targetCard = document.getElementById(targetId);
              if (targetCard) {
                targetCard.classList.add('active');
                currentIndex = index; // Update current index
              }
              
              // Reset transition flag
              setTimeout(() => {
                isTransitioning = false;
              }, 600);
            }
          }
        });

        // Click event for mobile
        item.addEventListener('click', function() {
          if (window.innerWidth <= 900) {
            nameItems.forEach(i => i.classList.remove('active'));
            cards.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const targetId = this.getAttribute('data-target');
            const targetCard = document.getElementById(targetId);
            if (targetCard) {
              targetCard.classList.add('active');
              currentIndex = index;
            }
          }
        });
      });

      // Resume auto-scroll when mouse leaves the entire section
      document.querySelector('.courses-section').addEventListener('mouseleave', function() {
        if (window.innerWidth > 900) {
          isHovered = false;
          // Resume auto-scroll after a brief delay
          setTimeout(() => {
            if (!isHovered && isAutoScrolling) {
              startAutoScroll();
            }
          }, 1500);
        }
      });

      // Improved window resize handling
      window.addEventListener('resize', function() {
        // Stop any existing auto-scroll
        stopAutoScroll();
        
        if (window.innerWidth <= 900) {
          isAutoScrolling = false;
          isHovered = false;
        } else {
          isAutoScrolling = true;
          if (!isHovered) {
            setTimeout(() => {
              startAutoScroll();
            }, 500);
          }
        }
      });

      // Enhanced visibility change handling
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          stopAutoScroll();
        } else if (!isHovered && window.innerWidth > 900 && isAutoScrolling) {
          // Resume auto-scroll when tab becomes visible again
          setTimeout(() => {
            startAutoScroll();
          }, 1000);
        }
      });

      // Pause auto-scroll when user scrolls manually
      let scrollTimeout;
      window.addEventListener('scroll', function() {
        if (window.innerWidth > 900) {
          stopAutoScroll();
          
          // Clear existing timeout
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }
          
          // Resume auto-scroll after scrolling stops
          scrollTimeout = setTimeout(() => {
            if (!isHovered && isAutoScrolling) {
              startAutoScroll();
            }
          }, 2000);
        }
      });
    });