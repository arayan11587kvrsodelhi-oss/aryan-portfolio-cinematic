import { useEffect, useState } from 'react'
import { useLenis } from './lib/useLenis'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import SignatureMorph from './components/SignatureMorph'
import Intro from './components/Intro'
import Work from './components/Work'
import About from './components/About'
import Skills from './components/Skills'
import Services from './components/Services'
import Experience from './components/Experience'
import Contact from './components/Contact'

export default function App(){
 useLenis()
 const [progress,setProgress]=useState(0)
 useEffect(()=>{
  let frame=0
  const update=()=>{frame=0;const h=document.documentElement.scrollHeight-innerHeight;setProgress(h>0?scrollY/h:0)}
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)}
  addEventListener('scroll',onScroll,{passive:true});update()
  return()=>{removeEventListener('scroll',onScroll);cancelAnimationFrame(frame)}
 },[])
 return <><a className="skip-link" href="#main-content">Skip to content</a><div className="scroll-progress" style={{transform:`scaleX(${progress})`}}/><div className="grain"/><div className="ambient ambient-a"/><div className="ambient ambient-b"/><Cursor/><SignatureMorph/><Nav/><main id="main-content"><Hero/><Intro/><Work/><About/><Skills/><Services/><Experience/><Contact/></main></>
}
