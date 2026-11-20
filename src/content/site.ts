/**
 * ─────────────────────────────────────────────────────────────
 *  PETAL & STEM — all business text and product data lives here.
 *  Edit this file to change words, prices, contact details and
 *  chat answers without touching the design.
 *
 *  Anything in [square brackets] is a placeholder you must replace.
 *  Testimonials / notes / projects marked "Sample" are invented
 *  examples for a concept project — replace or remove them.
 * ─────────────────────────────────────────────────────────────
 */

export const business = {
  name: 'Petal & Stem',
  shortName: 'Petal & Stem',
  kind: 'Florist',
  city: '[Kandy]',
  country: 'Sri Lanka',
  tagline: 'Flowers that say it for you.',
  description:
    'Hand-arranged bouquets for every feeling, each with a handwritten note. Same-day delivery in [Kandy], wedding and event flowers, and weekly flowers for homes and offices.',
  contact: {
    phoneDisplay: '[Phone: +94 XX XXX XXXX]',
    /** Digits only for the tel: link. Replace with the real number. */
    phoneHref: 'tel:+94XXXXXXXXX',
    whatsappDisplay: '[WhatsApp: +94 XX XXX XXXX]',
    /** Digits only, country code first, no "+" — used in wa.me links. Replace. */
    whatsappNumber: '94XXXXXXXXX',
    email: '[hello@your-domain.lk]',
    emailHref: 'mailto:hello@your-domain.example',
    address: '[Shop address, street, Kandy]',
    deliveryHours: '[Delivery hours, e.g. Mon–Sat 8:00 am – 7:00 pm]',
    shopHours: '[Shop hours, e.g. Mon–Sat 7:30 am – 7:30 pm]',
    sameDayCutoff: '[2:00 pm]',
    deliveryArea: '[Kandy city and nearby areas]',
    deliveryFee: '[LKR delivery fee]',
    paymentMethods: '[Payment methods, e.g. card, bank transfer, cash on delivery]',
  },
  /** Formspree endpoint — create a form at formspree.io and paste its ID. */
  formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
  social: {
    instagram: '[Instagram URL]',
  },
  studio: {
    name: 'Depthwyn',
    /** Depthwyn's main website (linked from the footer's concept-project note). */
    url: 'https://business-site.depthwyn.workers.dev/',
  },
  /** Used for canonical URLs and the social preview. Replace when deployed. */
  siteUrl: 'https://petal-and-stem.example',
} as const;

export const nav = [
  { label: 'Bouquets', href: '/bouquets' },
  { label: 'Weddings & Events', href: '/weddings-events' },
  { label: 'Subscription', href: '/subscription' },
  { label: 'Contact', href: '/contact' },
] as const;

/* ───────────────────────── Feelings & bouquets ───────────────────────── */

export type FeelingId = 'thank-you' | 'sorry' | 'congratulations' | 'love' | 'get-well';

export interface Bouquet {
  id: string;
  name: string;
  description: string;
  flowers: string;
  photoNote: string;
}

export interface Feeling {
  id: FeelingId;
  label: string;
  /** Short phrase used in sentences: "a ___ bouquet" */
  phrase: string;
  /** One-line promise shown on the menu. */
  line: string;
  /** Written on the card in the final scene. */
  cardMessage: string;
  bouquets: Bouquet[];
}

export const sizes = [
  { id: 'petite', label: 'Petite', note: 'A small, hand-tied posy', price: '[LKR price]' },
  { id: 'classic', label: 'Classic', note: 'Our everyday favourite', price: '[LKR price]' },
  { id: 'generous', label: 'Generous', note: 'For when it really matters', price: '[LKR price]' },
] as const;

