// figma-taste audit (min). Generated from audit.figma.js by build-min.mjs. Same checks as the full file.
// Edit ROOT_IDS, MIN_IMAGES, SUMMARY and BRAND_PALETTE on the next lines.
const ROOT_IDS=['ROOT_ID'];
const MIN_IMAGES=4;
const SUMMARY=false;
const BRAND_PALETTE=false;
const results=[];
for(const rootId of ROOT_IDS)results.push(await aR(rootId));
const verdict=results.every(r=>r.verdict==='PASS')?'PASS':'FAIL';
return{verdict,results};
async function aR(ROOT_ID_VALUE){
const ROOT=await figma.getNodeByIdAsync(ROOT_ID_VALUE);
if(!ROOT)return{root:ROOT_ID_VALUE,verdict:'FAIL',error:`node ${ROOT_ID_VALUE} not found`};
{
let p=ROOT;while(p.parent&&p.type!=='PAGE')p=p.parent;
if(p.type==='PAGE'&&p.id!==figma.currentPage.id)await figma.setCurrentPageAsync(p);
}
const fails=[],warns=[];
const F=(rule,n,msg)=>fails.push({rule,id:n?.id,name:n?.name,msg});
const W=(rule,n,msg)=>warns.push({rule,id:n?.id,name:n?.name,msg});
const all=[ROOT,...ROOT.findAll(()=>true)];
const sI=ROOT.parent?.id;
const iA=(n,re)=>{for(let p=n;p&&p.id!==sI;p=p.parent)if(re.test(p.name||''))return true;return false;};
const iI=n=>{for(let p=n.parent;p&&p.id!==sI;p=p.parent)if(p.type==='INSTANCE')return true;return false;};
const iF=n=>iA(n,/^free\//i);
const iU=n=>iA(n,/^ui\//i);
const iC=n=>iA(n,/^code\//i);
const hL=n=>'layoutMode'in n&&n.layoutMode&&n.layoutMode!=='NONE';
const vP=arr=>(Array.isArray(arr)?arr:[]).filter(p=>p.visible!==false);
const hI=n=>vP(n.fills).some(p=>p.type==='IMAGE');
const dN=/^(Frame|Rectangle|Group|Ellipse|Vector|Text|Line|Polygon|Star|Auto layout|Union|Subtract|Component|Instance)( \d+)?$/;
const nS=n=>{
const par=n.parent;if(!par||!('children'in par))return null;
const idx=par.children.findIndex(c=>c.id===n.id);
return idx>=0?par.children[idx+1]||null:null;
};
const iD=n=>/ · dummy$/.test(n.name||'')||(Array.isArray(n.annotations)&&n.annotations.some(a=>(a.label||'').startsWith('Dummy')));
const texts=all.filter(n=>n.type==='TEXT');
const fm=new Map();
const sizes=new Map();
const TI=new Map();
const SC=new Map();
for(const t of texts){
let segs=[];
try{segs=t.getStyledTextSegments(['fontName','fontSize','textCase','letterSpacing','lineHeight']);}catch{segs=[];}
let maxSize=0,mono=false,upper=false,tracked=false,lhPx=null;
for(const s of segs){
fm.set(s.fontName.family,(fm.get(s.fontName.family)||0)+1);
sizes.set(s.fontSize,(sizes.get(s.fontSize)||0)+1);
if(s.fontSize>maxSize){
maxSize=s.fontSize;
lhPx=s.lineHeight.unit==='PIXELS'?s.lineHeight.value:s.lineHeight.unit==='PERCENT'?s.lineHeight.value*s.fontSize/100:s.fontSize*1.2;
}
if(/mono|code|courier|consol/i.test(s.fontName.family))mono=true;
if(s.textCase==='UPPER')upper=true;
const ls=s.letterSpacing;
if((ls.unit==='PERCENT'&&ls.value>2)||(ls.unit==='PIXELS'&&ls.value>0.5))tracked=true;
}
const chars=t.characters||'';
if(!upper&&/[A-Za-z]{3}/.test(chars)&&chars===chars.toUpperCase())upper=true;
let styleName=null;
const sid=t.textStyleId;
if(sid&&sid!==figma.mixed){
if(!SC.has(sid)){const st=await figma.getStyleByIdAsync(sid);SC.set(sid,st?st.name:null);}
styleName=SC.get(sid);
}
const role=styleName?(styleName.match(/(?:^|\/)(Display|Heading|Statement|Quote|Body|Label|Small|Caption)\b/)||[])[1]||null:null;
TI.set(t.id,{maxSize,lhPx,mono,upper,tracked,chars,styleName,role});
}
const sz=n=>TI.get(n.id)?.maxSize||0;
let frames=0,aF=0,loose=0,instances=0,realImages=0,hidden=0,dummyLayers=0;
const uF=[],uS=[],uR=[],uT=[],dX=[];
for(const n of all){
if(n.visible===false){hidden++;continue;}
if(iD(n))dummyLayers++;
const inInst=iI(n);
if(n.type==='INSTANCE')instances++;
if(n.type==='FRAME'||n.type==='COMPONENT'){
frames++;
if(hL(n))aF++;
else if('children'in n&&n.children.length>=2&&!iF(n)&&!inInst){loose++;F('loose-frame',n,`${n.children.length} children placed absolutely; use auto layout or name it free/…`);}
if('children'in n&&n.children.length===1&&n.id!==ROOT.id&&!inInst
&&vP(n.fills).length===0&&vP(n.strokes).length===0
&&(!n.effects||n.effects.length===0)
&&['paddingTop','paddingBottom','paddingLeft','paddingRight'].every(k=>!n[k])
&&!/^(Section|Footer|Nav|image)\b/.test(n.name)){
W('useless-wrapper',n,'one child, no fill, padding or effect; append the child to the parent, and if the wrapper only limited its width, bind the child\'s width to span/N instead');
}
if('children'in n&&n.children.length===0&&vP(n.fills).length===0&&!/^image\//.test(n.name))W('empty-frame',n,'empty frame');
}
if(n.type==='GROUP'&&!iF(n)&&!inInst)W('group',n,'groups do not reflow; use an auto-layout frame');
if(n.layoutPositioning==='ABSOLUTE'&&!/^(free\/|scrim)/i.test(n.name))W('absolute-child',n,'absolute child inside auto layout; name it free/… if intended');
if(dN.test(n.name)&&!inInst)dX.push(n);
if(!inInst&&!iU(n)){
for(const p of vP(n.fills))if(p.type==='SOLID'&&!p.boundVariables?.color){uF.push(n);break;}
for(const p of vP(n.strokes))if(p.type==='SOLID'&&!p.boundVariables?.color){uF.push(n);break;}
if(hL(n)){
const bv=n.boundVariables||{};
const fields=['itemSpacing','paddingTop','paddingBottom','paddingLeft','paddingRight'];
if(n.layoutWrap==='WRAP')fields.push('counterAxisSpacing');
if(n.primaryAxisAlignItems==='SPACE_BETWEEN')fields.splice(fields.indexOf('itemSpacing'),1);
if(fields.some(f=>typeof n[f]==='number'&&n[f]>0&&!bv[f]))uS.push(n);
}
if('cornerRadius'in n){
const bv=n.boundVariables||{};
const r=n.cornerRadius;
const any=r===figma.mixed?['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'].some(k=>n[k]>0):r>0;
const bound=bv.topLeftRadius||bv.topRightRadius||bv.bottomLeftRadius||bv.bottomRightRadius;
if(any&&!bound)uR.push(n);
}
}
if(n.type==='TEXT'&&!inInst){
const sid=n.textStyleId;
if(!sid||sid===figma.mixed)uT.push(n);
}
for(const p of vP(n.fills)){
if(p.type.startsWith('GRADIENT')&&!/scrim/i.test(n.name))F('gradient',n,'gradient fill (only a neutral scrim named "scrim" is allowed)');
}
if(hI(n))realImages++;
for(const e of(n.effects||[]).filter(e=>e.visible!==false)){
if(e.type==='BACKGROUND_BLUR')F('glass',n,'background blur (glass)');
else if((e.type==='DROP_SHADOW'||e.type==='INNER_SHADOW')&&!/menu|dialog|popover|overlay|modal/i.test(n.name)&&!iU(n))W('shadow',n,'shadow on something at rest');
else if(e.type==='LAYER_BLUR')W('blur',n,'layer blur');
}
const sw=typeof n.strokeWeight==='number'?n.strokeWeight:1;
if(!inInst&&!iU(n)&&vP(n.strokes).length&&sw<=1.5&&n.type!=='TEXT'&&!/^field\//i.test(n.name)&&!iA(n,/^field\//i))W('hairline',n,'thin outline or divider; use space or a tone step');
if(n.type==='LINE'&&!iU(n))W('hairline',n,'divider line');
if(!inInst&&!iU(n)&&n.id!==ROOT.id){
const oneSide='strokeLeftWeight'in n&&n.strokeLeftWeight>0&&!n.strokeTopWeight&&!n.strokeRightWeight&&!n.strokeBottomWeight&&vP(n.strokes).length>0;
const par=n.parent;
const bar=n.type==='RECTANGLE'&&n.width<=8&&!hI(n)&&par&&'children'in par&&par.height>0&&n.height>=0.7*par.height
&&(hL(par)&&par.layoutMode==='HORIZONTAL'?par.children.find(c=>c.visible!==false)?.id===n.id
:Math.abs(n.absoluteTransform[0][2]-par.absoluteTransform[0][2])<=1);
if(oneSide||bar)W('left-stripe',n,'thin accent bar on one side; let space, scale or a full tone step mark it');
}
if(n.type==='ELLIPSE'&&n.width<=12&&n.height<=12&&!inInst&&!iU(n)&&!hI(n)
&&n.parent&&hL(n.parent)&&n.parent.layoutMode==='HORIZONTAL'&&n.parent.children.some(c=>c.type==='TEXT')
&&!iA(n,/toggle|switch|radio|legend|chart/i))W('status-dot',n,'decorative dot beside a label');
if(n.type==='TEXT'){
const ti=TI.get(n.id);
const chars=ti.chars.trim();
if(ti.mono&&!iC(n))F('monospace',n,'monospace outside code');
if(/^\(?0\d{1,2}\)?[.:/]?$/.test(chars)||/^(step|langkah|tahap)\s*\d+/i.test(chars))F('index-number',n,`index numbering "${chars}"`);
if(ti.maxSize<=14&&ti.upper&&ti.tracked)F('tiny-caps',n,'tiny uppercase letter-spaced label');
if(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/u.test(chars.replace(/[©®™]/g,'')))F('emoji',n,'emoji in UI text');
if(!iC(n)&&((/\b\d{1,2}[:.]\d{2}\b/.test(chars)&&/\b(GMT|UTC|WIB|WITA|WIT|CET|CEST|EST|EDT|PST|PDT|BST|JST|SGT|AEST|IST)\b/.test(chars))
||/\d\s*°\s*[NSEW]\b/.test(chars)||(chars.match(/·/g)||[]).length>=2))W('micro-meta',n,`agency micro-meta "${chars.slice(0,40)}"`);
const iH=ti.role?(ti.role==='Display'||ti.role==='Heading'):ti.maxSize>=48;
if(iH&&ti.maxSize>=28&&ti.lhPx){
const lines=Math.round(n.height/ti.lhPx);
if(lines>2)F('headline-lines',n,`headline runs ${lines} lines at ${ti.maxSize}px`);
}
const par=n.parent;
if(par&&'children'in par&&par.layoutMode==='VERTICAL'&&ti.maxSize<=16&&chars.length>0&&chars.length<=40){
const next=nS(n);
if(next&&next.type==='TEXT'&&sz(next)>=Math.max(32,ti.maxSize*1.8))F('eyebrow',n,`label "${chars}" above a heading`);
}
}
if((n.type==='FRAME'||n.type==='INSTANCE')&&n.parent?.layoutMode==='VERTICAL'&&n.height<=40){
const r=typeof n.cornerRadius==='number'?n.cornerRadius:0;
const sT='children'in n&&n.children.some(c=>c.type==='TEXT'&&sz(c)<=14);
const next=nS(n);
if(r>=n.height/2-1&&sT&&next&&next.type==='TEXT'&&sz(next)>=32)F('pill-badge',n,'pill badge above a heading');
}
if(/^image\//i.test(n.name)&&!hI(n))F('empty-image-slot',n,'image slot without a photograph');
}
const list=arr=>arr.slice(0,12).map(n=>`${n.name} (${n.id})`).join(', ');
if(uF.length)F('unbound-colour',uF[0],`${uF.length} nodes with raw colours: ${list(uF)}`);
if(uS.length)F('unbound-spacing',uS[0],`${uS.length} auto-layout frames with raw gap/padding: ${list(uS)}`);
if(uR.length)W('unbound-radius',uR[0],`${uR.length} nodes with raw radius: ${list(uR)}`);
if(uT.length)F('unstyled-text',uT[0],`${uT.length} text layers without a text style: ${list(uT)}`);
if(dX.length)W('default-names',dX[0],`${dX.length} default layer names: ${list(dX)}`);
if(fm.size>2)F('type-families',ROOT,`${fm.size} typefaces: ${[...fm.keys()].join(', ')}`);
if(sizes.size>7)W('type-sizes',ROOT,`${sizes.size} font sizes: ${[...sizes.keys()].sort((a,b)=>b-a).join(', ')}`);
function sig(n,depth=0){
if(depth>3)return'';
const bucket=k=>(k>=4?'4+':String(k));
if(n.type==='TEXT')return sz(n)>=28?'H':'t';
if(n.type==='RECTANGLE')return hI(n)||/^image\//.test(n.name)?'img':'r';
if(n.type==='INSTANCE')return`I:${n.mainComponent?.parent?.type==='COMPONENT_SET'?n.mainComponent.parent.name:n.mainComponent?.name}`;
if(!('children'in n))return n.type[0];
const kids=n.children.filter(c=>c.visible!==false&&!/^scrim/i.test(c.name));
const parts=[];
for(const k of kids){const s=sig(k,depth+1);if(parts[parts.length-1]?.s===s)parts[parts.length-1].c++;else parts.push({s,c:1});}
const mode=n.layoutMode||'NONE';
const g=mode==='GRID'?`${n.gridColumnCount}x${n.gridRowCount}`:'';
return`${mode[0]}${n.layoutWrap==='WRAP'?'w':''}${g}${hI(n)?'*':''}(${parts.map(p=>p.c>1?`${p.s}x${bucket(p.c)}`:p.s).join(',')})`;
}
const sc=ROOT.children.filter(c=>c.visible!==false&&!/^nav/i.test(c.name));
const sigs=sc.map(s=>({s,sig:sig(s)}));
for(let i=1;i<sigs.length;i++){
if(sigs[i].sig===sigs[i-1].sig)F('repeat-adjacent',sigs[i].s,`same composition as the section above (${sigs[i-1].s.name})`);
}
const seen=new Map();
for(const x of sigs){if(seen.has(x.sig))W('repeat',x.s,`same composition as ${seen.get(x.sig).name}`);else seen.set(x.sig,x.s);}
const cN=k=>k.type==='INSTANCE'?(k.mainComponent?.parent?.type==='COMPONENT_SET'?k.mainComponent.parent.name:k.mainComponent?.name)||'':'';
for(const n of all){
if(!hL(n)||!('children'in n)||iU(n)||iI(n))continue;
if(/^(Clients|Logos)\//i.test(n.name))continue;
const kids=n.children.filter(c=>c.visible!==false&&(c.type==='FRAME'||c.type==='INSTANCE'||c.type==='COMPONENT'));
if(kids.length<3||kids.length!==n.children.filter(c=>c.visible!==false).length)continue;
if(kids.every(k=>/^Logo\//i.test(cN(k))||/^Logo\//i.test(k.name)))continue;
const ks=kids.map(k=>sig(k,1));
if(!ks.every(s=>s===ks[0]))continue;
const iL=kids.every(k=>{
const first=k.findOne?.(d=>['VECTOR','ELLIPSE','BOOLEAN_OPERATION','STAR','POLYGON'].includes(d.type)||(/icon/i.test(d.name)&&d.width<=72));
return first&&first.width<=72&&!k.findOne(d=>hI(d));
});
const cd=kids.every(k=>vP(k.fills).length||vP(k.strokes).length);
if(iL)F('icon-cards',n,`${kids.length} identical cards with icons`);
else if(cd&&!kids.some(k=>k.findOne?.(d=>hI(d)||/^image\//.test(d.name))))W('card-row',n,`${kids.length} identical filled cards; check the dealt composition`);
}
const first=sc.find(s=>!/^nav/i.test(s.name));
const hTx=(s,px)=>s.type==='TEXT'?sz(s)>=px:'findOne'in s&&!!s.findOne(d=>d.type==='TEXT'&&sz(d)>=px);
if(first&&!hTx(first,40))F('no-title',first,'first screen has no title set large');
for(const s of sc){
if(/footer/i.test(s.name))continue;
if(s.type!=='TEXT'&&!hTx(s,28))W('untitled-section',s,'section without a heading');
if(hL(s)&&(s.paddingLeft||s.paddingRight)&&s.paddingLeft!==s.paddingRight&&!/free\//.test(s.name))F('unequal-margins',s,`padding left ${s.paddingLeft} ≠ right ${s.paddingRight}`);
}
const hsl=({r,g,b})=>{
const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;
if(!d)return[0,0,l*100];
const h=mx===r?((g-b)/d+6)%6:mx===g?(b-r)/d+2:(r-g)/d+4;
return[h*60,d/(1-Math.abs(2*l-1))*100,l*100];
};
const sCl=arr=>vP(arr).filter(p=>p.type==='SOLID'&&p.color).map(p=>p.color);
const iBd=(c,h0,h1,s0,s1,l0,l1)=>{const[h,s,l]=hsl(c);return h>=h0&&h<=h1&&s>=s0&&s<=s1&&l>=l0&&l<=l1;};
const iCr=c=>iBd(c,35,60,25,70,88,100);
const iCy=c=>iBd(c,8,28,35,75,35,60);
if(!BRAND_PALETTE){
const ground=[ROOT,...sc].find(s=>s.visible!==false&&sCl(s.fills).some(iCr));
const clay=ground&&all.find(n=>n.visible!==false&&[...sCl(n.fills),...sCl(n.strokes)].some(iCy));
if(clay)F('assistant-palette',clay,`cream ground (${ground.name}) with a terracotta accent; set BRAND_PALETTE = true only when the brand owns it`);
}
const bNm=/(^|\/)button\b/i;
const iBt=k=>(k.type==='FRAME'||k.type==='INSTANCE'||k.type==='COMPONENT')&&(bNm.test(k.name)||bNm.test(cN(k)));
const buttons=all.filter(k=>k.visible!==false&&iBt(k)&&!(k.parent&&iA(k.parent,bNm)));
const arw=k=>!!k.findOne?.(d=>(d.type==='TEXT'&&/[→↗›➝]\s*$/.test(d.characters||''))||(d.type!=='TEXT'&&/arrow/i.test(d.name)));
if(buttons.length>=3&&buttons.every(arw))W('button-arrows',buttons[0],`${buttons.length} buttons, every one ends in an arrow`);
const radii=all.filter(k=>k.visible!==false&&!iI(k)&&'cornerRadius'in k&&typeof k.cornerRadius==='number'&&k.cornerRadius>0).map(k=>k.cornerRadius);
if(radii.length>=4){
const freq=new Map();
for(const r of radii)freq.set(r,(freq.get(r)||0)+1);
const[top,count]=[...freq].sort((a,b)=>b[1]-a[1])[0];
if(top>=10&&top<=20&&count/radii.length>=0.7)W('soft-radius',ROOT,`${count} of ${radii.length} rounded layers share radius ${top}; choose square or fully round once`);
}
const heads=texts.filter(t=>{
const ti=TI.get(t.id);
return t.visible!==false&&(ti.role?ti.role==='Display'||ti.role==='Heading':ti.maxSize>=48);
});
const centred=heads.filter(t=>t.textAlignHorizontal==='CENTER').length;
if(heads.length>=3&&centred/heads.length>0.72)W('all-centred',ROOT,`${centred} of ${heads.length} headings centred; anchor left, keep one centred moment`);
const tK=k=>{
const p=vP(k.fills)[0];
const fill=p?p.boundVariables?.color?.id||JSON.stringify(p.color||p.type):'none';
const badge=k.findOne?.(d=>/badge|popular|recommended/i.test(d.name)||(d.type==='TEXT'&&/most popular|populer|recommended|terlaris/i.test(d.characters||'')));
return badge?`${fill}+badge`:fill;
};
for(const n of all){
if(!hL(n)||!('children'in n)||iI(n)||!iA(n,/pricing/i))continue;
const tiers=n.children.filter(c=>c.visible!==false&&(c.type==='FRAME'||c.type==='INSTANCE'||c.type==='COMPONENT'));
if(tiers.length<3)continue;
const keys=tiers.map(tK);
const odd=keys.filter(x=>keys.indexOf(x)===keys.lastIndexOf(x));
if(odd.length===1&&new Set(keys).size===2)W('popular-tier',tiers[keys.indexOf(odd[0])],'one tier raised above the others; let the words and the figure differ');
}
for(const n of all){
if(!hL(n)||n.layoutMode!=='GRID'||iU(n)||iI(n))continue;
const cells=n.children.filter(c=>c.visible!==false);
if(cells.length<4)continue;
const spans=new Set(cells.map(c=>'gridColumnSpan'in c?`${c.gridColumnSpan||1}x${c.gridRowSpan||1}`:'1x1'));
const filled=c=>!hI(c)&&(sCl(c.fills).length>0||vP(c.strokes).length>0);
if(spans.size>=2&&cells.every(filled))W('bento',n,`${cells.length} filled cells in mixed spans (bento)`);
}
const grid=(ROOT.layoutGrids||[]).find(g=>g.pattern==='COLUMNS'&&g.visible!==false);
let offGrid=0;
if(grid&&grid.alignment==='STRETCH'){
const Wd=ROOT.width,cols=grid.count,gut=grid.gutterSize,mar=grid.offset;
const col=(Wd-2*mar-(cols-1)*gut)/cols;
const st=Array.from({length:cols},(_,k)=>mar+k*(col+gut));
const en=st.map(s=>s+col);
const nr=(x,arr)=>arr.some(a=>Math.abs(a-x)<=1);
const rX=ROOT.absoluteTransform[0][2];
const fB=n=>n.width>=Wd-1;
const ck=(n,cR)=>{
if(n.visible===false||iF(n)||/^scrim/i.test(n.name)||n.layoutPositioning==='ABSOLUTE'||fB(n))return;
const x=n.absoluteTransform[0][2]-rX;
const r=x+n.width;
if(!nr(x,st)){offGrid++;W('off-grid',n,`left edge at ${x.toFixed(1)} is not on a column start`);}
else if(cR&&n.layoutSizingHorizontal!=='HUG'&&!nr(r,en)){offGrid++;W('off-grid',n,`right edge at ${r.toFixed(1)} is not on a column end`);}
};
for(const s of sc){
if(!('children'in s))continue;
for(const c of s.children){
ck(c,false);
const iS='children'in c&&(c.layoutMode==='HORIZONTAL'||c.layoutMode==='GRID')
&&c.layoutWrap!=='WRAP'&&c.primaryAxisAlignItems!=='SPACE_BETWEEN'
&&c.children.filter(k=>k.visible!==false&&k.layoutPositioning!=='ABSOLUTE').length>=2;
if(iS)for(const k of c.children)ck(k,true);
}
}
}else if(!grid){
W('no-layout-grid',ROOT,'page wrapper has no column layout grid; add it with columnGrid()');
}
if(realImages<MIN_IMAGES)F('image-floor',ROOT,`${realImages} real photographs; at least ${MIN_IMAGES} needed`);
const stats={
nodes:all.length,hidden,frames,autoLayoutFrames:aF,
autoLayoutRatio:frames?+(aF/frames).toFixed(2):1,
looseFrames:loose,instances,texts:texts.length,unstyledTexts:uT.length,
realImages,dummyLayers,offGrid,height:Math.round(ROOT.height),
sectionHeightSum:Math.round(sc.reduce((a,s)=>a+s.height,0)),
typefaces:[...fm.keys()],fontSizes:[...sizes.keys()].sort((a,b)=>b-a),
};
const v=fails.length?'FAIL':'PASS';
if(SUMMARY){
return{
root:`${ROOT.name} (${ROOT.id})`,verdict:v,fails:fails.length,warns:warns.length,
failList:fails.slice(0,30).map(f=>`${f.rule} · ${f.name}: ${String(f.msg).slice(0,90)}`),
stats:{realImages,dummyLayers,offGrid,autoLayoutRatio:stats.autoLayoutRatio,height:stats.height,typefaces:stats.typefaces},
};
}
return{
root:`${ROOT.name} (${ROOT.id})`,verdict:v,
counts:{fails:fails.length,warns:warns.length},
fails:fails.slice(0,60),warns:warns.slice(0,60),
stats:{...stats,sections:sigs.map(x=>({name:x.s.name,height:Math.round(x.s.height),sig:x.sig.slice(0,80)}))},
};
}
