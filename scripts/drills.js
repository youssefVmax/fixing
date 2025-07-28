// Drills page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Initialize animations
  initializeAnimations()
  
  // Category filtering
  const categoryBtns = document.querySelectorAll(".category-btn")
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.getAttribute("data-category")

      // Remove active class from all buttons with animation
      categoryBtns.forEach((categoryBtn) => {
        categoryBtn.classList.remove("active")
        categoryBtn.style.transform = "scale(1)"
      })

      // Add active class to clicked button with animation
      this.classList.add("active")
      this.style.transform = "scale(1.05)"
      setTimeout(() => {
        this.style.transform = "scale(1)"
      }, 150)

      // Filter drills based on category with animation
      filterDrillsByCategory(category)
    })
  })

  function filterDrillsByCategory(category) {
    const drillCards = document.querySelectorAll(".drill-card")
    const drillsGrid = document.querySelector(".drills-grid")
    
    // Add loading state
    drillsGrid.style.opacity = "0.7"
    
    drillCards.forEach((card, index) => {
      // Fade out cards first
      card.style.opacity = "0"
      card.style.transform = "translateY(20px)"
      
      setTimeout(() => {
        if (category === "all") {
          card.style.display = "block"
          // Animate cards back in
          setTimeout(() => {
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
          }, index * 50)
        } else {
          // Enhanced filtering logic
          const tags = card.querySelectorAll(".tag")
          let shouldShow = false
          
          if (category === "favorites") {
            shouldShow = card.querySelector(".favorite-btn.active") !== null
          } else if (category === "recent") {
            // Show first 3 cards as "recent" for demo
            shouldShow = index < 3
          } else if (category === "my-drills") {
            // Show cards created by current user (simplified)
            const creator = card.querySelector(".stat:last-child span")
            shouldShow = creator && creator.textContent.includes("Ahmed Hassan")
          } else {
            // Check if card has matching tag
            tags.forEach(tag => {
              if (tag.classList.contains(category)) {
                shouldShow = true
              }
            })
          }
          
          if (shouldShow) {
            card.style.display = "block"
            setTimeout(() => {
              card.style.opacity = "1"
              card.style.transform = "translateY(0)"
            }, index * 50)
          } else {
            card.style.display = "none"
          }
        }
      }, 200)
    })
    
    // Remove loading state
    setTimeout(() => {
      drillsGrid.style.opacity = "1"
    }, 400)
  }

  // Initialize animations function
  function initializeAnimations() {
    // Animate drill cards on page load
    const drillCards = document.querySelectorAll(".drill-card")
    drillCards.forEach((card, index) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(30px)"
      
      setTimeout(() => {
        card.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      }, index * 100)
    })
    
    // Animate filter buttons
    const categoryBtns = document.querySelectorAll(".category-btn")
    categoryBtns.forEach((btn, index) => {
      btn.style.opacity = "0"
      btn.style.transform = "translateX(-20px)"
      
      setTimeout(() => {
        btn.style.transition = "all 0.4s ease-out"
        btn.style.opacity = "1"
        btn.style.transform = "translateX(0)"
      }, index * 50)
    })
    
    // Animate filters
    const filters = document.querySelector(".drills-filters")
    if (filters) {
      filters.style.opacity = "0"
      filters.style.transform = "translateY(-20px)"
      
      setTimeout(() => {
        filters.style.transition = "all 0.5s ease-out"
        filters.style.opacity = "1"
        filters.style.transform = "translateY(0)"
      }, 200)
    }
  }

  // Enhanced search functionality
  const searchInput = document.getElementById("drill-search")
  if (searchInput) {
    let searchTimeout
    
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const drillCards = document.querySelectorAll(".drill-card")
      
      // Clear previous timeout
      clearTimeout(searchTimeout)
      
      // Add loading state to search
      this.style.background = "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDNWN00xMCAxM1YxN00zIDEwSDdNMTMgMTBIMTciIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+') no-repeat right 12px center, white"
      
      // Debounce search
      searchTimeout = setTimeout(() => {
        this.style.background = "white"
        
        drillCards.forEach((card, index) => {
          const title = card.querySelector("h3").textContent.toLowerCase()
          const description = card.querySelector(".drill-description").textContent.toLowerCase()
          const tags = Array.from(card.querySelectorAll(".tag")).map(tag => tag.textContent.toLowerCase())
          
          const matchesSearch = searchTerm === "" || 
                               title.includes(searchTerm) || 
                               description.includes(searchTerm) ||
                               tags.some(tag => tag.includes(searchTerm))

          // Animate search results
          card.style.transition = "all 0.3s ease-out"
          
          if (matchesSearch) {
            card.style.display = "block"
            card.classList.add("highlighted")
            
            setTimeout(() => {
              card.style.opacity = "1"
              card.style.transform = "scale(1)"
            }, index * 30)
          } else {
            card.style.opacity = "0.3"
            card.style.transform = "scale(0.95)"
            card.classList.remove("highlighted")
            
            setTimeout(() => {
              if (!card.classList.contains("highlighted")) {
                card.style.display = "none"
              }
            }, 300)
          }
        })
      }, 300)
    })
  }

  // Enhanced filter functionality
  const filters = document.querySelectorAll(".drills-filters select")
  filters.forEach((filter) => {
    filter.addEventListener("change", () => {
      // Add visual feedback
      filter.style.transform = "scale(1.02)"
      setTimeout(() => {
        filter.style.transform = "scale(1)"
      }, 150)
      
      applyDrillFilters()
    })
  })

  function applyDrillFilters() {
    const sportFilter = document.getElementById("sport-filter").value
    const typeFilter = document.getElementById("type-filter").value
    const difficultyFilter = document.getElementById("difficulty-filter").value
    const durationFilter = document.getElementById("duration-filter").value

    const drillCards = document.querySelectorAll(".drill-card")
    const drillsGrid = document.querySelector(".drills-grid")
    
    // Add loading animation
    drillsGrid.style.opacity = "0.7"

    drillCards.forEach((card, index) => {
      let show = true

      // Check sport filter
      if (sportFilter) {
        const sportTag = card.querySelector(`.tag.${sportFilter}`)
        if (!sportTag) show = false
      }

      // Check type filter
      if (typeFilter) {
        const typeTag = card.querySelector(`.tag.${typeFilter}`)
        if (!typeTag) show = false
      }

      // Check difficulty filter
      if (difficultyFilter) {
        const difficultyTag = card.querySelector(`.tag.${difficultyFilter}`)
        if (!difficultyTag) show = false
      }
      
      // Check duration filter
      if (durationFilter) {
        const durationText = card.querySelector(".drill-duration").textContent
        const duration = parseInt(durationText)
        
        if (durationFilter === "short" && duration > 15) show = false
        if (durationFilter === "medium" && (duration <= 15 || duration > 30)) show = false
        if (durationFilter === "long" && duration <= 30) show = false
      }

      // Animate filter results
      card.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      
      if (show) {
        card.style.display = "block"
        setTimeout(() => {
          card.style.opacity = "1"
          card.style.transform = "translateY(0) scale(1)"
        }, index * 50)
      } else {
        card.style.opacity = "0"
        card.style.transform = "translateY(20px) scale(0.9)"
        setTimeout(() => {
          card.style.display = "none"
        }, 400)
      }
    })
    
    // Remove loading state
    setTimeout(() => {
      drillsGrid.style.opacity = "1"
    }, 500)
  }

  window.clearDrillFilters = () => {
    // Animate clear action
    const clearBtn = document.querySelector('.drills-filters .btn-outline')
    if (clearBtn) {
      clearBtn.style.transform = "scale(0.95)"
      setTimeout(() => {
        clearBtn.style.transform = "scale(1)"
      }, 100)
    }
    
    filters.forEach((filter, index) => {
      setTimeout(() => {
        filter.value = ""
        filter.style.transform = "scale(1.02)"
        setTimeout(() => {
          filter.style.transform = "scale(1)"
        }, 100)
      }, index * 50)
    })
    
    setTimeout(() => {
      applyDrillFilters()
    }, 200)
  }

  // Enhanced drill actions with sample data
  const drillData = {
    1: {
      title: "Advanced Passing Combinations",
      description: "Complex passing sequences to improve ball control and team coordination under pressure.",
      duration: "15 min",
      players: "8-12 Players",
      space: "Half Pitch",
      instructions: "Set up cones in a diamond formation. Players pass in sequence while moving to different positions. Focus on first touch and quick passing.",
      equipment: "Cones, Footballs, Bibs",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop",
      tags: ["Football", "Technical", "Intermediate"]
    },
    2: {
      title: "Precision Shooting Training",
      description: "Target-based shooting exercises to improve accuracy and power in various game situations.",
      duration: "20 min",
      players: "6-10 Players",
      space: "Penalty Area",
      instructions: "Set up targets in goal corners. Players take shots from different angles and distances. Focus on accuracy over power.",
      equipment: "Goals, Footballs, Target markers",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      tags: ["Football", "Technical", "Advanced"]
    }
  }

  window.viewDrill = (drillId) => {
    const drill = drillData[drillId] || drillData[1] // Fallback to drill 1
    
    // Populate modal with drill data
    document.getElementById("drill-detail-title").textContent = drill.title
    document.getElementById("drill-detail-img").src = drill.image
    document.getElementById("drill-detail-description").textContent = drill.description
    document.getElementById("drill-detail-duration").textContent = drill.duration
    document.getElementById("drill-detail-players").textContent = drill.players
    document.getElementById("drill-detail-space").textContent = drill.space
    document.getElementById("drill-detail-instructions").innerHTML = `<p>${drill.instructions}</p>`
    document.getElementById("drill-detail-equipment").innerHTML = `<p>${drill.equipment}</p>`
    
    // Add tags
    const tagsContainer = document.getElementById("drill-detail-tags")
    tagsContainer.innerHTML = drill.tags.map(tag => 
      `<span class="tag ${tag.toLowerCase()}">${tag}</span>`
    ).join('')
    
    // Add entrance animation to modal
    const modal = document.getElementById("drill-detail-modal")
    modal.style.opacity = "0"
    window.openModal("drill-detail-modal")
    
    setTimeout(() => {
      modal.style.transition = "opacity 0.3s ease-out"
      modal.style.opacity = "1"
    }, 50)
  }

  window.assignDrill = (drillId) => {
    // Add visual feedback
    const assignBtns = document.querySelectorAll(`[onclick="assignDrill(${drillId})"]`)
    assignBtns.forEach(btn => {
      btn.style.transform = "scale(0.95)"
      btn.style.background = "var(--success)"
      btn.style.color = "white"
      
      setTimeout(() => {
        btn.style.transform = "scale(1)"
        btn.innerHTML = '<i class="fas fa-check"></i> Assigned'
      }, 150)
      
      setTimeout(() => {
        btn.style.background = ""
        btn.style.color = ""
        btn.innerHTML = '<i class="fas fa-calendar-plus"></i> Assign'
      }, 2000)
    })
    
    window.showNotification(`Drill assigned to next training session`, "success")
  }

  window.editDrill = (drillId) => {
    // Add visual feedback
    const editBtns = document.querySelectorAll(`[onclick="editDrill(${drillId})"]`)
    editBtns.forEach(btn => {
      btn.style.transform = "scale(0.95)"
      setTimeout(() => {
        btn.style.transform = "scale(1)"
      }, 150)
    })
    
    window.showNotification(`Opening drill editor...`, "info")
    
    // Simulate opening editor after delay
    setTimeout(() => {
      window.showNotification(`Drill editor opened`, "success")
    }, 1000)
  }

  window.closeDrillDetailModal = () => {
    const modal = document.getElementById("drill-detail-modal")
    modal.style.transition = "opacity 0.3s ease-out"
    modal.style.opacity = "0"
    
    setTimeout(() => {
      window.closeModal("drill-detail-modal")
    }, 300)
  }

  // Enhanced favorite functionality
  document.querySelectorAll(".favorite-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation()
      
      // Add animation
      this.style.transform = "scale(1.3)"
      
      setTimeout(() => {
        this.classList.toggle("active")
        this.style.transform = "scale(1)"

        const icon = this.querySelector("i")
        if (this.classList.contains("active")) {
          icon.className = "fas fa-heart"
          this.style.animation = "heartBeat 0.6s ease-out"
          window.showNotification("Added to favorites", "success")
        } else {
          icon.className = "far fa-heart"
          window.showNotification("Removed from favorites", "info")
        }
        
        // Remove animation class after animation completes
        setTimeout(() => {
          this.style.animation = ""
        }, 600)
      }, 150)
    })
  })

  // Enhanced new drill modal
  window.openNewDrillModal = () => {
    const modal = document.getElementById("new-drill-modal")
    modal.style.opacity = "0"
    window.openModal("new-drill-modal")
    
    setTimeout(() => {
      modal.style.transition = "opacity 0.3s ease-out"
      modal.style.opacity = "1"
    }, 50)
  }

  window.closeNewDrillModal = () => {
    const modal = document.getElementById("new-drill-modal")
    modal.style.transition = "opacity 0.3s ease-out"
    modal.style.opacity = "0"
    
    setTimeout(() => {
      window.closeModal("new-drill-modal")
    }, 300)
  }

  // Enhanced load more functionality
  window.loadMoreDrills = () => {
    const loadBtn = document.querySelector(".load-more button")
    const originalText = loadBtn.innerHTML
    
    loadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'
    loadBtn.disabled = true
    loadBtn.style.opacity = "0.7"

    // Simulate loading more drills
    setTimeout(() => {
      loadBtn.innerHTML = originalText
      loadBtn.disabled = false
      loadBtn.style.opacity = "1"
      
      // Add some new drill cards (simulation)
      const drillsGrid = document.querySelector(".drills-grid")
      const newCard = document.createElement("div")
      newCard.className = "drill-card"
      newCard.style.opacity = "0"
      newCard.style.transform = "translateY(30px)"
      newCard.innerHTML = `
        <div class="drill-thumbnail">
          <img src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop" alt="New Drill">
          <div class="drill-overlay">
            <button class="play-btn"><i class="fas fa-play"></i></button>
          </div>
          <div class="drill-duration">18 min</div>
          <button class="favorite-btn"><i class="far fa-heart"></i></button>
        </div>
        <div class="drill-content">
          <div class="drill-header">
            <h3>New Training Drill</h3>
            <div class="drill-tags">
              <span class="tag football">Football</span>
              <span class="tag tactical">Tactical</span>
              <span class="tag intermediate">Intermediate</span>
            </div>
          </div>
          <p class="drill-description">Newly added drill for enhanced training experience.</p>
          <div class="drill-stats">
            <div class="stat"><i class="fas fa-users"></i><span>10-15 Players</span></div>
            <div class="stat"><i class="fas fa-map-marker-alt"></i><span>Full Pitch</span></div>
            <div class="stat"><i class="fas fa-user"></i><span>Ahmed Hassan</span></div>
          </div>
          <div class="drill-actions">
            <button class="btn-outline" onclick="viewDrill(7)"><i class="fas fa-eye"></i> View</button>
            <button class="btn-outline" onclick="assignDrill(7)"><i class="fas fa-calendar-plus"></i> Assign</button>
            <button class="btn-outline" onclick="editDrill(7)"><i class="fas fa-edit"></i> Edit</button>
          </div>
        </div>
      `
      
      drillsGrid.appendChild(newCard)
      
      // Animate new card
      setTimeout(() => {
        newCard.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
        newCard.style.opacity = "1"
        newCard.style.transform = "translateY(0)"
      }, 100)
      
      window.showNotification("New drill loaded successfully!", "success")
    }, 1500)
  }

  // Enhanced drill detail modal actions
  window.favoriteDrill = () => {
    const favoriteBtn = document.querySelector('.drill-detail-actions .btn-outline')
    if (favoriteBtn && favoriteBtn.innerHTML.includes('heart')) {
      favoriteBtn.style.transform = "scale(0.95)"
      favoriteBtn.style.background = "var(--primary-red)"
      favoriteBtn.style.color = "white"
      
      setTimeout(() => {
        favoriteBtn.style.transform = "scale(1)"
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Favorited'
      }, 150)
    }
    
    window.showNotification("Drill added to favorites", "success")
  }

  window.duplicateDrill = () => {
    const duplicateBtn = document.querySelector('.drill-detail-actions .btn-outline:nth-child(2)')
    if (duplicateBtn) {
      duplicateBtn.style.transform = "scale(0.95)"
      setTimeout(() => {
        duplicateBtn.style.transform = "scale(1)"
      }, 150)
    }
    
    window.showNotification("Drill duplicated successfully", "success")
  }

  window.assignDrillToSession = () => {
    const assignBtn = document.querySelector('.drill-detail-actions .btn-primary')
    if (assignBtn) {
      assignBtn.style.transform = "scale(0.95)"
      assignBtn.style.background = "var(--success)"
      
      setTimeout(() => {
        assignBtn.style.transform = "scale(1)"
        assignBtn.innerHTML = '<i class="fas fa-check"></i> Assigned'
      }, 150)
    }
    
    window.showNotification("Drill assigned to session", "success")
    
    setTimeout(() => {
      window.closeDrillDetailModal()
    }, 1000)
  }

  // Play button functionality
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation()
      
      this.style.transform = "scale(1.2)"
      this.innerHTML = '<i class="fas fa-pause"></i>'
      
      setTimeout(() => {
        this.style.transform = "scale(1)"
        this.innerHTML = '<i class="fas fa-play"></i>'
      }, 2000)
      
      window.showNotification("Playing drill video...", "info")
    })
  })

  // Add smooth scrolling to load more button
  const loadMoreBtn = document.querySelector('.load-more button')
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      this.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  // Enhanced form submission for new drill modal
  const newDrillForm = document.getElementById('new-drill-form')
  if (newDrillForm) {
    newDrillForm.addEventListener('submit', function(e) {
      e.preventDefault()
      
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      
      // Add loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...'
      submitBtn.disabled = true
      
      // Simulate form processing
      setTimeout(() => {
        // Create new drill card
        const formData = new FormData(this)
        const drillsGrid = document.querySelector('.drills-grid')
        
        const newCard = document.createElement('div')
        newCard.className = 'drill-card'
        newCard.style.opacity = '0'
        newCard.style.transform = 'translateY(30px) scale(0.9)'
        
        newCard.innerHTML = `
          <div class="drill-thumbnail">
            <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop" alt="${formData.get('name')}">
            <div class="drill-overlay">
              <button class="play-btn"><i class="fas fa-play"></i></button>
            </div>
            <div class="drill-duration">${formData.get('duration')} min</div>
            <button class="favorite-btn"><i class="far fa-heart"></i></button>
          </div>
          <div class="drill-content">
            <div class="drill-header">
              <h3>${formData.get('name')}</h3>
              <div class="drill-tags">
                <span class="tag ${formData.get('sport')}">${formData.get('sport').charAt(0).toUpperCase() + formData.get('sport').slice(1)}</span>
                <span class="tag ${formData.get('type')}">${formData.get('type').charAt(0).toUpperCase() + formData.get('type').slice(1)}</span>
                <span class="tag ${formData.get('difficulty')}">${formData.get('difficulty').charAt(0).toUpperCase() + formData.get('difficulty').slice(1)}</span>
              </div>
            </div>
            <p class="drill-description">${formData.get('description')}</p>
            <div class="drill-stats">
              <div class="stat"><i class="fas fa-users"></i><span>${formData.get('players')}</span></div>
              <div class="stat"><i class="fas fa-map-marker-alt"></i><span>${formData.get('space')}</span></div>
              <div class="stat"><i class="fas fa-user"></i><span>Ahmed Hassan</span></div>
            </div>
            <div class="drill-actions">
              <button class="btn-outline" onclick="viewDrill(${Date.now()})"><i class="fas fa-eye"></i> View</button>
              <button class="btn-outline" onclick="assignDrill(${Date.now()})"><i class="fas fa-calendar-plus"></i> Assign</button>
              <button class="btn-outline" onclick="editDrill(${Date.now()})"><i class="fas fa-edit"></i> Edit</button>
            </div>
          </div>
        `
        
        // Add to beginning of grid
        drillsGrid.insertBefore(newCard, drillsGrid.firstChild)
        
        // Animate new card
        setTimeout(() => {
          newCard.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          newCard.style.opacity = '1'
          newCard.style.transform = 'translateY(0) scale(1)'
        }, 100)
        
        // Add event listeners to new card
        const favoriteBtn = newCard.querySelector('.favorite-btn')
        favoriteBtn.addEventListener('click', function(e) {
          e.stopPropagation()
          this.classList.toggle('active')
          const icon = this.querySelector('i')
          if (this.classList.contains('active')) {
            icon.className = 'fas fa-heart'
            this.style.animation = 'heartBeat 0.6s ease-out'
            window.showNotification('Added to favorites', 'success')
          } else {
            icon.className = 'far fa-heart'
            window.showNotification('Removed from favorites', 'info')
          }
        })
        
        const playBtn = newCard.querySelector('.play-btn')
        playBtn.addEventListener('click', function(e) {
          e.stopPropagation()
          this.style.transform = 'scale(1.2)'
          this.innerHTML = '<i class="fas fa-pause"></i>'
          setTimeout(() => {
            this.style.transform = 'scale(1)'
            this.innerHTML = '<i class="fas fa-play"></i>'
          }, 2000)
          window.showNotification('Playing drill video...', 'info')
        })
        
        // Reset form and close modal
        this.reset()
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
        
        window.showNotification('New drill created successfully!', 'success')
        window.closeNewDrillModal()
        
        // Scroll to new card
        setTimeout(() => {
          newCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 500)
        
      }, 2000)
    })
  }

  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      const searchInput = document.getElementById('drill-search')
      if (searchInput) {
        searchInput.focus()
        searchInput.select()
      }
    }
    
    // Ctrl/Cmd + N to open new drill modal
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault()
      window.openNewDrillModal()
    }
  })

  // Add intersection observer for lazy loading animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards'
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe drill cards for lazy animation
  document.querySelectorAll('.drill-card').forEach(card => {
    observer.observe(card)
  })
})
