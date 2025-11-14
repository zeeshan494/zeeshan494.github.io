// Dynamic Blog Loading System
class DynamicBlog {
  constructor() {
    this.posts = []
    this.categories = {}
    this.currentPage = 1
    this.postsPerPage = 6 // Show more posts in card view
    this.currentFilter = "all"
    this.viewMode = "cards" // "cards" or "full"
    this.selectedPost = null

    // Debug flag to help troubleshoot
    this.debug = true

    this.init()
  }

  init() {
    this.loadBlogData()
    this.bindEvents()
    this.loadCyberEffects()
  }

  loadBlogData() {
    try {
      // First try to load from localStorage (which has the full content)
      const localData = JSON.parse(localStorage.getItem("blogData") || '{"posts": [], "categories": {}}')

      // Then try window.blogData (from blog-data.js) as fallback
      if (window.blogData && window.blogData.posts && window.blogData.posts.length > 0) {
        // If both exist, merge them with preference to localStorage for content
        if (localData.posts && localData.posts.length > 0) {
          // Use localStorage data but merge any missing posts from window.blogData
          const localPostIds = localData.posts.map((p) => p.id)
          const missingPosts = window.blogData.posts.filter((p) => !localPostIds.includes(p.id))
          this.posts = [...localData.posts, ...missingPosts]
          this.categories = { ...window.blogData.categories, ...localData.categories }
        } else {
          // Use window.blogData if localStorage is empty
          this.posts = window.blogData.posts
          this.categories = window.blogData.categories
        }
      } else {
        // Fallback to localStorage only
        this.posts = localData.posts || []
        this.categories = localData.categories || {}
      }

      if (this.debug) {
        console.log("Loaded blog posts:", this.posts)
        if (this.posts.length > 0) {
          console.log("First post content length:", this.posts[0].content.length)
          console.log("First post has image:", !!this.posts[0].image)
        }
      }

      this.renderBlog()
    } catch (error) {
      console.error("Error loading blog data:", error)
      this.showNotification("Error loading blog data. Please try refreshing the page.", "error")
    }
  }

  renderBlog() {
    this.renderCategories()
    this.renderRecentPosts()
    this.renderTags()
    this.renderPosts()
    this.renderPagination()

    // Handle images after rendering
    setTimeout(() => {
      this.handleImageErrors()
    }, 100)
  }

  renderCategories() {
    const categoryList = document.getElementById("category-list")
    const totalPosts = this.posts.length

    let categoriesHTML = `
      <li><a href="#" data-category="all" class="category-filter active">All Posts <span class="count">(${totalPosts})</span></a></li>
    `

    const categoryNames = {
      soc: "SOC Operations",
      "threat-hunting": "Threat Hunting",
      "cloud-security": "Cloud Security",
      "ai-security": "AI Security",
      "incident-response": "Incident Response",
      "malware-analysis": "Malware Analysis",
    }

    Object.entries(this.categories).forEach(([category, count]) => {
      const displayName = categoryNames[category] || category
      categoriesHTML += `
        <li><a href="#" data-category="${category}" class="category-filter">${displayName} <span class="count">(${count})</span></a></li>
      `
    })

    categoryList.innerHTML = categoriesHTML
  }

  renderRecentPosts() {
    const recentPosts = document.getElementById("recent-posts")
    const recent = this.posts.slice(0, 5)

    const recentHTML = recent
      .map(
        (post) => `
      <li><a href="#" data-post-id="${post.id}" class="recent-post-link">${post.title}</a></li>
    `,
      )
      .join("")

    recentPosts.innerHTML = recentHTML
  }

  renderTags() {
    const tagCloud = document.getElementById("tag-cloud")
    const allTags = new Set()

    this.posts.forEach((post) => {
      post.tags.forEach((tag) => allTags.add(tag))
    })

    const tagsHTML = Array.from(allTags)
      .map(
        (tag) => `
      <span class="tag" data-tag="${tag}">${tag}</span>
    `,
      )
      .join("")

    tagCloud.innerHTML = tagsHTML
  }

  renderPosts() {
    const blogPosts = document.getElementById("blog-posts")
    const filteredPosts = this.getFilteredPosts()
    const startIndex = (this.currentPage - 1) * this.postsPerPage
    const endIndex = startIndex + this.postsPerPage
    const postsToShow = filteredPosts.slice(startIndex, endIndex)

    if (this.viewMode === "full" && this.selectedPost) {
      // Show single full post
      blogPosts.innerHTML = this.createFullPostHTML(this.selectedPost)
    } else {
      // Show cards
      const postsHTML = postsToShow
        .map((post) => {
          return this.createPostCardHTML({ ...post })
        })
        .join("")
      blogPosts.innerHTML = postsHTML
    }
  }

