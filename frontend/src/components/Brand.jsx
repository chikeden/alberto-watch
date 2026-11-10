import {Link} from 'react-router-dom';

export function BrandMark({className=''}){
  return <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M19 4H45L60 19V45L45 60H19L4 45V19L19 4Z" stroke="currentColor" strokeWidth="1.25"/>
    <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth=".65" opacity=".6"/>
    <path d="M16 45L32 15L48 45M23 35H41" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M32 7V10M57 32H54M32 57V54M7 32H10" stroke="currentColor" strokeWidth="1.25"/>
    <circle cx="32" cy="15" r="1.5" fill="currentColor"/>
  </svg>;
}

export default function Brand(){
  return <Link className="brand brand-lockup" to="/" aria-label="Alberto Watch Company, homepage">
    <BrandMark className="brand-mark"/>
    <span className="brand-text"><strong>ALBERTO</strong><small>WATCH COMPANY</small></span>
  </Link>;
}
