# 🎓 Smart College Portal

### 🚀 A Modern Web-Based College Management System

<p align="center">
  <img src="https://img.shields.io/badge/React-2026-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-Framework-black?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

<p align="center">
  <b>A centralized digital platform for students, teachers, and administrators.</b>
</p>

---

## 🌟 About the Project

**Smart College Portal** is a web-based application designed to simplify academic and administrative activities within a college. It brings important services together in one place, helping users access information through a role-oriented interface.

The project is built using modern web technologies, including React, Vite, Node.js, Express.js, and MongoDB.

## ✨ Key Features

- 🔐 **Role-Based Login** — Separate login flows for students, teachers, and administrators.
- 👨‍🎓 **Student Management** — Access student-related information and records.
- 📅 **Attendance Management** — Support attendance-related academic activities.
- 📊 **Results & Marks** — Access examination results and marks features.
- 📝 **Assignment Management** — Manage assignment details and deadlines.
- 📤 **Assignment Submission** — Code for document uploads and submission tracking.
- 👨‍🏫 **Teacher Review** — Interface for reviewing submissions and recording marks and feedback.
- 📢 **Notice Board** — Access college notices and announcements.
- 💰 **Fee Management** — Existing fee-related pages and payment integration.
- ☁️ **Cloud Deployment** — Frontend and backend deployment support.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ React.js | Frontend user interface |
| ⚡ Vite | Frontend development and build tool |
| 🟢 Node.js | Backend runtime |
| 🚂 Express.js | REST API and server routes |
| 🍃 MongoDB | Database |
| 🦫 Mongoose | Database modelling |
| 🔑 JWT | Authentication for protected submission routes |
| 📁 Multer | File-upload handling |
| ☁️ Cloudinary | Configured assignment document storage |
| 💳 Razorpay | Existing payment integration |
| ▲ Vercel | Frontend hosting |
| 🚀 Render | Backend hosting |
| 🐙 Git & GitHub | Version control |

## 🏗️ System Architecture

```text
       👨‍🎓 Student
       👨‍🏫 Teacher
       🛡️ Administrator
              |
              ▼
     ⚛️ React + Vite Frontend
              |
          REST API
              |
              ▼
     🟢 Node.js + Express
          /         \
         ▼           ▼
   🍃 MongoDB     ☁️ Cloudinary
   App Records    Uploaded Files
```

## 📂 Project Structure

```text
smart-college-management-portal/
│
├── 📁 src/                 # React frontend
├── 📁 public/              # Static assets
├── 📁 server/
│   ├── 📁 models/          # MongoDB models
│   ├── 📁 routes/          # API routes
│   ├── 📁 middleware/      # Authentication middleware
│   ├── 📁 uploads/         # Local upload directory, if used
│   ├── 📄 server.js        # Backend entry point
│   └── 📄 package.json     # Backend dependencies
│
├── 📄 .gitignore
├── 📄 package.json
└── 📄 README.md
```

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Govindmadhav07/smart-college-management-portal.git
cd smart-college-management-portal
```

### 2️⃣ Install Frontend Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `server/.env` file and add the variable names required by your backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

🔒 **Security:** Never upload real credentials or `.env` files to GitHub.

### 4️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

### 5️⃣ Start the Backend

```bash
npm start
```

Use the start command configured in `server/package.json`. If no `start` script exists, use the script defined for your backend.

### 6️⃣ Start the Frontend

Open another terminal in the project root:

```bash
npm run dev
```

Open the local URL shown by Vite, commonly `http://localhost:5173`.

## 🧪 Testing

The project has undergone development checks, including frontend build, backend syntax, local server startup, and protected endpoint behavior.

Before considering all features production-ready, verify:

- [ ] Student, teacher, and administrator login
- [ ] Attendance and results pages
- [ ] Assignment list and file upload
- [ ] Cloudinary file storage and MongoDB submission record
- [ ] Teacher review, marks, and feedback
- [ ] Notices and fee-related workflows
- [ ] Deployed frontend and backend integration

⚠️ **Current status:** The assignment upload interface and complete upload-to-review workflow still require end-to-end verification.

## 🌐 Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB

Configure the correct backend API URL, environment variables, and CORS settings for your deployment.

## 🔮 Future Enhancements

- 📩 Assignment deadline notifications
- 📚 Assignment submission history
- 🔍 Teacher filters for assignments and students
- 📈 Improved academic reports and analytics
- 🔗 Optional integration of assignment marks with the Results module
- 🧪 Automated API and end-to-end tests
- 📱 Further improvements to mobile usability

## 👨‍💻 Contributors

| Name | Role |
|---|---|
| **Govind Madhav** | Project Developer |
| **Agni Kumar** | Project Developer |

## 🎯 Project Goal

To provide a structured digital platform that makes common college activities easier to access and manage through modern web technologies.

---

<p align="center">
  ⭐ <b>If you find this project useful, consider giving the repository a star!</b> ⭐
</p>

<p align="center">
  Made with ❤️ using React, Node.js & MongoDB
</p>

