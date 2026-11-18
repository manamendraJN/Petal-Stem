/**
 * Scripted chat helper. Quick answers + simple keyword matching over the text
 * in /src/content/site.ts. Anything unknown is handed to WhatsApp or the form.
 * The element is persisted across ClientRouter navigations; the log is also kept
 * in sessionStorage so it survives a full reload.
 */
interface Answer {
  id: string;
  button: string;
  keywords: string[];
  answer: string;
  link?: { label: string; href: string };
}
interface Content {
  greeting: string;
  fallback: string;
  answers: Answer[];
  waNumber: string;
  waGeneral: string;
}
interface Msg {
  from: 'bot' | 'me';
  text: string;
  links?: { label: string; href: string; external?: boolean }[];
}
interface State {
  open: boolean;
  log: Msg[];
}

const KEY = 'ps-chat';

export function initChat() {
  const root = document.querySelector<HTMLElement>('[data-chat]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';

  const content: Content = JSON.parse(root.querySelector('[data-chat-content]')?.textContent ?? '{}');
  const toggle = root.querySelector<HTMLButtonElement>('[data-chat-toggle]')!;
  const panel = root.querySelector<HTMLElement>('[data-chat-panel]')!;
  const log = root.querySelector<HTMLElement>('[data-chat-log]')!;
  const form = root.querySelector<HTMLFormElement>('[data-chat-form]')!;
  const input = form.querySelector<HTMLInputElement>('input')!;
  const close = root.querySelector<HTMLButtonElement>('[data-chat-close]')!;

  const load = (): State => {
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
      if (s && Array.isArray(s.log)) return s;
    } catch {}
    return { open: false, log: [{ from: 'bot', text: content.greeting }] };
  };
  const state = load();
  const save = () => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ ...state, log: state.log.slice(-40) }));
    } catch {}
  };

  const wa = (text: string) => `https://wa.me/${content.waNumber}?text=${encodeURIComponent(text)}`;

  const renderMsg = (m: Msg) => {
    const el = document.createElement('div');
    el.className = `msg ${m.from}`;
    const p = document.createElement('p');
    p.textContent = m.text;
    el.appendChild(p);
    m.links?.forEach((l) => {
      const a = document.createElement('a');
      a.href = l.href;
      a.textContent = `${l.label} →`;
      if (l.external) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      el.appendChild(a);
    });
    log.appendChild(el);
  };
  const renderAll = () => {
    log.textContent = '';
    state.log.forEach(renderMsg);
    log.scrollTop = log.scrollHeight;
  };
  const push = (m: Msg) => {
    state.log.push(m);
    renderMsg(m);
    log.scrollTop = log.scrollHeight;
    save();
  };

  const reply = (a: Answer) => push({ from: 'bot', text: a.answer, links: a.link ? [a.link] : undefined });

  const match = (q: string): Answer | null => {
    const t = q.toLowerCase();
    let best: Answer | null = null;
    let score = 0;
    for (const a of content.answers) {
      const s = a.keywords.reduce((n, k) => (t.includes(k.toLowerCase()) ? n + k.length : n), 0);
      if (s > score) {
        score = s;
        best = a;
      }
    }
    return best;
  };

  const ask = (q: string) => {
    const text = q.trim();
    if (!text) return;
    push({ from: 'me', text });
    const a = match(text);
    window.setTimeout(() => {
      if (a) reply(a);
      else
        push({
          from: 'bot',
          text: content.fallback,
          links: [
            { label: 'Ask on WhatsApp', href: wa(`Hello Petal & Stem! ${text}`), external: true },
            { label: 'Send a message', href: '/contact' },
          ],
        });
    }, 280);
  };

  const setOpen = (open: boolean, focus = true) => {
    state.open = open;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      log.scrollTop = log.scrollHeight;
      if (focus) input.focus({ preventScroll: true });
    } else if (focus) toggle.focus({ preventScroll: true });
    save();
  };

  toggle.addEventListener('click', () => setOpen(true));
  close.addEventListener('click', () => setOpen(false));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.open) {
      e.stopPropagation();
      setOpen(false);
    }
  });
  root.querySelectorAll<HTMLButtonElement>('[data-q]').forEach((b) =>
    b.addEventListener('click', () => {
      const a = content.answers.find((x) => x.id === b.dataset.q);
      if (!a) return;
      push({ from: 'me', text: a.button });
      window.setTimeout(() => reply(a), 220);
    }),
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ask(input.value);
    input.value = '';
  });

  renderAll();
  setOpen(state.open, false);
}
