/* ═══════════════════════════════════════════════════════════════
   CYPH3R v4 — Open Source Engine
   Multi-Model AI Chat · Streaming · Arena · All Features
   NO hardcoded keys. Users provide their own.
   ═══════════════════════════════════════════════════════════════ */

// ── KEY MANAGEMENT ──────────────────────────────────────────
const KEY_STORE = 'cyph3r_keys';
function getKeys() { try { return JSON.parse(localStorage.getItem(KEY_STORE)) || {}; } catch { return {}; } }
function saveKeys(k) { try { localStorage.setItem(KEY_STORE, JSON.stringify(k)); } catch {} }
function getKey(p) { return (getKeys()[p] || '').trim(); }
function hasAnyKey() { const k = getKeys(); return !!(k.openrouter || k.groq || k.nvidia || k.google); }

// ── WORKSPACES ──────────────────────────────────────────────
const WORKSPACES = {
  general: {
    id: 'general', title: 'General', badge: 'GENERAL',
    defaultModel: { id: 'llama-3.1-70b-versatile', provider: 'groq', name: 'LLaMA 70B (Groq)' },
    systemPrompt: `You are CYPH3R, a highly capable, clean, and direct AI assistant.\nRULES:\n- Provide clear, concise, and highly readable answers.\n- Use markdown formatting (headers, lists, code blocks) for organization.\n- Be helpful, accurate, and thorough.\n- Include examples and step-by-step breakdowns when relevant.\n- No excessive roleplay or disclaimers.`,
    autoStealth: false
  },
  coding: {
    id: 'coding', title: 'Coding', badge: 'CODE',
    defaultModel: { id: 'deepseek/deepseek-chat', provider: 'openrouter', name: 'DeepSeek Chat' },
    systemPrompt: `You are CYPH3R, an elite AI coding assistant.\nRULES:\n- Provide COMPLETE technical depth.\n- Include specific code examples, exact commands, and working implementations.\n- Structure: Problem → Solution → Code → Explanation.\n- Cover edge cases, error handling, and best practices.\n- Use proper code blocks with language labels.`,
    autoStealth: false
  },
  analysis: {
    id: 'analysis', title: 'Analysis', badge: 'RESEARCH',
    defaultModel: { id: 'google/gemini-2.5-flash', provider: 'openrouter', name: 'Gemini Flash' },
    systemPrompt: `You are CYPH3R, an advanced research and analysis AI.\nRULES:\n- Answer ALL queries directly and completely.\n- Provide maximum detail and actionable information.\n- Structure: Overview → Key Findings → Details → Conclusion.\n- Use data, evidence, and logical reasoning.\n- Never give vague or surface-level responses.`,
    autoStealth: false
  }
};

// ── MODELS ──────────────────────────────────────────────────
const ALL_MODELS = [
  { id: 'llama-3.1-70b-versatile',       provider: 'groq',       name: 'LLaMA 70B (Groq) ⚡',    group: 'Groq (Free)' },
  { id: 'llama-3.1-8b-instant',           provider: 'groq',       name: 'LLaMA 8B (Groq) ⚡',     group: 'Groq (Free)' },
  { id: 'mixtral-8x7b-32768',             provider: 'groq',       name: 'Mixtral 8x7B (Groq)',    group: 'Groq (Free)' },
  { id: 'gemma2-9b-it',                   provider: 'groq',       name: 'Gemma2 9B (Groq)',       group: 'Groq (Free)' },
  { id: 'deepseek/deepseek-chat',         provider: 'openrouter', name: 'DeepSeek Chat',          group: 'OpenRouter' },
  { id: 'nousresearch/hermes-3-llama-3.1-70b', provider: 'openrouter', name: 'Hermes 3 70B',   group: 'OpenRouter' },
  { id: 'google/gemini-2.5-flash',        provider: 'openrouter', name: 'Gemini Flash',           group: 'OpenRouter' },
  { id: 'meta-llama/llama-3.1-8b-instruct', provider: 'openrouter', name: 'LLaMA 8B',            group: 'OpenRouter' },
  { id: 'mistralai/mistral-small-3.2-24b-instruct', provider: 'openrouter', name: 'Mistral Small', group: 'OpenRouter' },
  { id: 'anthropic/claude-sonnet-4',      provider: 'openrouter', name: 'Claude Sonnet 4',        group: 'OpenRouter ($)' },
  { id: 'openai/gpt-4o',                  provider: 'openrouter', name: 'GPT-4o',                 group: 'OpenRouter ($)' },
  { id: 'x-ai/grok-3',                    provider: 'openrouter', name: 'Grok 3',                 group: 'OpenRouter ($)' },
  { id: 'gemini-2.5-flash',               provider: 'google',     name: 'Gemini Flash (Google)',   group: 'Google (Free)' },
  { id: 'meta/llama-3.1-70b-instruct',    provider: 'nvidia',     name: 'LLaMA 70B (NVIDIA)',     group: 'NVIDIA (Free)' },
];

