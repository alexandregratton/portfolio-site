
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { getData } from '../lib/data/data.js'

export default function Nav({ ready, language, setLanguage }) {
    const root = useRef(null)
    const { profile } = getData(language)

    const toggleLanguage = () => {
        setLanguage((current) => (current === 'fr' ? 'en' : 'fr'))
    }

    useGSAP(
        () => {
            gsap.set(root.current, { yPercent: -100, opacity: 0 })
        },
        { scope: root }
    )

    useGSAP(
        () => {
            gsap.to(root.current, {
                yPercent: 0,
                opacity: 1,
                duration: 0.9,
                delay: 0.5,
                ease: 'power3.out',
            })
        },
        { scope: root, dependencies: [ready] }
    )

    const navLabels = language === 'fr'
        ? { projects: 'Projets', about: 'À propos', contact: 'Contact' }
        : { projects: 'Projects', about: 'About', contact: 'Contact' }

    return (
        <header className="nav" ref={root}>
            <a href="#top" className="nav__logo">
                {profile.logoName}
            </a>

            <nav className="nav__links">
                <a href="#projets">{navLabels.projects}</a>
                <a href="#apropos">{navLabels.about}</a>
                <a href="#contact">{navLabels.contact}</a>

                <button className='nav__language' onClick={toggleLanguage} aria-label="Change language">
                    {language === 'fr' ? 'EN' : 'FR'}
                </button>
            </nav>
        </header>
    )
}
