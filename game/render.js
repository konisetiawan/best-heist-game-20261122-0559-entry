const C = { ink:'#10131c', stone:'#252a33', gold:'#d8b46b', cream:'#f2e6c8', red:'#eb5963', mint:'#8ad9b5' };
const rr = (ctx,x,y,w,h,r=8) => { ctx.beginPath(); ctx.roundRect(x,y,w,h,r); };
const glow = (ctx,x,y,r,color) => { const g=ctx.createRadialGradient(x,y,0,x,y,r); g.addColorStop(0,color); g.addColorStop(1,'transparent'); ctx.fillStyle=g; ctx.fillRect(x-r,y-r,r*2,r*2); };

function floor(ctx, level) {
  ctx.fillStyle='#1b2029'; ctx.fillRect(0,0,1280,720);
  for(let y=30,row=0;y<690;y+=44,row++) for(let x=30+(row%2)*22;x<1250;x+=44){
    ctx.fillStyle=(row+Math.floor(x/44))%2?'#20252e':'#222831'; ctx.fillRect(x,y,42,42);
    ctx.strokeStyle='#ffffff08'; ctx.strokeRect(x+.5,y+.5,41,41);
  }
  for(const p of level.paths){
    const tint=p.kind==='left'?'#8c6f3a':p.kind==='middle'?'#536d69':'#426558';
    ctx.fillStyle=tint+'22'; ctx.fillRect(p.x,p.y,p.w,p.h);
    ctx.strokeStyle=tint+'28'; ctx.setLineDash([10,12]); ctx.lineWidth=2; ctx.strokeRect(p.x+10,p.y+10,p.w-20,p.h-20); ctx.setLineDash([]);
  }
  ctx.strokeStyle='#d4b57536'; ctx.lineWidth=2; ctx.strokeRect(32,32,1216,656);
  for(let i=0;i<8;i++){ctx.fillStyle='#d4b57525';ctx.fillRect(68+i*154,32,2,8);ctx.fillRect(68+i*154,680,2,8);}
}

function cone(ctx, actor, range, fov, color) {
  ctx.beginPath(); ctx.moveTo(actor.x,actor.y); ctx.arc(actor.x,actor.y,range,actor.angle-fov/2,actor.angle+fov/2); ctx.closePath();
  ctx.fillStyle=color; ctx.fill(); ctx.strokeStyle=color.replace(/,[\d.]+\)$/, ',0.45)'); ctx.lineWidth=1; ctx.stroke();
}

