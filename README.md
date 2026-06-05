<div align="center">

# ⚡ CYPH3R

### Open Source Multi-Model AI Chat Interface

*One beautiful interface. 14+ AI models. Your own API keys. Zero tracking.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Models](https://img.shields.io/badge/AI_Models-14%2B-blueviolet)
![Zero Backend](https://img.shields.io/badge/Backend-None_(100%25_Client_Side)-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-orange)

---

**CYPH3R** is a free, privacy-first AI chat application that runs entirely in your browser.  
Bring your own API keys and instantly access GPT-4o, Claude, Gemini, LLaMA, DeepSeek, Mistral, and many more — all from one clean, premium interface.

No sign-ups. No backend servers. No tracking. Just open `index.html` and start chatting.

</div>

---

## 📑 Table of Contents

- [Why CYPH3R?](#-why-cyph3r)
- [Quick Start (3 Steps)](#-quick-start)
- [Getting Free API Keys](#-getting-free-api-keys)
- [All Features](#-all-features)
- [Workspaces Explained](#-workspaces)
- [Available Models](#-available-models)
- [Arena Mode](#-arena-mode)
- [Settings & Configuration](#%EF%B8%8F-settings--configuration)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Project Structure](#-project-structure)
- [Privacy & Security](#-privacy--security)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Why CYPH3R?

| Problem | CYPH3R's Solution |
|---------|-------------------|
| ChatGPT/Claude require accounts and subscriptions | **No accounts needed** — just open the HTML file |
| Your data gets stored on company servers | **100% client-side** — nothing leaves your browser |
| Locked into one AI provider | **14+ models** from 4 providers in one place |
| Can't compare different AI responses | **Arena Mode** races models against each other |
| AI interfaces look generic | **Obsidian-themed** premium UI with smooth animations |
| Complex setup with npm, Docker, etc. | **Zero setup** — just open `index.html` in any browser |

---

## 🚀 Quick Start

### Step 1 — Download

```bash
git clone https://github.com/YOUR_USERNAME/CYPH3R.git
```

Or click **Code → Download ZIP** on this page and extract it.

### Step 2 — Open

Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).  
That's it. No terminal, no npm install, no build step.

### Step 3 — Add API Keys

On first launch, CYPH3R will ask you to add at least one API key.  
You can get **free keys** in under 2 minutes — see the next section.

> **Tip:** You only need ONE key to start. Groq is the fastest free option.

---

## 🔑 Getting Free API Keys

CYPH3R needs API keys to connect to AI providers. Most providers offer **generous free tiers** — you won't need to pay anything for casual use.

| Provider | Cost | Models You Get | How to Get Key |
|----------|------|----------------|----------------|
| **Groq** | ✅ **Free** | LLaMA 70B ⚡, LLaMA 8B ⚡, Mixtral 8x7B, Gemma2 9B | 1. Go to [console.groq.com/keys](https://console.groq.com/keys) <br> 2. Sign up with Google/GitHub <br> 3. Click "Create API Key" <br> 4. Copy and paste into CYPH3R Settings |
| **Google AI** | ✅ **Free** | Gemini Flash | 1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey) <br> 2. Sign in with Google <br> 3. Click "Create API Key" <br> 4. Copy and paste into CYPH3R Settings |
| **NVIDIA NIM** | ✅ **Free** | LLaMA 70B (NVIDIA) | 1. Go to [build.nvidia.com](https://build.nvidia.com/) <br> 2. Create a free account <br> 3. Get an API key from any model page <br> 4. Copy and paste into CYPH3R Settings |
| **OpenRouter** | 💳 **Pay-per-use** | GPT-4o, Claude Sonnet 4, Grok 3, DeepSeek, Gemini, Hermes, Mistral, + 200 more | 1. Go to [openrouter.ai/keys](https://openrouter.ai/keys) <br> 2. Sign up and add credit ($5 minimum) <br> 3. Create an API key <br> 4. Copy and paste into CYPH3R Settings |

> **Best free combo:** Get both **Groq** + **Google AI** keys. This gives you 5 fast models for free.

---

## ✨ All Features

### Core
| Feature | Description |
|---------|-------------|
| 🤖 **Multi-Model Chat** | Chat with 14+ AI models from Groq, OpenRouter, Google, and NVIDIA |
| ⚡ **Real-Time Streaming** | Responses stream in token-by-token — no waiting for full responses |
| 💬 **Workspaces** | 3 specialized modes (General, Coding, Analysis) with optimized system prompts |
| 🏟️ **Arena Mode** | Race multiple AI models on the same question and see which one wins |
| 💾 **Auto-Save** | All conversations save to your browser automatically |
| 📱 **Fully Responsive** | Works perfectly on desktop, tablet, and mobile |

### Smart Features
| Feature | Description |
|---------|-------------|
| 🎛️ **AutoTune** | Automatically detects if your question is about code, creativity, analysis, or casual chat — and adjusts the AI's temperature/sampling to give better results |
| 🔒 **Stealth Mode** | Obfuscates sensitive keywords using leet-speak, unicode lookalikes, and zero-width joiners to bypass overly aggressive content filters |
| 🧹 **Remove Hedging** | Strips wishy-washy phrases like "I think", "perhaps", "maybe" from AI responses |
| ✂️ **Skip Preambles** | Removes filler openings like "Sure!", "Of course!", "Certainly!" |
| 💬 **Casual Tone** | Auto-converts formal language: "However" → "But", "Utilize" → "Use" |

### API Key Management
| Feature | Description |
|---------|-------------|
| 👁️ **Show/Hide Keys** | Toggle visibility of any saved API key with the eye button |
| 📋 **Copy Key** | One-click copy any key to clipboard |
| ✕ **Remove Key** | Instantly delete a specific key |
| 🔐 **Secure Storage** | Keys are stored separately from chat data in your browser's localStorage |

### Chat Management
| Feature | Description |
|---------|-------------|
| ➕ **New Thread** | Start a fresh conversation (won't create duplicates if current thread is empty) |
| 📋 **Copy Message** | Hover any message to reveal a copy button |
| 📥 **Export Chats** | Download all conversations in the current workspace as a JSON file |
| 🗑️ **Clear Workspace** | Delete all threads in the current workspace at once |
| ❌ **Delete Thread** | Remove individual threads from the sidebar |

### UI & Design
| Feature | Description |
|---------|-------------|
| 🎨 **Theme Switcher** | Choose between 5 premium color themes (Obsidian, Cobalt, Emerald, Amethyst, Crimson) |
| 🌑 **Obsidian Base** | Warm dark palette with glass morphism — easy on the eyes |
| ✨ **Smooth Animations** | FadeUp, scale, shimmer, float, staggered reveals, ripple effects |
| 🔔 **Toast Notifications** | Visual feedback for actions (settings saved, keys copied, errors) |
| 📐 **Glass Morphism** | Frosted-glass sidebar and top bar with backdrop blur |
| 🎯 **First-Time Setup** | Guided onboarding for new users with direct links to get free API keys |

---

## 🏢 Workspaces

CYPH3R has 3 built-in workspaces. Each workspace has its own system prompt, default model, and separate chat history.

| Workspace | Icon | Best For | Default Model |
|-----------|------|----------|---------------|
| **General** | 💬 | Everyday questions, writing, brainstorming | LLaMA 70B (Groq) |
| **Coding** | 💻 | Programming, debugging, code reviews, technical docs | DeepSeek Chat |
| **Analysis** | 🔬 | Research, comparisons, data analysis, deep thinking | Gemini Flash |

**How to switch:** Click any workspace button in the left sidebar. Each workspace maintains its own separate chat history.

---

## 🤖 Available Models

### Free Models (No Credit Card Needed)

| Model | Provider | Speed | Best For |
|-------|----------|-------|----------|
| **LLaMA 3.1 70B** | Groq | ⚡ Ultra-fast | General purpose, coding, analysis |
| **LLaMA 3.1 8B** | Groq | ⚡ Ultra-fast | Quick questions, simple tasks |
| **Mixtral 8x7B** | Groq | ⚡ Fast | Creative writing, multilingual |
| **Gemma2 9B** | Groq | ⚡ Fast | Lightweight tasks |
| **Gemini Flash** | Google AI | 🟢 Fast | Research, analysis, long context |
| **LLaMA 70B** | NVIDIA NIM | 🟢 Medium | Alternative to Groq's LLaMA |

### Paid Models (via OpenRouter — Pay-Per-Use)

| Model | Provider | Best For |
|-------|----------|----------|
| **GPT-4o** | OpenAI | General excellence, reasoning |
| **Claude Sonnet 4** | Anthropic | Long documents, coding, nuance |
| **Grok 3** | xAI | Real-time info, uncensored |
| **DeepSeek Chat** | DeepSeek | Coding, math, logic |
| **Hermes 3 70B** | NousResearch | Instruction following |
| **Mistral Small** | Mistral AI | Efficient, fast, multilingual |
| **Gemini Flash** | Google (via OR) | Analysis, long context |
| **LLaMA 8B** | Meta (via OR) | Quick, lightweight tasks |

> **How to switch models:** Use the dropdown in the top-right corner of the chat area.

---

## 🏟️ Arena Mode

Arena Mode lets you **compare multiple AI models side-by-side** on the same question.

### How It Works

1. Click the **⚡ Arena** button in the top bar (it glows when active)
2. Type your question and send
3. CYPH3R sends your question to **up to 6 models** simultaneously
4. Each response is scored on: length, formatting, relevance, directness, and non-refusal
5. The **winning response** (highest score) is displayed in your chat with a 🏆 badge
6. A live scoreboard shows all models' scores and response times

### Scoring Criteria

| Criteria | Max Points | What It Measures |
|----------|------------|------------------|
| Length & Depth | 25 | Longer, more thorough answers score higher |
| Formatting | 20 | Use of headers, lists, code blocks |
| Non-Refusal | 25 | Doesn't dodge the question |
| Directness | 15 | Gets to the point without filler |
| Relevance | 15 | Uses keywords from your question |

> **Note:** Arena Mode sends up to 3 requests at a time to avoid hitting rate limits on free API tiers.

---

## ⚙️ Settings & Configuration

Open Settings by clicking the **⚙️** gear icon in the bottom-left sidebar.

### API Keys Section
- **Add keys** — Paste your API key into the input field for each provider
- **👁 Show/Hide** — Toggle between `••••••` and the actual key text
- **📋 Copy** — Copy the key to your clipboard
- **✕ Remove** — Delete a specific key from storage
- **Badges** — Green `Free` badge for free providers, yellow `Recommended` for OpenRouter

### Response Engine
| Setting | Default | What It Does |
|---------|---------|--------------|
| **AutoTune** | ✅ ON | Detects your query type and adjusts AI temperature automatically. Code questions get low temperature (precise), creative prompts get high temperature (varied). |
| **Stealth Mode** | ❌ OFF | Applies text obfuscation to bypass content filters. Uses leet-speak, unicode lookalikes, zero-width joiners, and ROT13. |

### Response Cleanup
| Setting | Default | Example |
|---------|---------|---------|
| **Remove Hedging** | ❌ OFF | "I think Python is good" → "Python is good" |
| **Skip Preambles** | ❌ OFF | "Sure! Here's the code:" → "Here's the code:" |
| **Casual Tone** | ❌ OFF | "However, one must utilize..." → "But, one must use..." |

> **Remember to click "Save Settings"** after making changes.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line (without sending) |
| `Ctrl + K` | Focus the input field |
| `Escape` | Close Settings modal / Close mobile sidebar |

---

## 📁 Project Structure

```
CYPH3R/
├── index.html          ← Main app — open this in browser
├── css/
│   └── style.css       ← Complete design system (Obsidian theme)
├── js/
│   └── app.js          ← Engine — API calls, state, UI, all logic
├── README.md           ← You're reading this
├── LICENSE             ← MIT License
└── .gitignore          ← Git ignore rules
```

**Total size:** ~55 KB. No dependencies. No node_modules. No build tools.

---

## 🛡️ Privacy & Security

| Question | Answer |
|----------|--------|
| **Where are my API keys stored?** | Only in your browser's `localStorage`. Never uploaded anywhere. |
| **Is there a backend server?** | No. CYPH3R is 100% client-side HTML/CSS/JS. |
| **Where do API calls go?** | Directly from your browser to the AI provider (Groq, OpenRouter, Google, NVIDIA). No middleman. |
| **Is my chat history stored online?** | No. All conversations are saved locally in your browser only. |
| **Does CYPH3R track usage?** | No. Zero analytics, zero telemetry, zero cookies. |
| **Is it safe to put API keys in?** | Yes — they only exist in your browser's storage and are sent exclusively to the official API endpoints over HTTPS. |
| **What happens if I clear browser data?** | Your API keys and chat history will be erased. Export your chats first using the 📥 Export button. |

---

## 🔧 Troubleshooting

### "Error: Rate limited"
**Cause:** Free API tiers (especially Groq) have strict rate limits.  
**Fix:** Wait 30–60 seconds and try again. For Groq, the limit is ~30 requests per minute on the free tier.

### "Error: Invalid API key"
**Cause:** The key you entered is incorrect, expired, or for the wrong provider.  
**Fix:** Go to Settings → API Keys, delete the key, and paste a fresh one from the provider's dashboard.

### "No models available" (in Arena Mode)
**Cause:** You haven't added any API keys yet.  
**Fix:** Add at least one API key in Settings. Arena Mode works best with 2+ providers configured.

### Responses look weird / markdown not rendering
**Cause:** Some models occasionally return malformed markdown.  
**Fix:** This is a model-side issue. Try switching to a different model (DeepSeek and GPT-4o tend to format well).

### "QuotaExceededError" or app feels slow
**Cause:** Too many long conversations stored in localStorage.  
**Fix:** Use the 🗑️ Clear button to remove old threads, or export & clear. CYPH3R automatically trims old data if storage exceeds 4MB.

### Nothing happens when I click Send
**Cause:** Either no API key is set, or the selected model's provider has no key.  
**Fix:** Check the provider dots in the sidebar footer — only providers with keys show a glowing dot. Make sure your selected model matches a provider with an active key.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** this repository
2. **Create a branch** — `git checkout -b feature/my-feature`
3. **Make your changes** — Keep it vanilla HTML/CSS/JS (no frameworks)
4. **Test** — Open `index.html` in a browser and verify everything works
5. **Commit** — `git commit -m "Add my feature"`
6. **Push** — `git push origin feature/my-feature`
7. **Open a Pull Request** with a clear description

### Ideas for Contributions
- 🌙 Light mode / additional themes
- 🌐 Multilingual UI support
- 📎 File/image upload support
- 🔊 Text-to-speech for responses
- 📊 Token usage tracking
- 🔌 More AI providers (Anthropic direct, Cohere, etc.)

---

## 📄 License

This project is licensed under the **MIT License** — you're free to use, modify, and distribute it. See [LICENSE](LICENSE) for the full text.

---

## 👤 Author

**Kushal Soni**

---

<div align="center">

*Built with ❤️ using pure HTML, CSS, and JavaScript.*  
*No frameworks. No build tools. No complexity. Just open and chat.*

**If you find CYPH3R useful, consider giving it a ⭐ on GitHub!**

</div>
