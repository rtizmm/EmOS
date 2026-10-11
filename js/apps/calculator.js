// Recursive-descent arithmetic parser; no eval or executable input.
export function calculate(source,{degrees=true,ans=0}={}){
 const text=String(source).toLowerCase().replaceAll('π','pi').replaceAll('×','*').replaceAll('÷','/');
 if(text.length>1000||/\d\s+\d/.test(text))throw Error('Geçersiz işlem');
 const compact=text.replace(/\s/g,''),tokens=compact.match(/(?:\d*\.\d+|\d+\.?\d*)(?:e[+-]?\d+)?|[a-z]+|[()+*/%^!-]/g)||[];
 if(!tokens.length||tokens.join('')!==compact)throw Error('Geçersiz işlem');let i=0;
 const functions={sqrt:Math.sqrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,sin:x=>Math.sin(degrees?x*Math.PI/180:x),cos:x=>Math.cos(degrees?x*Math.PI/180:x),tan:x=>{const r=degrees?x*Math.PI/180:x;if(Math.abs(Math.cos(r))<1e-14)throw Error('Tanımsız tanjant');return Math.tan(r)}};
 function atom(){const t=tokens[i++];if(t==='('){const v=sum();if(tokens[i++]!==')')throw Error('Parantez eksik');return v}if(t==='pi')return Math.PI;if(t==='e')return Math.E;if(t==='ans')return ans;if(Object.hasOwn(functions,t)){if(tokens[i++]!=='(')throw Error('Fonksiyon parantezi gerekli');const v=sum();if(tokens[i++]!==')')throw Error('Parantez eksik');return functions[t](v)}if(!t||!/^\d*\.?\d/.test(t))throw Error('Sayı bekleniyor');return Number(t)}
 function postfix(){let v=atom();while(['!','%'].includes(tokens[i])){if(tokens[i++]==='%')v/=100;else{if(!Number.isInteger(v)||v<0||v>170)throw Error('Faktöriyel 0–170 tam sayı olmalı');let n=1;for(let k=2;k<=v;k++)n*=k;v=n}}return v}
 function power(){const v=postfix();return tokens[i]==='^'?(i++,v**unary()):v}
 function unary(){if(tokens[i]==='+'){i++;return unary()}if(tokens[i]==='-'){i++;return-unary()}return power()}
 function product(){let v=unary();while(i<tokens.length){const op=tokens[i];if(op==='*'||op==='/'){i++;const n=unary();v=op==='*'?v*n:v/n}else if(op==='('||/^[a-z]/.test(op)){v*=unary()}else break}return v}
 function sum(){let v=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],n=product();v=op==='+'?v+n:v-n}return v}
 const result=sum();if(i!==tokens.length||!Number.isFinite(result))throw Error('Tanımsız veya çok büyük sonuç');return Number(result.toPrecision(12));
}
export function mount(root){
 let ans=0,degrees=true;root.innerHTML='<div class="calculator scientific"><div class="calc-top"><span>Bilimsel hesap makinesi</span><button class="secondary angle-mode" aria-label="Açı birimi">DEG</button></div><input class="calc-expression" aria-label="Matematik işlemi" placeholder="Örn. sqrt(144) + 2^3" autocomplete="off" spellcheck="false"><output class="calc-display" aria-live="polite">0</output><div class="calc-grid"></div><div class="calc-history" aria-label="İşlem geçmişi"></div></div>';
 const input=root.querySelector('input'),display=root.querySelector('output'),history=root.querySelector('.calc-history');
 root.querySelector('.angle-mode').onclick=e=>{degrees=!degrees;e.currentTarget.textContent=degrees?'DEG':'RAD'};
 const run=()=>{try{const expression=input.value;ans=calculate(expression,{degrees,ans});display.textContent=String(ans);const b=document.createElement('button');b.textContent=expression+' = '+ans;b.onclick=()=>{input.value=expression;input.focus()};history.prepend(b);while(history.children.length>8)history.lastChild.remove()}catch(error){display.textContent=error.message}};
 const insert=value=>{const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;input.setRangeText(value,start,end,'end');input.focus()};
 const keys=['sin(','cos(','tan(','(',')','sqrt(','log(','ln(','^','!','7','8','9','/','C','4','5','6','*','⌫','1','2','3','-','%','0','.','pi','+','=','abs(','exp(','e','ans','±'];
 for(const key of keys){const b=document.createElement('button');b.textContent=({'sqrt(':'√','pi':'π','*':'×','/':'÷'})[key]||key.replace('(','');if(key==='(')b.textContent='(';b.className=key==='='?'equals':/^\d|\.$/.test(key)?'':'operator';b.onclick=()=>{if(key==='=')run();else if(key==='C'){input.value='';display.textContent='0'}else if(key==='⌫'){const p=input.selectionStart??input.value.length,end=input.selectionEnd??p;input.setRangeText('',p===end?Math.max(0,p-1):p,end,'end');input.focus()}else if(key==='±'){input.value='-('+input.value+')';input.focus()}else insert(key)};root.querySelector('.calc-grid').append(b)}
 input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();run()}e.stopPropagation()};input.focus();
}
