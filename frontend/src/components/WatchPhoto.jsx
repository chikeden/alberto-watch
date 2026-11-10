import ModelWatch from './ModelWatch';

const referencePhotos=new Set(['aureole','nocturne','meridian','atelier-1958','regent','portico','orbit-s','vector','arc']);

export function hasReferencePhoto(slug){return referencePhotos.has(slug)}

export default function WatchPhoto({item,main=false}){
  if(!hasReferencePhoto(item.slug))return <ModelWatch model={item.slug} variant={item.category} small={!main}/>;
  return <img className="reference-watch-photo" src={`/watch-photos/${item.slug}.jpg`} alt={`Representative ${item.category} watch photograph for ${item.name}`} width="900" height="900" loading={main?'eager':'lazy'}/>;
}
