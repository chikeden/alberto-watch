import {useEffect,useRef} from 'react';
import {useReducedMotion} from 'motion/react';

export default function Watch({variant='luxury',live=false,small=false}){
  const initial=useRef(new Date());
  const hourHand=useRef(null),minuteHand=useRef(null),secondHand=useRef(null);
  const reduced=useReducedMotion();
  const smart=variant==='smart';

  useEffect(()=>{
    if(!live)return;
    const update=()=>{
      const now=new Date();
      const hours=(now.getHours()%12+now.getMinutes()/60+now.getSeconds()/3600)*30;
      const minutes=(now.getMinutes()+now.getSeconds()/60)*6;
      const seconds=(now.getSeconds()+(smart||reduced?0:now.getMilliseconds()/1000))*6;
      hourHand.current?.setAttribute('transform',`rotate(${hours} 250 330)`);
      minuteHand.current?.setAttribute('transform',`rotate(${minutes} 250 330)`);
      secondHand.current?.setAttribute('transform',`rotate(${seconds} 250 330)`);
    };
    if(smart||reduced){
      update();
      const interval=setInterval(update,1000);
      return()=>clearInterval(interval);
    }
    let frame,last=0;
    const tick=stamp=>{
      if(stamp-last>=33){update();last=stamp}
      frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(frame);
  },[live,smart,reduced]);

  const first=initial.current;
  const hours=live?(first.getHours()%12+first.getMinutes()/60)*30:305;
  const minutes=live?(first.getMinutes()+first.getSeconds()/60)*6:60;
  const seconds=live?(first.getSeconds()+first.getMilliseconds()/1000)*6:0;

  return <svg className={`watch-svg ${small?'watch-small':''} watch-${variant}`} viewBox="0 0 500 660" role="img" aria-label={`Alberto ${variant} watch${live?' showing local time':''}`}>
    <defs>
      <linearGradient id={`case-${variant}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#D8C19A"/><stop offset=".35" stopColor="#55483A"/><stop offset=".7" stopColor="#D9C098"/><stop offset="1" stopColor="#44372C"/></linearGradient>
      <radialGradient id={`dial-${variant}`}><stop stopColor={smart?'#25211F':'#28221D'}/><stop offset="1" stopColor="#090807"/></radialGradient>
    </defs>
    <path d="M191 0H309L322 150H178Z M178 510H322L309 660H191Z" fill={variant==='vintage'?'#51392B':smart?'#302D2B':'#72604B'} stroke="#B8935A" strokeWidth="2"/>
    <path d="M178 12H322M178 648H322" stroke="#D4AF72" opacity=".35"/>
    <rect x="450" y="298" width="25" height="64" rx="4" fill="#927A58"/>
    <circle cx="250" cy="330" r="224" fill={`url(#case-${variant})`}/>
    <circle cx="250" cy="330" r="209" fill="#1A120D" stroke="#E3C99A" strokeWidth="3"/>
    <circle cx="250" cy="330" r="194" fill={`url(#dial-${variant})`} stroke="#584B3D" strokeWidth="3"/>
    {Array.from({length:60},(_,i)=>{const a=i*6*Math.PI/180,major=i%5===0,r=major?157:174;return <line key={i} x1={250+Math.sin(a)*r} y1={330-Math.cos(a)*r} x2={250+Math.sin(a)*181} y2={330-Math.cos(a)*181} stroke={major?'#D7BD89':'#8C7858'} strokeWidth={major?3:1} opacity={major?1:.55}/>})}
    <text x="250" y="246" textAnchor="middle" fill="#E3D1AE" fontFamily="serif" fontSize="25" letterSpacing="6">ALBERTO</text>
    <text x="250" y="265" textAnchor="middle" fill="#A89F94" fontFamily="monospace" fontSize="9" letterSpacing="3">{smart?'CONNECTED':'AUTOMATIC'}</text>
    <text x="250" y="418" textAnchor="middle" fill="#A89F94" fontFamily="monospace" fontSize="10" letterSpacing="3">SWISS DESIGN</text>
    <g ref={hourHand} transform={`rotate(${hours} 250 330)`}><path d="M250 341L245 330L248 251L250 239L252 251L255 330Z" fill="#D8C59D"/></g>
    <g ref={minuteHand} transform={`rotate(${minutes} 250 330)`}><path d="M250 345L246 330L248 215L250 202L252 215L254 330Z" fill="#E3D1AE"/></g>
    <g ref={secondHand} transform={`rotate(${seconds} 250 330)`}><path d="M249 357L249 185H251L251 357Z" fill="#B8935A"/><circle cx="250" cy="206" r="7" fill="none" stroke="#B8935A" strokeWidth="2"/></g>
    <circle cx="250" cy="330" r="5" fill="#D8C59D"/>
  </svg>;
}
