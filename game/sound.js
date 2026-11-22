let audio=null,master=null,lastAlarm=0;
function context(){
  if(!audio){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;audio=new Audio();master=audio.createGain();master.gain.value=.16;master.connect(audio.destination);}
  if(audio.state==='suspended')audio.resume();return audio;
}
export function unlock(){context();}
function tone(freq,duration=.12,type='sine',volume=.4,slide=0){
  const a=context();if(!a)return;const osc=a.createOscillator(),gain=a.createGain(),t=a.currentTime;
  osc.type=type;osc.frequency.setValueAtTime(freq,t);if(slide)osc.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide),t+duration);
  gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+.012);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
  osc.connect(gain);gain.connect(master);osc.start(t);osc.stop(t+duration+.025);
}
export function step(sneak=false){tone(sneak?145:112,.045,'triangle',sneak?.1:.18,-22);}
export function pebble(){tone(780,.08,'triangle',.33,-320);setTimeout(()=>tone(330,.15,'sine',.2,-80),65);}
export function alarm(){const now=performance.now();if(now-lastAlarm<850)return;lastAlarm=now;tone(520,.2,'sawtooth',.17,-110);}
export function success(){tone(510,.12,'sine',.3,200);setTimeout(()=>tone(760,.18,'sine',.25,250),115);}
export function caught(){tone(190,.36,'sawtooth',.32,-115);setTimeout(()=>tone(92,.42,'triangle',.28,-35),170);}
