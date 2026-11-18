/** Split an element's text into word spans (reversible). Screen readers still read the words in order. */
export function splitWords(el: HTMLElement, text = el.textContent ?? '') {
  const original = el.innerHTML;
  el.textContent = '';
  const words = text.trim().split(/\s+/);
  const spans = words.map((w, i) => {
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = w;
    el.appendChild(s);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    return s;
  });
  return { spans, restore: () => (el.innerHTML = original) };
}
