# sensAi Chat Component Brief

A self-contained brief describing the chat experience built in the sensAi landing page (`components/sensai/chat-page.tsx` + `app/api/chat/route.ts`). Use this to adapt the existing chat in the sensAi product repo so it matches this look and behavior.

The reference implementation is React + Next.js (App Router), TypeScript, with inline styles and `lucide-react` icons. Adapt to whatever stack the target repo already uses — don't add new dependencies if the product already has equivalents (e.g. its own design tokens, UI kit, or icon set).

---

## 1. Layout & shell

Full-viewport vertical flex layout with three regions:

1. **Header** (top, fixed height ~62px)
2. **Chat area** (middle, scrollable, flex: 1)
3. **Composer** (bottom, fixed height)

Shell rules:
- Height: `100vh` with `100dvh` fallback for mobile (avoids iOS Safari address-bar jump).
- Background: light cool grey `#eef1f8`.
- Font: system stack — `-apple-system, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif`.
- Primary text: `#0b1530`. Soft text: `#475069`. Muted: `#7a849c`.

### Design tokens (use these names if you adopt them)
```
bg:        #eef1f8   (page background)
bgDeeper:  #e6ebf5   (hover surfaces)
ink:       #0b1530   (primary text)
inkSoft:   #475069   (secondary text)
blue:      #0c2c63   (primary brand / user bubble / send button)
blueBright:#1a44a8   (links)
rule:      #dfe4ee   (borders / dividers)
card:      #ffffff   (assistant bubble, composer surface)
muted:     #7a849c   (placeholder, tertiary text, typing dots)
```

If the product already has a design system, map these to its closest tokens rather than hard-coding.

---

## 2. Header

- 14px vertical / 24px horizontal padding, bottom border `1px solid rule`.
- Translucent white background `rgba(255,255,255,0.6)` with `backdrop-filter: blur(12px)`.
- Three slots, left to right:
  1. **Back button** — 34×34 rounded-8 button with `lucide-react` `ArrowLeft` icon. Links to `/` (or whatever the host page is). Hover background `bgDeeper`.
  2. **Brand** — `sensai-mascot.png` (34×34, radius 8) + the wordmark `sens` + uppercase `A` (1.15× size, weight 700, no letter-spacing) + `i`, all weight 600, 20px, letter-spacing `0.08em`, color `ink`.
  3. **New chat button** (only when `messages.length > 0`) — small pill: `RotateCcw` icon + label "New chat", 12px text, weight 500, 1px border, radius 8, transparent → `bgDeeper` on hover. Resets messages, regenerates the session id, clears input, re-shows quick actions.

---

## 3. Empty state (no messages)

Centered column, padded 24px sides:
- Mascot image, 72×72, radius 16, with a `fade-in` animation, 24px bottom margin.
- `h1`: "Hi! I'm sensAi" — 26px, weight 600, color `ink`, no margin.
- Subhead: "Your adaptive intelligence assistant. Ask me anything about how sensAi can help your iGaming operation." — 15px, color `inkSoft`, max-width 440px, line-height 1.55, 8px top margin.
- **Quick-action pills** (32px top margin, flex-wrap, 10px gap, max-width 520px, centered):
  - 4 suggestion chips. Default copy:
    - "What is sensAi?"
    - "How does sensAi detect bonus abuse?"
    - "Is sensAi only for iGaming?"
    - "Do I need to change my CRM platform?"
  - Pill style: 10×18 padding, 13px text weight 500, 1px `rule` border, radius 999, white background, `ink` text.
  - Hover: background → `blue`, border → `blue`, text → white.
  - Click: copies the text into the input and focuses the textarea (does **not** auto-send — gives the user a chance to edit).

For the product chat, replace the suggestion copy with product-context prompts (e.g. "Show me high-risk accounts today", "Why did this player score drop?"), but keep the structure.

---

## 4. Messages list

When `messages.length > 0`, render a centered column: `max-width: 680px; margin: 0 auto; padding: 24px`.

For each message:
- Wrapper: `display:flex`, `align-items:flex-start`, `gap:12`, `margin-bottom:16`.
- `justify-content`: `flex-end` for user, `flex-start` for assistant.
- Apply a `fade-in` entrance animation on mount.

