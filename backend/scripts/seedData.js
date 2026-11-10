import bcrypt from 'bcryptjs';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const catalog=[
  ['Meridian','luxury',4850,40,11.2,'AL-01 automatic',70,100,'Black alligator'],
  ['Nocturne','luxury',6200,39,10.8,'AL-02 automatic',72,50,'Black leather'],
  ['Aureole','luxury',7450,41,12.1,'AL-03 automatic',80,100,'Steel bracelet'],
  ['Atelier 1958','vintage',3250,38,10.4,'AL-58 automatic',48,50,'Cognac leather'],
  ['Regent','vintage',2950,37,10.1,'AL-21 automatic',42,50,'Brown leather'],
  ['Portico','vintage',3450,39,11,'AL-24 automatic',50,100,'Suede leather'],
  ['Orbit S','smart',890,42,11.5,'AL-S digital',0,50,'Fluoroelastomer'],
  ['Vector','smart',1090,43,11.9,'AL-S2 digital',0,100,'Steel bracelet'],
  ['Arc','smart',790,40,10.6,'AL-S digital',0,50,'Woven nylon']
];

export async function seedData({adminEmail,adminPassword}={}){
  for(let i=0;i<catalog.length;i++){
    const [name,category,price,caseDiameterMm,thicknessMm,movement,powerReserveH,waterResistanceM,strap]=catalog[i];
    const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    await Product.updateOne({slug},{$set:{name,slug,category,price,currency:'USD',description:`A ${caseDiameterMm} mm ${category==='smart'?'connected':'mechanical'} instrument with a restrained dial and hand-finished case.`,specs:{caseDiameterMm,thicknessMm,lugWidthMm:category==='smart'?22:20,caseMaterial:'316L stainless steel',movement,powerReserveH,waterResistanceM,crystal:'Sapphire',strap},featured:i<3,stock:12}},{upsert:true});
  }
  if(adminEmail&&adminPassword){
    await ensureInitialAdmin(adminEmail,adminPassword);
  }
}

export async function ensureInitialAdmin(adminEmail,adminPassword){
  if(adminPassword.length<12)throw new Error('ADMIN_PASSWORD must be at least 12 characters');
  const email=adminEmail.toLowerCase();
  await User.updateOne({email},{$set:{name:'Alberto Admin',email,passwordHash:await bcrypt.hash(adminPassword,12),role:'admin'}},{upsert:true});
}
