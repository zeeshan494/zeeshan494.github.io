document.addEventListener("DOMContentLoaded", () => {
  // Theme Management (same as main site)
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body
  const themeIcon = themeToggle.querySelector("i")

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark"
  body.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)

  themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    body.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    updateThemeIcon(newTheme)
  })

  function updateThemeIcon(theme) {
    if (theme === "dark") {
      themeIcon.className = "fas fa-sun"
    } else {
      themeIcon.className = "fas fa-moon"
    }
  }

  // Mobile Navigation
  const hamburger = document.getElementById("hamburger")
  const navLinks = document.querySelector(".nav-links")

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navLinks.classList.toggle("active")
    })

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navLinks.classList.remove("active")
      })
    })
  }

  // Cyber Background Effects
  function createBinaryRain() {
    const binaryRain = document.getElementById("binary-rain")
    if (!binaryRain) return

    const chars = "01"
    const columns = Math.floor(window.innerWidth / 20)

    binaryRain.innerHTML = ""

    for (let i = 0; i < columns; i++) {
      const digit = document.createElement("div")
      digit.className = "binary-digit"
      digit.style.left = i * 20 + "px"
      digit.style.animationDelay = Math.random() * 4 + "s"
      digit.textContent = chars[Math.floor(Math.random() * chars.length)]
      binaryRain.appendChild(digit)
    }
  }

  function createNetworkNodes() {
    const networkNodes = document.getElementById("network-nodes")
    if (!networkNodes) return

    const nodeCount = 15
    networkNodes.innerHTML = ""

    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement("div")
      node.className = "network-node"
      node.style.left = Math.random() * 100 + "%"
      node.style.top = Math.random() * 100 + "%"
      node.style.animationDelay = Math.random() * 2 + "s"
      networkNodes.appendChild(node)
    }
  }

  function createDataStreams() {
    const dataStreams = document.getElementById("data-streams")
    if (!dataStreams) return

    const streamCount = 8
    dataStreams.innerHTML = ""

    for (let i = 0; i < streamCount; i++) {
      const stream = document.createElement("div")
      stream.className = "data-stream"
      stream.style.top = Math.random() * 100 + "%"
      stream.style.animationDelay = Math.random() * 3 + "s"
      dataStreams.appendChild(stream)
    }
  }

  // Initialize cyber background effects
  createBinaryRain()
  createNetworkNodes()
  createDataStreams()

  // Blog Functionality

  // Category Filtering
  const categoryFilters = document.querySelectorAll(".category-filter")
  const blogPosts = document.querySelectorAll(".blog-post")

  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", (e) => {
      e.preventDefault()

      // Remove active class from all filters
      categoryFilters.forEach((f) => f.classList.remove("active"))
      // Add active class to clicked filter
      filter.classList.add("active")

      const category = filter.dataset.category

      blogPosts.forEach((post) => {
        if (category === "all" || post.dataset.category === category) {
          post.style.display = "block"
          post.style.animation = "fadeIn 0.5s ease-in-out"
        } else {
          post.style.display = "none"
        }
      })
    })
  })

  // Like Button Functionality
  const likeButtons = document.querySelectorAll(".like-btn")

  likeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const postId = btn.dataset.post
      const likeCount = btn.querySelector(".like-count")
      const currentLikes = Number.parseInt(likeCount.textContent)

      // Check if already liked (stored in localStorage)
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]")

      if (likedPosts.includes(postId)) {
        // Unlike
        likeCount.textContent = currentLikes - 1
        btn.classList.remove("liked")
        const index = likedPosts.indexOf(postId)
        likedPosts.splice(index, 1)
      } else {
        // Like
        likeCount.textContent = currentLikes + 1
        btn.classList.add("liked")
        likedPosts.push(postId)
      }

      localStorage.setItem("likedPosts", JSON.stringify(likedPosts))
    })
  })

  // Load liked posts from localStorage
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]")
  likedPosts.forEach((postId) => {
    const btn = document.querySelector(`[data-post="${postId}"]`)
    if (btn) {
      btn.classList.add("liked")
    }
  })

  // Comment Toggle Functionality
  const commentToggleButtons = document.querySelectorAll(".comment-toggle")

  commentToggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const postId = btn.dataset.post
      const commentsSection = document.getElementById(`comments-${postId}`)

      if (commentsSection.style.display === "none" || !commentsSection.style.display) {
        commentsSection.style.display = "block"
        commentsSection.scrollIntoView({ behavior: "smooth", block: "start" })
      } else {
        commentsSection.style.display = "none"
      }
    })
  })

  // Comment Submission
  const commentSubmitButtons = document.querySelectorAll(".comment-submit")

  commentSubmitButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()

      const postId = btn.dataset.post
      const commentForm = btn.closest(".comment-form")
      const name = commentForm.querySelector(".comment-name").value
      const email = commentForm.querySelector(".comment-email").value
      const text = commentForm.querySelector(".comment-text").value

      if (!name || !email || !text) {
        alert("Please fill in all fields")
        return
      }

      // Create new comment element
      const commentsList = document.querySelector(`#comments-${postId} .comments-list`)
      const newComment = createCommentElement(name, text, "Just now")

      commentsList.insertBefore(newComment, commentsList.firstChild)

      // Update comment count
      const commentCount = document.querySelector(`[data-post="${postId}"] .comment-count`)
      const currentCount = Number.parseInt(commentCount.textContent)
      commentCount.textContent = currentCount + 1

      // Clear form
      commentForm.querySelector(".comment-name").value = ""
      commentForm.querySelector(".comment-email").value = ""
      commentForm.querySelector(".comment-text").value = ""

      // Show success message
      showNotification("Comment posted successfully!", "success")
    })
  })

  // Reply Button Functionality
  const replyButtons = document.querySelectorAll(".reply-btn")

  replyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const commentId = btn.dataset.comment
      const replySection = document.getElementById(`reply-${commentId}`)

      if (replySection) {
        if (replySection.style.display === "none" || !replySection.style.display) {
          replySection.style.display = "block"
        } else {
          replySection.style.display = "none"
        }
      }
    })
  })

  // Share Button Functionality
  const shareButtons = document.querySelectorAll(".share-btn")

  shareButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const postTitle = btn.closest(".blog-post").querySelector(".post-title").textContent
      const postUrl = window.location.href

      if (navigator.share) {
        navigator.share({
          title: postTitle,
          url: postUrl,
        })
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(postUrl).then(() => {
          showNotification("Link copied to clipboard!", "success")
        })
      }
    })
  })

  // Tag Click Functionality
  const tags = document.querySelectorAll(".tag")

  tags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const tagText = tag.textContent.toLowerCase()

      blogPosts.forEach((post) => {
        const postTags = Array.from(post.querySelectorAll(".tag")).map((t) => t.textContent.toLowerCase())

        if (postTags.includes(tagText)) {
          post.style.display = "block"
          post.scrollIntoView({ behavior: "smooth", block: "start" })
        } else {
          post.style.display = "none"
        }
      })

      // Update active filter
      categoryFilters.forEach((f) => f.classList.remove("active"))
    })
  })

  // Helper Functions
  function createCommentElement(name, text, date) {
    const comment = document.createElement("div")
    comment.className = "comment"
    comment.innerHTML = `
      <div class="comment-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author">${name}</span>
          <span class="comment-date">${date}</span>
        </div>
        <p class="comment-body">${text}</p>
        <div class="comment-actions">
          <button class="reply-btn" data-comment="${Date.now()}">Reply</button>
          <button class="like-comment-btn">
            <i class="fas fa-thumbs-up"></i> 0
          </button>
        </div>
      </div>
    `
    return comment
  }

  function showNotification(message, type) {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `

    if (type === "success") {
      notification.style.backgroundColor = "#27ca3f"
    } else if (type === "error") {
      notification.style.backgroundColor = "#ff6b6b"
    }

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  // Search Functionality (if you want to add a search bar later)
  function searchPosts(query) {
    const searchTerm = query.toLowerCase()

    blogPosts.forEach((post) => {
      const title = post.querySelector(".post-title").textContent.toLowerCase()
      const content = post.querySelector(".post-body").textContent.toLowerCase()
      const tags = Array.from(post.querySelectorAll(".tag")).map((t) => t.textContent.toLowerCase())

      if (title.includes(searchTerm) || content.includes(searchTerm) || tags.some((tag) => tag.includes(searchTerm))) {
        post.style.display = "block"
      } else {
        post.style.display = "none"
      }
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const navbar = document.getElementById("navbar")
        const navbarHeight = navbar ? navbar.offsetHeight : 0
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  console.log("🔒 Blog System Initialized")
  console.log("📝 All blog functionality active")
})
