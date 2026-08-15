import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
const STATEMENT='I build digital experiences where design, technology and interaction meet.'
export default function Intro(){
 const rootRef=useRef<HTMLElement>(null)
 useEffect(()=>{const ctx=gsap.context(()=>{gsap.fromTo('.word',{opacity:.12,y:18},{opacity:1,y:0,stagger:.025,ease:'none',scrollTrigger:{trigger:rootRef.current,start:'top 78%',end:'bottom 48%',scrub:true}});gsap.to('.intro-orbit',{rotate:360,ease:'none',scrollTrigger:{trigger:rootRef.current,start:'top bottom',end:'bottom top',scrub:true}})},rootRef);return()=>ctx.revert()},[])
 return <section ref={rootRef} className="relative px-6 md:px-10 py-[var(--spacing-section)] overflow-hidden"><div className="intro-orbit"/><div className="max-w-container mx-auto grid md:grid-cols-12 gap-8 relative z-10"><p className="md:col-span-9 font-display text-statement">{STATEMENT.split(' ').map((w,i)=><span key={i} className="word inline-block mr-[.28em]">{w}</span>)}</p><p className="md:col-span-3 text-muted text-sm leading-relaxed self-end">A BCA student building interfaces that move with intention — part engineering discipline, part visual craft, grounded in an interest in how systems stay secure while they stay beautiful.</p></div></section>
}
