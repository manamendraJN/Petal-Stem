/** The visitor's chosen feeling, shared across scenes and pages. */
import { feelings, whatsapp, business, type FeelingId } from '../content/site';

const KEY = 'ps-feeling';
const EVENT = 'ps:feeling';

export function isFeeling(v: unknown): v is FeelingId {
  return typeof v === 'string' && feelings.some((f) => f.id === v);
}

export function getFeeling(fallback: FeelingId = 'thank-you'): FeelingId {
  try {
    const v = sessionStorage.getItem(KEY);
    if (isFeeling(v)) return v;
  } catch {}
  return fallback;
}

export function setFeeling(id: FeelingId) {
  try {
    sessionStorage.setItem(KEY, id);
  } catch {}
  document.dispatchEvent(new CustomEvent(EVENT, { detail: id }));
}

export function onFeeling(fn: (id: FeelingId) => void, signal: AbortSignal) {
  document.addEventListener(EVENT, (e) => fn((e as CustomEvent<FeelingId>).detail), { signal });
}

export function feelingById(id: FeelingId) {
  return feelings.find((f) => f.id === id) ?? feelings[0];
}

export function waLink(text: string) {
  return `https://wa.me/${business.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function waOrderLink(id: FeelingId) {
  return waLink(whatsapp.order.replace('{phrase}', feelingById(id).phrase));
}
