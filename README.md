# 🎨 Interactive React Web

An interactive website built with **React + Vite**, featuring smooth animations, global background music, and static media assets (audio & video) served from the `public` folder.

This project is designed for presentation, UI/UX exploration, and is fully ready to be deployed and shared publicly.

---

## ✨ Key Features

- ⚡ **React + Vite** (fast and modern tooling)
- 🎬 **Video & audio support** via the `public` directory
- 🎵 **Global background music**
  - Play / Pause control
  - State persisted using `localStorage`
  - Browser-safe (starts after user interaction)
- 💫 Smooth animations powered by **Framer Motion**
- 📱 Fully responsive (desktop & mobile friendly)
- 🚀 Ready for deployment on **Vercel / Netlify / Cloudflare Pages**

---

## 📂 Important Folder Structure

```
├── public/
│   ├── audio/
│   │   └── backsound.mp3
│   └── Videos.mp4
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── components/
│
├── index.html
├── package.json
└── vite.config.js
```

> All files inside the `public/` folder are served from the root path.  
> Examples:  
> `/audio/backsound.mp3`  
> `/Video.mp4`

---

## ▶️ Run the Project Locally

Make sure **Node.js v18 or higher** is installed.

```bash
npm install
npm run dev
```

Open in your browser:
```
http://localhost:5173
```

---

## 🏗 Build for Production

```bash
npm run build
```

The production build output will be generated in:
```
dist/
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🎵 Background Music Notes

- Browsers **do not allow audio autoplay with sound**
- Music starts after the **first user interaction** (click / tap / key press)
- Play state is saved using `localStorage`

Music file location:
```
public/audio/backsound.mp3
```

---

## 🚀 Deployment Guide

### Vercel
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

### Netlify
- Build Command: `npm run build`
- Publish Directory: `dist`

### Cloudflare Pages
- Framework Preset: **Vite**
- Build Output Directory: `dist`

---

## 🛠 Tech Stack

- React
- Vite
- Framer Motion
- HTML5 Audio & Video
- Modern CSS

---

## 📌 Notes

- Do not commit `node_modules`
- Ensure `.gitignore` is properly configured
- Never push `.env` files to public repositories

---

## 📄 License

This project is created for development and demonstration purposes.  
You are free to use and modify it as needed.