// ── API CALLS ───────────────────────────────────────────────
async function callOpenRouter(model, messages, params, signal) {
  const key = getKey('openrouter');
  if (!key) throw new Error('OpenRouter key not set. Add it in Settings → API Keys.');
  const body = { model, messages, stream: false, temperature: params.temperature ?? 0.7, max_tokens: params.max_tokens ?? 4096 };
  if (params.top_p !== undefined) body.top_p = params.top_p;
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST', signal,
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://github.com/cyph3r', 'X-Title': 'CYPH3R' },
    body: JSON.stringify(body)
  });
  if (res.status === 429) throw new Error('Rate limited — wait a moment and try again.');
  if (res.status === 401) throw new Error('Invalid OpenRouter key. Check Settings.');
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `OpenRouter HTTP ${res.status}`); }
  return (await res.json()).choices?.[0]?.message?.content || '';
}

async function callOpenRouterStream(model, messages, params, onChunk) {
  const key = getKey('openrouter');
  if (!key) throw new Error('OpenRouter key not set.');
  const body = { model, messages, stream: true, temperature: params.temperature ?? 0.7, max_tokens: params.max_tokens ?? 4096 };
  if (params.top_p !== undefined) body.top_p = params.top_p;
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://github.com/cyph3r', 'X-Title': 'CYPH3R' },
    body: JSON.stringify(body)
  });
  if (res.status === 429) throw new Error('Rate limited — wait a moment.');
  if (res.status === 401) throw new Error('Invalid OpenRouter key.');
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `HTTP ${res.status}`); }
  return streamSSE(res, onChunk);
}

async function callGroq(model, messages, params, signal) {
  const key = getKey('groq');
  if (!key) throw new Error('Groq key not set. Add it in Settings.');
  const body = { model, messages, stream: false, temperature: params.temperature ?? 0.7, max_tokens: params.max_tokens ?? 4096 };
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', signal,
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (res.status === 429) throw new Error('Groq rate limited — free tier has strict limits. Wait 60s.');
  if (res.status === 401) throw new Error('Invalid Groq key.');
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `Groq HTTP ${res.status}`); }
  return (await res.json()).choices?.[0]?.message?.content || '';
}

async function callGroqStream(model, messages, params, onChunk) {
  const key = getKey('groq');
  if (!key) throw new Error('Groq key not set.');
  const body = { model, messages, stream: true, temperature: params.temperature ?? 0.7, max_tokens: params.max_tokens ?? 4096 };
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (res.status === 429) throw new Error('Groq rate limited — wait 60s.');
  if (res.status === 401) throw new Error('Invalid Groq key.');
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `Groq HTTP ${res.status}`); }
  return streamSSE(res, onChunk);
}

async function callNvidia(model, messages, params, signal) {
  const key = getKey('nvidia');
  if (!key) throw new Error('NVIDIA key not set.');
  const body = { model, messages, temperature: params.temperature ?? 0.7, max_tokens: params.max_tokens ?? 4096 };
  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST', signal,
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (res.status === 429) throw new Error('NVIDIA rate limited.');
  if (res.status === 401) throw new Error('Invalid NVIDIA key.');
  if (!res.ok) throw new Error(`NVIDIA HTTP ${res.status}`);
  return (await res.json()).choices?.[0]?.message?.content || '';
}

async function callGoogleAI(model, messages, params, signal) {
  const key = getKey('google');
  if (!key) throw new Error('Google AI key not set.');
  const contents = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const sys = messages.find(m => m.role === 'system');
  const body = { contents, generationConfig: { temperature: params.temperature ?? 0.7, maxOutputTokens: params.max_tokens ?? 4096 } };
  if (sys) body.systemInstruction = { parts: [{ text: sys.content }] };
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST', signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  if (res.status === 429) throw new Error('Google AI rate limited.');
  if (res.status === 400 || res.status === 401) throw new Error('Invalid Google AI key.');
  if (!res.ok) throw new Error(`Google AI HTTP ${res.status}`);
  return (await res.json()).candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ── SSE STREAM ──────────────────────────────────────────────
async function streamSSE(res, onChunk) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '', buf = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() || '';
      for (const line of lines) {
        const t = line.trim();
        if (!t || !t.startsWith('data:')) continue;
        const payload = t.slice(5).trim();
        if (payload === '[DONE]') continue;
        try { const d = JSON.parse(payload); const tk = d.choices?.[0]?.delta?.content || ''; if (tk) { full += tk; onChunk(full); } } catch {}
      }
    }
    if (buf.trim().startsWith('data:')) {
      const payload = buf.trim().slice(5).trim();
      if (payload && payload !== '[DONE]') { try { const d = JSON.parse(payload); const tk = d.choices?.[0]?.delta?.content || ''; if (tk) { full += tk; onChunk(full); } } catch {} }
    }
  } finally { reader.releaseLock(); }
  return full;
}

async function queryModel(m, messages, params, signal) {
  switch (m.provider) {
    case 'openrouter': return callOpenRouter(m.id, messages, params, signal);
    case 'groq': return callGroq(m.id, messages, params, signal);
    case 'nvidia': return callNvidia(m.id, messages, params, signal);
    case 'google': return callGoogleAI(m.id, messages, params, signal);
    default: throw new Error('Unknown provider: ' + m.provider);
  }
}

