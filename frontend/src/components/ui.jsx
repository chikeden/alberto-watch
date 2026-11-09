import {motion} from 'motion/react';
import {quietReveal} from '../motion/variants';
import {ease,dur} from '../motion/tokens';
export function Container({children,className=''}){return <div className={`container ${className}`}>{children}</div>}
export function Section({children,className='',id}){return <section id={id} className={`section ${className}`}>{children}</section>}
export function Eyebrow({children}){return <p className="eyebrow">{children}</p>}
export function Reveal({children,className=''}){return <motion.div className={className} variants={quietReveal} initial="hidden" whileInView="visible" viewport={{once:true,amount:.3}}>{children}</motion.div>}
export function Button({children,className='',...props}){return <motion.button className={`button ${className}`} whileTap={{scale:.98}} transition={{duration:dur.fast,ease:ease.lux}} {...props}><span>{children}</span></motion.button>}
