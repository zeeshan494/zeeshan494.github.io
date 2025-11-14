document.addEventListener("DOMContentLoaded", () => {
  // Theme Management
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
  const hamburger = document.querySelector(".hamburger")
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

  // Sticky Navigation
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar")
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.padding = "10px 0"
        navbar.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)"
      } else {
        navbar.style.padding = "15px 0"
        navbar.style.boxShadow = "none"
      }
    }
  })

  // Enhanced Cybersecurity Background Effects
  function createBinaryRain() {
    const binaryRain = document.getElementById("binary-rain")
    if (!binaryRain) return

    const chars = "01"
    const columns = Math.floor(window.innerWidth / 20)

    // Clear existing content
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

    // Clear existing content
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

    // Clear existing content
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
    if (!typingText || !terminalOutput) return

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
          } else {
            // Reset and start over
            setTimeout(() => {
              terminalOutput.innerHTML = ""
              commandIndex = 0
              charIndex = 0
              typeCommand()
            }, 3000)
          }
        }, 1000)
      }
    }
  }

  // Start typing effect after a delay
  setTimeout(typeCommand, 2000)

  // High-speed rotating numbers
  function createRotatingNumber(element, speed = "medium") {
    if (!element) return

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

    // Start the rotation immediately and then continue at intervals
    updateNumber()
    setInterval(updateNumber, interval)
  }

  // Initialize rotating numbers immediately
  function initializeRotatingNumbers() {
    // Start stat numbers immediately
    document.querySelectorAll(".stat-number").forEach((stat) => {
      const speed = stat.dataset.speed || "medium"
      createRotatingNumber(stat, speed)
    })

    // Start SOC dashboard numbers immediately
    const activeThreats = document.getElementById("active-threats")
    const blockedIPs = document.getElementById("blocked-ips")

    if (activeThreats) {
      activeThreats.dataset.speed = "fast"
      createRotatingNumber(activeThreats, "fast")
    }

    if (blockedIPs) {
      blockedIPs.dataset.speed = "medium"
      createRotatingNumber(blockedIPs, "medium")
    }
  }

  // Matrix Background Effect
  function createMatrixEffect() {
    const matrixBg = document.getElementById("matrix-bg")
    if (!matrixBg) return

    const chars = "01"
    const columns = Math.floor(window.innerWidth / 20)

    // Clear existing content
    matrixBg.innerHTML = ""

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
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submit-btn");
const formStatus = document.getElementById("form-status");

// Initialize EmailJS with your actual public key
if (typeof emailjs !== "undefined") {
  emailjs.init("FA_MjBpdrM92B0AcA"); // Replace with real public key
}

if (contactForm && submitBtn) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Show loading state
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoading = submitBtn.querySelector(".btn-loading");

    if (btnText && btnLoading) {
      btnText.style.display = "none";
      btnLoading.style.display = "inline-block";
    }
    submitBtn.disabled = true;

    // Get form values
    const formData = {
      from_name: document.getElementById("name")?.value || "",
      from_email: document.getElementById("email")?.value || "",
      subject: document.getElementById("subject")?.value || "",
      message: document.getElementById("message")?.value || ""
    };

    try {
      // Send email using EmailJS
      await emailjs.send(
        "service_66fwymv",     // Replace with service ID
        "template_r5e4ngg",    // Replace with template ID
        formData
      );

      // Show success message
      if (formStatus) {
        formStatus.textContent = "Message sent successfully! I'll get back to you soon.";
        formStatus.className = "form-status success";
        formStatus.style.display = "block";
      }

      // Reset form
      contactForm.reset();
    } catch (error) {
      console.error("Email Error:", error);

      // Show error message
      if (formStatus) {
        formStatus.textContent =
          "Failed to send message. Please try again or contact me directly at muhammadzeeshan494@gmail.com";
        formStatus.className = "form-status error";
        formStatus.style.display = "block";
      }
    } finally {
      // Reset button state
      if (btnText && btnLoading) {
        btnText.style.display = "inline-block";
        btnLoading.style.display = "none";
      }
      submitBtn.disabled = false;

      // Hide status message after 5 seconds
      if (formStatus) {
        setTimeout(() => {
          formStatus.style.display = "none";
        }, 5000);
      }
    }
  });
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
      const navbar = document.getElementById("navbar")
      const navbarHeight = navbar ? navbar.offsetHeight : 0

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

  // Enhanced Threat Feed Animation
  function animateThreatFeed() {
    const feedItems = document.querySelectorAll(".feed-item")
    const threatTypes = ["MALWARE", "PHISHING", "INTRUSION", "DDoS", "RANSOMWARE", "BOTNET", "APT", "ZERO-DAY"]
    const statuses = [
      { text: "BLOCKED", class: "blocked" },
      { text: "DETECTED", class: "detected" },
      { text: "MITIGATED", class: "blocked" },
      { text: "QUARANTINED", class: "detected" },
    ]

    feedItems.forEach((item, index) => {
      setTimeout(() => {
        const threatType = item.querySelector(".threat-type")
        const threatStatus = item.querySelector(".threat-status")

        if (threatType && threatStatus) {
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
        }
      }, index * 1000)
    })
  }

  // Update threat feed every 8 seconds
  setInterval(animateThreatFeed, 8000)
  // Start threat feed animation immediately
  animateThreatFeed()

  // Initialize animations immediately
  highlightNavLink()
  initializeRotatingNumbers()

  // Enhanced Parallax effect for floating icons
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const floatingIcons = document.querySelectorAll(".floating-icon")

    floatingIcons.forEach((icon, index) => {
      const speed = 0.5 + index * 0.1
      icon.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`
    })

    // Parallax effect for cyber background elements
    const binaryDigits = document.querySelectorAll(".binary-digit")
    binaryDigits.forEach((digit, index) => {
      const speed = 0.2 + (index % 3) * 0.1
      digit.style.transform = `translateY(${scrolled * speed}px)`
    })
  })

  // Add enhanced glow effect to profile image on hover
  const profileImage = document.querySelector(".profile-image")
  if (profileImage) {
    profileImage.addEventListener("mouseenter", () => {
      profileImage.style.boxShadow = "0 0 30px rgba(100, 255, 218, 0.6)"
      profileImage.style.transform = "scale(1.05)"
    })

    profileImage.addEventListener("mouseleave", () => {
      profileImage.style.boxShadow = "0 0 20px rgba(100, 255, 218, 0.3)"
      profileImage.style.transform = "scale(1)"
    })
  }

  // Resume download tracking
  const resumeDownloadBtn = document.querySelector('a[download="Muhammad_Zeeshan_Resume.pdf"]')
  if (resumeDownloadBtn) {
    resumeDownloadBtn.addEventListener("click", () => {
      console.log("Resume downloaded")
      // You can add analytics tracking here
    })
  }

  // Enhanced security scanning animation
  function createSecurityScanEffect() {
    const scanLines = document.querySelectorAll(".security-scan-line")
    scanLines.forEach((line) => {
      line.style.animation = "securityScan 2s linear infinite"
    })
  }

  // Cyber security status indicators
  function updateSecurityStatus() {
    const statusIndicators = document.querySelectorAll(".status-indicator")
    statusIndicators.forEach((indicator) => {
      // Randomly change status colors to simulate real-time monitoring
      const colors = ["#27ca3f", "#ffc107", "#ff6b6b"]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      indicator.style.backgroundColor = randomColor
    })
  }

  // Update security status every 10 seconds
  setInterval(updateSecurityStatus, 10000)
  // Start security status updates immediately
  updateSecurityStatus()

  // Initialize all effects
  createSecurityScanEffect()

  console.log("🔒 Enhanced Security Portfolio Initialized")
  console.log("👨‍💻 Muhammad Zeeshan - Lead Security Engineer")
  console.log("🛡️ All systems operational with enhanced cyber effects")
  console.log("🌓 Theme switching enabled")
  console.log("🔄 All animations and rotations active")
})
