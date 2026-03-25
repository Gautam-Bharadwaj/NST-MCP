# NST-X: AI-Powered Student Companion

**NST-X** is an intelligent desktop application designed for Newton School students. It acts as a comprehensive portal and AI assistant, integrating perfectly with your enrolled courses, lectures, schedule, and practice coding problems. 

The entire app is powered directly by the **Newton MCP (Model Context Protocol)** backend, ensuring all data is perfectly synced to your personal student account.

---

## Download & Install

You do not need any coding knowledge to use this application! It has been built as a standalone desktop program for both Mac and Windows.

**[Download the Latest Release Here](https://github.com/Gautam-Bharadwaj/NST-MCP/releases/latest)**

1. Go to the Releases page (link above).
2. For **Windows**: Download the `.exe` file.
3. For **Mac**: Download the `.dmg` file.
4. Install and open the application.

### How to Log In
The very first time you open exactly **NST-X**, an automated browser window will appear asking you to log into your Newton School account (`@adypu.edu.in`).

Once you log in, your secure session token is saved locally to your device. Next time you open the app, it will already be perfectly synced with your schedule and assignments!

---

## Key Features
-  **AI Chat Assistant:** Ask questions about your upcoming lectures, pending assignments, or your subject-wise completion status.
-  **Smart Schedule:** Native interface showing your upcoming classes and contests across all active semesters.
-  **Assignment Tracker:** Get immediate visibility into what's Overdue, Pending, or Submitted.
-  **Progress Dashboard:** See how much of your course is complete, broken down subject-by-subject.
-  **DSA Practice Helper:** Instantly fetch and filter coding practice questions from the Arena by difficulty or topic.

---

## Advanced: Running From Source (For Developers)

If you are a developer and want to run or build the application from the source code, please ensure you have Node.js installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gautam-Bharadwaj/NST-MCP.git
   cd NST-MCP/ai-student-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run in development mode:**
   ```bash
   npm run dev
   ```
4. **Build installers locally:**
   ```bash
   # Build for Mac
   npm run build
   
   # Build for Windows
   npx electron-builder --win
   ```

---

