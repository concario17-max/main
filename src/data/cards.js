import { cardIcons } from './cardIcons.js';

export const cards = [
    {
        slug: 'celestial-ephemeris',
        href: 'https://calendar.simsang.org/',
        delayClass: 'delay-100',
        icon: cardIcons.celestial,
        heading: {
            main: 'Celestial',
            accent: 'Ephemeris',
        },
        copy: {
            label: '오컬트 주역 천체 관측소',
            description: '천체의 궤적과 고대의 정렬을 세밀히 기록하여 우주의 거대한 주기를 해석하고 영원의 시간을 측정합니다.',
            cta: 'Discover More',
        },
    },
    {
        slug: 'sutra-exegesis',
        href: 'https://yoga.simsang.org/',
        delayClass: 'delay-300',
        icon: cardIcons.sutra,
        heading: {
            main: 'Sutra',
            accent: 'Exegesis',
        },
        copy: {
            label: '파탄잘리 요가 수트라',
            description: '의식의 소용돌이를 고요히 잠재우고, 찬란하게 빛나는 순수한 주시자(Purusha)의 본성으로 회귀하는 영적 연금술.',
            cta: 'Discover More',
        },
    },
    {
        slug: 'divine-song',
        href: 'https://gita.simsang.org/',
        delayClass: 'delay-500',
        icon: cardIcons.divine,
        heading: {
            main: 'Divine',
            accent: 'Song',
        },
        copy: {
            label: '바가바드 기타',
            description: '전쟁터 한가운데서 울려 퍼진 신성한 서사시를 통해 존재의 본질과 영원한 의무(Dharma)를 각성합니다.',
            cta: 'Discover More',
        },
    },
    {
        slug: 'eternal-liberation',
        href: 'https://tibet.simsang.org/',
        delayClass: 'delay-700',
        icon: cardIcons.liberation,
        heading: {
            main: 'Eternal',
            accent: 'Liberation',
        },
        copy: {
            label: '티베트 사자의 서',
            description: '육신의 소멸 뒤에 펼쳐지는 바르도(Bardo)의 환영 속에서 투명한 빛의 근원을 식별하고 영속적인 윤회를 해탈하는 여정.',
            cta: 'Discover More',
        },
    },
];