  createPostCardHTML(post) {
    const categoryNames = {
      soc: "SOC Operations",
      "threat-hunting": "Threat Hunting",
      "cloud-security": "Cloud Security",
      "ai-security": "AI Security",
      "incident-response": "Incident Response",
      "malware-analysis": "Malware Analysis",
    }

    const categoryName = categoryNames[post.category] || post.category
    const readTime = this.calculateReadTime(post.content)
    const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return `
      <article class="blog-post-card" data-category="${post.category}" data-post-id="${post.id}">
        <div class="card-header">
          <div class="card-meta">
            <span class="card-date"><i class="fas fa-calendar"></i> ${formattedDate}</span>
            <span class="card-category ${post.category}">${categoryName}</span>
            <span class="card-read-time"><i class="fas fa-clock"></i> ${readTime} min read</span>
          </div>
          <h2 class="card-title">${post.title}</h2>
        </div>
        
        ${post.image ? `<div class="post-image"><img src="${post.image}" alt="${post.title}" onerror="this.src='/placeholder.svg?height=300&width=500';"></div>` : ""}
        
        <div class="card-content">
          <p class="card-excerpt">${post.excerpt}</p>
          
          <div class="card-tags">
            ${post.tags.map((tag) => `<span class="card-tag">${tag}</span>`).join("")}
          </div>
        </div>
        
        <div class="card-footer">
          <div class="card-author">
            <img src="profile.jpg" alt="Muhammad Zeeshan" class="card-author-avatar">
            <div class="card-author-info">
              <span class="card-author-name">Muhammad Zeeshan</span>
              <span class="card-author-title">Lead Security Engineer</span>
            </div>
          </div>
          
          <div class="card-stats">
            <span class="card-stat">
              <i class="fas fa-heart"></i>
              ${post.likes || 0}
            </span>
            <span class="card-stat">
              <i class="fas fa-comments"></i>
              ${post.comments?.length || 0}
            </span>
            <span class="card-stat">
              <i class="fas fa-eye"></i>
              ${post.views || 0}
            </span>
          </div>
        </div>
      </article>
    `
  }

  createFullPostHTML(post) {
    const categoryNames = {
      soc: "SOC Operations",
      "threat-hunting": "Threat Hunting",
      "cloud-security": "Cloud Security",
      "ai-security": "AI Security",
      "incident-response": "Incident Response",
      "malware-analysis": "Malware Analysis",
    }

    const categoryName = categoryNames[post.category] || post.category
    const readTime = this.calculateReadTime(post.content)
    const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return `
      <button class="back-to-blog" onclick="dynamicBlog.showCardView()">
        <i class="fas fa-arrow-left"></i> Back to Blog
      </button>
      
      <article class="blog-post-full" data-category="${post.category}" id="post-${post.id}">
        <div class="post-header">
          <div class="post-meta">
            <span class="post-date"><i class="fas fa-calendar"></i> ${formattedDate}</span>
            <span class="post-category ${post.category}">${categoryName}</span>
            <span class="read-time"><i class="fas fa-clock"></i> ${readTime} min read</span>
          </div>
          <h1 class="post-title">${post.title}</h1>
          <div class="post-author">
            <img src="profile.jpg" alt="Muhammad Zeeshan" class="author-avatar">
            <div class="author-info">
              <span class="author-name">Muhammad Zeeshan</span>
              <span class="author-title">Lead Security Engineer</span>
            </div>
          </div>
        </div>
        
        ${post.image ? `<div class="post-image"><img src="${post.image}" alt="${post.title}" onerror="this.src='/placeholder.svg?height=400&width=600';"></div>` : ""}
        
        <div class="post-content">
          <p class="post-excerpt">${post.excerpt}</p>
          
          <div class="post-body">
            ${post.content || "No content available."}
          </div>
          
          <div class="post-tags">
            ${post.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
        </div>
        
        <div class="post-actions">
          <button class="like-btn" data-post="${post.id}">
            <i class="fas fa-heart"></i>
            <span class="like-count">${post.likes || 0}</span>
          </button>
          <button class="share-btn" data-post="${post.id}">
            <i class="fas fa-share"></i>
            Share
          </button>
          <button class="comment-toggle" data-post="${post.id}">
            <i class="fas fa-comments"></i>
            <span class="comment-count">${post.comments?.length || 0}</span> Comments
          </button>
        </div>
        
        <div class="comments-section" id="comments-${post.id}">
          <div class="comments-header">
            <h4>Comments (${post.comments?.length || 0})</h4>
          </div>
          
          <div class="comment-form">
            <div class="form-group">
              <input type="text" placeholder="Your Name" class="comment-name" required>
            </div>
            <div class="form-group">
              <input type="email" placeholder="Your Email" class="comment-email" required>
            </div>
            <div class="form-group">
              <textarea placeholder="Write your comment..." class="comment-text" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary comment-submit" data-post="${post.id}">
              Post Comment
            </button>
          </div>
          
          <div class="comments-list">
            ${this.renderComments(post.comments || [])}
          </div>
        </div>
      </article>
    `
  }

