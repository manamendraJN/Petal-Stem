/** Order builder: feeling → bouquet & size → note → delivery, with a live card and a WhatsApp hand-off. */
import type { SceneInit } from '../motion';
import { feelingById, getFeeling, isFeeling, setFeeling, waLink } from '../feeling-state';
import { sizes, home } from '../../content/site';

export const initOrder: SceneInit = (root, { signal }) => {
  const form = root.querySelector<HTMLFormElement>('#order-form');
  if (!form) return;
  const $ = <T extends Element>(s: string) => root.querySelector<T>(s);
  const note = $<HTMLTextAreaElement>('[data-note-input]')!;
  const count = $<HTMLElement>('[data-note-count]');
  const pvNote = $<HTMLElement>('[data-pv-note]')!;
  const pvGreet = $<HTMLElement>('[data-pv-greet]')!;
  const sumFeeling = $<HTMLElement>('[data-sum-feeling]')!;
  const sumBouquet = $<HTMLElement>('[data-sum-bouquet]')!;
  const sumSize = $<HTMLElement>('[data-sum-size]')!;
  const recipient = form.querySelector<HTMLInputElement>('[name="recipient_name"]')!;

  const val = (name: string) => (form.elements.namedItem(name) as RadioNodeList | HTMLInputElement | null)?.value ?? '';

  const params = new URLSearchParams(location.search);
  const qFeeling = params.get('feeling');
  const start = isFeeling(qFeeling) ? qFeeling : getFeeling();
  const qBouquet = params.get('bouquet');

  const showBouquets = (feeling: string, preferred?: string | null) => {
    const opts = [...root.querySelectorAll<HTMLLabelElement>('[data-for-feeling]')];
    let checked = false;
    opts.forEach((o) => {
      const on = o.dataset.forFeeling === feeling;
      o.hidden = !on;
      const input = o.querySelector<HTMLInputElement>('input')!;
      input.disabled = !on;
      if (!on) input.checked = false;
      if (on && preferred && input.value.toLowerCase().replace(/\s+/g, '-') === preferred) {
        input.checked = true;
        checked = true;
      }
    });
    if (!checked) {
      const first = opts.find((o) => !o.hidden)?.querySelector<HTMLInputElement>('input');
      if (first) first.checked = true;
    }
  };

  const update = () => {
    const f = val('feeling');
    if (!isFeeling(f)) return;
    const feeling = feelingById(f);
    sumFeeling.textContent = feeling.label;
    sumBouquet.textContent = val('bouquet') || feeling.bouquets[0].name;
    const size = sizes.find((s) => s.label === val('size')) ?? sizes[1];
    sumSize.textContent = `${size.label} · ${size.price}`;
    const text = note.value.trim();
    pvNote.textContent = text || feeling.cardMessage;
    pvGreet.textContent = recipient.value.trim() ? `Dear ${recipient.value.trim()},` : home.invitation.cardGreeting;
    if (count) count.textContent = `${note.value.length} / ${note.maxLength}`;
  };

  // Preselect from the link or the feeling chosen earlier on the site.
  const radio = form.querySelector<HTMLInputElement>(`input[name="feeling"][value="${start}"]`);
  if (radio) radio.checked = true;
  showBouquets(start, qBouquet);
  update();

  form.addEventListener(
    'change',
    (e) => {
      const t = e.target as HTMLInputElement;
      if (t.name === 'feeling' && isFeeling(t.value)) {
        showBouquets(t.value);
        setFeeling(t.value);
      }
      update();
    },
    { signal },
  );
  form.addEventListener('input', update, { signal });

  root.querySelector('[data-note-help]')?.addEventListener(
    'click',
    () => {
      const f = val('feeling');
      if (isFeeling(f)) note.value = feelingById(f).cardMessage;
      update();
      note.focus();
    },
    { signal },
  );

  root.querySelector('[data-order-wa]')?.addEventListener(
    'click',
    () => {
      if (!form.reportValidity()) return;
      const f = val('feeling');
      const feeling = isFeeling(f) ? feelingById(f) : feelingById('thank-you');
      const lines = [
        'Hello Petal & Stem! I’d like to order flowers:',
        `• Feeling: ${feeling.phrase}`,
        `• Bouquet: ${val('bouquet')} (${val('size')})`,
        `• Note for the card: “${note.value.trim() || feeling.cardMessage}”`,
        `• For: ${val('recipient_name')}${val('recipient_phone') ? `, ${val('recipient_phone')}` : ''}`,
        `• Address: ${val('address')}`,
        `• Delivery: ${val('date')}, ${val('time')}`,
        `• From: ${val('name')}, ${val('phone')}`,
      ];
      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    },
    { signal },
  );
};