export const feelings: Feeling[] = [
  {
    id: 'thank-you',
    label: 'Thank you',
    phrase: '“thank you”',
    line: 'For the favour, the kindness, the person who showed up.',
    cardMessage: 'Thank you — for so much more than I ever said out loud.',
    bouquets: [
      {
        id: 'warm-light',
        name: 'Warm Light',
        description: 'Soft peach roses with chamomile and silver eucalyptus. Warm, open and easy to love.',
        flowers: 'Peach garden roses · chamomile · eucalyptus',
        photoNote: 'Photo: the “Warm Light” bouquet, 4:5, about 1600×2000',
      },
      {
        id: 'small-kindness',
        name: 'Small Kindness',
        description: 'A little hand-tied posy of cream ranunculus and fresh greens. Small, but it says a lot.',
        flowers: 'Cream ranunculus · spray roses · fresh greens',
        photoNote: 'Photo: the “Small Kindness” posy, 4:5, about 1600×2000',
      },
    ],
  },
  {
    id: 'sorry',
    label: 'I’m sorry',
    phrase: '“I’m sorry”',
    line: 'Gentle colours for a gentle word. No grand gesture, just honest.',
    cardMessage: 'I’m sorry. You matter more to me than being right.',
    bouquets: [
      {
        id: 'gentle-return',
        name: 'Gentle Return',
        description: 'White lisianthus, blush tulips and soft sage. Quiet colours that make room to talk.',
        flowers: 'White lisianthus · blush tulips · sage greens',
        photoNote: 'Photo: the “Gentle Return” bouquet, 4:5, about 1600×2000',
      },
      {
        id: 'quiet-words',
        name: 'Quiet Words',
        description: 'White roses wrapped in silver eucalyptus. Simple, calm and sincere.',
        flowers: 'White roses · silver eucalyptus',
        photoNote: 'Photo: the “Quiet Words” bouquet, 4:5, about 1600×2000',
      },
    ],
  },
  {
    id: 'congratulations',
    label: 'Congratulations',
    phrase: '“congratulations”',
    line: 'New job, new home, new baby, big exam. Colour that cheers out loud.',
    cardMessage: 'Congratulations! You did it — and I could not be prouder.',
    bouquets: [
      {
        id: 'big-day',
        name: 'Big Day',
        description: 'Coral peonies, golden sprays and bright ranunculus. A bouquet that throws confetti.',
        flowers: 'Coral peonies · golden solidago · ranunculus',
        photoNote: 'Photo: the “Big Day” bouquet, 4:5, about 1600×2000',
      },
      {
        id: 'bright-start',
        name: 'Bright Start',
        description: 'Sunny gerberas with mixed garden flowers. Happy from every angle.',
        flowers: 'Gerberas · garden roses · seasonal fillers',
        photoNote: 'Photo: the “Bright Start” bouquet, 4:5, about 1600×2000',
      },
    ],
  },
  {
    id: 'love',
    label: 'I love you',
    phrase: '“I love you”',
    line: 'Deep roses for the words you mean every day.',
    cardMessage: 'I love you. Today, and on all the ordinary days too.',
    bouquets: [
      {
        id: 'deep-rose',
        name: 'Deep Rose',
        description: 'Velvet-red roses, tied by hand with a silk ribbon. Classic, because it works.',
        flowers: 'Deep red roses · dark foliage · silk ribbon',
        photoNote: 'Photo: the “Deep Rose” bouquet, 4:5, about 1600×2000',
      },
      {
        id: 'every-day',
        name: 'Every Day',
        description: 'Blush roses and sweet peas. Soft, romantic and a little bit shy.',
        flowers: 'Blush roses · sweet peas · waxflower',
        photoNote: 'Photo: the “Every Day” bouquet, 4:5, about 1600×2000',
      },
    ],
  },
  {
    id: 'get-well',
    label: 'Get well soon',
    phrase: '“get well soon”',
    line: 'A little sunshine for the bedside table. Light, fresh, low scent.',
    cardMessage: 'Get well soon. Thinking of you, and sending a little sunshine.',
    bouquets: [
      {
        id: 'sunny-window',
        name: 'Sunny Window',
        description: 'Yellow tulips and white daisies. Bright without being loud.',
        flowers: 'Yellow tulips · daisies · fresh greens',
        photoNote: 'Photo: the “Sunny Window” bouquet, 4:5, about 1600×2000',
      },
      {
        id: 'soft-rest',
        name: 'Soft Rest',
        description: 'A low arrangement in its own jar, so nobody has to find a vase. Gentle scent.',
        flowers: 'Spray roses · lisianthus · greens, in a jar',
        photoNote: 'Photo: the “Soft Rest” jar arrangement, 4:5, about 1600×2000',
      },
    ],
  },
];

/** The three feelings offered by the picker in the hero. */
export const heroFeelings: FeelingId[] = ['thank-you', 'sorry', 'congratulations'];

/** Words that float in the air in the first scene. */
export const floatingWords = ['thank you', 'I’m sorry', 'congratulations', 'I love you', 'get well soon'];

