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
 useEffect(()=>{const onScroll=()=>{const h=document.documentElement.scrollHeight-innerHeight;setProgress(h>0?scrollY/h:0)};addEventListener('scroll',onScroll,{passive:true});onScroll();return()=>removeEventListener('scroll',onScroll)},[])
 return <><div className="scroll-progress" style={{transform:`scaleX(${progress})`}}/><div className="grain"/><div className="ambient ambient-a"/><div className="ambient ambient-b"/><Cursor/><SignatureMorph/><Nav/><main><Hero/><Intro/><Work/><About/><Skills/><Services/><Experience/><Contact/></main></>
}
