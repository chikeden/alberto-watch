import {useEffect,useState} from 'react';
import {Link,NavLink,useLocation} from 'react-router-dom';
import {AnimatePresence,motion,useMotionValueEvent,useScroll} from 'motion/react';
import {Container} from './ui';
import {links} from './navigation';
import {dur,ease} from '../motion/tokens';

export default function Navbar(){const [scrolled,setScrolled]=useState(false),[hidden,setHidden]=useState(false),[open,setOpen]=useState(false);const {scrollY}=useScroll(),location=useLocation();useMotionValueEvent(scrollY,'change',latest=>{setScrolled(latest>80);setHidden(latest>160&&latest>scrollY.getPrevious())});useEffect(()=>setOpen(false),[location.pathname]);return <header className={`site-header ${scrolled?'scrolled':''} ${hidden?'header-hidden':''}`}><Container className="nav-inner"><Link className="brand" to="/" >ALBERTO<span>WATCH COMPANY</span></Link><button className="menu-toggle" aria-expanded={open} aria-label={open?'Close':'Menu'} aria-controls="main-navigation" onClick={()=>setOpen(!open)}>{open?'Close':'Menu'}</button><nav id="main-navigation" className={open?'nav-open':''} aria-label="Main navigation">{links.map(([name,path])=><NavLink key={path} to={path}>{({isActive})=><>{name}{isActive&&<motion.span className="nav-active" layoutId="nav-active"/>}</>}</NavLink>)}<NavLink className="nav-account-mobile" to="/login">Account</NavLink></nav><Link className="nav-account" to="/login">Account</Link></Container></header>}