/* ───────────────────────── Home page copy ───────────────────────── */

export const home = {
  meta: {
    title: 'Petal & Stem — Flowers that say it for you · [Kandy]',
    description:
      'Hand-arranged bouquets for every feeling, each with a handwritten note. Same-day delivery in [Kandy], Sri Lanka.',
  },
  hook: {
    headline: 'Some things are hard to say.',
    line: 'Thank you. I’m sorry. Congratulations. I love you. You know what you feel — finding the words is the hard part.',
  },
  turn: {
    headline: 'Flowers that say it for you.',
    line: 'Pick a feeling. We’ll arrange the bouquet that says it.',
    pickerLabel: 'What do you want to say?',
    link: { label: 'See every bouquet', href: '/bouquets' },
  },
  proof: {
    kicker: 'How we make them',
    headline: 'Arranged by hand. Written by hand.',
    line: 'Flowers arrive fresh each morning. Every bouquet is made for the feeling behind it, and every note is written by hand.',
    points: ['Fresh flowers every morning', 'Arranged by hand, for the feeling', 'A handwritten note, every time'],
    link: { label: 'See every bouquet', href: '/bouquets' },
  },
  offer: {
    kicker: 'The menu',
    headline: 'Choose by feeling.',
    line: 'Same-day delivery in [Kandy] when you order before [2:00 pm].',
    link: { label: 'See the full menu', href: '/bouquets' },
  },
  ease: {
    kicker: 'Ordering',
    headline: 'Three steps. Delivered today.',
    steps: [
      { title: 'Choose a feeling', text: 'Thank you, sorry, congratulations — start with what you mean.' },
      { title: 'Write your note', text: 'Tell us what to say. We write it by hand on a card.' },
      { title: 'We deliver today', text: 'Order before [2:00 pm] for same-day delivery in [Kandy].' },
    ],
    link: { label: 'Start your order', href: '/order' },
  },
  invitation: {
    headline: 'These will say it for you.',
    line: 'Choose your feeling and send it today. We’ll do the rest — by hand.',
    cardGreeting: 'Dear [their name],',
    cardSign: 'with love, [you]',
  },
};

/** Sample notes shown in the proof scene — clearly marked as samples. */
export const sampleNotes = [
  {
    text: 'You stayed late every night so I could finish. Thank you.',
    from: 'Sample note',
  },
  {
    text: 'Sorry I forgot. You never do. Dinner on me?',
    from: 'Sample note',
  },
  {
    text: 'Congratulations, Doctor! Amma and Thaththa are so proud.',
    from: 'Sample note',
  },
];

/** Sample customer words — replace with real reviews. */
export const sampleReviews = [
  { quote: '[Sample review] “The note was exactly what I couldn’t say myself.”', name: '[Customer name]' },
  { quote: '[Sample review] “Ordered at noon, delivered by four. She cried (the good kind).”', name: '[Customer name]' },
];

/* ───────────────────────── WhatsApp messages ───────────────────────── */

export const whatsapp = {
  general: 'Hello Petal & Stem! I’d like to ask about flowers.',
  /** {phrase} is replaced with the chosen feeling, e.g. “thank you”. */
  order: 'Hello Petal & Stem! I’d like to order a {phrase} bouquet for delivery today in [Kandy]. Could you help me?',
  wedding: 'Hello Petal & Stem! We’re planning a wedding/event and would love to talk about flowers.',
  subscription: 'Hello Petal & Stem! I’d like to start a weekly flower subscription.',
};

/* ───────────────────────── Bouquets page ───────────────────────── */

export const bouquetsPage = {
  meta: {
    title: 'Bouquets by feeling — Petal & Stem · [Kandy]',
    description:
      'Choose flowers by what you want to say: thank you, sorry, congratulations, I love you, get well soon. Hand-arranged with a handwritten note. Same-day delivery in [Kandy].',
  },
  headline: 'Start with the feeling.',
  line: 'Every bouquet is arranged by hand for what you want to say, and comes with a handwritten note. Flowers change with the morning market, so yours may vary a little — the feeling never does.',
  delivery: [
    { title: 'Same-day in [Kandy]', text: 'Order before [2:00 pm] and we deliver today.' },
    { title: 'Delivery fee', text: '[LKR delivery fee] within [delivery area].' },
    { title: 'Handwritten note', text: 'Free with every bouquet. You write it, we pen it.' },
  ],
};

