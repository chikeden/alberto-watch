import {useEffect,useState} from 'react';
import {MapContainer,TileLayer,Marker,Tooltip,useMap} from 'react-leaflet';
import L from 'leaflet';
import {Link} from 'react-router-dom';
import {Container,Section,Eyebrow} from '../components/ui';
import 'leaflet/dist/leaflet.css';

const stores=[
  {name:'New York atelier',city:'New York',coordinates:[40.7128,-74.006],zone:'America/New_York'},
  {name:'London showroom',city:'London',coordinates:[51.5072,-.1276],zone:'Europe/London'},
  {name:'Tokyo studio',city:'Tokyo',coordinates:[35.6762,139.6503],zone:'Asia/Tokyo'}
];
const pin=L.divIcon({className:'map-pin',html:'<span></span>',iconSize:[22,22],iconAnchor:[11,11]});
function FocusMap({store}){const map=useMap();useEffect(()=>{map.flyTo(store.coordinates,11,{duration:.6})},[store,map]);return null}
function opening(store,now){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:store.zone,weekday:'short',hour:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));const weekday=parts.weekday;const hour=Number(parts.hour);return weekday==='Sat'||weekday==='Sun'||hour<10||hour>=18?'Closed · viewing hours 10:00–18:00':'Open now · closes at 18:00'}
export default function Stores(){const [active,setActive]=useState(0),[now,setNow]=useState(new Date());useEffect(()=>{const id=setInterval(()=>setNow(new Date()),60_000);return()=>clearInterval(id)},[]);return <><section className="page-hero"><Container><Eyebrow>PRIVATE VIEWINGS</Eyebrow><h1>See it in person.</h1><p>Meet the collection in New York, London, or Tokyo. Every viewing is arranged in advance.</p></Container></section><Section><Container className="editorial-grid stores-grid"><div className="store-list">{stores.map((store,i)=><button key={store.city} className={`store ${i===active?'store-active':''}`} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} aria-pressed={i===active}><Eyebrow>0{i+1} / {store.city}</Eyebrow><h2>{store.name}</h2><p>{opening(store,now)} · By appointment</p><span>View on map ↗</span></button>)}<Link className="button" to="/contact"><span>Request a viewing</span></Link></div><div className="store-map"><MapContainer center={stores[0].coordinates} zoom={11} scrollWheelZoom={false} aria-label="Map of viewing cities"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{stores.map((store,i)=><Marker key={store.city} position={store.coordinates} icon={pin} eventHandlers={{click:()=>setActive(i),mouseover:()=>setActive(i)}}><Tooltip>{store.name} · city centre marker, exact location shared on booking</Tooltip></Marker>)}<FocusMap store={stores[active]}/></MapContainer><p>Markers show city centres. Exact viewing locations are shared when your appointment is confirmed.</p></div></Container></Section></>}
