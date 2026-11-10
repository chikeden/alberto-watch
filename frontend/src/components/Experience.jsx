import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {AnimatePresence,motion,useReducedMotion,useScroll,useSpring,useTransform} from 'motion/react';
import {Container,Eyebrow} from './ui';
import Watch from './Watch';
import {BrandMark} from './Brand';
import {dur,ease} from '../motion/tokens';

export function Preloader(){
  const reduced=useReducedMotion();
  const [visible,setVisible]=useState(()=>{try{return !reduced&&!matchMedia('(max-width: 760px)').matches&&!sessionStorage.getItem('alberto-intro-seen')}catch{return false}});
  useEffect(()=>{if(reduced)setVisible(false)},[reduced]);
  useEffect(()=>{if(!visible)return;try{sessionStorage.setItem('alberto-intro-seen','1')}catch{}const id=setTimeout(()=>setVisible(false),1000);return()=>clearTimeout(id)},[visible]);
  return <AnimatePresence>{visible&&<motion.div className="preloader" initial={{clipPath:'inset(0 0 0 0)'}} exit={{clipPath:'inset(0 0 100% 0)'}} transition={{duration:dur.base,ease:ease.inOut}} aria-hidden="true"><svg viewBox="0 0 100 100"><motion.circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth=".5" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:dur.slow,ease:ease.lux}}/></svg><div className="preloader-word">{'ALBERTO'.split('').map((letter,i)=><span key={i}><motion.b initial={{y:'110%'}} animate={{y:0}} transition={{duration:dur.base,delay:i*.07,ease:ease.lux}}>{letter}</motion.b></span>)}</div></motion.div>}</AnimatePresence>
}

export function HeroScene(){
  const ref=useRef(null),reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});
  const smooth=useSpring(scrollYProgress,{stiffness:120,damping:30});
  const scale=useTransform(smooth,[0,.8],[1,.68]);
  const bezel=useTransform(smooth,[0,.8],[0,30]);
  const copyOpacity=useTransform(smooth,[0,.5],[1,0]);
  const teaserOpacity=useTransform(smooth,[.55,.85],[0,1]);
  return <section ref={ref} className="hero-scroll"><div className="hero sticky-hero"><Container className="hero-grid"><motion.div className="hero-copy" style={reduced?{}:{opacity:copyOpacity}}><div className="hero-identity"><BrandMark className="hero-brand-mark"/><Eyebrow>ALBERTO WATCH COMPANY / EST. 2024</Eyebrow></div><h1><span className="line-mask"><motion.span initial={{y:'110%'}} animate={{y:0}} transition={{duration:dur.hero,ease:ease.lux}}>Every second</motion.span></span><span className="line-mask"><motion.em initial={{y:'110%'}} animate={{y:0}} transition={{duration:dur.hero,delay:.15,ease:ease.lux}}>has weight.</motion.em></span></h1><p>Watches made to mark the moments you choose to keep.</p><Link className="button" to="/products"><span>View the collection</span></Link><div className="trust">Two-year warranty <b>·</b> Sapphire crystal <b>·</b> Complimentary first service</div></motion.div><div className="hero-watch"><div className="hero-halo"/><motion.div className="hero-watch-motion" style={reduced?{}:{scale,rotate:bezel}}><Watch live/></motion.div></div><div className="hero-caption mono"><span>AL-01 / MERIDIAN</span><span>LOCAL TIME IN MOTION</span></div><motion.div className="hero-teaser" style={{opacity:reduced?1:teaserOpacity}}><Eyebrow>THREE COLLECTIONS</Eyebrow><p>One attention to detail.</p><Link to="/products">Explore the collection ↗</Link></motion.div></Container></div></section>
}

export function ManifestoWords(){
  const ref=useRef(null),reduced=useReducedMotion();
  const words='Time is the only luxury you cannot buy back. We build instruments that respect it.'.split(' ');
  const {scrollYProgress}=useScroll({target:ref,offset:['start .85','end .25']});
  return <h2 ref={ref} className="manifesto-words">{words.map((word,i)=><Word key={i} word={word} progress={scrollYProgress} start={i/words.length*.85} reduced={reduced}/>)}</h2>
}
function Word({word,progress,start,reduced}){const opacity=useTransform(progress,[start,start+.18],[.72,1]);return <motion.span style={{opacity:reduced?1:opacity}}>{word}{' '}</motion.span>}

export function MovementExploded(){
  const ref=useRef(null),reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start .85','end .2']});
  const lift1=useTransform(scrollYProgress,[0,1],[0,-42]),lift2=useTransform(scrollYProgress,[0,1],[0,-16]),drop1=useTransform(scrollYProgress,[0,1],[0,28]),drop2=useTransform(scrollYProgress,[0,1],[0,52]);
  const labelOpacity=useTransform(scrollYProgress,[.15,.55],[0,1]);
  const layers=[
    {label:'01 / HANDS',style:lift1,shape:<><line x1="250" y1="250" x2="188" y2="168" strokeWidth="4"/><line x1="250" y1="250" x2="297" y2="120" strokeWidth="3"/><circle cx="250" cy="250" r="7" fill="currentColor"/></>},
    {label:'02 / DIAL',style:lift2,shape:<><circle cx="250" cy="250" r="174" fill="none" strokeWidth="2"/>{Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <line key={i} x1={250+Math.sin(a)*143} y1={250-Math.cos(a)*143} x2={250+Math.sin(a)*161} y2={250-Math.cos(a)*161} strokeWidth="3"/>})}</>},
    {label:'03 / GEAR TRAIN',style:drop1,shape:<><circle cx="188" cy="235" r="51" fill="none" strokeWidth="2"/><circle cx="288" cy="236" r="57" fill="none" strokeWidth="2"/><circle cx="242" cy="317" r="41" fill="none" strokeWidth="2"/><circle cx="188" cy="235" r="14" fill="none"/><circle cx="288" cy="236" r="14" fill="none"/></>},
    {label:'04 / BALANCE',style:drop2,shape:<><circle cx="250" cy="250" r="200" fill="none" strokeWidth="5"/><circle cx="250" cy="250" r="209" fill="none" strokeWidth="1"/></>}
  ];
  return <div ref={ref} className="movement-exploded" role="img" aria-label="Exploded diagram showing hands, dial, gear train and balance in four layers">{layers.map((layer,i)=><motion.div className={`movement-layer layer-${i}`} key={i} style={reduced?{}:{y:layer.style}}><svg viewBox="0 0 500 500" fill="none" stroke="currentColor">{layer.shape}</svg><motion.span className="mono" style={{opacity:reduced?1:labelOpacity}}>{layer.label}</motion.span></motion.div>)}</div>
}

export function CountUp({value,suffix=''}){const reduced=useReducedMotion(),[shown,setShown]=useState(reduced?value:0),ref=useRef(null);useEffect(()=>{if(reduced){setShown(value);return}const node=ref.current;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){const started=performance.now();const frame=now=>{const p=Math.min(1,(now-started)/900);setShown(Math.round(value*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(frame)};requestAnimationFrame(frame);observer.disconnect()}},{threshold:.5});observer.observe(node);return()=>observer.disconnect()},[value,reduced]);return <span ref={ref}>{shown}{suffix}</span>}
