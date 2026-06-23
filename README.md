# ⚡ CircuitLens AI

**AI-Powered AR Learning Platform for Electronics** — Learn electronics by looking at it.

> A concept platform combining computer vision, AR, and AI tutoring to help students and hobbyists identify electronic components and understand circuits in real time.

🔗 **Live Demo:** _add your deployed link here_
📄 **Built by:** H G Gahana Jain — Full Stack (MERN) Developer | ECE Undergraduate, VTU

---

## 🧠 What This Is

CircuitLens AI is a frontend prototype demonstrating how AR, computer vision, and AI could combine to teach electronics interactively. It was built to showcase the intersection of **Electronics & Communication Engineering (ECE)** knowledge and **Full Stack development** — point a camera at a component, get an instant AI explanation of what it is and how it works.

This repo contains the **frontend prototype**: a fully interactive, installable Progressive Web App (PWA) built as a single-page experience.

---

## ✨ Features

| Feature | Status |
|---|---|
| 📷 AR Scanner UI (5 preset components) | ✅ Fully working (simulated data) |
| 🧠 AI Component Search (any component, real specs) | ✅ Working — calls Anthropic Claude API |
| ⚡ Interactive Circuit Builder (17+ components) | ✅ Fully working, client-side |
| 📖 Guided Circuit Tutorials (6 example circuits) | ✅ Fully working, client-side |
| 📡 IoT Sensor Dashboard | ⚠️ Simulated data — no real ESP32 connected (see below) |
| 🎓 Electronics Quiz | ✅ Fully working, client-side |
| 📲 Installable PWA (Add to Home Screen) | ✅ Working — manifest + service worker included |

### Honest Notes on Simulated Features
This is a **portfolio-stage prototype**, not a production product. To be transparent:
- The **AR Scanner's preset buttons** use hardcoded sample data — there's no live YOLOv8 model running in this version.
- The **IoT Dashboard** generates realistic-looking simulated sensor readings (sine/cosine wave functions) to demonstrate the UI/UX — it is not connected to a real ESP32 yet. See [`/hardware`](#-real-hardware-integration-optional) below for how to make it real.
- The **AI Component Search** is genuinely functional and calls the Anthropic Claude API — but it requires a backend proxy with your own API key to run outside of Claude.ai's sandboxed environment. Without that backend, this feature will show a graceful fallback message rather than failing silently.

---

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript (Canvas API for circuit builder & charts)
**Planned Full Stack:** React / Next.js, Node.js, Express, MongoDB, Socket.io
**AI / Computer Vision (concept):** YOLOv8, TensorFlow, OpenCV
**Hardware (concept):** ESP32, DHT11

---

## 🚀 Getting Started

```bash
git clone https://github.com/<your-username>/circuitlens-ai.git
cd circuitlens-ai
# open index.html directly, or serve locally:
npx serve .
```

Open the served URL on your phone's browser and tap **"Add to Home Screen"** to install it as an app.

---

## 🔌 Real Hardware Integration (Optional)

To make the IoT Dashboard show real sensor data, you'll need:
1. An ESP32 board + DHT11 sensor running Arduino firmware that publishes readings over WiFi.
2. A small Node.js + Socket.io server that receives ESP32 data and broadcasts it to connected dashboard clients.
3. A modified dashboard script that connects via WebSocket instead of the built-in simulator.

_(Reach out or open an issue if you'd like the reference implementation for this.)_

---

## 📜 License

This project is shared under a **custom Portfolio Project License** — see [LICENSE](./LICENSE).
You're welcome to view, fork for learning, and reference with attribution. Commercial use, rehosting as your own work, or removing attribution is not permitted.

---

## 👤 Author

**H G Gahana Jain**
Full Stack (MERN) Developer · ECE Undergraduate, VTU
Built WHANI.org (live production platform) · Presented CNN-based plant disease detection research at ISCCSC 2025, Chitkara University
