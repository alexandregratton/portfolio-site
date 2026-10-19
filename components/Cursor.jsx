import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { isFinePointer, isReduced } from '../lib/motion'

export default function Cursor() {
  const dot = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (!isFinePointer() || isReduced()) return
    setOn(true)
    document.documentElement.classList.add('has-cursor')
    return () => document.documentElement.classList.remove('has-cursor')
  }, [])

  useGSAP(
    () => {
      if (!on) return
      gsap.set(dot.current, { opacity: 0 })
      let placed = false
      const xTo = gsap.quickTo(dot.current, 'x', { duration: 0.3, ease: 'power3' })
      const yTo = gsap.quickTo(dot.current, 'y', { duration: 0.3, ease: 'power3' })
      const move = (e) => {
        if (!placed) {
          placed = true
          gsap.set(dot.current, { x: e.clientX, y: e.clientY, opacity: 1 })
        }
        xTo(e.clientX)
        yTo(e.clientY)
      }
      const over = (e) => {
        const hit = e.target.closest && e.target.closest('a, button')
        gsap.to(dot.current, { scale: hit ? 3 : 1, duration: 0.3, ease: 'power3.out' })
      }
      window.addEventListener('mousemove', move)
      window.addEventListener('mouseover', over)
      return () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseover', over)
      }
    },
    { dependencies: [on] }
  )

  return on ? <div className="cursor" ref={dot} aria-hidden="true" /> : null
}
