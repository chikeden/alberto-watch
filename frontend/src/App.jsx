import {lazy,Suspense,useEffect} from 'react';
import {Navigate,Route,Routes,useLocation} from 'react-router-dom';
import {AnimatePresence,motion} from 'motion/react';
import {Header,Footer} from './components/Shell';
import {Preloader} from './components/Experience';
import {useAuth} from './context/AuthContext';
import {dur,ease} from './motion/tokens';

const Home=lazy(()=>import('./pages/Home'));
const Products=lazy(()=>import('./pages/Products'));
const About=lazy(()=>import('./pages/About'));
const Technology=lazy(()=>import('./pages/Technology'));
const Gallery=lazy(()=>import('./pages/Gallery'));
const Stores=lazy(()=>import('./pages/Stores'));
const Contact=lazy(()=>import('./pages/Contact'));
const Auth=lazy(()=>import('./pages/Auth'));
const Admin=lazy(()=>import('./pages/Admin'));

function ProtectedAdmin(){
  const {user,loading}=useAuth();
  if(loading)return <div className="loading">Checking session…</div>;
  return user?.role==='admin'?<Admin/>:<Navigate to="/login"/>;
}

export default function App(){
  const location=useLocation();
  useEffect(()=>{window.scrollTo(0,0)},[location.pathname]);
  return <>
    <Preloader/>
    <Header/>
    <main id="main">
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:dur.fast,ease:ease.inOut}}>
          <motion.div className="transition-line" aria-hidden="true" initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:dur.fast,ease:ease.inOut}}/>
          <Suspense fallback={<div className="loading">Loading…</div>}>
            <Routes location={location}>
              <Route path="/" element={<Home/>}/>
              <Route path="/products" element={<Products/>}/>
              <Route path="/about" element={<About/>}/>
              <Route path="/technology" element={<Technology/>}/>
              <Route path="/gallery" element={<Gallery/>}/>
              <Route path="/stores" element={<Stores/>}/>
              <Route path="/contact" element={<Contact/>}/>
              <Route path="/login" element={<Auth/>}/>
              <Route path="/register" element={<Auth register/>}/>
              <Route path="/admin" element={<ProtectedAdmin/>}/>
              <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </main>
    <Footer/>
  </>;
}