  renderComments(comments) {
    return comments
      .map(
        (comment) => `
      <div class="comment">
        <div class="comment-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">${comment.name}</span>
            <span class="comment-date">${new Date(comment.date).toLocaleDateString()}</span>
          </div>
          <p class="comment-body">${comment.text}</p>
          <div class="comment-actions">
            <button class="reply-btn" data-comment="${comment.id}">Reply</button>
            <button class="like-comment-btn">
              <i class="fas fa-thumbs-up"></i> ${comment.likes || 0}
            </button>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200
    const textContent = content.replace(/<[^>]*>/g, "")
    const wordCount = textContent.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  getFilteredPosts() {
    if (this.currentFilter === "all") {
      return this.posts
    }
    return this.posts.filter((post) => post.category === this.currentFilter)
  }

  renderPagination() {
    const pagination = document.getElementById("pagination")

    if (this.viewMode === "full") {
      pagination.style.display = "none"
      return
    }

    pagination.style.display = "flex"

    const filteredPosts = this.getFilteredPosts()
    const totalPages = Math.ceil(filteredPosts.length / this.postsPerPage)

    const prevBtn = document.getElementById("prev-page")
    const nextBtn = document.getElementById("next-page")
    const pageInfo = document.getElementById("pagination-info")

    prevBtn.disabled = this.currentPage === 1
    nextBtn.disabled = this.currentPage === totalPages || totalPages === 0
    pageInfo.textContent = `Page ${this.currentPage} of ${totalPages || 1}`
  }

  showCardView() {
    this.viewMode = "cards"
    this.selectedPost = null
    this.renderPosts()
    this.renderPagination()

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  showFullPost(postId) {
    const post = this.posts.find((p) => p.id === postId)
    if (!post) return

    this.selectedPost = post
    this.viewMode = "full"

    // Increment view count
    post.views = (post.views || 0) + 1
    this.updatePostData()

    this.renderPosts()
    this.renderPagination()

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  bindEvents() {
    // Card click to open full post
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".blog-post-card")
      if (card) {
        const postId = card.dataset.postId
        this.showFullPost(postId)
      }
    })

    // Recent post links
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("recent-post-link")) {
        e.preventDefault()
        const postId = e.target.dataset.postId
        this.showFullPost(postId)
      }
    })

    // Category filtering
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("category-filter")) {
        e.preventDefault()

        // Remove active class from all filters
        document.querySelectorAll(".category-filter").forEach((f) => f.classList.remove("active"))
        e.target.classList.add("active")

        this.currentFilter = e.target.dataset.category
        this.currentPage = 1
        this.showCardView() // Always show cards when filtering
      }
    })

    // Tag filtering
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("tag")) {
        const tag = e.target.dataset.tag
        this.filterByTag(tag)
      }
    })

    // Like functionality
    document.addEventListener("click", (e) => {
      if (e.target.closest(".like-btn")) {
        const btn = e.target.closest(".like-btn")
        const postId = btn.dataset.post
        this.toggleLike(postId, btn)
      }
    })

    // Comment toggle
    document.addEventListener("click", (e) => {
      if (e.target.closest(".comment-toggle")) {
        const btn = e.target.closest(".comment-toggle")
        const postId = btn.dataset.post
        this.toggleComments(postId)
      }
    })

    // Comment submission
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("comment-submit")) {
        const postId = e.target.dataset.post
        this.submitComment(postId, e.target)
      }
    })

    // Share functionality
    document.addEventListener("click", (e) => {
      if (e.target.closest(".share-btn")) {
        const postId = e.target.closest(".share-btn").dataset.post
        this.sharePost(postId)
      }
    })

    // Pagination
    document.getElementById("prev-page").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--
        this.renderPosts()
        this.renderPagination()
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })

    document.getElementById("next-page").addEventListener("click", () => {
      const filteredPosts = this.getFilteredPosts()
      const totalPages = Math.ceil(filteredPosts.length / this.postsPerPage)
      if (this.currentPage < totalPages) {
        this.currentPage++
        this.renderPosts()
        this.renderPagination()
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  }

  filterByTag(tag) {
    // Reset to show all posts with the tag
    this.currentFilter = "all"
    this.currentPage = 1

    // Update category filter UI
    document.querySelectorAll(".category-filter").forEach((f) => f.classList.remove("active"))
    document.querySelector('[data-category="all"]').classList.add("active")

    // Filter posts by tag
    const postsWithTag = this.posts.filter((post) => post.tags.includes(tag))

    // Temporarily override the filtered posts
    this.tempFilteredPosts = postsWithTag
    this.showCardView()

    // Clear temp filter after a short delay
    setTimeout(() => {
      this.tempFilteredPosts = null
    }, 100)
  }

  toggleLike(postId, btn) {
    const likeCount = btn.querySelector(".like-count")
    const currentLikes = Number.parseInt(likeCount.textContent)

    // Check if already liked
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

    // Update the post data
    const post = this.posts.find((p) => p.id === postId)
    if (post) {
      post.likes = Number.parseInt(likeCount.textContent)
      this.updatePostData()
    }
  }

  toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`)
    if (commentsSection.style.display === "none" || !commentsSection.style.display) {
      commentsSection.style.display = "block"
      commentsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      commentsSection.style.display = "none"
    }
  }