### Assistant message
- Mascot avatar 32×32, radius 8, 4px top margin, flex-shrink 0, on the **left** of the bubble.
- Bubble: white background, 1px `rule` border, `ink` text.
- Padding: `12px 16px`. Font: 14px / 1.55.
- Border radius: `16px 16px 16px 4px` (squared bottom-left corner, "tail" toward avatar).
- Max-width: 80% of column.

### User message
- No avatar.
- Bubble: `blue` background, white text. 40px left margin so it never butts against the left edge.
- Same padding/font.
- Border radius: `16px 16px 4px 16px` (squared bottom-right corner).
- Max-width: 80%.

### Streaming / typing indicator
While the assistant message is empty and streaming, render three pulsing dots inside the assistant bubble:
- Inline-flex, gap 5, padding `4px 2px`.
- Each dot: 6×6, radius 50%, color `muted`, animated with `dotPulse` 1.2s ease-in-out infinite, with staggered `animation-delay` of `0s`, `0.15s`, `0.3s`.

### Markdown rendering for assistant text
Lightweight, no library — just a recursive renderer:
- Paragraphs: split on blank lines; render as `<p>` with `line-height: 1.55`, 8px top margin (except the first).
- **Bold**: `**text**` → `<strong style={fontWeight: 600}>`.
- **Links**: `[label](url)` → `<a target="_blank" rel="noopener noreferrer">` styled with color `blueBright`, underline, `text-underline-offset: 2px`, weight 500.
- **Bullets**: lines starting with `-`, `*`, `•`, or a leading emoji are bullets.
  - Render as `<ul>` with 8px top/bottom margin, `flex-direction: column`, gap 6.
  - Each `<li>`: flex row, gap 8, font 14 / 1.55. Bullet glyph is the leading emoji if present, otherwise `•`.

User messages render as plain text — no markdown.

### Auto-scroll
Keep an empty `<div ref={messagesEndRef} />` at the end and call `scrollIntoView({ behavior: 'smooth' })` whenever `messages` change. Focus the textarea on mount.

---

## 5. Composer (input area)

- Top border `1px solid rule`, translucent background `rgba(255,255,255,0.5)`, `backdrop-filter: blur(8px)`, padding `16px 24px`.
- Inner container: `max-width: 680px`, centered, mirrors the messages column.

Composer card:
- Flex row, `align-items: flex-end`, gap 12.
- White background, 1px `rule` border, radius 14, padding `12px 16px`.
- Subtle shadow: `0 4px 12px -6px rgba(15,28,70,0.1)`.

**Textarea**
- Single line that grows: `rows={1}`, `min-height: 24`, `max-height: 128`, `resize: none`.
- Transparent background, no border, no outline, font 14 inherit, color `ink`.
- Placeholder: "Ask me anything about sensAi..." (replace with product-appropriate copy).
- Keyboard: Enter sends; Shift+Enter inserts newline. Disabled while streaming.

**Send button**
- 34×34, radius 10, `lucide-react` `Send` icon (size 15).
- Enabled state: background `blue`, white icon, cursor pointer.
- Disabled state (empty input or streaming): background `bgDeeper`, icon color `muted`, default cursor.
- 0.2s ease transitions on background/color.

**Footer microcopy**
Below the composer card, centered: "Powered by sensAi" — 10px, color `muted`, opacity 0.5, 8px top margin. Replace as appropriate for the product (e.g. "sensAi may make mistakes — verify critical actions").

---

## 6. Behavior & state

State held by the chat component:
```ts
messages: { role: 'user' | 'assistant', content: string }[]
input: string
streaming: boolean
showQuickActions: boolean
sessionId: string  // generated client-side: `chat_${Date.now()}_${randomBase36}`
```