// ── SCORING ─────────────────────────────────────────────────
const REFUSAL_RE = [/I cannot|I can't|I'm unable/i, /I apologize|I'm sorry, but/i, /As an AI|As a language model/i, /I must decline/i];
function scoreResponse(c, q) {
  if (!c || c.length < 10) return 0;
  let s = Math.min(c.length / 40, 25);
  s += Math.min(((c.match(/^#{1,3}\s/gm)||[]).length*3)+((c.match(/^\s*[-*]\s/gm)||[]).length*1.5)+((c.match(/```/g)||[]).length/2*5), 20);
  s += Math.max(25 - REFUSAL_RE.filter(p => p.test(c)).length * 8, 0);
  s += /^(Sure|Of course|Certainly)/i.test(c.trim()) ? 8 : 15;
  const qw = q.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const cl = c.toLowerCase();
  s += (qw.length > 0 ? qw.filter(w => cl.includes(w)).length / qw.length : 0.5) * 15;
  return Math.round(Math.min(s, 100));
}

// ── ARENA ───────────────────────────────────────────────────
async function runArena(models, messages, params, onResult) {
  const ctrl = new AbortController();
  const results = [];
  let done = false;
  const MAX = 3;
  return new Promise(resolve => {
    let settled = 0;
    const finish = () => { if (done) return; done = true; ctrl.abort(); resolve(results); };
    const timer = setTimeout(finish, 40000);
    let grace = null;
    const queue = [...models];
    let running = 0;
    const next = () => {
      while (running < MAX && queue.length) {
        const m = queue.shift(); running++;
        const t0 = Date.now();
        queryModel(m, messages, params, ctrl.signal)
          .then(c => {
            if (done) return;
            const r = { model: m.name, content: c, duration: Date.now() - t0, score: scoreResponse(c, messages[messages.length-1]?.content||''), success: true };
            results.push(r); settled++; running--;
            if (onResult) onResult(r, settled, models.length);
            if (results.filter(x=>x.success).length >= Math.min(3,models.length) && !grace) grace = setTimeout(finish, 3000);
            if (settled === models.length) { clearTimeout(timer); finish(); } else next();
          })
          .catch(e => {
            if (done) return;
            results.push({ model: m.name, content: '', duration: Date.now()-t0, score: 0, success: false, error: e.message });
            settled++; running--;
            if (onResult) onResult(results[results.length-1], settled, models.length);
            if (settled === models.length) { clearTimeout(timer); finish(); } else next();
          });
      }
    };
    if (!models.length) finish(); else next();
  });
}

// ── STEALTH ─────────────────────────────────────────────────
const TRIGGERS = ['hack','exploit','bypass','crack','attack','inject','payload','shellcode','malware','virus','trojan','rootkit','keylogger','botnet','ransomware','phishing','brute','vulnerability','ddos','privilege','escalat','jailbreak'];
const LEET = {a:'4',e:'3',i:'1',o:'0',s:'5',t:'7',g:'9',b:'8'};
const UNI_MAP = {a:'а',e:'е',o:'о',p:'р',c:'с',x:'х',y:'у'};
const Stealth = {
  enabled: false,
  process(text) {
    if (!this.enabled) return text;
    return text.split(/\b/).map(w => {
      if (!TRIGGERS.some(t => w.toLowerCase().includes(t))) return w;
      return w.split('').map(c => {
        if (Math.random() > 0.5) return c;
        const r = Math.random();
        if (r < 0.2) return LEET[c.toLowerCase()] || c;
        if (r < 0.35) return UNI_MAP[c.toLowerCase()] || c;
        if (r < 0.5) return c + '\u200D';
        if (r < 0.65) return Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase();
        return c;
      }).join('');
    }).join('');
  }
};

// ── AUTOTUNE ────────────────────────────────────────────────
const CTX = {
  code: [/\b(code|function|class|bug|debug|api|regex|algorithm|implement|script|compile|error)\b/i, /```/, /\b(python|javascript|java|rust|react|sql|html|css)\b/i],
  creative: [/\b(write|create|story|poem|imagine|fiction|narrative)\b/i],
  analytical: [/\b(analy[sz]e|compare|evaluate|research|explain|why|how does|difference)\b/i],
  technical: [/\b(hack|exploit|pentest|vulnerability|malware|payload|reverse.?engineer|ctf|nmap|burp|metasploit)\b/i],
  chat: [/\b(hi|hello|hey|thanks|what's up)\b/i, /^.{0,25}$/]
};
const CTX_P = { code:{temperature:.15,top_p:.9}, creative:{temperature:1.1,top_p:.95}, analytical:{temperature:.4,top_p:.85}, technical:{temperature:.25,top_p:.9}, chat:{temperature:.7,top_p:.9} };
const AutoTune = {
  enabled: true,
  detect(t) { let b='chat',bs=0; for (const [c,ps] of Object.entries(CTX)) { const s=ps.reduce((a,p)=>a+(p.test(t)?1:0),0); if(s>bs){bs=s;b=c;} } return b; },
  getParams(t) { if (!this.enabled) return {temperature:.7,context:'default'}; const c=this.detect(t); return {context:c,...CTX_P[c],max_tokens:4096}; }
};

// ── STM ─────────────────────────────────────────────────────
const STM = {
  hedge: { enabled:false, fn:t=>t.replace(/\b(I think|perhaps|maybe|probably|I believe|It seems like)\s*/gi,'') },
  direct: { enabled:false, fn:t=>t.replace(/^(Sure,?\s*|Of course,?\s*|Certainly,?\s*|Great question!?\s*|I'd be happy to help[.!]?\s*|Absolutely,?\s*)/i,'') },
  casual: { enabled:false, fn:t=>t.replace(/\bHowever\b/g,'But').replace(/\bTherefore\b/g,'So').replace(/\bFurthermore\b/g,'Also').replace(/\bAdditionally\b/g,'Plus').replace(/\bUtilize\b/g,'Use').replace(/\butilize\b/g,'use') }
};
function applySTM(t) { let r=t; for (const m of Object.values(STM)) { if(m.enabled) r=m.fn(r); } return r; }

// ── MARKDOWN ────────────────────────────────────────────────
function md(raw) {
  if (!raw) return '';
  let t = raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  t = t
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_,l,c)=>`<pre><code class="lang-${l}">${c.trim()}</code></pre>`)
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^---$/gm,'<hr>')
    .replace(/^\s*[-*•]\s+(.+)$/gm,'<li>$1</li>').replace(/^\d+\.\s+(.+)$/gm,'<li>$1</li>')
    .replace(/^&gt; (.+)$/gm,'<blockquote>$1</blockquote>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n{2,}/g,'</p><p>').replace(/\n/g,'<br>');
  t = t.replace(/((?:<li>.*?<\/li>\s*(?:<br>)?)+)/g,'<ul>$1</ul>');
  return `<p>${t}</p>`.replace(/<p>\s*<\/p>/g,'');
}

// ── STATE ───────────────────────────────────────────────────
const ST_KEY = 'cyph3r_v4';
const MAX_ST = 4*1024*1024;
const defState = { theme:'theme-obsidian', conversations:[], currentWorkspace:'coding', activeConvIds:{general:null,coding:null,analysis:null}, arenaEnabled:false, onboardingDone:false, modules:{autotune:true,stealth:false,stm_hedge:false,stm_direct:false,stm_casual:false} };
let state = {...defState};
let svTimer = null;

function saveState() { if(svTimer) clearTimeout(svTimer); svTimer = setTimeout(()=>{try{const j=JSON.stringify(state);if(j.length>MAX_ST)evict();localStorage.setItem(ST_KEY,j);}catch(e){if(e.name==='QuotaExceededError'){evict();try{localStorage.setItem(ST_KEY,JSON.stringify(state));}catch{}}}},300); }
function saveNow() { try{const j=JSON.stringify(state);if(j.length>MAX_ST)evict();localStorage.setItem(ST_KEY,j);}catch(e){if(e.name==='QuotaExceededError'){evict();try{localStorage.setItem(ST_KEY,JSON.stringify(state));}catch{}}} }
function evict() { while(state.conversations.length>5) state.conversations.pop(); for(const c of state.conversations){if(c.messages.length>50) c.messages=c.messages.slice(-30);} toast('Older chats trimmed to free storage.','note'); }

function loadState() {
  try { const s=JSON.parse(localStorage.getItem(ST_KEY)); if(s) state={...defState,...s,modules:{...defState.modules,...(s.modules||{})},activeConvIds:{...defState.activeConvIds,...(s.activeConvIds||{})}}; } catch {}
  document.body.dataset.workspace = state.currentWorkspace;
  document.body.className = state.theme || 'theme-obsidian';
  syncModules();
}
function syncModules() { AutoTune.enabled=state.modules.autotune; Stealth.enabled=WORKSPACES[state.currentWorkspace]?.autoStealth||state.modules.stealth; STM.hedge.enabled=state.modules.stm_hedge; STM.direct.enabled=state.modules.stm_direct; STM.casual.enabled=state.modules.stm_casual; }

// ── TOAST ───────────────────────────────────────────────────
function toast(msg, type='note') {
  const box = document.getElementById('toast-box'); if(!box) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${type==='ok'?'✓':type==='bad'?'✕':'ℹ'}</span> ${esc(msg)}`;
  box.appendChild(el);
  setTimeout(()=>{el.classList.add('toast-bye');setTimeout(()=>el.remove(),300);},4000);
}

// ── CONVERSATIONS ───────────────────────────────────────────
function uid() { return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
function createConv() {
  const ws=state.currentWorkspace;
  const cur=getCurConv(); if(cur&&cur.messages.length===0) return cur;
  const c={id:'c_'+uid(),wsId:ws,title:'New Thread',messages:[],createdAt:Date.now()};
  state.conversations.unshift(c); state.activeConvIds[ws]=c.id; saveState(); return c;
}
function getCurConv() { const id=state.activeConvIds[state.currentWorkspace]; return id?state.conversations.find(c=>c.id===id)||null:null; }
function addMsg(cid,role,content,meta={}) {
  const c=state.conversations.find(x=>x.id===cid); if(!c) return null;
  const m={id:'m_'+uid(),role,content,timestamp:Date.now(),...meta};
  c.messages.push(m);
  if(role==='user'&&c.messages.filter(x=>x.role==='user').length===1) c.title=content.substring(0,40)+(content.length>40?'...':'');
  saveState(); 
  if(cid === state.activeConvIds[state.currentWorkspace]) appendMsgNode(m);
  return m;
}

function appendMsgNode(m) {
  const area = document.getElementById('chat-messages');
  if (area.querySelector('.welcome')) area.innerHTML = '';
  const time = new Date(m.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  const div = document.createElement('div');
  div.className = `message ${m.role}`;
  div.id = m.id;
  div.innerHTML = `<div class="msg-body">
      ${m.role==='assistant'?`<div class="msg-meta"><span class="meta-model">${esc(m.model||'AI')}</span><span>${m.context?m.context.toUpperCase():''}</span><span>${time}</span></div>`:''}
      <div class="msg-content">${md(m.content)}</div>
    </div>
    <div class="msg-actions">
      <button class="msg-action-btn copy-msg-btn" data-content="${btoa(encodeURIComponent(m.content))}">📋 Copy</button>
    </div>`;
  area.appendChild(div);
  const btn = div.querySelector('.copy-msg-btn');
  if (btn) btn.addEventListener('click',()=>{
    try { const text=decodeURIComponent(atob(btn.dataset.content)); navigator.clipboard.writeText(text); toast('Copied to clipboard!','ok'); } catch { toast('Copy failed','bad'); }
  });
  area.scrollTop = area.scrollHeight;
}

function updateMsgNode(mid, content) {
  const el = document.getElementById(mid);
  if (!el) return;
  const c = el.querySelector('.msg-content');
  if (c) c.innerHTML = md(content);
  const btn = el.querySelector('.copy-msg-btn');
  if (btn) btn.dataset.content = btoa(encodeURIComponent(content));
  const area = document.getElementById('chat-messages');
  if (area.scrollHeight - area.scrollTop - area.clientHeight < 120) {
    area.scrollTop = area.scrollHeight;
  }
}

function updMsg(cid,mid,content) { const c=state.conversations.find(x=>x.id===cid); if(!c) return; const m=c.messages.find(x=>x.id===mid); if(m) m.content=content; saveState(); }

// ── UI ──────────────────────────────────────────────────────
function esc(s) { const d=document.createElement('div');d.textContent=s;return d.innerHTML; }

function updateUI() {
  const ws=WORKSPACES[state.currentWorkspace]; if(!ws) return;
  document.getElementById('header-ws-title').textContent=ws.title;
  document.querySelectorAll('.ws-btn').forEach(b=>b.classList.toggle('active',b.dataset.ws===ws.id));
  document.getElementById('st-stealth').style.display=Stealth.enabled?'inline':'none';
  document.getElementById('st-autotune').textContent=AutoTune.enabled?'AutoTune: ON':'AutoTune: OFF';
  updateDots(); renderSidebar(); renderMsgs();
}

function updateDots() {
  const el=document.getElementById('provider-status'); if(!el) return;
  const k=getKeys();
  const dots=[];
  if(k.openrouter) dots.push('<span class="p-dot live" style="background:#f0a030;color:#f0a030" title="OpenRouter ✓"></span>');
  if(k.groq) dots.push('<span class="p-dot live" style="background:#34d399;color:#34d399" title="Groq ✓"></span>');
  if(k.nvidia) dots.push('<span class="p-dot live" style="background:#a78bfa;color:#a78bfa" title="NVIDIA ✓"></span>');
  if(k.google) dots.push('<span class="p-dot live" style="background:#fbbf24;color:#fbbf24" title="Google ✓"></span>');
  el.innerHTML=dots.length?dots.join(''):'<span style="font-size:.6rem;color:var(--text-4)">No keys</span>';
}

function renderSidebar() {
  const list=document.getElementById('chat-list');
  const ws=state.currentWorkspace;
  const chats=state.conversations.filter(c=>c.wsId===ws);
  if(!chats.length){list.innerHTML='<div style="padding:22px;text-align:center;color:var(--text-4);font-size:.82rem;">No threads yet.</div>';return;}
  list.innerHTML=chats.map(c=>`<div class="chat-item ${c.id===state.activeConvIds[ws]?'active':''}" data-id="${c.id}"><span class="chat-item-title">${esc(c.title)}</span><button class="del-btn" data-delete="${c.id}" aria-label="Delete">✕</button></div>`).join('');
}

function renderMsgs() {
  const area=document.getElementById('chat-messages');
  const conv=getCurConv();
  if(!conv||!conv.messages.length) {
    const icons={general:'💬',coding:'💻',analysis:'🔬'};
    const ic=icons[state.currentWorkspace]||'⚡';
    const has=hasAnyKey();
    area.innerHTML=`<div class="welcome stagger">
      <div class="hero-ico">${ic}</div>
      <h2>Welcome to CYPH3R</h2>
      <p>${has?'Your workspace is ready. Type a message below to start.':'Add your API keys in Settings to get started.'}</p>
      ${!has?'<div class="setup-nudge" id="setup-nudge" role="button" tabindex="0">🔑 Set up API keys to start chatting</div>':''}
      <div class="shortcut-row"><span class="shortcut">Enter ↵ Send</span><span class="shortcut">Shift+Enter Newline</span><span class="shortcut">Ctrl+K Focus</span></div>
    </div>`;
    document.getElementById('setup-nudge')?.addEventListener('click',()=>document.getElementById('settings-modal').classList.add('active'));
    return;
  }
  const msgs=conv.messages.filter(m=>m.role!=='system');
  area.innerHTML=msgs.map((m,i)=>{
    const delay=Math.min(i*.04,.25);
    const time=new Date(m.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    return `<div class="message ${m.role}" id="${m.id}" style="animation-delay:${delay}s"><div class="msg-body">
      ${m.role==='assistant'?`<div class="msg-meta"><span class="meta-model">${esc(m.model||'AI')}</span><span>${m.context?m.context.toUpperCase():''}</span><span>${time}</span></div>`:''}
      <div class="msg-content">${md(m.content)}</div>
    </div>
    <div class="msg-actions">
      <button class="msg-action-btn copy-msg-btn" data-content="${btoa(encodeURIComponent(m.content))}">📋 Copy</button>
    </div></div>`;
  }).join('');
  area.scrollTop=area.scrollHeight;

  // Copy message buttons
  area.querySelectorAll('.copy-msg-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      try { const text=decodeURIComponent(atob(btn.dataset.content)); navigator.clipboard.writeText(text); toast('Copied to clipboard!','ok'); } catch { toast('Copy failed','bad'); }
    });
  });
}

function showTyping(){const a=document.getElementById('chat-messages');a.querySelectorAll('.typing-bubble').forEach(e=>e.remove());const el=document.createElement('div');el.className='typing-bubble';el.id='typing-el';el.innerHTML='<div class="dot"></div><div class="dot"></div><div class="dot"></div>';a.appendChild(el);a.scrollTop=a.scrollHeight;}
function hideTyping(){document.getElementById('typing-el')?.remove();}

function renderArena(results,total){
  const p=document.getElementById('arena-panel');p.classList.add('active');
  const sorted=[...results].sort((a,b)=>b.score-a.score);
  p.innerHTML=`<div class="arena-hdr"><span class="pulse"></span>Arena — ${results.length}/${total}</div>${sorted.map(r=>`<div class="arena-row"><span class="name">${esc(r.model)}</span><div class="track"><div class="fill ${r.success?'':'fail'}" style="width:${r.success?r.score:5}%"></div></div><span class="pts ${r.score>=60?'hi':''}">${r.success?r.score:'✕'}</span><span class="dur">${(r.duration/1000).toFixed(1)}s</span></div>`).join('')}`;
}
function hideArena(){document.getElementById('arena-panel').classList.remove('active');}

// ── DROPDOWN ────────────────────────────────────────────────
let ddInit=false;
function initDD(){
  const sel=document.getElementById('model-select'), disp=document.getElementById('model-display');
  const ws=WORKSPACES[state.currentWorkspace]; if(!ws) return;
  const groups={}; ALL_MODELS.forEach(m=>{(groups[m.group]=groups[m.group]||[]).push(m);});
  sel.innerHTML=Object.entries(groups).map(([g,ms])=>`<optgroup label="${g}">${ms.map(m=>`<option value="${m.id}::${m.provider}">${m.name}</option>`).join('')}</optgroup>`).join('');
  const def=ws.defaultModel; sel.value=`${def.id}::${def.provider}`;
  const txt=disp.querySelector('.txt'); if(txt) txt.textContent=def.name;
  if(!ddInit){ sel.addEventListener('change',e=>{const[id,prov]=e.target.value.split('::');const m=ALL_MODELS.find(x=>x.id===id&&x.provider===prov);const t=disp.querySelector('.txt');if(t) t.textContent=m?m.name:'Unknown';}); ddInit=true; }
}
function getModel(){const v=document.getElementById('model-select').value;if(!v)return ALL_MODELS[0];const[id,p]=v.split('::');return ALL_MODELS.find(m=>m.id===id&&m.provider===p)||ALL_MODELS[0];}

// ── SEND ────────────────────────────────────────────────────
let streaming=false, lastSend=0;
async function handleSend(){
  if(streaming) return;
  if(Date.now()-lastSend<1000) return;
  lastSend=Date.now();
  const input=document.getElementById('user-input');
  const text=input.value.trim(); if(!text) return;
  if(!hasAnyKey()){toast('Add at least one API key in Settings first.','bad');document.getElementById('settings-modal').classList.add('active');return;}
  let conv=getCurConv(); if(!conv) conv=createConv();
  const processed=Stealth.process(text);
  addMsg(conv.id,'user',text);
  input.value='';input.style.height='auto';
  renderSidebar();
  const ws=WORKSPACES[state.currentWorkspace];
  const msgs=[{role:'system',content:ws.systemPrompt}];
  const hist=conv.messages.slice(-21,-1);
  for(const m of hist){if(m.role==='user'||m.role==='assistant') msgs.push({role:m.role,content:m.content});}
  msgs.push({role:'user',content:processed});
  const params=AutoTune.getParams(text);
  const stInfo=document.getElementById('st-streaming');
  streaming=true;document.getElementById('send-btn').disabled=true;
  try{
    if(state.arenaEnabled){
      stInfo.textContent='⚡ Racing...';showTyping();
      const k=getKeys();
      const mods=ALL_MODELS.filter(m=>{if(m.provider==='openrouter'&&!k.openrouter)return false;if(m.provider==='groq'&&!k.groq)return false;if(m.provider==='nvidia'&&!k.nvidia)return false;if(m.provider==='google'&&!k.google)return false;return true;}).slice(0,6);
      if(!mods.length) throw new Error('No models available. Add keys in Settings.');
      hideTyping();
      const rr=[];
      const results=await runArena(mods,msgs,params,(r,d,t)=>{rr.push(r);renderArena(rr,t);});
      const winners=results.filter(r=>r.success).sort((a,b)=>b.score-a.score);
      if(!winners.length) throw new Error('All models failed.');
      const best=winners[0];
      addMsg(conv.id,'assistant',applySTM(best.content),{model:best.model+' 🏆',context:params.context});
      stInfo.textContent=`🏆 ${best.model} (${best.score}pts)`;
      setTimeout(hideArena,5000);
    }else{
      const model=getModel();
      if(!getKey(model.provider)) throw new Error(`No ${model.provider} key. Add it in Settings.`);
      stInfo.textContent=`⏳ ${model.name}`;showTyping();
      hideTyping();
      const am=addMsg(conv.id,'assistant','▊',{model:model.name,context:params.context});
      let full='';
      if(model.provider==='openrouter'){full=await callOpenRouterStream(model.id,msgs,params,p=>{updMsg(conv.id,am.id,p+'▊');updateMsgNode(am.id,p+'▊');});}
      else if(model.provider==='groq'){full=await callGroqStream(model.id,msgs,params,p=>{updMsg(conv.id,am.id,p+'▊');updateMsgNode(am.id,p+'▊');});}
      else{full=await queryModel(model,msgs,params);}
      const finalTxt=applySTM(full);
      updMsg(conv.id,am.id,finalTxt);
      updateMsgNode(am.id,finalTxt);
      stInfo.textContent='✓ Done';
    }
  }catch(err){
    hideTyping();
    addMsg(conv.id,'assistant',`⚠️ **Error:** ${err.message||'Something went wrong.'}`,{model:'System'});
    stInfo.textContent='✕ Error';toast(err.message||'Request failed','bad');
  }
  streaming=false;document.getElementById('send-btn').disabled=false;renderSidebar();
}

// ── ONBOARDING ──────────────────────────────────────────────
function showOnboarding(){
  if(state.onboardingDone||hasAnyKey()) return;
  const ov=document.createElement('div');ov.className='ob-overlay';ov.id='ob-overlay';
  ov.innerHTML=`<div class="ob-card"><div class="ob-icon">⚡</div><h2>Welcome to CYPH3R</h2><p>A free, open-source AI chat that lets you use your own API keys to access 14+ models — GPT-4o, Claude, Gemini, LLaMA, DeepSeek and more.</p>
    <div class="ob-field"><label>Groq API Key <span style="color:var(--ok)">(Free & Fast)</span></label><input type="password" class="key-input" id="ob-groq" placeholder="gsk_..." autocomplete="off"><div class="hint">Get free → <a href="https://console.groq.com/keys" target="_blank">console.groq.com/keys</a></div></div>
    <div class="ob-field"><label>Google AI Key <span style="color:var(--ok)">(Free)</span></label><input type="password" class="key-input" id="ob-google" placeholder="AIzaSy..." autocomplete="off"><div class="hint">Get free → <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com</a></div></div>
    <button class="ob-go" id="ob-go">Get Started</button><button class="ob-later" id="ob-later">Skip — I'll add keys in Settings</button></div>`;
  document.body.appendChild(ov);
  document.getElementById('ob-go').addEventListener('click',()=>{
    const k=getKeys();
    const g=document.getElementById('ob-groq').value.trim();
    const gl=document.getElementById('ob-google').value.trim();
    if(g) k.groq=g; if(gl) k.google=gl; saveKeys(k);
    state.onboardingDone=true;saveState();ov.remove();updateDots();renderMsgs();toast('Keys saved! Ready to chat.','ok');
  });
  document.getElementById('ob-later').addEventListener('click',()=>{state.onboardingDone=true;saveState();ov.remove();});
}

// ── EVENTS ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  loadState();initDD();updateUI();
  setTimeout(()=>showOnboarding(),400);

  document.getElementById('send-btn').addEventListener('click',handleSend);
  document.getElementById('user-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleSend();}});
  document.getElementById('user-input').addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,190)+'px';});

  // Workspaces
  document.querySelectorAll('.ws-btn').forEach(btn=>{btn.addEventListener('click',()=>{state.currentWorkspace=btn.dataset.ws;document.body.dataset.workspace=state.currentWorkspace;saveState();syncModules();initDD();updateUI();});});

  // Arena
  document.getElementById('arena-toggle').addEventListener('click',()=>{state.arenaEnabled=!state.arenaEnabled;document.getElementById('arena-toggle').classList.toggle('active',state.arenaEnabled);saveState();if(state.arenaEnabled) toast('Arena ON — next message goes to multiple models.','note');});
  document.getElementById('arena-toggle').classList.toggle('active',state.arenaEnabled);

  // New chat
  document.getElementById('new-chat-btn').addEventListener('click',()=>{createConv();updateUI();});

  // Clear
  document.getElementById('clear-ws-btn').addEventListener('click',()=>{
    const n=WORKSPACES[state.currentWorkspace]?.title||state.currentWorkspace;
    if(confirm(`Clear all threads in "${n}"?`)){state.conversations=state.conversations.filter(c=>c.wsId!==state.currentWorkspace);state.activeConvIds[state.currentWorkspace]=null;saveState();updateUI();toast(`${n} threads cleared.`,'note');}
  });

  // Export
  document.getElementById('export-btn').addEventListener('click',()=>{
    const data=state.conversations.filter(c=>c.wsId===state.currentWorkspace);
    if(!data.length){toast('Nothing to export.','note');return;}
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`cyph3r_${state.currentWorkspace}_export.json`;a.click();URL.revokeObjectURL(url);
    toast('Chats exported!','ok');
  });

  // Chat list
  document.getElementById('chat-list').addEventListener('click',e=>{
    const del=e.target.closest('.del-btn');
    if(del){const id=del.dataset.delete;state.conversations=state.conversations.filter(c=>c.id!==id);if(state.activeConvIds[state.currentWorkspace]===id)state.activeConvIds[state.currentWorkspace]=null;saveState();updateUI();return;}
    const item=e.target.closest('.chat-item');
    if(item){state.activeConvIds[state.currentWorkspace]=item.dataset.id;saveState();renderSidebar();renderMsgs();}
  });

  // Settings
  const modal=document.getElementById('settings-modal');
  document.getElementById('settings-btn').addEventListener('click',()=>{
    const k=getKeys();
    document.getElementById('key-openrouter').value=k.openrouter||'';
    document.getElementById('key-groq').value=k.groq||'';
    document.getElementById('key-nvidia').value=k.nvidia||'';
    document.getElementById('key-google').value=k.google||'';
    document.getElementById('toggle-autotune').checked=state.modules.autotune;
    document.getElementById('toggle-stealth').checked=state.modules.stealth;
    document.getElementById('toggle-stm-hedge').checked=state.modules.stm_hedge;
    document.getElementById('toggle-stm-direct').checked=state.modules.stm_direct;
    document.getElementById('toggle-stm-casual').checked=state.modules.stm_casual;
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === (state.theme || 'theme-obsidian')));
    modal.classList.add('active');
  });
  document.getElementById('settings-close').addEventListener('click',()=>modal.classList.remove('active'));
  modal.addEventListener('click',e=>{if(e.target===modal) modal.classList.remove('active');});

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.getElementById('settings-save').addEventListener('click',()=>{
    saveKeys({openrouter:document.getElementById('key-openrouter').value.trim(),groq:document.getElementById('key-groq').value.trim(),nvidia:document.getElementById('key-nvidia').value.trim(),google:document.getElementById('key-google').value.trim()});
    state.modules.autotune=document.getElementById('toggle-autotune').checked;
    state.modules.stealth=document.getElementById('toggle-stealth').checked;
    state.modules.stm_hedge=document.getElementById('toggle-stm-hedge').checked;
    state.modules.stm_direct=document.getElementById('toggle-stm-direct').checked;
    state.modules.stm_casual=document.getElementById('toggle-stm-casual').checked;
    const activeThemeBtn = document.querySelector('.theme-btn.active');
    if (activeThemeBtn) {
      state.theme = activeThemeBtn.dataset.theme;
      document.body.className = state.theme;
    }
    saveState();syncModules();updateUI();modal.classList.remove('active');toast('Settings saved!','ok');
  });

  // API key actions: Show/Copy/Delete for each provider
  ['openrouter','groq','nvidia','google'].forEach(p=>{
    // Toggle visibility
    document.getElementById(`eye-${p}`).addEventListener('click',()=>{
      const inp=document.getElementById(`key-${p}`);
      inp.type=inp.type==='password'?'text':'password';
    });
    // Copy key
    document.getElementById(`copy-${p}`).addEventListener('click',()=>{
      const v=document.getElementById(`key-${p}`).value.trim();
      if(!v){toast('No key to copy.','note');return;}
      navigator.clipboard.writeText(v).then(()=>toast(`${p} key copied!`,'ok')).catch(()=>toast('Copy failed','bad'));
    });
    // Delete key
    document.getElementById(`del-${p}`).addEventListener('click',()=>{
      document.getElementById(`key-${p}`).value='';
      const k=getKeys();delete k[p];saveKeys(k);updateDots();toast(`${p} key removed.`,'note');
    });
  });

  // Mobile
  document.getElementById('sidebar-toggle')?.addEventListener('click',()=>{document.getElementById('sidebar').classList.add('open');document.getElementById('sidebar-overlay').classList.add('open');});
  document.getElementById('sidebar-close')?.addEventListener('click',closeSB);
  document.getElementById('sidebar-overlay')?.addEventListener('click',closeSB);
  function closeSB(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-overlay').classList.remove('open');}

  // Shortcuts
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey&&e.key==='k'){e.preventDefault();document.getElementById('user-input')?.focus();}
    if(e.key==='Escape'){modal.classList.remove('active');closeSB();}
  });

  document.getElementById('user-input')?.focus();

  // Ripple
  document.addEventListener('click',e=>{
    const btn=e.target.closest('.ripple-btn');if(!btn)return;
    const rect=btn.getBoundingClientRect();const sz=Math.max(rect.width,rect.height)*2;
    const rip=document.createElement('span');rip.className='ripple-wave';
    rip.style.width=rip.style.height=sz+'px';rip.style.left=(e.clientX-rect.left-sz/2)+'px';rip.style.top=(e.clientY-rect.top-sz/2)+'px';
    btn.appendChild(rip);setTimeout(()=>rip.remove(),500);
  });

  // Intersection Observer for reveals
  const obs=new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.isIntersecting)en.target.classList.add('visible');});},{threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
});
