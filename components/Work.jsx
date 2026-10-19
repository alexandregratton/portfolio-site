import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { isFinePointer, isReduced } from '../lib/motion'
import { getData } from '../lib/data/data.js'


export default function Work({ language }) {
    const root = useRef(null)
    const preview = useRef(null)
    const videoRef = useRef(null)
    const [active, setActive] = useState(null)
    const { profile, projects, skills, statement } = getData(language);

    useGSAP(
        () => {
            if (!isReduced()) {
                gsap.from('.work__heading', {
                    yPercent: 40,
                    opacity: 0,
                    duration: 1,
                    ease: 'power4.out',
                    scrollTrigger: { trigger: '.work__heading', start: 'top 85%' },
                })

                gsap.utils.toArray('.row').forEach((row) => {
                    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%' } })
                    tl.from(row.querySelector('.row__rule'), {
                        scaleX: 0,
                        transformOrigin: 'left',
                        duration: 1,
                        ease: 'power3.inOut',
                    }).from(
                        row.querySelectorAll('.row__cell'),
                        { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07 },
                        '-=0.7'
                    )
                })
            }

            if (!isFinePointer()) return

            const card = preview.current
            gsap.set(card, { xPercent: -50, yPercent: -50, scale: 0 })
            const xTo = gsap.quickTo(card, 'x', { duration: 0.5, ease: 'power3' })
            const yTo = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3' })

            const pointer = { x: 0, y: 0, inside: false }
            let placed = false
            let raf = 0

            const pick = () => {
                if (!pointer.inside) {
                    setActive(null)
                    return
                }
                const el = document.elementFromPoint(pointer.x, pointer.y)
                const row = el && el.closest ? el.closest('.row[data-index]') : null
                setActive(row ? Number(row.dataset.index) : null)
            }
            const schedule = () => {
                cancelAnimationFrame(raf)
                raf = requestAnimationFrame(pick)
            }

            const onMove = (e) => {
                pointer.x = e.clientX
                pointer.y = e.clientY
                pointer.inside = true
                if (!placed) {
                    placed = true
                    gsap.set(card, { x: e.clientX, y: e.clientY })
                }
                xTo(e.clientX)
                yTo(e.clientY)
                schedule()
            }
            const onLeave = () => {
                pointer.inside = false
                schedule()
            }

            window.addEventListener('mousemove', onMove)
            window.addEventListener('scroll', schedule, { passive: true })
            document.documentElement.addEventListener('mouseleave', onLeave)
            return () => {
                cancelAnimationFrame(raf)
                window.removeEventListener('mousemove', onMove)
                window.removeEventListener('scroll', schedule)
                document.documentElement.removeEventListener('mouseleave', onLeave)
            }
        },
        { scope: root }
    )

    useGSAP(
        () => {
            if (!isFinePointer()) return
            const p = active === null ? null : projects[active]
            if (p) {

                const v = videoRef.current
                if (p.video) {
                    if (v.getAttribute('src') !== p.video) v.src = p.video  // only swap if different
                    v.play().catch(() => { })
                }

                gsap.to(preview.current, {
                    scale: 1,
                    duration: 0.4,
                    ease: 'power3.out',
                    overwrite: 'auto',
                })
            } else {
                gsap.to(preview.current, {
                    scale: 0, duration: 0.4, ease: 'power3.in', overwrite: 'auto',
                    onComplete: () => videoRef.current.pause(),
                })
            }
        },
        { scope: root, dependencies: [active] }
    )

    return (
        <section className="work" id="projets" ref={root}>
            <div className="section__head">
                <h2 className="work__heading">Projets</h2>
                <span className="section__count label">{projects.length} projets</span>
            </div>

            <ul className="rows" data-has-active={active !== null ? '' : undefined}>
                {projects.map((p, i) => {
                    const Tag = p.href ? 'a' : 'div'
                    const props = p.href ? { href: p.href, target: '_blank', rel: 'noreferrer' } : {}
                    return (
                        <li className={`row${active === i ? ' is-active' : ''}`} key={p.title} data-index={i}>
                            <div className="row__rule" />
                            <Tag className="row__inner" {...props}>
                                <span className="row__cell row__index label">{String(i + 1).padStart(2, '0')}</span>
                                <span className="row__cell row__title">{p.title}</span>
                                <span className="row__cell row__desc">{p.description}</span>
                                <span className="row__cell row__meta label">
                                    <span>{p.kind}</span>
                                    <span>{p.year}</span>
                                </span>
                            </Tag>
                        </li>
                    )
                })}
                <li className="row row--end" aria-hidden="true">
                    <div className="row__rule" />
                </li>
            </ul>

            <div className="preview label" ref={preview} aria-hidden="true">
                <video
                    ref={videoRef}
                    muted
                    loop
                    playsInline
                />
                {/* <span ref={previewLabel} /> */}
            </div>
        </section>
    )
}
