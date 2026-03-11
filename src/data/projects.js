// src/data/projects.js
// Your real deployed projects — edit freely!

export const projects = [
  {
    id: "sparkchat",
    title: "SparkChat",
    description: "A full-stack real-time chat application with WebSockets, JWT authentication, file sharing, online/offline status, and status updates — built with the MERN stack.",
    liveUrl: "https://spark--chat.vercel.app/",
    githubUrl: "https://github.com/krishpatel13072006/whatsapp-lite",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&auto=format&fit=crop",
    tech: ["React", "Node.js", "MongoDB", "Socket.IO", "Express", "JWT"],
    category: "Full Stack",
    color: "#25D366",
    stars: 12,
    forks: 3,
    featured: true,
    readme: `# SparkChat

A full-stack real-time messaging application inspired by WhatsApp, built with the MERN stack and Socket.IO.

## Features
- Real-time messaging with Socket.IO
- JWT-based authentication (register / login)
- File & image sharing
- Online / offline status indicators
- 24-hour status updates
- Responsive mobile-first design

## Tech Stack
- **Frontend**: React, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.IO
- **Auth**: JWT (JSON Web Tokens)

## Getting Started
\`\`\`bash
# Clone the repo
git clone https://github.com/krishpatel13072006/whatsapp-lite

# Install dependencies
cd whatsapp-lite && npm install

# Run dev server
npm run dev
\`\`\`

## Author
Created by **Krish Patel**`,
  },

  {
    id: "nextgen-hms",
    title: "NextGen HMS",
    description: "An AI-powered Hospital/Hotel Management System with a 3D glassmorphism frontend, real-time analytics, dynamic pricing engine, and Google Gemini AI concierge.",
    liveUrl: "https://nextgen-hms.vercel.app/",
    githubUrl: "https://github.com/krishpatel13072006/nextgen-hms",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop",
    tech: ["React", "Node.js", "MongoDB", "Three.js", "Gemini AI", "JWT"],
    category: "Full Stack",
    color: "#6366f1",
    stars: 18,
    forks: 4,
    featured: true,
    readme: `# 🏨 NextGen HMS - AI-Powered Hospital/Hotel Management System

A modern, full-stack management system featuring a stunning 3D frontend with glassmorphism UI, real-time analytics, dynamic pricing, and AI-powered concierge services.

## ✨ Features

### Frontend
- 🎨 **Glassmorphism UI** - Modern, translucent design with blur effects
- 🌐 **3D Hero Section** - Interactive Three.js animated sphere
- 🤖 **AI Concierge Widget** - Floating chatbot with Gemini AI integration
- 📊 **Admin Analytics Dashboard** - Real-time occupancy and revenue tracking
- 🔐 **Smart Check-In** - Digital identity verification with scanning animation
- 💳 **Room Booking Cards** - Live availability with dynamic pricing

### Backend
- 🔐 **JWT Authentication** - Secure user registration and login
- 🏠 **Room Management** - CRUD operations for 4 room types
- 💰 **Dynamic Pricing Engine** - Prices adjust based on occupancy and weekends
- 📈 **Analytics API** - Revenue, occupancy, and booking statistics
- 🤖 **AI Integration** - Google Gemini-powered concierge service

## 🛠️ Tech Stack
- **Frontend**: React 18, Three.js, CSS Glassmorphism
- **Backend**: Node.js 18+, Express.js
- **Database**: MongoDB (Local)
- **AI**: Google Gemini API
- **Auth**: JWT

## 🚀 Getting Started
\`\`\`bash
git clone https://github.com/krishpatel13072006/nextgen-hms
cd nextgen-hms && npm install
npm run dev
\`\`\`

## Author
Created by **Krish Patel**`,
  },

  {
    id: "fancy-ai",
    title: "Fancy AI",
    description: "A sleek AI-powered chat and tools application built with Next.js, offering modern UI interactions and AI-driven features powered by cutting-edge language models.",
    liveUrl: "https://fancy-ai01.netlify.app/",
    githubUrl: "https://github.com/krishpatel13072006/fancy-ai",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop",
    tech: ["Next.js", "React", "TypeScript", "AI API", "Tailwind CSS"],
    category: "Full Stack",
    color: "#a855f7",
    stars: 9,
    forks: 2,
    featured: true,
    readme: `# ✨ Fancy AI

A sleek, modern AI-powered application built with Next.js and React.

## Features
- 🤖 AI-powered chat interface
- ⚡ Server-side rendering with Next.js
- 🎨 Modern, responsive UI
- 🔒 Secure API key handling
- 📱 Mobile-friendly design

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Geist (Vercel)
- **AI**: Language Model API integration

## Getting Started
\`\`\`bash
git clone https://github.com/krishpatel13072006/fancy-ai
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deploy
Deployed on **Netlify** — [fancy-ai01.netlify.app](https://fancy-ai01.netlify.app/)

## Author
Created by **Krish Patel**`,
  },

  {
    id: "aura-finance",
    title: "Aura Finance",
    description: "A beautiful expense tracker and personal finance manager built with React and Vite, featuring budget planning, spending insights, and visual charts.",
    liveUrl: "https://aurafinanceee.netlify.app/",
    githubUrl: "https://github.com/krishpatel13072006",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop",
    tech: ["React", "Vite", "Chart.js", "LocalStorage", "CSS"],
    category: "Frontend",
    color: "#10b981",
    stars: 7,
    forks: 1,
    featured: false,
    readme: `# 💰 Aura Finance — Expense Tracker

A beautiful, intuitive personal finance and expense tracking application built with React + Vite.

## Features
- 📊 Visual spending charts and breakdowns
- 💳 Add, edit, and delete expenses by category
- 🎯 Budget goal setting and tracking
- 📅 Monthly spending history
- 💾 Persistent data with LocalStorage
- 🌙 Clean, modern UI

## Tech Stack
- **Framework**: React 18 + Vite
- **Charts**: Chart.js / Recharts
- **Styling**: CSS with custom design system
- **State**: React hooks + LocalStorage
- **Build**: Vite with HMR

## Getting Started
\`\`\`bash
git clone <repo-url>
npm install
npm run dev
\`\`\`

## Deploy
Deployed on **Netlify** — [aurafinanceee.netlify.app](https://aurafinanceee.netlify.app/)

## Author
Created by **Krish Patel**`,
  },

  {
    id: "resume-builder",
    title: "AI Resume Builder",
    description: "An AI-powered resume builder that generates professional, ATS-friendly resumes from your input — with live preview, PDF export, and multiple templates.",
    liveUrl: "https://ai-resume-creator-130706.netlify.app/",
    githubUrl: "https://github.com/krishpatel13072006/Resume-Builder",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop",
    tech: ["React", "Vite", "AI API", "PDF Export", "CSS"],
    category: "Frontend",
    color: "#f59e0b",
    stars: 14,
    forks: 3,
    featured: false,
    readme: `# 📄 AI Resume Builder

Created by **Krish Patel**

An intelligent resume builder that uses AI to help you craft professional, ATS-optimized resumes in minutes.

## Features
- 🤖 AI-assisted content generation
- 👁️ Live preview as you type
- 📄 PDF export with one click
- 🎨 Multiple professional templates
- ✅ ATS-friendly formatting
- 💾 Auto-save functionality

## Tech Stack
- **Framework**: React + Vite
- **AI**: Language Model API
- **Export**: PDF generation library
- **Styling**: Custom CSS
- **Build**: Vite

## Getting Started
\`\`\`bash
git clone https://github.com/krishpatel13072006/Resume-Builder
npm install
npm run dev
\`\`\`

## Live Demo
🚀 [ai-resume-creator-130706.netlify.app](https://ai-resume-creator-130706.netlify.app/)

## Author
Created by **Krish Patel** — [@krishpatel13072006](https://github.com/krishpatel13072006)`,
  },
];

export const categories = ["All", "Full Stack", "Frontend", "Backend"];
