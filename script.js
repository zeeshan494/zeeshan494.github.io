document.addEventListener("DOMContentLoaded", () => {
  // Initialize EmailJS
  emailjs.init("YOUR_PUBLIC_KEY") // You'll need to replace this with your actual EmailJS public key

  // Mobile Navigation
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")

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

  // Sticky Navigation
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar")
    if (window.scrollY > 50) {
      navbar.style.padding = "10px 0"
      navbar.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)"
    } else {
      navbar.style.padding = "15px 0"
      navbar.style.boxShadow = "none"
    }
  })

  // Terminal Typing Effect
  const commands = [
    "whoami",
    "Muhammad Zeeshan - Lead Security Engineer",
    "cat /etc/passwd | grep threats",
    "1000+ threats detected and mitigated",
    "ps aux | grep soc",
    "24/7 SOC monitoring active",
    "nmap -sS target_network",
    "Scanning for vulnerabilities...",
    "tail -f /var/log/security.log",
    "All systems secure ✓",
  ]

  let commandIndex = 0
  let charIndex = 0
  const typingText = document.getElementById("typing-text")
  const terminalOutput = document.getElementById("terminal-output")

  function typeCommand() {
    if (commandIndex < commands.length) {
      const currentCommand = commands[commandIndex]

      if (charIndex < currentCommand.length) {
        typingText.textContent = currentCommand.slice(0, charIndex + 1)
        charIndex++
        setTimeout(typeCommand, 100)
      } else {
        // Command finished typing
        setTimeout(() => {
          if (commandIndex % 2 === 0) {
            // This is a command, show it in output
            const outputLine = document.createElement("div")
            outputLine.innerHTML = `<span style="color: var(--secondary-color)">root@soc:~# </span>${currentCommand}`
            terminalOutput.appendChild(outputLine)
          } else {
            // This is output
            const outputLine = document.createElement("div")
            outputLine.innerHTML = `<span style="color: var(--text-secondary)">${currentCommand}</span>`
            terminalOutput.appendChild(outputLine)
          }

          typingText.textContent = ""
          charIndex = 0
          commandIndex++

          if (commandIndex < commands.length) {
            setTimeout(typeCommand, 1000)
          }
        }, 1000)
      }
    }
  }

  // Start typing effect
  setTimeout(typeCommand, 2000)

  // High-speed rotating numbers
  function createRotatingNumber(element, speed = "medium") {
    const speeds = {
      fast: 50, // 50ms interval
      medium: 100, // 100ms interval
      slow: 200, // 200ms interval
    }

    const interval = speeds[speed] || speeds.medium

    function updateNumber() {
      let randomNum

      if (element.id === "active-threats") {
        randomNum = Math.floor(Math.random() * 10) // 0-9 for active threats
      } else if (element.id === "blocked-ips") {
        randomNum = Math.floor(Math.random() * 999) + 100 // 100-999 for blocked IPs
      } else if (element.dataset.target === "1000") {
        randomNum = Math.floor(Math.random() * 9999) + 1000 // 1000-9999 for threats detected
      } else if (element.dataset.target === "24") {
        randomNum = Math.floor(Math.random() * 24) + 1 // 1-24 for SOC monitoring
      } else if (element.dataset.target === "99") {
        randomNum = Math.floor(Math.random() * 10) + 95 // 95-99 for uptime
      }

      element.textContent = randomNum
    }

    // Start the rotation
    setInterval(updateNumber, interval)
  }

  // Initialize rotating numbers when elements are visible
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Start rotating numbers for stat elements
        if (entry.target.classList.contains("stat-number")) {
          const speed = entry.target.dataset.speed || "medium"
          createRotatingNumber(entry.target, speed)
        }

        // Start rotating numbers for SOC dashboard
        if (entry.target.id === "active-threats" || entry.target.id === "blocked-ips") {
          const speed = entry.target.dataset.speed || "medium"
          createRotatingNumber(entry.target, speed)
        }

        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  function initializeRotatingNumbers() {
    // Observe stat numbers
    document.querySelectorAll(".stat-number").forEach((stat) => {
      stat.style.opacity = "0"
      stat.style.transform = "translateY(20px)"
      stat.style.transition = "all 0.8s ease"
      observer.observe(stat)
    })

    // Observe SOC dashboard numbers
    const activeThreats = document.getElementById("active-threats")
    const blockedIPs = document.getElementById("blocked-ips")

    if (activeThreats) {
      activeThreats.dataset.speed = "fast"
      observer.observe(activeThreats)
    }

    if (blockedIPs) {
      blockedIPs.dataset.speed = "medium"
      observer.observe(blockedIPs)
    }
  }

  // Matrix Background Effect
  function createMatrixEffect() {
    const matrixBg = document.getElementById("matrix-bg")
    const chars = "01"
    const columns = Math.floor(window.innerWidth / 20)

    for (let i = 0; i < columns; i++) {
      const column = document.createElement("div")
      column.style.position = "absolute"
      column.style.left = i * 20 + "px"
      column.style.top = "0"
      column.style.color = "rgba(100, 255, 218, 0.1)"
      column.style.fontSize = "14px"
      column.style.fontFamily = "monospace"
      column.style.animation = `matrixFall ${Math.random() * 3 + 2}s linear infinite`
      column.style.animationDelay = Math.random() * 2 + "s"

      let text = ""
      for (let j = 0; j < 50; j++) {
        text += chars[Math.floor(Math.random() * chars.length)] + "<br>"
      }
      column.innerHTML = text

      matrixBg.appendChild(column)
    }
  }

  // Add matrix fall animation
  const style = document.createElement("style")
  style.textContent = `
    @keyframes matrixFall {
      0% { transform: translateY(-100vh); opacity: 1; }
      100% { transform: translateY(100vh); opacity: 0; }
    }
  `
  document.head.appendChild(style)

  createMatrixEffect()

  // Form Submission with EmailJS
  const contactForm = document.getElementById("contactForm")
  const submitBtn = document.getElementById("submit-btn")
  const formStatus = document.getElementById("form-status")

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Show loading state
      const btnText = submitBtn.querySelector(".btn-text")
      const btnLoading = submitBtn.querySelector(".btn-loading")

      btnText.style.display = "none"
      btnLoading.style.display = "inline-block"
      submitBtn.disabled = true

      // Get form values
      const formData = {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        to_email: "muhammadzeeshan494@gmail.com",
      }

      try {
        // Send email using EmailJS
        // Note: You'll need to set up EmailJS service and get your service ID, template ID, and public key
        const response = await emailjs.send(
          "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
          "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
          formData,
        )

        // Show success message
        formStatus.textContent = "Message sent successfully! I'll get back to you soon."
        formStatus.className = "form-status success"
        formStatus.style.display = "block"

        // Reset form
        contactForm.reset()
      } catch (error) {
        console.error("EmailJS Error:", error)

        // Show error message
        formStatus.textContent = "Failed to send message. Please try again or contact me directly."
        formStatus.className = "form-status error"
        formStatus.style.display = "block"
      } finally {
        // Reset button state
        btnText.style.display = "inline-block"
        btnLoading.style.display = "none"
        submitBtn.disabled = false

        // Hide status message after 5 seconds
        setTimeout(() => {
          formStatus.style.display = "none"
        }, 5000)
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
        const navbarHeight = document.getElementById("navbar").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Animation for skill items
  const skillItems = document.querySelectorAll(".skill-item")
  skillItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`

    // Add click effect
    item.addEventListener("click", () => {
      item.style.transform = "scale(0.95)"
      setTimeout(() => {
        item.style.transform = "translateY(-2px)"
      }, 150)
    })
  })

  // Add active class to nav links based on scroll position
  function highlightNavLink() {
    const sections = document.querySelectorAll("section")
    const navLinks = document.querySelectorAll(".nav-links a")

    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      const navbarHeight = document.getElementById("navbar").offsetHeight

      if (window.scrollY >= sectionTop - navbarHeight - 100) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  }

  window.addEventListener("scroll", highlightNavLink)

  // Threat Feed Animation
  function animateThreatFeed() {
    const feedItems = document.querySelectorAll(".feed-item")
    const threatTypes = ["MALWARE", "PHISHING", "INTRUSION", "DDoS", "RANSOMWARE", "BOTNET"]
    const statuses = [
      { text: "BLOCKED", class: "blocked" },
      { text: "DETECTED", class: "detected" },
      { text: "MITIGATED", class: "blocked" },
    ]

    feedItems.forEach((item, index) => {
      setTimeout(() => {
        const threatType = item.querySelector(".threat-type")
        const threatStatus = item.querySelector(".threat-status")

        const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)]
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

        threatType.textContent = randomThreat
        threatStatus.textContent = randomStatus.text
        threatStatus.className = `threat-status ${randomStatus.class}`

        // Add flash effect
        item.style.backgroundColor = "rgba(100, 255, 218, 0.1)"
        setTimeout(() => {
          item.style.backgroundColor = "transparent"
        }, 500)
      }, index * 1000)
    })
  }

  // Update threat feed every 10 seconds
  setInterval(animateThreatFeed, 10000)

  // Initialize animations
  highlightNavLink()
  initializeRotatingNumbers()

  // Parallax effect for floating icons
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const floatingIcons = document.querySelectorAll(".floating-icon")

    floatingIcons.forEach((icon, index) => {
      const speed = 0.5 + index * 0.1
      icon.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`
    })
  })

  // Add glow effect to profile image on hover
  const profileImage = document.querySelector(".profile-image")
  if (profileImage) {
    profileImage.addEventListener("mouseenter", () => {
      profileImage.style.boxShadow = "0 0 30px rgba(100, 255, 218, 0.6)"
    })

    profileImage.addEventListener("mouseleave", () => {
      profileImage.style.boxShadow = "0 0 20px rgba(100, 255, 218, 0.3)"
    })
  }

  console.log("🔒 Security Portfolio Initialized")
  console.log("👨‍💻 Muhammad Zeeshan - Lead Security Engineer")
  console.log("🛡️ All systems operational")
})
