import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { getData } from '../lib/data/data.js'
import dynamic from 'next/dynamic'

function Chars({ text }) {
    return text.split('').map((c, i) => (
        <span className="char" key={i}>
            {c === ' ' ? ' ' : c}
        </span>
    ))
}

export default function Hero({ ready, language }) {
    const root = useRef(null)
    const { profile, traductions, projects, skills, statement } = getData(language);

    useGSAP(
        () => {
            gsap.set('.char', { yPercent: 115 })
            gsap.set('.fade', { opacity: 0, y: 24 })
            gsap.to('.hero__title', {
                yPercent: 22,
                ease: 'none',
                scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
            })
        },
        { scope: root }
    )

    useGSAP(
        () => {
            if (!ready) return
            const tl = gsap.timeline({ delay: 0.15 })
            tl.to('.char', { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.05 })
                .to('.fade', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, '-=0.6')
                .from('.hero__line', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'power3.inOut' }, '<')
        },
        { scope: root, dependencies: [ready] }
    )

    return (
        <section className="hero" id="top" ref={root}>
            <div className="hero__top label fade">
                <span>{profile.status}</span>
                <span>{profile.role}</span>
            </div>

            <h1 className="hero__title" aria-label={profile.name}>
                <span className="line" aria-hidden="true">
                    <Chars text={profile.name} />
                </span>
            </h1>

            <div className="hero__line" />

            <div className="hero__bottom">
                <p className="hero__intro fade">{profile.intro}</p>
                <a href="#projets" className="hero__scroll label fade">
                    {traductions.scrollIndicator} <span aria-hidden="true">↓</span>
                </a>
            </div>
        </section>
    )
}
