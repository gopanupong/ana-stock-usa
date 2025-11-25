# Damodaran Stock Analyzer

Web application for analyzing US stocks using Aswath Damodaran's valuation methodology, powered by Gemini AI.

## 🚀 How to Deploy on Vercel

### 1. Prerequisites
- A GitHub/GitLab/Bitbucket account.
- A Vercel account.
- A Google Gemini API Key.

### 2. Setup (Local)
1. Initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Push this code to your GitHub repository.

### 3. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** -> **"Project"**.
2. Import your GitHub repository.
3. Vercel will auto-detect that this is a **Vite** project.
4. **Important:** In the "Environment Variables" section, add your API key:
   - **Key:** `API_KEY`
   - **Value:** `Your_Actual_Gemini_API_Key`
5. Click **Deploy**.

## 🛠️ Tech Stack
- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini (via `@google/genai` SDK)
- **Charts:** Recharts

## 💻 Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` file:
   ```
   API_KEY=your_api_key_here
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
