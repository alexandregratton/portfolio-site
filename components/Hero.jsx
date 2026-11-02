
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getData } from '../lib/data/data.js'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Chars({ text }) {
    return text.split('').map((c, i) => (
        <span className="char" key={i}>
            {c === ' ' ? ' ' : c}
        </span>
    ))
}

export default function Hero({ ready, language }) {
    const root = useRef(null)
    const heroStatusRef = useRef(null)
    const heroStatusHoverRef = useRef(null)

    const { profile, traductions } = getData(language)

    // Base animations
    useGSAP(() => {
        gsap.set('.char', { yPercent: 115 })
        gsap.set('.fade', { opacity: 0, y: 24 })

        gsap.to('.hero__title', {
            yPercent: 22,
            ease: 'none',
            scrollTrigger: {
                trigger: root.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        })

        // Status hover anim.

        const el = heroStatusRef.current
        const tip = heroStatusHoverRef.current

        gsap.set(tip, { scale: 1, yPercent: 0, opacity: 1, transformOrigin: '50% 100%' })

        const onEnter = () => {
            gsap.to(tip, {
                scale: 1,
                yPercent: -80,
                opacity: 1,
                duration: 0.8,
                ease: "elastic.out(0.8,0.85)",
                overwrite: 'auto',
            })
        }

        const onLeave = () => {
            gsap.to(tip, {
                scale: 0,
                yPercent: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                overwrite: 'auto',
            })
        }

        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)

        return () => {
            el.removeEventListener('mouseenter', onEnter)
            el.removeEventListener('mouseleave', onLeave)
            gsap.killTweensOf(tip)
        }

    }, { scope: root })

    // Entrance animation
    useGSAP(() => {
        if (!ready) return

        const tl = gsap.timeline({ delay: 0.15 })

        tl.to('.char', {
            yPercent: 0,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.05,
        })
            .to('.fade', {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.12,
            }, '-=0.6')
            .from('.hero__line', {
                scaleX: 0,
                transformOrigin: 'left',
                duration: 1.2,
                ease: 'power3.inOut',
            }, '<')

    }, {
        scope: root,
        dependencies: [ready],
        revertOnUpdate: true,
    })

    return (
        <section className="hero" id="top" ref={root}>
            <div className="hero__top label fade">
                <div className="hero__status" ref={heroStatusRef}>
                    <span
                        className="hero__indicator_hover"
                        ref={heroStatusHoverRef}
                    >
                        {profile.statusToolTip}
                    </span>

                    <span className="hero__indicator"></span>
                    <span className="hero__indicator_anim"></span>
                    <span>{profile.status}</span>
                </div>

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