/* ───────────────────────── Weddings page ───────────────────────── */

export const weddingsPage = {
  meta: {
    title: 'Wedding & event flowers — Petal & Stem · [Kandy]',
    description:
      'Wedding and event flowers arranged by hand in [Kandy]: bridal bouquets, poruwa and ceremony flowers, table pieces and more. Start with a conversation.',
  },
  headline: 'Your day, in flowers.',
  line: 'We start with how you want the day to feel — then design every bouquet, arch and table around it.',
  services: [
    { title: 'Bridal bouquets', text: 'Hand-tied for you, to match the dress, the season and the feeling.' },
    { title: 'Poruwa & ceremony', text: 'Flowers for the poruwa, the aisle and the arch, fresh on the morning.' },
    { title: 'Tables & reception', text: 'Centrepieces, head tables and little touches guests take home.' },
    { title: 'Party & buttonholes', text: 'Bridesmaids’ posies, buttonholes and hair flowers.' },
    { title: 'Events & launches', text: 'Corporate events, birthdays and dinners, styled to the occasion.' },
  ],
  process: [
    { title: 'Talk', text: 'A relaxed chat — in the shop, on a call or on WhatsApp — about your day and your budget.' },
    { title: 'Design', text: 'We send a mood board and a clear quote. You can change anything.' },
    { title: 'Sample', text: 'For weddings, we make a sample bouquet so you can see and hold it.' },
    { title: 'The day', text: 'We deliver and set up early, so everything is fresh and in place.' },
  ],
  pricing: 'Wedding packages from [LKR price]. Every quote is made for your day.',
  samples: [
    { title: '[Sample project] Garden wedding, [venue]', note: 'Photo: bridal bouquet in a garden, 4:5' },
    { title: '[Sample project] Evening reception, [venue]', note: 'Photo: reception tables with flowers, 3:2' },
    { title: '[Sample project] Company launch, [venue]', note: 'Photo: event flower installation, 1:1' },
  ],
};

/* ───────────────────────── Subscription page ───────────────────────── */

export const subscriptionPage = {
  meta: {
    title: 'Weekly flower subscription — Petal & Stem · [Kandy]',
    description:
      'Fresh, hand-arranged flowers delivered every week to your home or office in [Kandy]. Pause or cancel any time.',
  },
  headline: 'Fresh flowers, every week.',
  line: 'A new hand-made arrangement on your table every [Monday]. We bring the fresh one and take the old one away.',
  plans: [
    {
      id: 'home',
      name: 'Home',
      text: 'A fresh bouquet for the kitchen table or the hallway.',
      price: '[LKR price] / week',
      includes: ['Seasonal hand-tied bouquet', 'Free delivery in [Kandy]', 'Pause any week'],
    },
    {
      id: 'office',
      name: 'Office',
      text: 'Reception, meeting rooms and desks that feel looked after.',
      price: '[LKR price] / week',
      includes: ['Larger arrangement + vase', 'Old flowers taken away', 'Monthly invoice'],
    },
    {
      id: 'fortnight',
      name: 'Every other week',
      text: 'All the joy, at a gentler pace.',
      price: '[LKR price] / delivery',
      includes: ['Seasonal bouquet', 'Free delivery in [Kandy]', 'Cancel any time'],
    },
  ],
  steps: [
    { title: 'Choose a plan', text: 'Home, office, or every other week.' },
    { title: 'Pick your day', text: 'We deliver on the same day each week.' },
    { title: 'Enjoy, or pause', text: 'Away next week? Just send us a message.' },
  ],
  faqs: [
    { q: 'Can I choose the flowers?', a: 'We pick the freshest flowers from each morning’s market. Tell us colours you love (or dislike) and we’ll keep to them.' },
    { q: 'Can I pause or cancel?', a: 'Yes. Message us by [the day before delivery] to pause a week, or cancel any time.' },
    { q: 'How do I pay?', a: '[Payment methods and billing schedule — to be confirmed.]' },
  ],
};

/* ───────────────────────── Order page ───────────────────────── */

export const orderPage = {
  meta: {
    title: 'Order flowers for today — Petal & Stem · [Kandy]',
    description:
      'Order in three steps: choose a feeling, write your note, and we deliver today in [Kandy]. Order on WhatsApp or online.',
  },
  headline: 'Order for today.',
  line: 'Three steps. Order before [2:00 pm] for same-day delivery in [Kandy].',
  notePlaceholder: 'Write what you want to say. We’ll copy it by hand.',
  sent: 'Thank you! Your order request is with us. We’ll confirm by phone or WhatsApp within [time].',
};

