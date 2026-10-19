import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { isReduced } from '../lib/motion'
import { GSDevTools } from 'gsap/GSDevTools'
import { getData } from '../lib/data/data.js'

gsap.registerPlugin(GSDevTools)

export default function Intro({ onDone, language  }) {
    const root = useRef(null)
    const { profile, projects, skills, statement } = getData(language);

    useGSAP(
        () => {
            if (isReduced()) {
                gsap.set(root.current, { display: 'none' })
                onDone()
                return
            }

            gsap.set('.intro__inner', { visibility: 'visible' })
            const counter = { v: 0 }
            const num = root.current.querySelector('.intro__count')

            const tl = gsap.timeline()

            tl.from('.intro__name', {
                yPercent: 110,
                duration: 1,
                ease: 'power4.out',
            })
                .to('.intro__track', {
                    scaleX: 1,
                    duration: 0.6,
                    ease: 'power3.inOut',
                }, '-=0.6')
                .from('.intro__meta', {
                    y: 8,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                }, '-=0.55')
                .to('.intro__bar', {
                    scaleX: 1,
                    duration: 1.2,
                    ease: 'power3.inOut',
                }, '-=0.2')

                .to(counter, {
                    v: 100,
                    duration: 1.2,
                    ease: 'power3.inOut',
                    onUpdate: () => {
                        num.textContent = String(Math.round(counter.v)).padStart(3, '0')
                    },
                }, '<')
                .to('.intro__inner', {
                    y: -12,
                    opacity: 0,
                    duration: 0.45,
                    ease: 'power2.in',
                }, '+=0.25')
                .to(root.current, {
                    yPercent: -100,
                    duration: 0.9,
                    ease: 'power4.inOut',
                    onStart: onDone,
                })
                .set(root.current, {
                    display: 'none',
                })

            // GSDevTools.create({ animation: tl })
        },
        { scope: root }
    )

    return (
        <div className="intro" ref={root} aria-hidden="true">
            <div className="intro__inner">
                <div className="intro__mask">
                    <span className="intro__name">{profile.logoName}</span>
                </div>
                <div className="intro__meta label">
                    <span>Portfolio 2026</span>
                    <span className="intro__count">000</span>
                </div>
                <div className="intro__track">
                    <div className="intro__bar" />
                </div>
            </div>
        </div>
    )
}
