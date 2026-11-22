import { levels } from './levels.js';
import { createCamera, createGuard, updateCamera, updateGuard } from './guard.js';
import { render } from './render.js';
import * as sound from './sound.js';

const canvas=document.querySelector('#game'), ctx=canvas.getContext('2d');
const keys=new Set();
const game={screen:'title',levelIndex:0,level:levels[0],player:{x:100,y:360,angle:0},guards:[],cameras:[],alarm:0,timer:0,pebbles:3,lootTaken:false,pickProgress:0,noise:null,message:'',introTime:0};
let last=performance.now(),stepClock=0,previousAlarm=0;
const obstacles=()=>[...game.level.walls,...game.level.cover];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

function beginLevel(index){
  game.levelIndex=index;game.level=levels[index];game.player={...game.level.spawn,angle:0};
  game.guards=game.level.guards.map(createGuard);game.cameras=game.level.cameras.map(createCamera);
  game.alarm=0;game.timer=0;game.pebbles=3;game.lootTaken=false;game.pickProgress=0;game.noise=null;
  game.message=game.level.hint;game.screen='intro';game.introTime=1.5;previousAlarm=0;
}
function activate(){if(game.screen==='title')beginLevel(0);else if(game.screen==='clear'){if(game.levelIndex<2)beginLevel(game.levelIndex+1);else game.screen='title';}}
function insideRect(x,y,r,pad=0){return x>r.x-pad&&x<r.x+r.w+pad&&y>r.y-pad&&y<r.y+r.h+pad;}
function collides(x,y){
  if(x<42||x>1238||y<42||y>678)return true;
  return obstacles().some(r=>{const qx=clamp(x,r.x,r.x+r.w),qy=clamp(y,r.y,r.y+r.h);return Math.hypot(x-qx,y-qy)<13;});
}
function throwPebble(x,y){
  if(game.screen!=='playing'||game.pebbles<=0)return;
  game.pebbles--;game.noise={x,y,radius:390,age:0};game.message='A pebble rings out. Someone is going to investigate.';sound.pebble();
}
function pointer(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*1280/r.width,y:(e.clientY-r.top)*720/r.height};}

addEventListener('keydown',e=>{
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();
  keys.add(e.key.toLowerCase());sound.unlock();
  if((e.key==='Enter'||e.key===' ')&&(game.screen==='title'||game.screen==='clear'))activate();
  if(e.key.toLowerCase()==='r'&&(game.screen==='caught'||game.screen==='alarm'))beginLevel(game.levelIndex);
});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
canvas.addEventListener('pointerdown',e=>{sound.unlock();if(game.screen==='title'||game.screen==='clear'){activate();return;}const p=pointer(e);throwPebble(p.x,p.y);});

function movePlayer(dt){
  const dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);
  const dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);
  const moving=dx!==0||dy!==0,sneak=keys.has('shift');
  if(moving){const n=Math.hypot(dx,dy),speed=sneak?92:166;game.player.angle=Math.atan2(dy,dx);const sx=dx/n*speed*dt,sy=dy/n*speed*dt;
    if(!collides(game.player.x+sx,game.player.y))game.player.x+=sx;
    if(!collides(game.player.x,game.player.y+sy))game.player.y+=sy;
    stepClock+=dt;if(stepClock>(sneak ? 0.52 : 0.31)){sound.step(sneak);stepClock=0;}
  }
  return {moving,sneak};
}

function update(dt){
  if(game.screen==='intro'){game.introTime-=dt;if(game.introTime<=0)game.screen='playing';return;}
  if(game.screen!=='playing')return;
  game.timer+=dt;const {moving,sneak}=movePlayer(dt);
  if(game.noise){game.noise.age+=dt;if(game.noise.age>1.8)game.noise=null;}
  const solids=obstacles();let seen=false,caught=false;
  for(const g of game.guards){const r=updateGuard(g,dt,game.player,solids,sneak,game.noise);seen ||= r.visible;caught ||= r.caught;}
  for(const c of game.cameras)seen ||= updateCamera(c,dt,game.player,solids,sneak);
  const oldAlarm=game.alarm;game.alarm=clamp(game.alarm+(seen?(game.cameras.some(c=>c.spotted>0)?34:10)*dt:-7*dt),0,100);
  if(game.alarm>oldAlarm+1&&Math.floor(game.alarm/12)>Math.floor(oldAlarm/12))sound.alarm();
  if(caught){game.screen='caught';game.alarm=100;sound.caught();return;}
  if(game.alarm>=100){game.screen='alarm';sound.caught();return;}
  const loot=game.level.loot,nearLoot=distance(game.player,loot)<82;
  if(!game.lootTaken&&loot.type==='safe'){
    if(nearLoot&&!moving){game.pickProgress+=dt;game.message='Lockpicking… hold still while the pins turn.';if(game.pickProgress>=3){game.lootTaken=true;game.pickProgress=0;game.message='The Moon Coin is yours. Find the exit.';sound.success();}}
    else {if(game.pickProgress>0&&moving)game.message='The lockpick slipped. Stay still beside the vault.';game.pickProgress=0;}
  }else if(!game.lootTaken&&distance(game.player,loot)<48){game.lootTaken=true;game.message='Loot secured. Reach the marked exit.';sound.success();}
  if(game.lootTaken&&insideRect(game.player.x,game.player.y,game.level.exit,12)){game.screen='clear';game.message='';sound.success();}
}

function frame(now){
  const dt=Math.min(0.04,(now-last)/1000);last=now;update(dt);render(ctx,game);requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
