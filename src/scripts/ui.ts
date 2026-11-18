/** Page behaviours that are not scroll animation: header, menu, forms. Re-bound on every page load. */
import { getLenis } from './motion';

function initHeader(signal: AbortSignal) {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true, signal });
}

function initMenu(signal: AbortSignal) {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (!menu || !openBtn || !closeBtn) return;

  const focusables = () => [...menu.querySelectorAll<HTMLElement>('a[href], button')];
  const open = () => {
    menu.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    getLenis()?.stop();
    closeBtn.focus();
  };
  const close = (restore = true) => {
    if (menu.hidden) return;
    menu.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    getLenis()?.start();
    if (restore) openBtn.focus();
  };
  openBtn.addEventListener('click', open, { signal });
  closeBtn.addEventListener('click', () => close(), { signal });
  menu.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) close(false);
  }, { signal });
  document.addEventListener(
    'keydown',
    (e) => {
      if (menu.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = focusables();
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    { signal },
  );
  signal.addEventListener('abort', () => {
    document.documentElement.style.overflow = '';
  });
}

/** Forms post to Formspree with fetch; without JS they still submit normally. */
function initForms(signal: AbortSignal) {
  document.querySelectorAll<HTMLFormElement>('form[data-formspree]').forEach((form) => {
    const status =
      form.querySelector<HTMLElement>('[data-form-status]') ??
      document.querySelector<HTMLElement>(`[data-form-status][data-for="${form.id}"]`);
    form.addEventListener(
      'submit',
      async (e) => {
        if (!form.checkValidity()) return;
        e.preventDefault();
        const btn =
          form.querySelector<HTMLButtonElement>('button[type="submit"]') ??
          document.querySelector<HTMLButtonElement>(`button[type="submit"][form="${form.id}"]`);
        btn?.setAttribute('disabled', '');
        if (status) status.textContent = 'Sending…';
        try {
          if (form.action.includes('YOUR_FORM_ID')) throw new Error('not-configured');
          const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' },
          });
          if (!res.ok) throw new Error('failed');
          form.reset();
          if (status) status.textContent = form.dataset.success ?? 'Thank you! We’ll be in touch soon.';
        } catch (err) {
          if (status)
            status.textContent =
              (err as Error).message === 'not-configured'
                ? 'This form is not connected yet (concept site). Please use WhatsApp, phone or email for now.'
                : 'Sorry, that didn’t send. Please try again, or message us on WhatsApp.';
        } finally {
          btn?.removeAttribute('disabled');
        }
      },
      { signal },
    );
  });
}

export function initUI(signal: AbortSignal) {
  initHeader(signal);
  initMenu(signal);
  initForms(signal);
}