Send flow:
1. Guard: ignore if `input` is blank or `streaming` is true.
2. Hide quick actions; append the user message; clear input; set `streaming=true`.
3. Immediately append a placeholder assistant message with `content: ""` (this is what triggers the typing-dots indicator).
4. POST to `/api/chat` with `{ sessionId, messages }` (full transcript so far, role+content only).
5. Read the response as an SSE stream: lines starting with `data: ` carry JSON `{ text: "..." }` deltas. Accumulate into the last assistant message on each chunk via `setMessages`. The terminator is `data: [DONE]`.
6. On error, replace the last assistant message with: "Sorry, something went wrong. Please try again."
7. `finally`: `streaming = false`.

Reset ("New chat"): clears messages, clears input, generates a new `sessionId`, re-shows quick actions.

---

## 7. API contract

**Request** — `POST /api/chat`
```json
{
  "sessionId": "chat_1717000000000_abc1234",
  "messages": [
    { "role": "user", "content": "What is sensAi?" },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response** — `text/event-stream`
- `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`.
- Event lines: `data: {"text":"<delta>"}\n\n` per token chunk.
- Terminator: `data: [DONE]\n\n`.
- Errors: JSON with `{ error }` and an appropriate status (400 invalid request, 429 rate-limited, 500 server).

Server side (Next.js route handler) responsibilities — adapt to the product's framework if different:
- Per-IP rate limit (10 messages / 60s).
- Cap conversation length (≤ 50 messages).
- Load `system-prompt.md` (and an optional FAQ knowledge file) from disk and pass as the `system` parameter.
- Stream from Anthropic SDK: `client.messages.stream({ model, max_tokens: 1024, system, messages })` and forward `content_block_delta` text events as SSE.
- Persist conversations by `sessionId` to whatever the product uses (the landing page uses Supabase REST; the product likely has its own DB).

If the product chat already has its own backend/streaming protocol, **keep the product's backend** and only change the client to render the messages, composer, and quick actions per this brief — the visual + interaction layer is the part to port.

---

## 8. Animations (CSS)

```css
@keyframes dotPulse {
  0%, 60%, 100% { opacity: 0.3; transform: scale(1); }
  30%           { opacity: 1;   transform: scale(1.3); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(2px); }
  to   { opacity: 1; transform: translateY(0); }
}

.sensai-dot-pulse { animation: dotPulse 1.2s ease-in-out infinite; }
.sensai-fade-in   { animation: fadeIn 0.4s ease; }
```

Apply `.sensai-fade-in` to the empty-state mascot and to each message wrapper.

---

## 9. Responsive

The shell uses `100dvh`. At ≤640px, tighten paddings:
- Header: `10px 14px`.
- Empty-state side padding: 14px. Heading shrinks to 22px.
- Quick-action pills: 12px text, `8px 14px` padding.
- Messages container: `16px 12px`.
- Composer wrapper: `12px`.

The 680px max-width content column collapses naturally on narrow screens.

---

## 10. Assets

- Mascot image: `/sensai-mascot.png` (used at 32px in messages, 34px in header, 72px in empty state). Use whatever equivalent the product has — keep it consistently rounded (radius 8 small, 16 large).
- Icons (`lucide-react`): `ArrowLeft`, `RotateCcw`, `Send`. Replace with the product's icon set if available.

---

## 11. What to keep vs. adapt in the product

**Keep verbatim:**
- Layout structure (header / scroll area / composer).
- Message bubble shapes, colors, asymmetric border-radius (rounded except the corner closest to the speaker).
- Streaming dot indicator.
- Smooth auto-scroll, Enter-to-send / Shift+Enter for newline, growing textarea.
- Markdown rendering rules (bold, links, bullets, paragraphs).
- Empty state with mascot + quick-action pills that prefill (not auto-send) the input.
- "New chat" button that resets the session id.

**Adapt to the product:**
- Suggestion-pill copy (use product-context prompts).
- Composer placeholder + footer microcopy.
- The brand colors only if the product has its own palette — otherwise apply the tokens above.
- Backend integration: keep the product's existing endpoint, auth, persistence; only ensure the client expects an SSE stream of `data: {"text": "..."}` deltas (or trivially translate from the product's existing stream format).
- Routing: replace the `Link href="/"` back button with whatever "exit chat" navigation the product uses.

If anything in the product chat is genuinely better (e.g. a richer markdown renderer, attachments, threads), keep it — this brief is the visual/interaction baseline, not a ceiling.
