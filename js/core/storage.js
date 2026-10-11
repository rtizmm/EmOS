const defaults={theme:'dark',accent:'#b5a0ff',wallpaper:'aurora',motion:true};
export function readSetting(key,fallback){try{return JSON.parse(localStorage.getItem('emos:'+key))??fallback}catch{return fallback}}
export function writeSetting(key,value){try{localStorage.setItem('emos:'+key,JSON.stringify(value));return true}catch{return false}}
export const preferences={...defaults,...readSetting('preferences',{})};
export function applyPreferences(){document.body.dataset.theme=preferences.theme;document.body.dataset.wallpaper=preferences.wallpaper;document.body.dataset.motion=preferences.motion?'on':'off';document.documentElement.style.setProperty('--accent',preferences.accent)}
export function setPreference(key,value){preferences[key]=value;applyPreferences();const saved=writeSetting('preferences',preferences);window.dispatchEvent(new CustomEvent('preferenceschange'));return saved}
let database;
function db(){return database??=new Promise((resolve,reject)=>{const request=indexedDB.open('emos',1);request.onupgradeneeded=()=>request.result.createObjectStore('notes',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
async function transact(mode,operation){const database=await db();return new Promise((resolve,reject)=>{const tx=database.transaction('notes',mode);const request=operation(tx.objectStore('notes'));tx.oncomplete=()=>resolve(request.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Kayıt iptal edildi'))})}
export const notesStore={list:()=>transact('readonly',s=>s.getAll()),put:note=>transact('readwrite',s=>s.put(note)),remove:id=>transact('readwrite',s=>s.delete(id))};
export function download(name,content,type='text/plain'){const url=URL.createObjectURL(new Blob([content],{type}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
