import{preferences,setPreference,readSetting,writeSetting,notesStore}from'../core/storage.js?v=1.1.1';
import{calculate}from'./calculator.js?v=1.1.1';
export function mount(root,wm){
 root.innerHTML='<div class="terminal-body"><pre class="terminal-output"></pre><form class="terminal-form"><span>emo@emos ~ ❯</span><input aria-label="Terminal komutu" autocomplete="off" spellcheck="false" autocapitalize="off"></form></div>';
 const output=root.querySelector('pre'),input=root.querySelector('input'),prompt=root.querySelector('.terminal-form span');let history=readSetting('terminalHistory',[]),cursor=history.length,cwd='~',closed=false;
 const commands=['help','clear','date','whoami','version','echo','ls','pwd','cd','open','theme','wallpaper','clock','calc','history','neofetch','cat'];
 const print=text=>{if(closed)return;output.textContent=(output.textContent+text+'\n').slice(-50000);root.firstElementChild.scrollTop=root.firstElementChild.scrollHeight};
 const updatePrompt=()=>prompt.textContent=(preferences.name||'emo')+'@emos '+cwd+' ❯';updatePrompt();
 print('EmOS Terminal 1.1\nhelp ile keşfet · Tab ile tamamla · ↑ ↓ komut geçmişi\n');
 root.querySelector('form').onsubmit=async e=>{
  e.preventDefault();const line=input.value.trim();if(!line||input.disabled)return;history.push(line);history=history.slice(-100);writeSetting('terminalHistory',history);cursor=history.length;input.value='';print(prompt.textContent+' '+line);input.disabled=true;
  const[raw,...args]=line.split(/\s+/),cmd=raw.toLowerCase(),value=args.join(' ');
  try{switch(cmd){
   case'help':print('help / clear / date / whoami / version / echo <metin>\nls / pwd / cd apps|notes|askimmm|..|~\nopen <uygulama>      notes, settings, music, askimmm…\ncat <not id>         Kaydedilmiş bir notu oku\ncalc <işlem>        Örn. sqrt(144)+2^3, sin(30) [DEG]\ntheme dark|light\nwallpaper aurora|ocean|ember\nclock on|off\nhistory / history clear\nneofetch            EmOS bilgisi\n\nKlasörler EmOS’a aittir; cihazının dosyalarına erişilmez.');break;
   case'clear':output.textContent='';break;
   case'date':print(new Date().toLocaleString('tr-TR'));break;
   case'whoami':print((preferences.name||'emo')+' · yerel kullanıcı');break;
   case'version':print('EmOS 1.1 · Modern Glass');break;
   case'echo':print(value);break;
   case'pwd':print('/home/'+(preferences.name||'emo')+(cwd==='~'?'':'/'+cwd));break;
   case'cd':{const target=(args[0]||'~').replace(/^~\//,'').replace(/\/$/,'');if(['..','~','/'].includes(target))cwd='~';else if(['apps','notes','askimmm'].includes(target))cwd=target;else print('Klasör bulunamadı. apps, notes, askimmm');updatePrompt();break}
   case'ls':if(cwd==='notes'){const notes=await notesStore.list();print(notes.length?notes.map(n=>n.id+'  '+n.title).join('\n'):'Henüz kayıtlı not yok.')}else if(cwd==='askimmm')print('nazlimmm/  bebegimmmm/  nazli-studio/\nopen askimmm ile klasörü aç.');else if(cwd==='apps')print(wm.registry.map(a=>a.id).join('  '));else print('apps/  notes/  askimmm/');break;
   case'cat':{const note=(await notesStore.list()).find(n=>n.id===value);print(note?note.title+'\n\n'+note.text:'Not bulunamadı. cd notes ve ls ile kimlikleri görebilirsin.');break}
   case'open':{const id=args[0]==='spotify'?'music':args[0];if(wm.registry.some(a=>a.id===id)){wm.open(id);print(id+' açıldı.')}else print('Uygulama bulunamadı: '+wm.registry.map(a=>a.id).join(', '));break}
   case'theme':if(['dark','light'].includes(value))print(setPreference('theme',value)?'Tema kaydedildi.':'Tema değişti; kayıt başarısız.');else print('theme dark|light');break;
   case'wallpaper':if(['aurora','ocean','ember'].includes(value)){setPreference('wallpaper',value);print('Hazır tema seçildi. Kendi görselin etkinse Ayarlar’dan kaldırabilirsin.')}else print('wallpaper aurora|ocean|ember');break;
   case'clock':if(['on','off'].includes(value)){setPreference('clockVisible',value==='on');print('Saat '+(value==='on'?'görünür.':'gizlendi.'))}else print('clock on|off');break;
   case'calc':print(String(calculate(value)));break;
   case'history':if(value==='clear'){history=[];cursor=0;writeSetting('terminalHistory',history);print('Komut geçmişi silindi.')}else print(history.map((v,i)=>(i+1)+'  '+v).join('\n'));break;
   case'neofetch':print('EmOS 1.1\nKullanıcı: '+(preferences.name||'emo')+'\nTema: '+preferences.theme+'\nGörünüm alanı: '+innerWidth+' × '+innerHeight+'\nAçık uygulama: '+wm.windows.size+'\nDepolama: bu tarayıcı\nÇalışma ortamı: web masaüstü');break;
   default:print('Komut bulunamadı: '+cmd+' · help ile başlayabilirsin.');
  }}catch(error){print('Hata: '+error.message)}finally{if(!closed){input.disabled=false;print('');if(wm.active==='terminal')input.focus()}}
 };
 input.onkeydown=e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();cursor=Math.max(0,Math.min(history.length,cursor+(e.key==='ArrowUp'?-1:1)));input.value=history[cursor]||''}if(e.key==='Tab'){e.preventDefault();const isOpen=input.value.startsWith('open '),prefix=isOpen?input.value.slice(5):input.value;const choices=(isOpen?wm.registry.map(a=>a.id):commands).filter(c=>c.startsWith(prefix));if(choices.length===1)input.value=(isOpen?'open ':'')+choices[0]+' ';else if(choices.length)print(choices.join('  '))}if(e.ctrlKey&&e.key==='l'){e.preventDefault();output.textContent=''}};
 window.addEventListener('preferenceschange',updatePrompt);input.focus();return()=>{closed=true;window.removeEventListener('preferenceschange',updatePrompt)};
}