/* ───────────────────────── Contact page ───────────────────────── */

export const contactPage = {
  meta: {
    title: 'Contact — Petal & Stem · [Kandy]',
    description: 'Call, WhatsApp, email or send us a message. Petal & Stem, florist in [Kandy], Sri Lanka.',
  },
  headline: 'Say hello.',
  line: 'Questions, special requests or not sure what to send? Ask us. We usually reply within [time].',
  sent: 'Thank you! Your message is on its way. We’ll reply within [time].',
};

/* ───────────────────────── Chat helper (scripted, no AI) ───────────────────────── */

export interface ChatAnswer {
  id: string;
  /** Text on the quick-answer button. */
  button: string;
  /** Words that trigger this answer when typed. */
  keywords: string[];
  answer: string;
  link?: { label: string; href: string };
}

export const chat = {
  title: 'Ask Petal & Stem',
  greeting:
    'Hello! I’m the Petal & Stem helper. I can answer quick questions. Pick one below or type your own.',
  fallback:
    'I’m not sure about that one — but a real person is. Send us a WhatsApp or a message and we’ll help.',
  answers: [
    {
      id: 'same-day',
      button: 'Same-day delivery?',
      keywords: ['today', 'same day', 'same-day', 'deliver', 'delivery', 'when', 'cut off', 'cutoff', 'time', 'fast', 'urgent'],
      answer:
        'Yes! Order before [2:00 pm] and we deliver the same day in [delivery area]. Delivery hours: [Delivery hours].',
      link: { label: 'Order for today', href: '/order' },
    },
    {
      id: 'prices',
      button: 'How much are bouquets?',
      keywords: ['price', 'prices', 'cost', 'how much', 'lkr', 'rs', 'rupees', 'cheap', 'budget'],
      answer: 'Bouquets come in three sizes — Petite [LKR price], Classic [LKR price] and Generous [LKR price]. Delivery is [LKR delivery fee].',
      link: { label: 'See the menu', href: '/bouquets' },
    },
    {
      id: 'note',
      button: 'Do you write the note?',
      keywords: ['note', 'card', 'message', 'write', 'handwritten', 'words'],
      answer: 'Always. Every bouquet comes with a card handwritten by us. Tell us what to say — or ask us to help you find the words.',
    },
    {
      id: 'wedding',
      button: 'Wedding flowers',
      keywords: ['wedding', 'bride', 'bridal', 'poruwa', 'event', 'party', 'reception', 'decor'],
      answer: 'We’d love to help with your day. Start with a chat — we’ll send ideas and a clear quote.',
      link: { label: 'Weddings & events', href: '/weddings-events' },
    },
    {
      id: 'subscription',
      button: 'Weekly flowers',
      keywords: ['weekly', 'subscription', 'subscribe', 'office', 'every week', 'regular', 'pause'],
      answer: 'Our subscription brings fresh flowers every week to your home or office. Pause or cancel any time.',
      link: { label: 'See the plans', href: '/subscription' },
    },
    {
      id: 'pay',
      button: 'How can I pay?',
      keywords: ['pay', 'payment', 'card', 'bank', 'transfer', 'cash'],
      answer: 'You can pay by [Payment methods].',
    },
    {
      id: 'care',
      button: 'Keeping flowers fresh',
      keywords: ['fresh', 'care', 'last', 'water', 'wilt', 'vase', 'long'],
      answer: 'Trim the stems a little, use fresh cool water every two days, and keep them out of direct sun. Most bouquets last [number] days.',
    },
    {
      id: 'where',
      button: 'Where are you?',
      keywords: ['where', 'address', 'shop', 'location', 'visit', 'open', 'hours'],
      answer: 'You’ll find us at [Shop address, street, Kandy]. Shop hours: [Shop hours].',
      link: { label: 'Contact details', href: '/contact' },
    },
  ] satisfies ChatAnswer[],
};

/* ───────────────────────── Footer ───────────────────────── */

export const footer = {
  line: 'Hand-arranged flowers for the things that are hard to say.',
  concept: { before: 'Concept project designed by', after: '. Not a real business.' },
};