  submitComment(postId, btn) {
    const commentForm = btn.closest(".comment-form")
    const name = commentForm.querySelector(".comment-name").value
    const email = commentForm.querySelector(".comment-email").value
    const text = commentForm.querySelector(".comment-text").value

    if (!name || !email || !text) {
      this.showNotification("Please fill in all fields", "error")
      return
    }

    const comment = {
      id: Date.now().toString(),
      name,
      email,
      text,
      date: new Date().toISOString(),
      likes: 0,
    }

    // Add comment to post
    const post = this.posts.find((p) => p.id === postId)
    if (post) {
      if (!post.comments) post.comments = []
      post.comments.unshift(comment)

      // Update UI
      const commentsList = document.querySelector(`#comments-${postId} .comments-list`)
      commentsList.insertAdjacentHTML("afterbegin", this.renderComments([comment]))

      // Update comment count
      const commentCount = document.querySelector(`[data-post="${postId}"] .comment-count`)
      if (commentCount) {
        commentCount.textContent = post.comments.length
      }

      // Clear form
      commentForm.querySelector(".comment-name").value = ""
      commentForm.querySelector(".comment-email").value = ""
      commentForm.querySelector(".comment-text").value = ""

      this.updatePostData()
      this.showNotification("Comment posted successfully!", "success")
    }
  }

  sharePost(postId) {
    const post = this.posts.find((p) => p.id === postId)
    if (!post) return

    const postUrl = `${window.location.origin}${window.location.pathname}#post-${postId}`

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: postUrl,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(postUrl).then(() => {
        this.showNotification("Link copied to clipboard!", "success")
      })
    }
  }

  updatePostData() {
    // Update localStorage
    const blogData = {
      posts: this.posts,
      categories: this.categories,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem("blogData", JSON.stringify(blogData))
  }

  loadCyberEffects() {
    // Same cyber effects as other pages
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

    createBinaryRain()
    createNetworkNodes()
    createDataStreams()
  }

  showNotification(message, type) {
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

  // Helper method to handle image loading errors
  handleImageErrors() {
    document.querySelectorAll(".post-image img, .card-image img").forEach((img) => {
      img.onerror = function () {
        this.src = "/placeholder.svg?height=300&width=500"
        this.alt = "Image could not be loaded"
      }

      // For base64 images that might be too large
      if (img.src.startsWith("data:") && img.src.length > 1000000) {
        // Create a more efficient version of the image
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const tempImg = new Image()
        tempImg.crossOrigin = "anonymous"

        tempImg.onload = () => {
          // Resize large images to reduce memory usage
          const maxWidth = 500
          const maxHeight = 300
          let width = tempImg.width
          let height = tempImg.height

          if (width > maxWidth) {
            height = height * (maxWidth / width)
            width = maxWidth
          }

          if (height > maxHeight) {
            width = width * (maxHeight / height)
            height = maxHeight
          }

          canvas.width = width
          canvas.height = height
          ctx.drawImage(tempImg, 0, 0, width, height)

          try {
            img.src = canvas.toDataURL("image/jpeg", 0.8)
          } catch (e) {
            console.error("Error converting image:", e)
            img.src = "/placeholder.svg?height=300&width=500"
          }
        }

        tempImg.onerror = () => {
          img.src = "/placeholder.svg?height=300&width=500"
        }

        tempImg.src = img.src
      }
    })
  }
}

// Initialize the dynamic blog system
let dynamicBlog
document.addEventListener("DOMContentLoaded", () => {
  dynamicBlog = new DynamicBlog()
})
