import{preferences,readSetting,writeSetting}from'./storage.js?v=1.0.1';
import{icon}from'./icons.js?v=1.0.1';
export class WindowManager{
 constructor(registry){
  this.registry=registry;this.windows=new Map();this.active=null;this.layer=10;this.sessionTimer=null;window.addEventListener('pagehide',()=>this.saveSession());
  window.addEventListener('resize',()=>this.windows.forEach(w=>{if(w.maximized)this.fit(w);else if(w.snapped)this.snap(w.app.id,w.snapped,false);else this.clamp(w)}));
 }
 saveSession(){if(!preferences.rememberWindows)return;writeSetting('windowSession',[...this.windows.values()].map(w=>({id:w.app.id,bounds:this.bounds(w),restore:w.restore,maximized:!!w.maximized,snapped:w.snapped||null,hidden:w.el.hidden})))}
 restoreSession(){const saved=readSetting('windowSession',null);if(!preferences.rememberWindows||!Array.isArray(saved))return false;const valid=b=>b&&['left','top','width','height'].every(k=>typeof b[k]==='string'&&/^[-\d.]+px$/.test(b[k])&&Number.isFinite(parseFloat(b[k])));for(const item of saved.slice(0,20)){if(!item||!this.registry.some(a=>a.id===item.id)||!valid(item.bounds)||parseFloat(item.bounds.width)<=0||parseFloat(item.bounds.height)<=0)continue;this.open(item.id,{launch:false});const w=this.windows.get(item.id);if(!w)continue;Object.assign(w.el.style,item.bounds);this.clamp(w);if(item.maximized)this.maximize(item.id);else if(['left','right'].includes(item.snapped))this.snap(item.id,item.snapped);if(valid(item.restore))w.restore=item.restore;w.el.hidden=!!item.hidden}this.pickFocus();return true}
 emit(){clearTimeout(this.sessionTimer);this.sessionTimer=setTimeout(()=>this.saveSession(),250);window.dispatchEvent(new CustomEvent('windowschange'))}
 focus(id){const w=this.windows.get(id);if(!w)return;w.el.hidden=false;if(this.active===id&&w.el.classList.contains('focused'))return;this.active=id;this.windows.forEach(x=>x.el.classList.toggle('focused',x===w));w.el.style.zIndex=++this.layer;this.emit()}
 bounds(w){return{left:w.el.style.left,top:w.el.style.top,width:w.el.style.width,height:w.el.style.height}}
 clamp(w){const width=Math.min(parseFloat(w.el.style.width),innerWidth),height=Math.min(parseFloat(w.el.style.height),innerHeight-64);Object.assign(w.el.style,{width:width+'px',height:height+'px',left:Math.max(0,Math.min(parseFloat(w.el.style.left),innerWidth-width))+'px',top:Math.max(0,Math.min(parseFloat(w.el.style.top),innerHeight-64-height))+'px'})}
 fit(w){Object.assign(w.el.style,{left:'0px',top:'0px',width:innerWidth+'px',height:innerHeight-64+'px'})}
 restore(id){const w=this.windows.get(id);if(!w)return;if(w.restore)Object.assign(w.el.style,w.restore);w.maximized=false;w.snapped=null;w.el.classList.remove('maximized');this.clamp(w);w.el.querySelector('[data-action="maximize"]').setAttribute('aria-label','Büyüt');this.focus(id)}
 maximize(id){const w=this.windows.get(id);if(!w)return;if(w.maximized){this.restore(id);return}if(!w.snapped)w.restore=this.bounds(w);w.snapped=null;w.maximized=true;w.el.classList.add('maximized');this.fit(w);w.el.querySelector('[data-action="maximize"]').setAttribute('aria-label','Eski boyuta döndür');this.focus(id)}
 snap(id,side,focus=true){const w=this.windows.get(id);if(!w||innerWidth<=760)return;if(!w.snapped&&!w.maximized)w.restore=this.bounds(w);w.maximized=false;w.snapped=side;w.el.querySelector('[data-action="maximize"]').setAttribute('aria-label','Büyüt');w.el.classList.remove('maximized');Object.assign(w.el.style,{left:side==='left'?'8px':innerWidth/2+4+'px',top:'8px',width:innerWidth/2-12+'px',height:innerHeight-80+'px'});if(focus)this.focus(id)}
 pickFocus(){this.windows.forEach(w=>w.el.classList.remove('focused'));const visible=[...this.windows.values()].filter(w=>!w.el.hidden).sort((a,b)=>+b.el.style.zIndex-+a.el.style.zIndex);this.active=null;if(visible[0])this.focus(visible[0].app.id);else this.emit()}
 minimize(id){const w=this.windows.get(id);if(w){w.el.hidden=true;this.pickFocus()}}
 close(id){const w=this.windows.get(id);if(!w)return;w.cancelDrag?.();w.cleanup?.();w.el.remove();this.windows.delete(id);this.pickFocus()}
 toggle(id){const w=this.windows.get(id);if(w&&!w.el.hidden&&this.active===id)this.minimize(id);else this.open(id)}
 showDesktop(){const visible=[...this.windows.values()].filter(w=>!w.el.hidden);if(visible.length){this.desktopHidden=visible.map(w=>w.app.id);visible.forEach(w=>{w.el.hidden=true;w.el.classList.remove('focused')});this.active=null;this.emit()}else{(this.desktopHidden||[]).forEach(id=>this.focus(id));this.desktopHidden=[]}}
 open(id,{launch=true}={}){
  if(this.windows.has(id)){this.focus(id);return}
  const app=this.registry.find(a=>a.id===id);if(!app)return;if(launch)app.launch?.();
  const el=document.createElement('section');el.className='window';el.setAttribute('role','dialog');el.setAttribute('aria-label',app.title);
  const offset=this.windows.size*20,width=app.width||660,height=app.height||490;
  Object.assign(el.style,{width:Math.min(width,innerWidth-24)+'px',height:Math.min(height,innerHeight-96)+'px',left:Math.max(0,(innerWidth-width)/2+offset)+'px',top:Math.max(0,(innerHeight-64-height)/2+offset)+'px'});
  el.innerHTML=`<header class="titlebar"><span class="window-title">${icon(id)}${app.title}</span><div class="window-controls"><button data-snap="left" class="snap-button" aria-label="Sola hizala" title="Sola hizala · Alt + ←">◧</button><button data-snap="right" class="snap-button" aria-label="Sağa hizala" title="Sağa hizala · Alt + →">◨</button><button data-action="minimize" aria-label="Küçült" title="Küçült">−</button><button data-action="maximize" aria-label="Büyüt" title="Büyüt / geri yükle">□</button><button data-action="close" class="close" aria-label="Kapat" title="Kapat">×</button></div></header><div class="window-content"></div><div class="resize-handle" aria-hidden="true"></div>`;
  document.querySelector('#windows').append(el);const w={el,app,maximized:false};this.windows.set(id,w);this.clamp(w);
  el.addEventListener('pointerdown',()=>this.focus(id));
  el.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>this[b.dataset.action](id));
  el.querySelectorAll('[data-snap]').forEach(b=>b.onclick=()=>this.snap(id,b.dataset.snap));
  const bar=el.querySelector('.titlebar');bar.ondblclick=e=>{if(!e.target.closest('button')){if(w.snapped)this.restore(id);else this.maximize(id)}};
  const drag=(handle,resize)=>{
   handle.onpointerdown=e=>{
    if(e.button!==0||e.target.closest('button')||w.maximized||innerWidth<=760)return;
    const rect=el.getBoundingClientRect(),x=e.clientX,y=e.clientY;let frame=0,last=e,moved=false;
    handle.setPointerCapture(e.pointerId);e.preventDefault();
    const paint=()=>{frame=0;if(!moved)return;const dx=last.clientX-x,dy=last.clientY-y;if(resize){el.style.width=Math.min(innerWidth-rect.left,Math.max(280,rect.width+dx))+'px';el.style.height=Math.min(innerHeight-64-rect.top,Math.max(240,rect.height+dy))+'px'}else{const left=Math.max(0,Math.min(innerWidth-rect.width,rect.left+dx)),top=Math.max(0,Math.min(innerHeight-108,rect.top+dy));el.style.transform=`translate3d(${left-rect.left}px,${top-rect.top}px,0)`}};
    handle.onpointermove=ev=>{last=ev;if(Math.abs(ev.clientX-x)+Math.abs(ev.clientY-y)>3)moved=true;if(moved)el.classList.add('dragging');if(!frame)frame=requestAnimationFrame(paint)};
    const stop=cancelled=>{cancelAnimationFrame(frame);paint();el.style.transform='';el.classList.remove('dragging');handle.onpointermove=null;handle.onpointerup=null;handle.onpointercancel=null;w.cancelDrag=null;if(!moved)return;this.emit();w.snapped=null;if(!resize){el.style.left=Math.max(0,Math.min(innerWidth-rect.width,rect.left+last.clientX-x))+'px';el.style.top=Math.max(0,Math.min(innerHeight-108,rect.top+last.clientY-y))+'px';if(!cancelled){if(last.clientY<10)this.maximize(id);else if(last.clientX<12)this.snap(id,'left');else if(last.clientX>innerWidth-12)this.snap(id,'right')}}};
    handle.onpointerup=()=>stop(false);handle.onpointercancel=()=>stop(true);w.cancelDrag=()=>stop(true);
   };
  };
  drag(bar,false);drag(el.querySelector('.resize-handle'),true);this.focus(id);
  try{w.cleanup=app.mount(el.querySelector('.window-content'),this)}catch{el.querySelector('.window-content').textContent='Uygulama açılamadı. Kapatıp tekrar deneyebilirsin.'}
 }
}
