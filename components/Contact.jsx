import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { getData } from "../lib/data/data.js";


export default function Contact({ language }) {
    const root = useRef(null)
    const mail = useRef(null)
    const { profile, traductions, projects, skills, statement } = getData(language);

    useGSAP(
        () => {
            const el = mail.current
            const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })
            const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })
            const move = (e) => {
                const r = el.getBoundingClientRect()
                xTo((e.clientX - (r.left + r.width / 2)) * 0.15)
                yTo((e.clientY - (r.top + r.height / 2)) * 0.3)
            }
            const leave = () => {
                xTo(0)
                yTo(0)
            }
            el.addEventListener('mousemove', move)
            el.addEventListener('mouseleave', leave)
            return () => {
                el.removeEventListener('mousemove', move)
                el.removeEventListener('mouseleave', leave)
            }
        },
        { scope: root }
    )

    return (
        <section className="contact" id="contact" ref={root}>
            <h2 className="contact__title">
                <span className="line">
                    <span>{traductions.contactH1Line01}</span>
                    <span className="accent">{traductions.contactH1Line02}</span>
                </span>
            </h2>

            <a className="contact__mail" href={`mailto:${profile.email}`} ref={mail}>
                {profile.email}
            </a>

            <div className="contact__links">
                {profile.links.map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                        {l.label} ↗
                    </a>
                ))}
            </div>

            <footer className="footer label">
                <span>© 2026 {profile.name}</span>
                <a href="#top">{traductions.scrollBackToTop} ↑</a>
            </footer>
        </section>
    )
}
