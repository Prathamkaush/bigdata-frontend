# 🖥️ BigData Admin Dashboard  
A modern, metallic-UI React admin dashboard for managing users, credits, logs, stats, and monitoring the Big Data API system.

This panel is used by admins to:
- Log in using Admin API Key  
- Manage users  
- Add credits  
- View logs  
- View 30-day analytics & usage  
- Run queries (optional)  

Built with:
- **React + Vite**
- **TailwindCSS**
- **Axios**
- **Lucide-React icons**

---

## 🚀 Features
### ✔ Secure Admin Login  
Stores `admin_api_key` in localStorage  
Protects all routes via `ProtectedLayout.jsx`

### ✔ Users Management  
- Create users  
- View all users  
- See credits & roles  

### ✔ Credits Management  
- Add credits  
- Filters: role, sort, search  
- Pagination  

### ✔ Logs  
- Full API logs  
- Searchable  
- Paginated  
- Shimmer loading UI  

### ✔ Statistics / Charts  
- Today usage  
- 30-day usage  
- Total requests  
- Dynamic API call graph  

---

## 📁 Project Structure

```
/bigdata-admin
│
├── src/
│   ├── api/
│   │   ├── axios.js
│   │   └── admin.js
│   │
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Loader.jsx
│   │   ├── StatCard.jsx
│   │   └── layout/
│   │       └── ProtectedLayout.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── UserCreation.jsx
│   │   ├── Credits.jsx
│   │   ├── Logger.jsx
│   │   ├── StatsPage.jsx
│   │   └── Settings.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── vite.config.js
```

---

## 🔧 Setup Instructions

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Start development server
```bash
npm run dev
```

---

## 🌍 Environment (Important)

Update `axios.js`:

```js
const api = axios.create({
  baseURL: "https://bigdata-backend-s33g.onrender.com",
});
```

---

## 🔐 Admin Login

In the Login page:

1. Enter admin API key  
2. Saved in `localStorage.admin_api_key`  
3. Redirects to dashboard  
4. All pages require this key  

---

## 📦 Production Build

```bash
npm run build
```

Upload `dist/` folder to:
- Vercel  
- Netlify  
- Cloudflare Pages  
- Nginx  

---

## 🌈 UI / UX Enhancements
- Metallic theme  
- Glow animation loader  
- Responsive tables  
- Smooth transitions  
- Shimmer skeleton loading  

---

## 🧑‍💻 Author
**Pratham Kaushik**  
Frontend Developer & System Architect  
GitHub: https://github.com/Prathamkaush

