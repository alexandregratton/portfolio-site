import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { isReduced } from '../lib/motion'
import { getData } from "../lib/data/data.js";

export default function About({ language }) {
    const root = useRef(null)
    const { profile, projects, skills, statement } = getData(language);

    useGSAP(
        () => {
            if (isReduced()) return

            gsap.fromTo(
                '.word',
                { opacity: 0.18 },
                {
                    opacity: 1,
                    ease: 'none',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: '.about__statement',
                        start: 'top 80%',
                        end: 'bottom 45%',
                        scrub: true,
                    },
                }
            )

            gsap.from('.skill', {
                y: 40,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.12,
                scrollTrigger: { trigger: '.skills', start: 'top 85%' },
            })
        },
        { scope: root }
    )

    return (
        <section className="about" id="apropos" ref={root}>
            <div className="section__head">
                <h2>À propos</h2>
            </div>

            <p className="about__statement">
                {statement.split(' ').map((w, i) => (
                    <span className="word" key={i}>
                        {w}{' '}
                    </span>
                ))}
            </p>

            <div className="skills">
                {skills.map((s) => (
                    <div className="skill" key={s.title}>
                        <h3 className="label">{s.title}</h3>
                        <ul>
                            {s.items.map((it) => (
                                <li key={it}>{it}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    )
}
