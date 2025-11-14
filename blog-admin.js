// Blog Admin Management System
class BlogAdmin {
  constructor() {
    this.posts = JSON.parse(localStorage.getItem("blogPosts") || "[]")
    this.config = JSON.parse(localStorage.getItem("githubConfig") || "{}")
    this.currentPost = null
    this.quill = null
    this.isAuthenticated = localStorage.getItem("adminAuth") === "true"

    this.init()
  }

  init() {
    this.initializeAuth()
    this.initializeEditor()
    this.bindEvents()
    this.loadCyberEffects()
    this.loadAnalytics()

    if (this.isAuthenticated) {
      this.showAdminContent()
      this.loadPosts()
      this.showMainDashboard()
    }
  }

  initializeAuth() {
    const loginModal = document.getElementById("login-modal")
    const loginForm = document.getElementById("login-form")
    const adminContent = document.getElementById("admin-content")

    if (!this.isAuthenticated) {
      loginModal.style.display = "flex"
    } else {
      adminContent.style.display = "block"
    }

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const password = document.getElementById("admin-password").value

      // Simple password check (in production, use proper authentication)
      if (password === "admin123" || password === "zeeshan2025") {
        this.isAuthenticated = true
        localStorage.setItem("adminAuth", "true")
        loginModal.style.display = "none"
        this.showAdminContent()
        this.loadPosts()
      } else {
        this.showNotification("Invalid password!", "error")
      }
    })

    // Logout functionality
    document.getElementById("logout-btn").addEventListener("click", (e) => {
      e.preventDefault()
      this.logout()
    })
  }

  showAdminContent() {
    document.getElementById("admin-content").style.display = "block"
    this.loadGitHubConfig()
  }

  logout() {
    localStorage.removeItem("adminAuth")
    window.location.reload()
  }

  initializeEditor() {
    // Initialize Quill rich text editor
    this.quill = new Quill("#post-content", {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["link", "image"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["clean"],
        ],
      },
      placeholder: "Write your blog post content here...",
    })
  }

  bindEvents() {
    // Navigation buttons
    document.getElementById("new-post-btn").addEventListener("click", () => this.showEditor())
    document.getElementById("manage-posts-btn").addEventListener("click", () => this.showPostsManagement())
    document.getElementById("github-sync-btn").addEventListener("click", () => this.syncToGitHub())

    // Editor buttons
    document.getElementById("save-draft-btn").addEventListener("click", () => this.savePost("draft"))
    document.getElementById("publish-post-btn").addEventListener("click", () => this.savePost("published"))
    document.getElementById("cancel-edit-btn").addEventListener("click", () => this.cancelEdit())

    // GitHub config
    document.getElementById("save-config-btn").addEventListener("click", () => this.saveGitHubConfig())

    // Image upload
    document.getElementById("post-image").addEventListener("change", (e) => this.handleImageUpload(e))

    // Search and filter
    document.getElementById("search-posts").addEventListener("input", (e) => this.filterPosts())
    document.getElementById("status-filter").addEventListener("change", (e) => this.filterPosts())
  }

  showEditor(post = null) {
    this.currentPost = post

    // Hide other sections
    document.getElementById("posts-management").style.display = "none"
    document.getElementById("github-config").style.display = "none"
    document.getElementById("analytics-dashboard").style.display = "none"

    // Show the editor
    const editorSection = document.getElementById("post-editor")
    editorSection.style.display = "block"

    if (post) {
      document.getElementById("editor-title").textContent = "Edit Post"
      this.populateEditor(post)
    } else {
      document.getElementById("editor-title").textContent = "Create New Post"
      this.clearEditor()
    }

    // Scroll to editor
    editorSection.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  showPostsManagement() {
    // Hide other sections
    document.getElementById("post-editor").style.display = "none"
    document.getElementById("github-config").style.display = "none"
    document.getElementById("analytics-dashboard").style.display = "none"

    // Show posts management
    document.getElementById("posts-management").style.display = "block"
    this.renderPostsTable()
  }

  showMainDashboard() {
    // Hide other sections
    document.getElementById("post-editor").style.display = "none"
    document.getElementById("posts-management").style.display = "none"

    // Show main sections
    document.getElementById("github-config").style.display = "block"
    document.getElementById("analytics-dashboard").style.display = "block"
  }

  populateEditor(post) {
    document.getElementById("post-id").value = post.id
    document.getElementById("post-title").value = post.title
    document.getElementById("post-category").value = post.category
    document.getElementById("post-excerpt").value = post.excerpt
    document.getElementById("post-tags").value = post.tags.join(", ")
    document.getElementById("post-status").value = post.status

    this.quill.root.innerHTML = post.content

    if (post.image) {
      const preview = document.getElementById("image-preview")
      preview.innerHTML = `<img src="${post.image}" alt="Featured image">`
    }
  }

  clearEditor() {
    document.getElementById("post-form").reset()
    document.getElementById("post-id").value = ""
    this.quill.root.innerHTML = ""

    const preview = document.getElementById("image-preview")
    preview.innerHTML = '<i class="fas fa-image"></i><span>Click to upload image</span>'
  }

  cancelEdit() {
    this.showPostsManagement()
  }

  handleImageUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = document.getElementById("image-preview")
      preview.innerHTML = `<img src="${e.target.result}" alt="Featured image">`
    }
    reader.readAsDataURL(file)
  }

  savePost(status) {
    const form = document.getElementById("post-form")
    const formData = new FormData(form)

    const title = document.getElementById("post-title").value
    const category = document.getElementById("post-category").value
    const excerpt = document.getElementById("post-excerpt").value
    const tags = document
      .getElementById("post-tags")
      .value.split(",")
      .map((tag) => tag.trim())
    const content = this.quill.root.innerHTML
    const postId = document.getElementById("post-id").value
    const imageFile = document.getElementById("post-image").files[0]

    if (!title || !category || !content) {
      this.showNotification("Please fill in all required fields!", "error")
      return
    }

    let imageUrl = ""
    if (imageFile) {
      // Convert image to base64 for storage
      const reader = new FileReader()
      reader.onload = (e) => {
        imageUrl = e.target.result
        this.savePostData(postId, title, category, excerpt, tags, content, status, imageUrl)
      }
      reader.readAsDataURL(imageFile)
    } else {
      // Use existing image if editing
      if (this.currentPost && this.currentPost.image) {
        imageUrl = this.currentPost.image
      }
      this.savePostData(postId, title, category, excerpt, tags, content, status, imageUrl)
    }
  }

  savePostData(postId, title, category, excerpt, tags, content, status, imageUrl) {
    // Process image if it's a base64 string and too large
    let processedImageUrl = imageUrl

    if (imageUrl && imageUrl.startsWith("data:") && imageUrl.length > 500000) {
      // Compress the image
      processedImageUrl = this.compressImage(imageUrl)
    }

    const post = {
      id: postId || this.generateId(),
      title,
      category,
      excerpt,
      tags,
      content,
      status,
      image: processedImageUrl,
      date: postId ? this.currentPost.date : new Date().toISOString(),
      lastModified: new Date().toISOString(),
      views: postId ? this.currentPost.views : 0,
      likes: postId ? this.currentPost.likes : 0,
      comments: postId ? this.currentPost.comments : [],
    }

    if (postId) {
      // Update existing post
      const index = this.posts.findIndex((p) => p.id === postId)
      this.posts[index] = post
    } else {
      // Add new post
      this.posts.unshift(post)
    }

    this.savePosts()
    this.showNotification(`Post ${status === "published" ? "published" : "saved as draft"} successfully!`, "success")
    this.showPostsManagement()
    this.loadAnalytics()
  }

  // Add a new method to compress images
  compressImage(base64Image) {
    try {
      // Create a temporary image element
      const img = document.createElement("img")
      img.src = base64Image

      // Create a canvas to draw the resized image
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      // Set maximum dimensions
      const maxWidth = 800
      const maxHeight = 600

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = height * (maxWidth / width)
        width = maxWidth
      }

      if (height > maxHeight) {
        width = width * (maxHeight / height)
        height = maxHeight
      }

      // Set canvas dimensions and draw the resized image
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      // Convert canvas to compressed base64 image
      return canvas.toDataURL("image/jpeg", 0.7)
    } catch (error) {
      console.error("Error compressing image:", error)
      return base64Image // Return original if compression fails
    }
  }

  generateId() {
    return "post_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  }

  savePosts() {
    localStorage.setItem("blogPosts", JSON.stringify(this.posts))
    this.generateBlogData()
  }

  generateBlogData() {
    // Generate FULL blog data for local viewing (no content truncation)
    const blogData = {
      posts: this.posts.filter((post) => post.status === "published"),
      categories: this.getCategoryCounts(),
      lastUpdated: new Date().toISOString(),
    }

    // Save full data locally for the blog page
    localStorage.setItem("blogData", JSON.stringify(blogData))
  }

  getCategoryCounts() {
    const counts = {}
    this.posts
      .filter((post) => post.status === "published")
      .forEach((post) => {
        counts[post.category] = (counts[post.category] || 0) + 1
      })
    return counts
  }

  loadPosts() {
    this.renderPostsTable()
  }

  renderPostsTable() {
    const tbody = document.getElementById("posts-table-body")
    const filteredPosts = this.getFilteredPosts()

    tbody.innerHTML = ""

    filteredPosts.forEach((post) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>
          <div class="post-title-cell">
            <strong>${post.title}</strong>
            <small>${post.excerpt.substring(0, 50)}...</small>
          </div>
        </td>
        <td>
          <span class="category-badge ${post.category}">${this.getCategoryName(post.category)}</span>
        </td>
        <td>
          <span class="status-badge ${post.status}">${post.status}</span>
        </td>
        <td>${new Date(post.date).toLocaleDateString()}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-small btn-primary" onclick="blogAdmin.editPost('${post.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-small btn-secondary" onclick="blogAdmin.duplicatePost('${post.id}')">
              <i class="fas fa-copy"></i>
            </button>
            <button class="btn-small btn-accent" onclick="blogAdmin.deletePost('${post.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `
      tbody.appendChild(row)
    })
  }

  getFilteredPosts() {
    const statusFilter = document.getElementById("status-filter").value
    const searchTerm = document.getElementById("search-posts").value.toLowerCase()

    return this.posts.filter((post) => {
      const matchesStatus = statusFilter === "all" || post.status === statusFilter
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm) || post.excerpt.toLowerCase().includes(searchTerm)
      return matchesStatus && matchesSearch
    })
  }

  filterPosts() {
    this.renderPostsTable()
  }

  getCategoryName(category) {
    const names = {
      soc: "SOC Operations",
      "threat-hunting": "Threat Hunting",
      "cloud-security": "Cloud Security",
      "ai-security": "AI Security",
      "incident-response": "Incident Response",
      "malware-analysis": "Malware Analysis",
    }
    return names[category] || category
  }

  editPost(postId) {
    const post = this.posts.find((p) => p.id === postId)
    if (post) {
      this.showEditor(post)
    }
  }

  duplicatePost(postId) {
    const post = this.posts.find((p) => p.id === postId)
    if (post) {
      const duplicatedPost = {
        ...post,
        id: this.generateId(),
        title: post.title + " (Copy)",
        status: "draft",
        date: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: [],
      }
      this.posts.unshift(duplicatedPost)
      this.savePosts()
      this.renderPostsTable()
      this.showNotification("Post duplicated successfully!", "success")
    }
  }

  deletePost(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
      this.posts = this.posts.filter((p) => p.id !== postId)
      this.savePosts()
      this.renderPostsTable()
      this.loadAnalytics()
      this.showNotification("Post deleted successfully!", "success")
    }
  }

  loadGitHubConfig() {
    if (this.config.token) {
      document.getElementById("github-token").value = this.config.token
    }
    if (this.config.repo) {
      document.getElementById("github-repo").value = this.config.repo
    }
    if (this.config.branch) {
      document.getElementById("github-branch").value = this.config.branch
    }
  }

  saveGitHubConfig() {
    this.config = {
      token: document.getElementById("github-token").value,
      repo: document.getElementById("github-repo").value,
      branch: document.getElementById("github-branch").value,
    }

    localStorage.setItem("githubConfig", JSON.stringify(this.config))
    this.showNotification("GitHub configuration saved!", "success")
  }

  async syncToGitHub() {
    if (!this.config.token || !this.config.repo) {
      this.showNotification("Please configure GitHub settings first!", "error")
      return
    }

    try {
      this.showNotification("Syncing to GitHub...", "info")

      // Get the FULL blog data for GitHub (no truncation for local storage)
      const fullBlogData = JSON.parse(localStorage.getItem("blogData") || '{"posts": [], "categories": {}}')

      // Create a simplified version for GitHub sync only if needed
      const githubBlogData = {
        ...fullBlogData,
        posts: fullBlogData.posts.map((post) => ({
          ...post,
          // Only truncate content for GitHub if it's extremely large
          content: post.content.length > 10000 ? this.cleanContentForSync(post.content) : post.content,
          // Convert base64 images to placeholder for GitHub
          image: post.image && post.image.startsWith("data:") ? "/placeholder.svg?height=400&width=600" : post.image,
        })),
      }

      // Create the content for blog-data.js
      const blogDataContent = `// Auto-generated blog data
window.blogData = ${JSON.stringify(githubBlogData, null, 2)};`

      // Check content size before encoding
      const contentSize = new Blob([blogDataContent]).size
      console.log(`Content size: ${contentSize} bytes`)

      if (contentSize > 1000000) {
        // 1MB limit - create a more aggressive truncation
        const truncatedData = {
          ...githubBlogData,
          posts: githubBlogData.posts.map((post) => ({
            ...post,
            content: this.cleanContentForSync(post.content),
            excerpt: post.excerpt.substring(0, 200),
          })),
        }

        const truncatedContent = `// Auto-generated blog data (truncated for GitHub)
window.blogData = ${JSON.stringify(truncatedData, null, 2)};`

        this.showNotification("Content was truncated for GitHub sync. Full content available locally.", "info")
        return this.uploadToGitHub(truncatedContent)
      }

      return this.uploadToGitHub(blogDataContent)
    } catch (error) {
      console.error("GitHub sync error:", error)
      this.showNotification(`Failed to sync to GitHub: ${error.message}`, "error")
    }
  }

  async uploadToGitHub(content) {
    // Get current file SHA
    const currentSha = await this.getFileSha("blog-data.js")

    // GitHub API call to update the file
    const response = await fetch(`https://api.github.com/repos/${this.config.repo}/contents/blog-data.js`, {
      method: "PUT",
      headers: {
        Authorization: `token ${this.config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Update blog data - ${new Date().toISOString()}`,
        content: btoa(unescape(encodeURIComponent(content))), // Better encoding for special characters
        branch: this.config.branch,
        ...(currentSha && { sha: currentSha }),
      }),
    })

    const responseData = await response.json()

    if (response.ok) {
      this.showNotification("Successfully synced to GitHub!", "success")
      console.log("GitHub sync successful:", responseData)
    } else {
      console.error("GitHub API Error:", responseData)
      throw new Error(`GitHub API Error: ${responseData.message || "Unknown error"}`)
    }
  }

  // Updated content cleaning method - less aggressive
  cleanContentForSync(content) {
    if (!content) return ""

    // Remove excessive whitespace but preserve formatting
    let cleaned = content
      .replace(/\s{3,}/g, " ") // Replace 3+ spaces with single space
      .replace(/\n\s*\n\s*\n/g, "\n\n") // Remove excessive line breaks
      .trim()

    // Only truncate if absolutely necessary and add proper ending
    if (cleaned.length > 8000) {
      // Find a good breaking point (end of paragraph or sentence)
      let truncateAt = 7500
      const lastParagraph = cleaned.lastIndexOf("</p>", truncateAt)
      const lastSentence = cleaned.lastIndexOf(".", truncateAt)

      if (lastParagraph > 6000) {
        truncateAt = lastParagraph + 4
      } else if (lastSentence > 6000) {
        truncateAt = lastSentence + 1
      }

      cleaned = cleaned.substring(0, truncateAt) + "...</p><p><em>Read the full article on the website.</em></p>"
    }

    return cleaned
  }

  async getFileSha(filename) {
    try {
      const response = await fetch(`https://api.github.com/repos/${this.config.repo}/contents/${filename}`, {
        headers: {
          Authorization: `token ${this.config.token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.sha
      } else if (response.status === 404) {
        console.log("File does not exist, will create new")
        return null
      } else {
        const errorData = await response.json()
        console.error("Error getting file SHA:", errorData)
        throw new Error(`Failed to get file SHA: ${errorData.message}`)
      }
    } catch (error) {
      console.log("Error getting file SHA:", error.message)
      return null
    }
  }

  loadAnalytics() {
    const totalPosts = this.posts.length
    const totalViews = this.posts.reduce((sum, post) => sum + (post.views || 0), 0)
    const totalLikes = this.posts.reduce((sum, post) => sum + (post.likes || 0), 0)
    const totalComments = this.posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)

    document.getElementById("total-posts").textContent = totalPosts
    document.getElementById("total-views").textContent = totalViews
    document.getElementById("total-likes").textContent = totalLikes
    document.getElementById("total-comments").textContent = totalComments
  }

  loadCyberEffects() {
    // Same cyber effects as main site
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
    } else if (type === "info") {
      notification.style.backgroundColor = "#64ffda"
      notification.style.color = "#0a192f"
    }

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
}

// Initialize the blog admin system
let blogAdmin
document.addEventListener("DOMContentLoaded", () => {
  blogAdmin = new BlogAdmin()
})
