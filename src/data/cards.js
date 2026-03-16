import { cardIcons } from './cardIcons.js';

export const cards = [
    {
        slug: 'celestial-ephemeris',
        href: 'https://calendar.simsang.org/',
        delayClass: 'delay-100',
        featured: true,
        tone: 'celestial',
        icon: cardIcons.celestial,
        heading: {
            main: 'Celestial',
            accent: 'Ephemeris',
        },
        copy: {
            label: 'Astrological Observatory',
            description: 'Track planetary cycles, symbolic alignments, and cosmic timing through a refined astrological archive.',
            cta: 'Enter the Archive',
        },
    },
    {
        slug: 'sutra-exegesis',
        href: 'https://yoga.simsang.org/',
        delayClass: 'delay-300',
        tone: 'sutra',
        icon: cardIcons.sutra,
        heading: {
            main: 'Sutra',
            accent: 'Exegesis',
        },
        copy: {
            label: 'Yoga Wisdom Library',
            description: 'Read distilled teachings on consciousness, discipline, and the inner architecture of contemplative practice.',
            cta: 'Unveil the Sutras',
        },
    },
    {
        slug: 'divine-song',
        href: 'https://gita.simsang.org/',
        delayClass: 'delay-500',
        tone: 'divine',
        icon: cardIcons.divine,
        heading: {
            main: 'Divine',
            accent: 'Song',
        },
        copy: {
            label: 'Bhagavad Gita Archive',
            description: 'Enter a guided reading of duty, devotion, and awakening through the voice of the Gita.',
            cta: 'Hear the Song',
        },
    },
    {
        slug: 'eternal-liberation',
        href: 'https://tibet.simsang.org/',
        delayClass: 'delay-700',
        tone: 'liberation',
        icon: cardIcons.liberation,
        heading: {
            main: 'Eternal',
            accent: 'Liberation',
        },
        copy: {
            label: 'Tibetan Passage Texts',
            description: 'Explore teachings on transition, death, and luminous awareness through the Tibetan wisdom tradition.',
            cta: 'Cross the Bardo',
        },
    },
];
