import { cardIcons } from './cardIcons.js';

export const cards = [
    {
        slug: 'celestial-ephemeris',
        href: 'https://calendar.simsang.org/',
        delayClass: 'delay-100',
        featured: true,
        tone: 'celestial',
        icon: cardIcons.celestial,
        index: 'I',
        portal: 'Astrology Portal',
        heading: {
            main: 'Celestial',
            accent: 'Ephemeris',
        },
        copy: {
            label: '오컬트 주역 천체 관측소',
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
        index: 'II',
        portal: 'Yoga Portal',
        heading: {
            main: 'Sutra',
            accent: 'Exegesis',
        },
        copy: {
            label: '파탄잘리 요가 수트라',
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
        index: 'III',
        portal: 'Gita Portal',
        heading: {
            main: 'Divine',
            accent: 'Song',
        },
        copy: {
            label: '바가바드 기타',
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
        index: 'IV',
        portal: 'Bardo Portal',
        heading: {
            main: 'Eternal',
            accent: 'Liberation',
        },
        copy: {
            label: '티베트 사자의 서',
            description: 'Explore teachings on transition, death, and luminous awareness through the Tibetan wisdom tradition.',
            cta: 'Cross the Bardo',
        },
    },
    {
        slug: 'threefold-luminaries',
        href: 'https://3sin.simsang.org/',
        delayClass: 'delay-700',
        tone: 'trinity',
        icon: cardIcons.trinity,
        index: 'V',
        portal: 'Threefold Portal',
        heading: {
            main: 'Threefold',
            accent: 'Luminaries',
        },
        copy: {
            label: '인위삼신행상명등론',
            description: 'Trace the doctrine of the three radiant principles through image, motion, and luminous correspondence.',
            cta: 'Open the Treatise',
        },
    },
];