function obstacles(ctx, level) {
  for(const w of level.walls){
    ctx.fillStyle='#090c12';ctx.fillRect(w.x+4,w.y+5,w.w,w.h);
    const g=ctx.createLinearGradient(w.x,w.y,w.x+w.w,w.y+w.h);g.addColorStop(0,'#68717a');g.addColorStop(.18,'#39414a');g.addColorStop(1,'#272d35');ctx.fillStyle=g;ctx.fillRect(w.x,w.y,w.w,w.h);
    ctx.strokeStyle='#b9c0c327';ctx.lineWidth=2;ctx.strokeRect(w.x+1,w.y+1,w.w-2,w.h-2);
  }
  for(const o of level.cover){
    ctx.fillStyle='#090b10a8';rr(ctx,o.x+4,o.y+6,o.w,o.h,8);ctx.fill();
    const palette={crate:['#784c37','#a97651'],case:['#4d555d','#91a0a2'],rope:['#513e42','#b35d62'],plant:['#27483e','#5f9b74']};
    const [a,b]=palette[o.type]||palette.crate;const g=ctx.createLinearGradient(o.x,o.y,o.x+o.w,o.y+o.h);g.addColorStop(0,b);g.addColorStop(1,a);
    ctx.fillStyle=g;rr(ctx,o.x,o.y,o.w,o.h,8);ctx.fill();ctx.strokeStyle='#e3d3ad55';ctx.lineWidth=2;ctx.stroke();
    if(o.type==='plant'){ctx.fillStyle='#19392e';ctx.beginPath();ctx.ellipse(o.x+o.w/2,o.y+o.h/2,o.w*.22,o.h*.27,0,0,Math.PI*2);ctx.fill();for(let i=0;i<5;i++){ctx.strokeStyle='#82b77b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(o.x+o.w/2,o.y+o.h/2);ctx.quadraticCurveTo(o.x+o.w/2+(i-2)*12,o.y+o.h/2-20,o.x+o.w/2+(i-2)*17,o.y+8);ctx.stroke();}}
    else if(o.type==='rope'){ctx.strokeStyle='#d6b46d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(o.x+6,o.y+o.h/2);ctx.quadraticCurveTo(o.x+o.w/2,o.y+o.h/2+14,o.x+o.w-6,o.y+o.h/2);ctx.stroke();}
    else {ctx.strokeStyle='#e0c48a66';ctx.lineWidth=2;ctx.strokeRect(o.x+8,o.y+8,o.w-16,o.h-16);}
  }
}

function drawCamera(ctx,c){
  ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.angle);ctx.fillStyle='#291319';ctx.fillRect(-10,-8,22,16);ctx.fillStyle='#a93243';ctx.beginPath();ctx.arc(7,0,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f17a72';ctx.beginPath();ctx.arc(8,-1,2,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.fillStyle='#6d7881';ctx.beginPath();ctx.arc(c.x-10,c.y,5,0,Math.PI*2);ctx.fill();
}

function drawGuard(ctx,g){
  const color=g.state==='chase'?'#d84b52':g.state==='investigate'?'#d8a246':'#68737d';
  ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.angle);ctx.fillStyle='#0a0b10aa';ctx.beginPath();ctx.ellipse(2,8,16,10,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=color;rr(ctx,-12,-11,24,23,7);ctx.fill();ctx.fillStyle='#e8c9a0';ctx.beginPath();ctx.arc(2,-2,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#29242a';ctx.fillRect(5,-4,8,4);ctx.restore();
  if(g.spotted>0){ctx.fillStyle='#f4d47a';ctx.font='bold 22px system-ui';ctx.fillText('!',g.x-4,g.y-20);}
}

function drawLoot(ctx, loot, taken, time, pick) {
  if(taken)return; const {x,y,type}=loot; const pulse=1+Math.sin(time*3)*.08;
  glow(ctx,x,y,88,type==='safe'?'#d9aa54aa':'#64d9d4aa');
  ctx.save();ctx.translate(x,y);
  if(type==='safe'){
    ctx.fillStyle='#11151c';rr(ctx,-52,-36,104,72,12);ctx.fill();ctx.fillStyle='#59636c';rr(ctx,-48,-42,96,70,10);ctx.fill();ctx.strokeStyle='#d7b365';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='#303942';rr(ctx,-28,-25,56,39,6);ctx.fill();ctx.strokeStyle='#c9a554';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,-4,12,-.9,2.5);ctx.stroke();ctx.fillStyle='#dfbd70';ctx.beginPath();ctx.arc(0,-4,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ead29b';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('VAULT 07',0,20);
    if(pick>0){ctx.strokeStyle='#f0ce76';ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,-58,-0+24,-Math.PI/2,-Math.PI/2+Math.PI*2*pick);ctx.stroke();}
  }else{
    ctx.fillStyle='#30251d';rr(ctx,-34,-23,68,47,10);ctx.fill();ctx.strokeStyle='#d8b66c';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle=type==='moonstone'?'#b1f7e8':'#5ee8ed';ctx.beginPath();ctx.moveTo(0,-42);ctx.lineTo(21,-17);ctx.lineTo(14,8);ctx.lineTo(0,24);ctx.lineTo(-16,6);ctx.lineTo(-22,-16);ctx.closePath();ctx.fill();
    ctx.fillStyle='#e7fff5aa';ctx.beginPath();ctx.moveTo(0,-42);ctx.lineTo(21,-17);ctx.lineTo(0,-10);ctx.closePath();ctx.fill();
    if(type==='moonstone'){ctx.fillStyle='#ad7b4b';ctx.fillRect(26,4,22,20);ctx.strokeStyle='#d3a66b';ctx.strokeRect(26,4,22,20);}
  }
  ctx.restore();
  ctx.fillStyle='#fff0ca';ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.fillText(loot.label,x,y+57);ctx.textAlign='left';
}

function drawPlayer(ctx,p,time){
  glow(ctx,p.x,p.y,78,'#dfb76225');glow(ctx,p.x+Math.cos(time*2)*6,p.y+Math.sin(time*2)*6,24,'#f5d89048');
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle||0);ctx.fillStyle='#080a0dbb';ctx.beginPath();ctx.ellipse(2,8,16,10,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#171820';ctx.beginPath();ctx.moveTo(0,-15);ctx.lineTo(13,5);ctx.quadraticCurveTo(0,17,-13,5);ctx.closePath();ctx.fill();ctx.strokeStyle='#756245';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='#d4ae82';ctx.beginPath();ctx.arc(0,-5,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d8b96d';ctx.beginPath();ctx.arc(8,-11,3,0,Math.PI*2);ctx.fill();ctx.restore();
}

function label(ctx,text,x,y,size=12,color='#d8cfb8',weight='500'){ctx.font=`${weight} ${size}px system-ui`;ctx.fillStyle=color;ctx.fillText(text,x,y);}
function hud(ctx,g){
  ctx.fillStyle='#10131ddd';rr(ctx,30,20,1220,72,13);ctx.fill();ctx.strokeStyle='#d9b86c48';ctx.lineWidth=1;ctx.stroke();
  label(ctx,`ROOM 0${g.levelIndex+1}`,48,43,10,'#b69a63','700');label(ctx,g.level.name,48,69,18,'#f1e7d3','700');
  label(ctx,`LOOT  ${g.lootTaken?'1 / 1':'0 / 1'}`,338,52,13,g.lootTaken?'#9be0bd':'#e8d9b5','700');
  label(ctx,`PEBBLES  ${g.pebbles}`,470,52,12,'#d8d0c0','600');
  label(ctx,`TIME  ${Math.floor(g.timer/60).toString().padStart(2,'0')}:${Math.floor(g.timer%60).toString().padStart(2,'0')}`,590,52,12,'#d8d0c0','600');
  label(ctx,'ALARM',760,48,10,'#edb7ac','700');ctx.fillStyle='#2a2024';rr(ctx,760,57,206,16,8);ctx.fill();
  const aw=202*g.alarm/100;const ag=ctx.createLinearGradient(762,0,962,0);ag.addColorStop(0,'#d3ae56');ag.addColorStop(.68,'#e77a4e');ag.addColorStop(1,'#f14755');ctx.fillStyle=ag;rr(ctx,762,59,aw,12,6);ctx.fill();
  label(ctx,'WASD / Arrows move  ·  Shift sneak  ·  Click pebble',985,51,11,'#d1c8b5','500');
  ctx.fillStyle='#11141bcf';rr(ctx,30,665,1220,34,9);ctx.fill();label(ctx,g.message||g.level.hint,48,687,13,'#dfd2b6','500');
}

function exitDoor(ctx,exit){
  ctx.fillStyle='#151922';rr(ctx,exit.x,exit.y,exit.w,exit.h,8);ctx.fill();ctx.strokeStyle='#c39f5d';ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='#5b4932';rr(ctx,exit.x+8,exit.y+10,exit.w-16,exit.h-20,5);ctx.fill();ctx.fillStyle='#e0bd76';ctx.beginPath();ctx.arc(exit.x+exit.w-17,exit.y+exit.h/2,3,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.translate(exit.x+exit.w/2,exit.y+exit.h/2);ctx.rotate(-Math.PI/2);ctx.fillStyle='#e9d6ad';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('EXIT',0,3);ctx.restore();
}

function screenCard(ctx,title,sub,accent='#d8b46b',small=''){
  ctx.fillStyle='#080b11bd';ctx.fillRect(0,0,1280,720);
  ctx.fillStyle='#11151ded';rr(ctx,270,205,740,300,22);ctx.fill();ctx.strokeStyle=accent+'88';ctx.lineWidth=2;ctx.stroke();
  ctx.textAlign='center';ctx.fillStyle=accent;ctx.font='700 11px system-ui';ctx.fillText('A VELVET VAULT HEIST',640,247);
  ctx.fillStyle='#f5ead3';ctx.font='700 42px Georgia,serif';ctx.fillText(title,640,312);
  ctx.fillStyle='#d0c8b8';ctx.font='16px system-ui';ctx.fillText(sub,640,360);
  if(small){ctx.fillStyle='#a99c84';ctx.font='13px system-ui';ctx.fillText(small,640,402);}
  ctx.textAlign='left';
}

export function render(ctx,g){
  floor(ctx,g.level);
  exitDoor(ctx,g.level.exit);
  for(const c of g.cameras) cone(ctx,c,c.range,c.fov,'rgba(239,68,77,0.10)');
  for(const guard of g.guards){
    const tint=guard.state==='chase'?'rgba(237,62,69,0.23)':guard.suspicion>.45?'rgba(244,145,56,0.2)':'rgba(243,199,77,0.15)';
    cone(ctx,guard,245,0.92,tint);
  }
  for(const c of g.cameras) drawCamera(ctx,c);
  drawLoot(ctx,g.level.loot,g.lootTaken,g.timer,g.pickProgress||0);
  if(g.noise){const a=Math.max(0,1-g.noise.age/1.8);ctx.strokeStyle=`rgba(231,208,147,${a*.8})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(g.noise.x,g.noise.y,16+g.noise.age*105,0,Math.PI*2);ctx.stroke();}
  obstacles(ctx,g.level);
  for(const guard of g.guards) drawGuard(ctx,guard);
  drawPlayer(ctx,g.player,g.timer);
  if(g.screen!=='title')hud(ctx,g);
  if(g.screen==='title')screenCard(ctx,'The Velvet Vault','A museum heist in the dark',' #d8b46b','3 rooms  ·  steal the loot  ·  reach the exit  ·  Enter / click to begin');
  if(g.screen==='intro')screenCard(ctx,g.level.name,g.level.objective,'#d8b46b',`ROOM 0${g.levelIndex+1}  ·  ${g.level.hint}`);
  if(g.screen==='caught')screenCard(ctx,'CAUGHT!','The guard found you. The gallery resets around you.','#e7656b','Press R to try the route again');
  if(g.screen==='alarm')screenCard(ctx,'ALARM TRIPPED','The security shutters slam down.','#ed515d','Press R to try the route again');
  if(g.screen==='clear')screenCard(ctx,g.levelIndex===2?'THE NIGHT IS YOURS':'Loot secured',g.levelIndex===2?'All three rooms cleaned. The Velvet Vault is empty.':'On to the next room. The night is still young.','#e4c579',g.levelIndex===2?'Click or Enter to play again':'Click or Enter to continue');
}
