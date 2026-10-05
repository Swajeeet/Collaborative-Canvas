# CollaborativeCanvas

A real-time collaborative whiteboard that lets multiple users draw, sketch, and brainstorm together in the browser.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, HTML5 Canvas, RoughJS, STOMP.js, SockJS |
| **Backend** | Java 17+, Spring Boot 3.x, Spring WebSocket (STOMP) |

## Getting Started

### Backend

```bash
cd server
./mvnw spring-boot:run
```

The server starts at `http://localhost:5000`.

> Requires **Java 17+** installed.

### Frontend

```bash
cd client
npm install
npm run dev
```

The app opens at `http://localhost:3000`.

## Features

- Freehand brush, line, rectangle, circle, arrow, and text tools
- Stroke color, fill color, and size customization
- Real-time sync via WebSocket (STOMP/SockJS)
- Undo / Redo (Ctrl+Z / Ctrl+Y)
- Export canvas as PNG