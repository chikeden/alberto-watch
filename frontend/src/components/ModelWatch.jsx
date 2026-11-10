import {useId} from 'react';

const designs={
  meridian:{shape:'round',strap:'leather',strapColor:'#39291F',caseColor:'#BCA476',dial:'#15130F',ink:'#E9DFC9',markers:'baton',detail:'date',accent:'#C6A46D',label:'AUTOMATIC'},
  nocturne:{shape:'round',strap:'leather',strapColor:'#181513',caseColor:'#8D7860',dial:'#0B1014',ink:'#C9D4D6',markers:'dots',detail:'moon',accent:'#8FA4AD',label:'MOON PHASE'},
  aureole:{shape:'octagon',strap:'steel',strapColor:'#B8B5AC',caseColor:'#D4C9AD',dial:'#D9D2BF',ink:'#292A27',markers:'baton',detail:'chrono',accent:'#8A7350',label:'CHRONOGRAPH'},
  'atelier-1958':{shape:'cushion',strap:'leather',strapColor:'#8C5939',caseColor:'#A69375',dial:'#DED2B8',ink:'#312A24',markers:'arabic',detail:'smallSeconds',accent:'#805D3B',label:'AL-58'},
  regent:{shape:'rectangle',strap:'leather',strapColor:'#56372B',caseColor:'#B9A071',dial:'#F0E8D8',ink:'#29241D',markers:'roman',detail:'minimal',accent:'#9A784C',label:'HAND-WOUND'},
  portico:{shape:'octagon',strap:'woven',strapColor:'#686252',caseColor:'#9B8D77',dial:'#313A3A',ink:'#E3DFD3',markers:'baton',detail:'sector',accent:'#BFA676',label:'AUTOMATIC'},
  'orbit-s':{shape:'squircle',strap:'rubber',strapColor:'#303432',caseColor:'#A6A8A0',dial:'#101917',ink:'#E5E9E2',markers:'none',detail:'digital',accent:'#9EBEAB',label:'CONNECTED'},
  vector:{shape:'round',strap:'steel',strapColor:'#767D80',caseColor:'#BFC4C3',dial:'#172126',ink:'#E4EBE9',markers:'dots',detail:'digital',accent:'#A8C4D0',label:'VECTOR OS'},
  arc:{shape:'squircle',strap:'woven',strapColor:'#9A927E',caseColor:'#B6A990',dial:'#27231E',ink:'#F2ECE3',markers:'none',detail:'minimalDigital',accent:'#D4AF72',label:'CONNECTED'}
};

const representative={luxury:'meridian',vintage:'atelier-1958',smart:'orbit-s'};
const points='250,105 390,135 465,245 465,415 390,525 250,555 110,525 35,415 35,245 110,135';
const innerPoints='250,129 373,156 439,252 439,408 373,504 250,531 127,504 61,408 61,252 127,156';

function Strap({design}){
  const {strap,strapColor,accent}=design;
  if(strap==='steel')return <g fill={strapColor} stroke="#514C43" strokeWidth="2">
    <path d="M165 0H335L342 150H158Z M158 510H342L335 660H165Z"/>
    {[18,55,92,555,592,629].map(y=><g key={y}><rect x="164" y={y} width="172" height="24" rx="3"/><path d={`M221 ${y}v24 M279 ${y}v24`} fill="none" stroke={accent} opacity=".6"/></g>)}
  </g>;
  if(strap==='rubber')return <g><path d="M174 0H326L334 150H166Z M166 510H334L326 660H174Z" fill={strapColor} stroke={accent} strokeWidth="2"/>{[26,64,102,550,588,626].map(y=><rect key={y} x="209" y={y} width="82" height="8" rx="4" fill="#151B19" opacity=".65"/>)}</g>;
  if(strap==='woven')return <g><path d="M179 0H321L327 150H173Z M173 510H327L321 660H179Z" fill={strapColor} stroke={accent} strokeWidth="2"/><path d="M208 0V150 M292 0V150 M208 510V660 M292 510V660" stroke={accent} strokeWidth="3" opacity=".55"/>{[20,45,70,95,120,535,560,585,610,635].map(y=><path key={y} d={`M180 ${y}h140`} stroke="#E6D8BF" opacity=".12"/>)}</g>;
  return <g><path d="M180 0H320L330 150H170Z M170 510H330L320 660H180Z" fill={strapColor} stroke={accent} strokeWidth="2"/><path d="M192 0V145 M308 0V145 M192 515V660 M308 515V660" stroke={accent} strokeDasharray="4 7" opacity=".55"/></g>;
}

function Case({design,gradientId}){
  const {shape,dial,caseColor,accent}=design;
  if(shape==='round')return <g><circle cx="250" cy="330" r="222" fill={`url(#${gradientId})`} stroke={caseColor} strokeWidth="4"/><circle cx="250" cy="330" r="199" fill={dial} stroke={accent} strokeWidth="3"/><circle cx="250" cy="330" r="184" fill="none" stroke={accent} opacity=".4"/></g>;
  if(shape==='octagon')return <g><polygon points={points} fill={`url(#${gradientId})`} stroke={caseColor} strokeWidth="5"/><polygon points={innerPoints} fill={dial} stroke={accent} strokeWidth="3"/><circle cx="250" cy="330" r="174" fill="none" stroke={accent} opacity=".35"/></g>;
  const outer={rectangle:{x:65,y:105,width:370,height:450,rx:28},cushion:{x:27,y:110,width:446,height:440,rx:112},squircle:{x:35,y:112,width:430,height:436,rx:105}}[shape];
  return <g><rect {...outer} fill={`url(#${gradientId})`} stroke={caseColor} strokeWidth="5"/><rect x={outer.x+19} y={outer.y+19} width={outer.width-38} height={outer.height-38} rx={Math.max(outer.rx-15,14)} fill={dial} stroke={accent} strokeWidth="3"/></g>;
}

