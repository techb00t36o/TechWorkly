// Mock worker data for development and testing.
// Each worker has a slug that maps to the /workers/:slug route.
// Full profiles include: stats, financials, bio, skills, gigs, pods, contracts, reviews.
export const workers = [
  {
    slug: "elena-r",
    name: "Elena R.",
    fullName: "Dr. Elena Rostova",
    title: "Distributed Systems Architect",
    tagline: "Public bio / profile, private self.",
    avatar: "https://i.pravatar.cc/300?img=32",
    bannerGradient: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900",
    gridPattern: true,
    status: "AVAILABLE",
    statusColor: "bg-emerald-500",
    ledgerNode: true,
    viewSwitcher: "default",
    availableFor: ["Pods", "Solo", "Gigs"],
    verified: [
      { label: "ID & Biometrics", icon: "check" },
      { label: "Top 1% Architect", icon: "check" }
    ],
    location: "Berlin, Germany",
    languages: ["English (Fluent)", "German (Conversational)", "Russian (Native)"],
    timezone: "UTC+1 (CET)",
    pGPKey: "21F3 8E72 9A1B C4D5 E6F7 0823 4567 89AB CDEF 0123",
    experience: "12+ years in distributed systems architecture across fintech and infrastructure domains",
    externalLinks: [
      { platform: "GitHub", url: "https://github.com/erostova" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/erostova" },
      { platform: "Personal Site", url: "https://erostova.dev" }
    ],
    stats: {
      jobsCompleted: { value: 23, change: "+2 this month" },
      podsAndSquads: { value: 8, label: "Pods formed" },
      activeGigs: { value: 3, label: "Fixed-price" },
      escrowClearance: { value: "$28,000", sub: "in escrow" },
      responseTime: { value: "< 2 hrs", sub: "avg response" },
      overallRating: { value: "4.7", label: "Top 1% of architects" }
    },
    financials: {
      public: { tier: "Tier 1 Institutional Liquidity Profile", escrowReady: true },
      worker: {
        earningsTotal: "$148,000.00",
        escrowClearance: "$28,000",
        pendingPayouts: "$8,250",
        gigRates: "$1,200 – $4,800",
        retainer: "€5,500/mo",
        availableBalance: "$22,180",
        withdrawalOptions: ["USDT (TRC-20)", "SWIFT Wire", "Local Bank"],
        withdrawFee: "0%",
        lastWithdrawal: "2026-03-15",
        accountType: "Business",
        tier: "Tier 1",
        jurisdiction: "Berlin, Germany",
        linkedEntity: "Rostova Systems GmbH",
        lastKYC: "2026-02-10",
        taxDocuments: "2025",
        documentsExempt: false,
        taxDocsLastVerified: "2026-01-20",
        jurisdictionUpdate: "2026-03-01",
        documentsVerified: true
      }
    },
    bio: {
      overview: "Architect of resilient, high-throughput distributed systems. Specializing in consensus protocols, event-driven architectures, and infrastructure that scales under pressure.",
      highlights: [
        "Architected distributed ledger platform processing 50K TPS",
        "Reduced system latency by 40% across 3 data centers",
        "Open-source contributor to consensus protocol libraries"
      ]
    },
    skills: [
      { name: "TypeScript", benchmark: 95, category: "Language" },
      { name: "Next.js", benchmark: 92, category: "Framework" },
      { name: "React", benchmark: 96, category: "Framework" },
      { name: "Node.js", benchmark: 90, category: "Runtime" },
      { name: "PostgreSQL", benchmark: 88, category: "Database" },
      { name: "Kubernetes", benchmark: 85, category: "Infrastructure" }
    ],
    gigs: [
      {
        id: "gig-1",
        title: "Architecture Review",
        description: "Comprehensive review of your system with actionable recommendations for scalability and performance.",
        price: "$2,400",
        deliveryTime: "5 business days",
        includes: ["Architecture audit report", "Performance bottleneck analysis", "Scalability roadmap", "30-min follow-up call"],
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop"
      },
      {
        id: "gig-2",
        title: "Microservices Migration Blueprint",
        description: "Detailed migration plan from monolith to microservices, including service boundaries and deployment strategy.",
        price: "$3,600",
        deliveryTime: "7 business days",
        includes: ["Service decomposition map", "Data migration strategy", "CI/CD pipeline design", "Risk assessment matrix"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
      }
    ],
    pods: [
      {
        name: "Quantum Ledger Initiative",
        role: "Pod Lead",
        period: "Jan 2025 – Dec 2025",
        members: 8,
        status: "Completed",
        description: "Built distributed ledger platform with 50K TPS throughput",
        escrowStatus: "Fully Released",
        rating: 5.0
      }
    ],
    soloContracts: [
      {
        client: "Meridian Bank",
        project: "Core Banking System Redesign",
        period: "Aug 2023 – Jan 2024",
        rating: 5.0,
        value: "$32,000"
      }
    ],
    reviews: {
      overall: 4.7,
      distribution: { 5: 18, 4: 5, 3: 0, 2: 0, 1: 0 },
      breakdown: {
        pod: { rating: 4.8, count: 10 },
        solo: { rating: 4.6, count: 8 },
        gig: { rating: 4.7, count: 5 }
      },
      recent: [
        { author: "Alex M.", role: "CTO, QuantumFin", rating: 5.0, date: "2026-03-10", text: "Exceptional architect. Elena delivered a distributed system that exceeded all performance benchmarks.", project: "Quantum Ledger Initiative" },
        { author: "Sarah K.", role: "VP Engineering, TradeFlow", rating: 4.6, date: "2026-02-15", text: "Elena's microservices migration blueprint saved us months of trial and error.", project: "FinCORE Migration" }
      ]
    },
    caseStudies: [
      {
        title: "High-Frequency Trading Engine",
        subtitle: "Architecture Benchmark",
        metrics: [
          { label: "Latency", value: "< 50μs" },
          { label: "Throughput", value: "100K TPS" },
          { label: "Uptime", value: "99.999%" }
        ]
      }
    ],
    engagementTerms: {
      hourlyRate: "$180/hr",
      podRetainer: "€5,500/mo",
      minAllocation: "20 hrs/week",
      maxAllocation: "40 hrs/week"
    }
  },
  {
    slug: "marcus-t",
    name: "Marcus T.",
    fullName: "Marcus Thompson",
    title: "Web Security Engineer",
    tagline: "Breaking systems to make them stronger.",
    avatar: "https://i.pravatar.cc/300?img=12",
    bannerGradient: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900",
    gridPattern: true,
    status: "AVAILABLE",
    statusColor: "bg-emerald-500",
    ledgerNode: true,
    viewSwitcher: "default",
    availableFor: ["Pods", "Solo"],
    verified: [
      { label: "ID & Biometrics", icon: "check" }
    ],
    location: "New York, USA",
    languages: ["English (Fluent)"],
    timezone: "UTC-5 (EST)",
    pGPKey: "B2C3 D4E5 F6A7 8901 2345 6789 ABCD EF01 2345 6789",
    experience: "8+ years in web application security and penetration testing",
    externalLinks: [
      { platform: "GitHub", url: "https://github.com/mthompson" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/mthompson" }
    ],
    stats: {
      jobsCompleted: { value: 11, change: "+1 this month" },
      podsAndSquads: { value: 3, label: "Pods formed" },
      activeGigs: { value: 2, label: "Fixed-price" },
      escrowClearance: { value: "$19,000", sub: "in escrow" },
      responseTime: { value: "< 6 hrs", sub: "avg response" },
      overallRating: { value: "4.5", label: "Top 10% of security engineers" }
    },
    financials: {
      public: { tier: "Tier 3 Liquidity Profile", escrowReady: true },
      worker: {
        earningsTotal: "$72,000.00",
        escrowClearance: "$19,000",
        pendingPayouts: "$4,500",
        gigRates: "$800 – $2,400",
        retainer: "€3,200/mo",
        availableBalance: "$12,800",
        withdrawalOptions: ["USDT (TRC-20)", "SWIFT Wire"],
        withdrawFee: "0%",
        lastWithdrawal: "2026-03-08",
        accountType: "Individual",
        tier: "Tier 3",
        jurisdiction: "New York, USA",
        linkedEntity: "Thompson Security LLC",
        lastKYC: "2026-01-20",
        taxDocuments: "2025",
        documentsExempt: false,
        taxDocsLastVerified: "2026-02-15",
        jurisdictionUpdate: "2026-02-20",
        documentsVerified: true
      }
    },
    bio: {
      overview: "Security engineer specializing in web application penetration testing, vulnerability assessment, and security architecture reviews.",
      highlights: [
        "Discovered critical vulnerabilities in 3 Fortune 500 platforms",
        "Conducted 50+ penetration tests across fintech and healthcare",
        "Bug bounty hunter with $180K in rewards"
      ]
    },
    skills: [
      { name: "XSS", benchmark: 95, category: "Attack" },
      { name: "Recon", benchmark: 92, category: "Reconnaissance" },
      { name: "Burp Suite", benchmark: 90, category: "Tool" },
      { name: "OWASP", benchmark: 94, category: "Framework" },
      { name: "Python", benchmark: 85, category: "Language" },
      { name: "Network Security", benchmark: 88, category: "Infrastructure" }
    ],
    gigs: [
      {
        id: "gig-1",
        title: "Web App Penetration Test",
        description: "Comprehensive security assessment of your web application with detailed remediation guidance.",
        price: "$1,800",
        deliveryTime: "7 business days",
        includes: ["Full pentest report", "CVSS scoring", "Remediation guide", "Retest"],
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop"
      }
    ],
    pods: [
      {
        name: "FinCORE Security Audit",
        role: "Specialist",
        period: "Mar 2024 – Sep 2024",
        members: 5,
        status: "Completed",
        description: "Comprehensive security audit for financial platform",
        escrowStatus: "Fully Released",
        rating: 4.5
      }
    ],
    soloContracts: [
      {
        client: "MedSecure",
        project: "HIPAA Compliance Assessment",
        period: "Jan 2024 – Apr 2024",
        rating: 4.6,
        value: "$15,000"
      }
    ],
    reviews: {
      overall: 4.5,
      distribution: { 5: 7, 4: 4, 3: 0, 2: 0, 1: 0 },
      breakdown: {
        pod: { rating: 4.5, count: 5 },
        solo: { rating: 4.4, count: 4 },
        gig: { rating: 4.6, count: 2 }
      },
      recent: [
        { author: "James L.", role: "CTO, MedSecure", rating: 4.6, date: "2026-03-05", text: "Marcus found vulnerabilities we had missed for years. His report was thorough and actionable.", project: "HIPAA Compliance Assessment" }
      ]
    },
    caseStudies: [
      {
        title: "Healthcare Platform Security",
        subtitle: "Security Benchmark",
        metrics: [
          { label: "Vulns Found", value: "23" },
          { label: "Critical", value: "4" },
          { label: "Remediated", value: "100%" }
        ]
      }
    ],
    engagementTerms: {
      hourlyRate: "$150/hr",
      podRetainer: "€3,200/mo",
      minAllocation: "16 hrs/week",
      maxAllocation: "40 hrs/week"
    }
  },
  {
    slug: "amina-k",
    name: "Amina K.",
    fullName: "Amina Khalid",
    title: "Full-Stack Developer",
    tagline: "Shipping production-ready code daily.",
    avatar: "https://i.pravatar.cc/300?img=47",
    bannerGradient: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900",
    gridPattern: true,
    status: "AVAILABLE",
    statusColor: "bg-emerald-500",
    ledgerNode: true,
    viewSwitcher: "default",
    availableFor: ["Pods", "Solo", "Gigs"],
    verified: [
      { label: "ID & Biometrics", icon: "check" }
    ],
    location: "Toronto, Canada",
    languages: ["English (Fluent)", "Arabic (Native)"],
    timezone: "UTC-5 (EST)",
    pGPKey: "C3D4 E5F6 A7B8 9012 3456 789A BCDE F012 3456 7890",
    experience: "7+ years building full-stack applications with React and Node.js",
    externalLinks: [
      { platform: "GitHub", url: "https://github.com/akhalid" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/akhalid" }
    ],
    stats: {
      jobsCompleted: { value: 42, change: "+4 this month" },
      podsAndSquads: { value: 10, label: "Pods formed" },
      activeGigs: { value: 5, label: "Fixed-price" },
      escrowClearance: { value: "$48,000", sub: "in escrow" },
      responseTime: { value: "< 3 hrs", sub: "avg response" },
      overallRating: { value: "4.9", label: "Top 5% of developers" }
    },
    financials: {
      public: { tier: "Tier 2 Liquidity Profile", escrowReady: true },
      worker: {
        earningsTotal: "$198,000.00",
        escrowClearance: "$48,000",
        pendingPayouts: "$12,000",
        gigRates: "$800 – $3,200",
        retainer: "€4,800/mo",
        availableBalance: "$35,200",
        withdrawalOptions: ["USDT (TRC-20)", "SWIFT Wire", "Local Bank"],
        withdrawFee: "0%",
        lastWithdrawal: "2026-03-12",
        accountType: "Business",
        tier: "Tier 2",
        jurisdiction: "Toronto, Canada",
        linkedEntity: "Khalid Dev Inc",
        lastKYC: "2026-02-05",
        taxDocuments: "2025",
        documentsExempt: false,
        taxDocsLastVerified: "2026-01-30",
        jurisdictionUpdate: "2026-03-05",
        documentsVerified: true
      }
    },
    bio: {
      overview: "Full-stack developer specializing in React, Node.js, and API design. Passionate about building performant, accessible web applications.",
      highlights: [
        "Built SaaS platform serving 100K+ active users",
        "Reduced load times by 60% through code splitting and optimization",
        "Led frontend architecture for e-commerce platform doing $5M/year"
      ]
    },
    skills: [
      { name: "React", benchmark: 96, category: "Framework" },
      { name: "Node.js", benchmark: 93, category: "Runtime" },
      { name: "TypeScript", benchmark: 91, category: "Language" },
      { name: "API Design", benchmark: 89, category: "Architecture" },
      { name: "PostgreSQL", benchmark: 86, category: "Database" },
      { name: "AWS", benchmark: 84, category: "Cloud" }
    ],
    gigs: [
      {
        id: "gig-1",
        title: "React Performance Audit",
        description: "Identify and fix performance bottlenecks in your React application with actionable recommendations.",
        price: "$1,200",
        deliveryTime: "3 business days",
        includes: ["Performance audit report", "Bundle analysis", "Render optimization guide", "15-min follow-up"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
      },
      {
        id: "gig-2",
        title: "API Design & Build",
        description: "Design and build a RESTful or GraphQL API for your application with authentication and documentation.",
        price: "$2,400",
        deliveryTime: "5 business days",
        includes: ["API specification", "Implementation", "Auth setup", "Swagger docs"],
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop"
      },
      {
        id: "gig-3",
        title: "SaaS MVP Build",
        description: "Full-stack MVP with React frontend, Node.js backend, and PostgreSQL database — ready to launch.",
        price: "$4,800",
        deliveryTime: "14 business days",
        includes: ["Responsive frontend", "REST API", "Database schema", "Deployment setup"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
      }
    ],
    pods: [
      {
        name: "FinCORE Platform",
        role: "Pod Lead",
        period: "Jun 2025 – Nov 2025",
        members: 6,
        status: "Completed",
        description: "Built full-stack fintech dashboard with real-time analytics",
        escrowStatus: "Fully Released",
        rating: 5.0
      },
      {
        name: "E-Commerce Rebuild",
        role: "Specialist",
        period: "Jan 2025 – May 2025",
        members: 4,
        status: "Completed",
        description: "Frontend rebuild for major e-commerce platform",
        escrowStatus: "Fully Released",
        rating: 4.9
      }
    ],
    soloContracts: [
      {
        client: "TechStart",
        project: "SaaS Dashboard MVP",
        period: "Mar 2024 – Jul 2024",
        rating: 5.0,
        value: "$24,000"
      },
      {
        client: "HealthApp",
        project: "Patient Portal",
        period: "Aug 2023 – Dec 2023",
        rating: 4.8,
        value: "$18,000"
      }
    ],
    reviews: {
      overall: 4.9,
      distribution: { 5: 35, 4: 7, 3: 0, 2: 0, 1: 0 },
      breakdown: {
        pod: { rating: 5.0, count: 20 },
        solo: { rating: 4.9, count: 14 },
        gig: { rating: 4.8, count: 8 }
      },
      recent: [
        { author: "Tom H.", role: "CEO, TechStart", rating: 5.0, date: "2026-03-01", text: "Amina delivered our MVP ahead of schedule. Her code quality and communication are exceptional.", project: "SaaS Dashboard MVP" },
        { author: "Lisa W.", role: "PM, HealthApp", rating: 4.8, date: "2025-11-20", text: "Patient portal was built exactly to spec. Amina is thorough and reliable.", project: "Patient Portal" }
      ]
    },
    caseStudies: [
      {
        title: "Real-time Analytics Dashboard",
        subtitle: "Performance Benchmark",
        metrics: [
          { label: "Load Time", value: "< 1.2s" },
          { label: "Lighthouse", value: "98" },
          { label: "Users", value: "100K+" }
        ]
      }
    ],
    engagementTerms: {
      hourlyRate: "$140/hr",
      podRetainer: "€4,800/mo",
      minAllocation: "20 hrs/week",
      maxAllocation: "40 hrs/week"
    }
  },
  {
    slug: "david-r",
    name: "David R.",
    fullName: "David Reyes",
    title: "QA Engineer",
    tagline: "If it ships, it's been tested.",
    avatar: "https://i.pravatar.cc/300?img=53",
    bannerGradient: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900",
    gridPattern: true,
    status: "AVAILABLE",
    statusColor: "bg-emerald-500",
    ledgerNode: true,
    viewSwitcher: "default",
    availableFor: ["Pods", "Solo"],
    verified: [
      { label: "ID & Biometrics", icon: "check" }
    ],
    location: "Austin, USA",
    languages: ["English (Fluent)", "Spanish (Native)"],
    timezone: "UTC-6 (CST)",
    pGPKey: "D4E5 F6A7 B8C9 0123 4567 89AB CDEF 0123 4567 8901",
    experience: "6+ years in QA automation and test strategy",
    externalLinks: [
      { platform: "GitHub", url: "https://github.com/dreyes" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/dreyes" }
    ],
    stats: {
      jobsCompleted: { value: 31, change: "+3 this month" },
      podsAndSquads: { value: 7, label: "Pods formed" },
      activeGigs: { value: 0, label: "Fixed-price" },
      escrowClearance: { value: "$26,000", sub: "in escrow" },
      responseTime: { value: "< 4 hrs", sub: "avg response" },
      overallRating: { value: "4.8", label: "Top 5% of QA engineers" }
    },
    financials: {
      public: { tier: "Tier 2 Liquidity Profile", escrowReady: true },
      worker: {
        earningsTotal: "$112,000.00",
        escrowClearance: "$26,000",
        pendingPayouts: "$6,200",
        gigRates: "N/A",
        retainer: "€4,200/mo",
        availableBalance: "$18,500",
        withdrawalOptions: ["USDT (TRC-20)", "SWIFT Wire"],
        withdrawFee: "0%",
        lastWithdrawal: "2026-03-10",
        accountType: "Business",
        tier: "Tier 2",
        jurisdiction: "Austin, USA",
        linkedEntity: "Reyes QA LLC",
        lastKYC: "2026-01-25",
        taxDocuments: "2025",
        documentsExempt: false,
        taxDocsLastVerified: "2026-02-20",
        jurisdictionUpdate: "2026-03-01",
        documentsVerified: true
      }
    },
    bio: {
      overview: "QA engineer focused on Playwright and CI/CD automation. Building test suites that catch bugs before users do.",
      highlights: [
        "Achieved 95% code coverage across 3 enterprise projects",
        "Reduced regression testing time by 70% with Playwright",
        "Built CI pipelines catching 90% of bugs before production"
      ]
    },
    skills: [
      { name: "Playwright", benchmark: 96, category: "Framework" },
      { name: "CI/CD", benchmark: 91, category: "DevOps" },
      { name: "TypeScript", benchmark: 87, category: "Language" },
      { name: "Jenkins", benchmark: 84, category: "Tool" },
      { name: "Postman", benchmark: 89, category: "Tool" },
      { name: "Performance Testing", benchmark: 82, category: "Specialty" }
    ],
    gigs: [],
    pods: [
      {
        name: "FinCORE QA Overhaul",
        role: "Pod Lead",
        period: "Apr 2025 – Sep 2025",
        members: 4,
        status: "Completed",
        description: "Built end-to-end test suite covering 95% of critical paths",
        escrowStatus: "Fully Released",
        rating: 4.8
      }
    ],
    soloContracts: [
      {
        client: "RetailMax",
        project: "E2E Test Suite",
        period: "Jun 2024 – Oct 2024",
        rating: 4.9,
        value: "$16,000"
      }
    ],
    reviews: {
      overall: 4.8,
      distribution: { 5: 22, 4: 9, 3: 0, 2: 0, 1: 0 },
      breakdown: {
        pod: { rating: 4.8, count: 15 },
        solo: { rating: 4.7, count: 10 },
        gig: { rating: 0, count: 0 }
      },
      recent: [
        { author: "Karen P.", role: "Engineering Lead, RetailMax", rating: 4.9, date: "2026-02-28", text: "David's test suite caught critical regressions before launch. His work saved us from a major incident.", project: "E2E Test Suite" }
      ]
    },
    caseStudies: [
      {
        title: "E-Commerce Test Automation",
        subtitle: "Quality Benchmark",
        metrics: [
          { label: "Coverage", value: "95%" },
          { label: "Bugs Caught", value: "340+" },
          { label: "Time Saved", value: "70%" }
        ]
      }
    ],
    engagementTerms: {
      hourlyRate: "$120/hr",
      podRetainer: "€4,200/mo",
      minAllocation: "16 hrs/week",
      maxAllocation: "40 hrs/week"
    }
  },
  {
    slug: "chen-w",
    name: "Chen W.",
    fullName: "Chen Wei",
    title: "Security Hacker",
    tagline: "Find what others miss.",
    avatar: "https://i.pravatar.cc/300?img=59",
    bannerGradient: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900",
    gridPattern: true,
    status: "AVAILABLE",
    statusColor: "bg-emerald-500",
    ledgerNode: true,
    viewSwitcher: "default",
    availableFor: ["Pods", "Solo", "Gigs"],
    verified: [
      { label: "ID & Biometrics", icon: "check" },
      { label: "Top 1% Hacker", icon: "check" }
    ],
    location: "Singapore",
    languages: ["English (Fluent)", "Mandarin (Native)"],
    timezone: "UTC+8 (SGT)",
    pGPKey: "E5F6 A7B8 C9D0 1234 5678 9ABC DEF0 1234 5678 9012",
    experience: "10+ years in offensive security and bug bounty hunting",
    externalLinks: [
      { platform: "GitHub", url: "https://github.com/cwei" },
      { platform: "HackerOne", url: "https://hackerone.com/cwei" }
    ],
    stats: {
      jobsCompleted: { value: 19, change: "+1 this month" },
      podsAndSquads: { value: 5, label: "Pods formed" },
      activeGigs: { value: 4, label: "Fixed-price" },
      escrowClearance: { value: "$33,000", sub: "in escrow" },
      responseTime: { value: "< 1 hr", sub: "avg response" },
      overallRating: { value: "4.9", label: "Top 1% of hackers" }
    },
    financials: {
      public: { tier: "Tier 1 Liquidity Profile", escrowReady: true },
      worker: {
        earningsTotal: "$165,000.00",
        escrowClearance: "$33,000",
        pendingPayouts: "$9,800",
        gigRates: "$600 – $2,000",
        retainer: "€5,000/mo",
        availableBalance: "$28,400",
        withdrawalOptions: ["USDT (TRC-20)", "SWIFT Wire", "Crypto"],
        withdrawFee: "0%",
        lastWithdrawal: "2026-03-14",
        accountType: "Business",
        tier: "Tier 1",
        jurisdiction: "Singapore",
        linkedEntity: "Wei Security Pte Ltd",
        lastKYC: "2026-02-15",
        taxDocuments: "2025",
        documentsExempt: false,
        taxDocsLastVerified: "2026-01-25",
        jurisdictionUpdate: "2026-03-01",
        documentsVerified: true
      }
    },
    bio: {
      overview: "Offensive security specialist with deep expertise in audit and penetration testing. Bug bounty hunter with $250K+ in rewards.",
      highlights: [
        "Discovered critical RCE in major cloud platform",
        "$250K+ in bug bounty rewards",
        "Found 15 critical vulnerabilities in Fortune 500 companies"
      ]
    },
    skills: [
      { name: "Audit", benchmark: 97, category: "Specialty" },
      { name: "Pentest", benchmark: 95, category: "Specialty" },
      { name: "Reverse Engineering", benchmark: 90, category: "Specialty" },
      { name: "Python", benchmark: 88, category: "Language" },
      { name: "C/C++", benchmark: 84, category: "Language" },
      { name: "Linux", benchmark: 92, category: "OS" }
    ],
    gigs: [
      {
        id: "gig-1",
        title: "Smart Contract Audit",
        description: "Full security audit of your Solidity smart contracts with formal verification.",
        price: "$2,000",
        deliveryTime: "5 business days",
        includes: ["Full audit report", "Severity classification", "Remediation steps", "Re-audit"],
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop"
      },
      {
        id: "gig-2",
        title: "API Security Assessment",
        description: "Comprehensive security testing of your REST and GraphQL APIs.",
        price: "$1,200",
        deliveryTime: "3 business days",
        includes: ["OWASP Top 10 testing", "Auth bypass testing", "Report with CVSS scores"],
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop"
      }
    ],
    pods: [
      {
        name: "DeFi Protocol Audit",
        role: "Pod Lead",
        period: "Feb 2025 – Jun 2025",
        members: 4,
        status: "Completed",
        description: "Security audit for DeFi lending protocol handling $50M TVL",
        escrowStatus: "Fully Released",
        rating: 5.0
      }
    ],
    soloContracts: [
      {
        client: "CryptoExchange",
        platform: "Exchange Security Review",
        period: "Sep 2023 – Jan 2024",
        rating: 5.0,
        value: "$28,000"
      }
    ],
    reviews: {
      overall: 4.9,
      distribution: { 5: 15, 4: 4, 3: 0, 2: 0, 1: 0 },
      breakdown: {
        pod: { rating: 5.0, count: 8 },
        solo: { rating: 4.8, count: 6 },
        gig: { rating: 4.9, count: 5 }
      },
      recent: [
        { author: "Mike R.", role: "CTO, CryptoExchange", rating: 5.0, date: "2026-03-08", text: "Chen found a critical vulnerability that could have cost us millions. His audit was thorough and professional.", project: "Exchange Security Review" }
      ]
    },
    caseStudies: [
      {
        title: "DeFi Protocol Security",
        subtitle: "Audit Benchmark",
        metrics: [
          { label: "TVL Protected", value: "$50M" },
          { label: "Vulns Found", value: "18" },
          { label: "Critical", value: "3" }
        ]
      }
    ],
    engagementTerms: {
      hourlyRate: "$200/hr",
      podRetainer: "€5,000/mo",
      minAllocation: "20 hrs/week",
      maxAllocation: "40 hrs/week"
    }
  },
  {
    slug: "sofia-m",
    name: "Sofia M.",
    fullName: "Sofia Martinez",
    title: "Mobile Developer",
    tagline: "Crafting pixel-perfect mobile experiences.",
    avatar: "https://i.pravatar.cc/300?img=44",
    bannerGradient: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900",
    gridPattern: true,
    status: "AVAILABLE",
    statusColor: "bg-emerald-500",
    ledgerNode: true,
    viewSwitcher: "default",
    availableFor: ["Pods", "Solo"],
    verified: [
      { label: "ID & Biometrics", icon: "check" }
    ],
    location: "Barcelona, Spain",
    languages: ["English (Fluent)", "Spanish (Native)", "Catalan (Fluent)"],
    timezone: "UTC+1 (CET)",
    pGPKey: "F6A7 B8C9 D0E1 2345 6789 ABCD EF01 2345 6789 0123",
    experience: "6+ years building cross-platform mobile apps with Flutter and Swift",
    externalLinks: [
      { platform: "GitHub", url: "https://github.com/smartinez" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/smartinez" }
    ],
    stats: {
      jobsCompleted: { value: 27, change: "+2 this month" },
      podsAndSquads: { value: 6, label: "Pods formed" },
      activeGigs: { value: 0, label: "Fixed-price" },
      escrowClearance: { value: "$31,000", sub: "in escrow" },
      responseTime: { value: "< 3 hrs", sub: "avg response" },
      overallRating: { value: "4.7", label: "Top 10% of mobile devs" }
    },
    financials: {
      public: { tier: "Tier 2 Liquidity Profile", escrowReady: true },
      worker: {
        earningsTotal: "$125,000.00",
        escrowClearance: "$31,000",
        pendingPayouts: "$7,800",
        gigRates: "N/A",
        retainer: "€4,500/mo",
        availableBalance: "$20,200",
        withdrawalOptions: ["USDT (TRC-20)", "SWIFT Wire"],
        withdrawFee: "0%",
        lastWithdrawal: "2026-03-05",
        accountType: "Business",
        tier: "Tier 2",
        jurisdiction: "Barcelona, Spain",
        linkedEntity: "Martinez Mobile SL",
        lastKYC: "2026-01-30",
        taxDocuments: "2025",
        documentsExempt: false,
        taxDocsLastVerified: "2026-02-10",
        jurisdictionUpdate: "2026-02-28",
        documentsVerified: true
      }
    },
    bio: {
      overview: "Mobile developer specializing in Flutter and Swift. Building performant, beautiful apps for iOS and Android.",
      highlights: [
        "Built fitness app with 500K+ downloads",
        "Expert in Flutter state management and native integrations",
        "Published 8 apps on App Store and Play Store"
      ]
    },
    skills: [
      { name: "Flutter", benchmark: 94, category: "Framework" },
      { name: "Swift", benchmark: 90, category: "Language" },
      { name: "Dart", benchmark: 92, category: "Language" },
      { name: "Firebase", benchmark: 87, category: "Backend" },
      { name: "UI/UX Design", benchmark: 85, category: "Design" },
      { name: "CI/CD", benchmark: 82, category: "DevOps" }
    ],
    gigs: [],
    pods: [
      {
        name: "FitTrack Mobile",
        role: "Pod Lead",
        period: "May 2025 – Oct 2025",
        members: 5,
        status: "Completed",
        description: "Built cross-platform fitness tracking app with 500K+ downloads",
        escrowStatus: "Fully Released",
        rating: 4.7
      }
    ],
    soloContracts: [
      {
        client: "TravelGo",
        project: "Travel Booking App",
        period: "Jan 2024 – May 2024",
        rating: 4.8,
        value: "$20,000"
      }
    ],
    reviews: {
      overall: 4.7,
      distribution: { 5: 18, 4: 9, 3: 0, 2: 0, 1: 0 },
      breakdown: {
        pod: { rating: 4.7, count: 12 },
        solo: { rating: 4.6, count: 9 },
        gig: { rating: 0, count: 0 }
      },
      recent: [
        { author: "Ana L.", role: "CEO, TravelGo", rating: 4.8, date: "2026-02-20", text: "Sofia built our travel app with incredible attention to detail. Users love the smooth animations.", project: "Travel Booking App" }
      ]
    },
    caseStudies: [
      {
        title: "Fitness Tracking App",
        subtitle: "Mobile Benchmark",
        metrics: [
          { label: "Downloads", value: "500K+" },
          { label: "App Store", value: "4.8★" },
          { label: "Retention", value: "65%" }
        ]
      }
    ],
    engagementTerms: {
      hourlyRate: "$130/hr",
      podRetainer: "€4,500/mo",
      minAllocation: "20 hrs/week",
      maxAllocation: "40 hrs/week"
    }
  },
  {
    slug: "liam-o",
    name: "Liam O.",
    fullName: "Liam O'Brien",
    title: "QA Automation Engineer",
    tagline: "Automating quality at scale.",
    avatar: "https://i.pravatar.cc/300?img=51",
    bannerGradient: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900",
    gridPattern: true,
    status: "AVAILABLE",
    statusColor: "bg-emerald-500",
    ledgerNode: true,
    viewSwitcher: "default",
    availableFor: ["Solo"],
    verified: [],
    location: "Dublin, Ireland",
    languages: ["English (Native)"],
    timezone: "UTC+0 (GMT)",
    pGPKey: "A7B8 C9D0 E1F2 3456 789A BCDE F012 3456 7890 1234",
    experience: "4+ years in QA automation with Cypress and Jenkins",
    externalLinks: [
      { platform: "GitHub", url: "https://github.com/lobrien" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/lobrien" }
    ],
    stats: {
      jobsCompleted: { value: 14, change: "+1 this month" },
      podsAndSquads: { value: 3, label: "Pods formed" },
      activeGigs: { value: 0, label: "Fixed-price" },
      escrowClearance: { value: "$15,000", sub: "in escrow" },
      responseTime: { value: "< 5 hrs", sub: "avg response" },
      overallRating: { value: "4.6", label: "Reliable QA engineer" }
    },
    financials: {
      public: { tier: "Tier 3 Liquidity Profile", escrowReady: true },
      worker: {
        earningsTotal: "$58,000.00",
        escrowClearance: "$15,000",
        pendingPayouts: "$3,200",
        gigRates: "N/A",
        retainer: "€2,800/mo",
        availableBalance: "$9,800",
        withdrawalOptions: ["USDT (TRC-20)", "SWIFT Wire"],
        withdrawFee: "0%",
        lastWithdrawal: "2026-03-01",
        accountType: "Individual",
        tier: "Tier 3",
        jurisdiction: "Dublin, Ireland",
        linkedEntity: "N/A",
        lastKYC: "2026-02-01",
        taxDocuments: "2025",
        documentsExempt: false,
        taxDocsLastVerified: "2026-01-15",
        jurisdictionUpdate: "2026-02-10",
        documentsVerified: true
      }
    },
    bio: {
      overview: "QA automation engineer focused on Cypress and Jenkins. Building reliable CI pipelines and test suites.",
      highlights: [
        "Built test automation framework reducing manual QA by 60%",
        "Configured Jenkins pipelines for 5 concurrent projects",
        "Achieved 88% code coverage across main product"
      ]
    },
    skills: [
      { name: "Cypress", benchmark: 90, category: "Framework" },
      { name: "Jenkins", benchmark: 86, category: "Tool" },
      { name: "JavaScript", benchmark: 83, category: "Language" },
      { name: "Git", benchmark: 88, category: "Tool" },
      { name: "Docker", benchmark: 78, category: "Infrastructure" },
      { name: "SQL", benchmark: 80, category: "Database" }
    ],
    gigs: [],
    pods: [
      {
        name: "SaaS Test Framework",
        role: "Specialist",
        period: "Jul 2025 – Nov 2025",
        members: 3,
        status: "Completed",
        description: "Built Cypress test suite for SaaS platform",
        escrowStatus: "Fully Released",
        rating: 4.6
      }
    ],
    soloContracts: [
      {
        client: "DataFlow",
        project: "Test Automation Setup",
        period: "Sep 2024 – Jan 2025",
        rating: 4.5,
        value: "$10,000"
      }
    ],
    reviews: {
      overall: 4.6,
      distribution: { 5: 8, 4: 6, 3: 0, 2: 0, 1: 0 },
      breakdown: {
        pod: { rating: 4.6, count: 6 },
        solo: { rating: 4.5, count: 5 },
        gig: { rating: 0, count: 0 }
      },
      recent: [
        { author: "Brian K.", role: "CTO, DataFlow", rating: 4.5, date: "2026-01-15", text: "Liam set up our test automation quickly and professionally. Good communication throughout.", project: "Test Automation Setup" }
      ]
    },
    caseStudies: [
      {
        title: "SaaS Test Automation",
        subtitle: "Quality Benchmark",
        metrics: [
          { label: "Coverage", value: "88%" },
          { label: "Manual Saved", value: "60%" },
          { label: "CI Pass Rate", value: "97%" }
        ]
      }
    ],
    engagementTerms: {
      hourlyRate: "$90/hr",
      podRetainer: "€2,800/mo",
      minAllocation: "16 hrs/week",
      maxAllocation: "40 hrs/week"
    }
  },
  {
    slug: "priya-n",
    name: "Priya N.",
    fullName: "Priya Nair",
    title: "Backend Developer",
    tagline: "Building the engines that power products.",
    avatar: "https://i.pravatar.cc/300?img=45",
    bannerGradient: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900",
    gridPattern: true,
    status: "AVAILABLE",
    statusColor: "bg-emerald-500",
    ledgerNode: true,
    viewSwitcher: "default",
    availableFor: ["Pods", "Solo", "Gigs"],
    verified: [
      { label: "ID & Biometrics", icon: "check" }
    ],
    location: "Bangalore, India",
    languages: ["English (Fluent)", "Hindi (Native)", "Malayalam (Native)"],
    timezone: "UTC+5:30 (IST)",
    pGPKey: "B8C9 D0E1 F2A3 4567 89AB CDEF 0123 4567 8901 2345",
    experience: "8+ years building backend systems with Go and PostgreSQL",
    externalLinks: [
      { platform: "GitHub", url: "https://github.com/pnair" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/pnair" }
    ],
    stats: {
      jobsCompleted: { value: 35, change: "+3 this month" },
      podsAndSquads: { value: 9, label: "Pods formed" },
      activeGigs: { value: 2, label: "Fixed-price" },
      escrowClearance: { value: "$44,000", sub: "in escrow" },
      responseTime: { value: "< 3 hrs", sub: "avg response" },
      overallRating: { value: "4.8", label: "Top 5% of backend devs" }
    },
    financials: {
      public: { tier: "Tier 2 Liquidity Profile", escrowReady: true },
      worker: {
        earningsTotal: "$175,000.00",
        escrowClearance: "$44,000",
        pendingPayouts: "$11,000",
        gigRates: "$600 – $2,400",
        retainer: "€5,200/mo",
        availableBalance: "$32,000",
        withdrawalOptions: ["USDT (TRC-20)", "SWIFT Wire", "Local Bank"],
        withdrawFee: "0%",
        lastWithdrawal: "2026-03-11",
        accountType: "Business",
        tier: "Tier 2",
        jurisdiction: "Bangalore, India",
        linkedEntity: "Nair Tech Solutions",
        lastKYC: "2026-01-20",
        taxDocuments: "2025",
        documentsExempt: false,
        taxDocsLastVerified: "2026-02-18",
        jurisdictionUpdate: "2026-03-05",
        documentsVerified: true
      }
    },
    bio: {
      overview: "Backend developer specializing in Go and PostgreSQL. Building high-performance APIs and data pipelines.",
      highlights: [
        "Designed data pipeline processing 5M events/day",
        "Reduced API latency by 45% through query optimization",
        "Built Go microservices handling 50K concurrent connections"
      ]
    },
    skills: [
      { name: "Postgres", benchmark: 95, category: "Database" },
      { name: "Go", benchmark: 93, category: "Language" },
      { name: "Redis", benchmark: 88, category: "Database" },
      { name: "Docker", benchmark: 86, category: "Infrastructure" },
      { name: "Kafka", benchmark: 84, category: "Messaging" },
      { name: "gRPC", benchmark: 87, category: "Communication" }
    ],
    gigs: [
      {
        id: "gig-1",
        title: "Database Optimization",
        description: "Analyze and optimize your PostgreSQL queries, indexes, and schema for maximum performance.",
        price: "$1,800",
        deliveryTime: "5 business days",
        includes: ["Query analysis", "Index recommendations", "Schema optimization", "Performance report"],
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop"
      }
    ],
    pods: [
      {
        name: "DataMesh Federation",
        role: "Specialist",
        period: "Jun 2023 – Feb 2024",
        members: 6,
        status: "Completed",
        description: "Built data pipeline processing 5M events/day",
        escrowStatus: "Fully Released",
        rating: 4.8
      }
    ],
    soloContracts: [
      {
        client: "LogiTech",
        project: "Logistics API",
        period: "Apr 2024 – Aug 2024",
        rating: 4.9,
        value: "$22,000"
      }
    ],
    reviews: {
      overall: 4.8,
      distribution: { 5: 28, 4: 7, 3: 0, 2: 0, 1: 0 },
      breakdown: {
        pod: { rating: 4.8, count: 16 },
        solo: { rating: 4.7, count: 12 },
        gig: { rating: 4.9, count: 7 }
      },
      recent: [
        { author: "Raj S.", role: "CTO, LogiTech", rating: 4.9, date: "2026-03-05", text: "Priya's backend work is exceptional. She optimized our API reducing response times by 45%.", project: "Logistics API" }
      ]
    },
    caseStudies: [
      {
        title: "Event Processing Pipeline",
        subtitle: "Backend Benchmark",
        metrics: [
          { label: "Events/day", value: "5M" },
          { label: "Latency", value: "< 50ms" },
          { label: "Uptime", value: "99.99%" }
        ]
      }
    ],
    engagementTerms: {
      hourlyRate: "$110/hr",
      podRetainer: "€5,200/mo",
      minAllocation: "20 hrs/week",
      maxAllocation: "40 hrs/week"
    }
  },
  {
    slug: "mahfuz",
    name: "Mahfuz",
    fullName: "Mahfuz",
    title: "Full-Stack Developer",
    tagline: "Building modern web experiences.",
    avatar: "/Mahfuz.jpg",
    bannerGradient: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900",
    gridPattern: true,
    status: "AVAILABLE",
    statusColor: "bg-emerald-500",
    ledgerNode: true,
    viewSwitcher: "default",
    availableFor: ["Pods", "Solo", "Gigs"],
    verified: [
      { label: "ID & Biometrics", icon: "check" }
    ],
    location: "Dhaka, Bangladesh",
    languages: ["English (Fluent)", "Bengali (Native)"],
    timezone: "UTC+6 (BST)",
    pGPKey: "C9D0 E1F2 A3B4 5678 9ABC DEF0 1234 5678 9012 3456",
    experience: "5+ years building modern web applications with React and Node.js",
    externalLinks: [
      { platform: "GitHub", url: "https://github.com/mahfuz" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/mahfuz" }
    ],
    stats: {
      jobsCompleted: { value: 15, change: "+2 this month" },
      podsAndSquads: { value: 4, label: "Pods formed" },
      activeGigs: { value: 2, label: "Fixed-price" },
      escrowClearance: { value: "$18,500", sub: "in escrow" },
      responseTime: { value: "< 2 hrs", sub: "avg response" },
      overallRating: { value: "4.8", label: "Top 10% of developers" }
    },
    financials: {
      public: { tier: "Tier 2 Liquidity Profile", escrowReady: true },
      worker: {
        earningsTotal: "$82,000.00",
        escrowClearance: "$18,500",
        pendingPayouts: "$5,200",
        gigRates: "$500 – $2,000",
        retainer: "€3,500/mo",
        availableBalance: "$14,800",
        withdrawalOptions: ["USDT (TRC-20)", "SWIFT Wire", "Local Bank"],
        withdrawFee: "0%",
        lastWithdrawal: "2026-03-10",
        accountType: "Individual",
        tier: "Tier 2",
        jurisdiction: "Dhaka, Bangladesh",
        linkedEntity: "N/A",
        lastKYC: "2026-02-01",
        taxDocuments: "2025",
        documentsExempt: false,
        taxDocsLastVerified: "2026-01-20",
        jurisdictionUpdate: "2026-03-01",
        documentsVerified: true
      }
    },
    bio: {
      overview: "Full-stack developer passionate about building modern web applications with React, Node.js, and TailwindCSS. Focused on clean code, responsive design, and delivering production-ready solutions.",
      highlights: [
        "Built and deployed 10+ production web applications",
        "Expertise in React, Vite, and modern frontend tooling",
        "Strong focus on UI/UX and performance optimization",
        "Experience with both startups and enterprise clients"
      ]
    },
    skills: [
      { name: "React", benchmark: 93, category: "Framework" },
      { name: "JavaScript", benchmark: 91, category: "Language" },
      { name: "Node.js", benchmark: 88, category: "Runtime" },
      { name: "TailwindCSS", benchmark: 92, category: "Styling" },
      { name: "TypeScript", benchmark: 85, category: "Language" },
      { name: "Git", benchmark: 90, category: "Tool" }
    ],
    gigs: [
      {
        id: "gig-mahfuz-1",
        title: "Landing Page Build",
        description: "A modern, responsive landing page built with React and TailwindCSS, optimized for performance and SEO.",
        price: "$800",
        deliveryTime: "3 business days",
        includes: ["Responsive design", "SEO setup", "Performance optimized", "Deployment"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
      },
      {
        id: "gig-mahfuz-2",
        title: "React Component Library",
        description: "A reusable, accessible component library built with React and TailwindCSS for your design system.",
        price: "$1,500",
        deliveryTime: "5 business days",
        includes: ["20+ components", "Storybook setup", "Documentation", "Accessibility audit"],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
      }
    ],
    pods: [
      {
        name: "TechWorkly Platform",
        role: "Pod Lead",
        period: "Jan 2026 – Present",
        members: 3,
        status: "In Progress",
        description: "Building the TechWorkly freelance marketplace platform",
        escrowStatus: "Active",
        rating: 4.8
      }
    ],
    soloContracts: [
      {
        client: "LocalStart",
        project: "E-commerce Frontend",
        period: "Sep 2025 – Jan 2026",
        rating: 4.9,
        value: "$12,000"
      }
    ],
    reviews: {
      overall: 4.8,
      distribution: { 5: 12, 4: 3, 3: 0, 2: 0, 1: 0 },
      breakdown: {
        pod: { rating: 4.8, count: 6 },
        solo: { rating: 4.7, count: 5 },
        gig: { rating: 4.9, count: 4 }
      },
      recent: [
        { author: "Tanvir A.", role: "CEO, LocalStart", rating: 4.9, date: "2026-01-10", text: "Mahfuz delivered an excellent e-commerce frontend. Clean code, great communication, and ahead of schedule.", project: "E-commerce Frontend" }
      ]
    },
    caseStudies: [
      {
        title: "Modern Web Application",
        subtitle: "Development Benchmark",
        metrics: [
          { label: "Lighthouse", value: "96" },
          { label: "Load Time", value: "< 1.5s" },
          { label: "Uptime", value: "99.9%" }
        ]
      }
    ],
    engagementTerms: {
      hourlyRate: "$80/hr",
      podRetainer: "€3,500/mo",
      minAllocation: "16 hrs/week",
      maxAllocation: "40 hrs/week"
    }
  }
];

export function getWorkerBySlug(slug) {
  return workers.find((w) => w.slug === slug);
}
