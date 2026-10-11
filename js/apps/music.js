import{readSetting,writeSetting}from'../core/storage.js?v=1.1.0';
export function spotifyEmbed(value){
 const url=new URL(value.trim());if(url.protocol!=='https:'||url.hostname!=='open.spotify.com'||url.username||url.password)throw Error('Spotify’ın paylaş menüsünden bir bağlantı yapıştır.');
 const match=url.pathname.match(/^\/(?:intl-[a-z-]+\/)?(?:embed\/)?(playlist|track|album|artist|episode|show)\/([a-zA-Z0-9]{22})\/?$/);if(!match)throw Error('Liste, şarkı, albüm, sanatçı veya podcast bağlantısı gerekli.');return 'https://open.spotify.com/embed/'+match[1]+'/'+match[2];
}
export function mount(root){
 root.innerHTML=`<div class="spotify-room"><div class="eyebrow">EMOS / MUSIC ROOM</div><h2>Bizim melodimiz.</h2><p class="muted">Bir liste aç, burada kal.</p><form class="spotify-form"><input aria-label="Spotify bağlantısı" placeholder="Spotify liste veya şarkı bağlantısı" type="url" required><button class="primary">Aç</button></form><p class="spotify-status" role="status"></p><div class="spotify-frame"></div><div class="spotify-foot"><span>Spotify oynatıcısı · oynatma olanakları Spotify’a bağlıdır.</span><a target="_blank" rel="noopener noreferrer">Spotify’da aç ↗</a></div></div>`;
 const input=root.querySelector('input'),status=root.querySelector('.spotify-status'),holder=root.querySelector('.spotify-frame'),external=root.querySelector('.spotify-foot a');
 function show(value){try{const url=spotifyEmbed(value);const frame=document.createElement('iframe');frame.src=url;frame.title='Spotify müzik oynatıcısı';frame.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.loading='eager';holder.replaceChildren(frame);input.value=url.replace('/embed/','/');external.href=input.value;status.textContent=writeSetting('spotifyURL',input.value)?'Listeni buradan dinleyebilirsin.':'Liste açıldı; bağlantı bu tarayıcıda kaydedilemedi.'}catch(error){status.textContent=error.message}}
 root.querySelector('form').onsubmit=e=>{e.preventDefault();show(input.value)};
 show(readSetting('spotifyURL','https://open.spotify.com/playlist/6NyRmMt13dUIeXdh6IEstU'));
 return()=>holder.replaceChildren();
}