function Markers({design}){
  const {markers,ink,accent}=design;
  if(markers==='none')return null;
  if(markers==='roman'||markers==='arabic'){
    const values=markers==='roman'?['XII','III','VI','IX']:['12','3','6','9'];
    return <g fill={ink} fontFamily="Georgia,serif" fontSize={markers==='roman'?27:32} textAnchor="middle" dominantBaseline="middle">{[[250,171],[397,330],[250,493],[103,330]].map(([x,y],i)=><text key={i} x={x} y={y}>{values[i]}</text>)}</g>;
  }
  return <g>{Array.from({length:12},(_,i)=>{const angle=i*Math.PI/6,x=250+Math.sin(angle)*165,y=330-Math.cos(angle)*165;if(markers==='dots')return <circle key={i} cx={x} cy={y} r={i%3===0?6:3} fill={i%3===0?accent:ink}/>;return <line key={i} x1={250+Math.sin(angle)*151} y1={330-Math.cos(angle)*151} x2={x} y2={y} stroke={i%3===0?accent:ink} strokeWidth={i%3===0?5:2}/>})}</g>;
}

function Detail({design}){
  const {detail,ink,accent,label}=design;
  if(detail==='digital'||detail==='minimalDigital')return <g textAnchor="middle" fill={ink}>
    <text x="250" y="236" fontSize="13" letterSpacing="5" fontFamily="monospace" fill={accent}>{label}</text>
    <text x="250" y="370" fontSize={detail==='digital'?88:96} fontWeight="300" letterSpacing="-5" fontFamily="system-ui,sans-serif">10:10</text>
    <text x="250" y="420" fontSize="16" letterSpacing="5" fontFamily="monospace" fill={accent}>{detail==='digital'?'TUE  ·  10 NOV':'TIME / WELL KEPT'}</text>
    {detail==='digital'&&<g fill={accent}>{[0,1,2,3,4].map(i=><rect key={i} x={188+i*29} y={454-(i%2)*7} width="18" height={7+(i%2)*7} rx="2"/>)}</g>}
  </g>;
  if(detail==='moon')return <g><circle cx="250" cy="423" r="34" fill="#263540" stroke={accent} strokeWidth="2"/><circle cx="262" cy="411" r="20" fill={accent}/><circle cx="271" cy="403" r="20" fill="#263540"/><path d="M195 423H220M280 423h25" stroke={accent}/></g>;
  if(detail==='chrono')return <g><circle cx="190" cy="410" r="29" fill="none" stroke={accent} strokeWidth="2"/><circle cx="310" cy="410" r="29" fill="none" stroke={accent} strokeWidth="2"/><path d="M190 410l9-14M310 410l-8 17" stroke={ink} strokeWidth="2"/></g>;
  if(detail==='smallSeconds')return <g><circle cx="250" cy="425" r="32" fill="none" stroke={accent} strokeWidth="2"/><path d="M250 425l14-18" stroke={ink} strokeWidth="2"/></g>;
  if(detail==='sector')return <g><circle cx="250" cy="330" r="113" fill="none" stroke={accent} strokeWidth="1" opacity=".7"/><path d="M145 330h210" stroke={accent} opacity=".45"/></g>;
  if(detail==='date')return <g><rect x="330" y="313" width="35" height="31" fill="#EEE7D7" stroke={accent}/><text x="347" y="335" textAnchor="middle" fill="#27231D" fontSize="18" fontFamily="monospace">10</text></g>;
  return null;
}

export default function ModelWatch({model,variant='luxury',small=false}){
  const key=designs[model]?model:representative[variant]||'meridian';
  const design=designs[key];
  const gradientId=`model-case-${useId().replace(/:/g,'')}`;
  const digital=design.detail==='digital'||design.detail==='minimalDigital';
  return <svg className={`watch-svg ${small?'watch-small':''} model-watch`} viewBox="0 0 500 660" role="img" aria-label={`${key.replace(/-/g,' ')} watch with ${design.strap} strap and ${design.shape} case`}>
    <defs><linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1"><stop stopColor={design.caseColor}/><stop offset=".5" stopColor="#5A5145"/><stop offset="1" stopColor={design.caseColor}/></linearGradient></defs>
    <Strap design={design}/>
    <rect x="456" y="301" width="20" height="57" rx="4" fill={design.caseColor}/>
    <Case design={design} gradientId={gradientId}/>
    <Markers design={design}/>
    {!digital&&<g><text x="250" y="241" textAnchor="middle" fill={design.ink} fontFamily="Georgia,serif" fontSize="24" letterSpacing="5">ALBERTO</text><text x="250" y="263" textAnchor="middle" fill={design.accent} fontFamily="monospace" fontSize="9" letterSpacing="3">{design.label}</text><g transform="rotate(305 250 330)"><path d="M250 340L246 330L248 253L250 239L252 253L254 330Z" fill={design.ink}/></g><g transform="rotate(60 250 330)"><path d="M250 344L246 330L248 219L250 204L252 219L254 330Z" fill={design.ink}/></g><circle cx="250" cy="330" r="5" fill={design.accent}/></g>}
    <Detail design={design}/>
  </svg>;
}
