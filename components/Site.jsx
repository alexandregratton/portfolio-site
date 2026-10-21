'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Intro from './Intro'
import Nav from './Nav'
import Cursor from './Cursor'
import Hero from './Hero'
import Work from './Work'
import About from './About'
import Contact from './Contact'


gsap.registerPlugin(ScrollTrigger, useGSAP)


export default function Site() {
    const [ready, setReady] = useState(false)
    const [language, setLanguage] = useState('fr')

    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.1, anchors: true })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (t) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        return () => {
            gsap.ticker.remove(tick)
            lenis.destroy()
        }
    }, [])

    return (
        <>
            <Intro onDone={() => setReady(true)} language={language} />
            <Cursor />
            <Nav
                ready={ready}
                language={language}
                setLanguage={setLanguage} />
            <main>
                <Hero ready={ready} language={language} />
                <Work language={language} />
                <About language={language} />
                <Contact language={language} />
            </main>
        </>
    )
}
