import { useRef } from 'react'
import gsap from 'gsap'
import { ArrowUpRight, Github, Linkedin, Instagram, Mail, Phone } from 'lucide-react'
const LINKS=[
  {label:'Email',icon:Mail,href:'mailto:arayan11587kvrsodelhi@gmail.com'},
  {label:'Phone',icon:Phone,href:'tel:+918076233501'},
  {label:'LinkedIn',icon:Linkedin,href:'https://www.linkedin.com/in/aryan-sharma-7681a3380/'},
  {label:'GitHub',icon:Github,href:'https://github.com/arayan11587kvrsodelhi-oss/'},
  {label:'Instagram',icon:Instagram,href:'https://www.instagram.com/aryan._.5harma/'},
]
function MagneticButton(){const ref=useRef<HTMLAnchorElement>(null);return <a ref={ref} href="mailto:arayan11587kvrsodelhi@gmail.com" onMouseMove={e=>{const b=ref.current;if(!b)return;const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.28,y:(e.clientY-r.top-r.height/2)*.28,duration:.35,ease:'power3.out',overwrite:true})}} onMouseLeave={()=>gsap.to(ref.current,{x:0,y:0,duration:.7,ease:'elastic.out(1,.35)'})} data-cursor="open" className="magnetic group inline-flex items-center gap-3 rounded-full border border-accent/50 px-8 py-5 text-lg font-display hover:shadow-[0_0_55px_-12px_var(--accent)] transition-shadow">Let's Talk <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20}/></a>}
export default function Contact(){return <section id="contact" className="relative px-6 md:px-10 py-[var(--spacing-section)] border-t border-border overflow-hidden"><div className="contact-glow"/><div className="max-w-container mx-auto flex flex-col items-center text-center gap-10 relative z-10"><span className="text-eyebrow text-accent">OPEN TO BUILDING</span><h2 className="font-display text-display">LET'S BUILD<br/>SOMETHING<br/><span className="text-accent">GREAT.</span></h2><MagneticButton/><div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-6 text-eyebrow">{LINKS.map(l=><a key={l.label} href={l.href} target={l.href.startsWith('http')?'_blank':undefined} rel={l.href.startsWith('http')?'noopener noreferrer':undefined} className="flex items-center gap-2 hover:text-accent transition-colors" data-cursor="open"><l.icon size={14}/>{l.label}</a>)}</div><p className="text-muted text-xs mt-10">© {new Date().getFullYear()} Aryan Sharma. Built with React, GSAP &amp; Lenis.</p></div></section>}
