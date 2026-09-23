const ids=['home','projects','expertise','about','contact'];
const names=['THE BEGINNING','SELECTED DIRECTIONS','AREAS OF EXPLORATION','FIRST PRINCIPLES','THE NEXT CHAPTER'];
const captions=['RETURN TO THE ORIGIN','IDEAS TAKE FORM','ENTER THE BLUEPRINT','QUESTION EVERYTHING','OPEN THE NEXT DOOR'];
const pages=ids.map(id=>document.getElementById(id));
const transition=document.getElementById('transition');
const transitionText=document.getElementById('transitionText');
const counter=document.getElementById('counter');
const pageName=document.getElementById('pageName');
const menu=document.getElementById('mobileMenu');
const menuToggle=document.getElementById('menuToggle');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let current=0,busy=false,lastWheel=0,touchStart=null;
function closeMenu(){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false')}
function updateUI(){document.querySelectorAll('[data-go]').forEach(el=>{const active=el.dataset.go===ids[current];el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current')});counter.textContent=String(current+1).padStart(2,'0')+' / 05';pageName.textContent=names[current];history.replaceState(null,'','#'+ids[current])}
function navigate(target){if(busy||target<0||target>=pages.length||target===current){closeMenu();return}busy=true;closeMenu();const old=current;transition.className='transition';transitionText.textContent=captions[target];void transition.offsetWidth;transition.classList.add('playing','to-'+ids[target]);const swap=()=>{pages[old].classList.remove('active');pages[old].setAttribute('inert','');pages[target].classList.add('active');pages[target].removeAttribute('inert');pages[target].scrollTop=0;current=target;updateUI()};if(reduced){swap();transition.className='transition';busy=false;return}setTimeout(swap,730);setTimeout(()=>{transition.className='transition';busy=false},1450)}
document.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();navigate(ids.indexOf(el.dataset.go))}));
menuToggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuToggle.setAttribute('aria-expanded',String(!menu.hidden))});
document.getElementById('next').addEventListener('click',()=>navigate((current+1)%ids.length));document.getElementById('prev').addEventListener('click',()=>navigate((current-1+ids.length)%ids.length));
function canScroll(direction){const page=pages[current];return direction>0?page.scrollTop+page.clientHeight<page.scrollHeight-3:page.scrollTop>3}
window.addEventListener('wheel',e=>{if(busy||Math.abs(e.deltaY)<12)return;const direction=Math.sign(e.deltaY);if(canScroll(direction))return;const now=performance.now();if(now-lastWheel<950)return;lastWheel=now;navigate(Math.max(0,Math.min(ids.length-1,current+direction)))},{passive:true});
window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();return}if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();navigate(Math.min(ids.length-1,current+1))}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();navigate(Math.max(0,current-1))}});
window.addEventListener('touchstart',e=>{touchStart=e.touches[0].clientY},{passive:true});window.addEventListener('touchend',e=>{if(touchStart===null||busy)return;const delta=touchStart-e.changedTouches[0].clientY;touchStart=null;if(Math.abs(delta)<70)return;const direction=Math.sign(delta);if(canScroll(direction))return;navigate(Math.max(0,Math.min(ids.length-1,current+direction)))},{passive:true});
const initial=ids.indexOf(location.hash.slice(1));if(initial>0){pages[0].classList.remove('active');pages[0].setAttribute('inert','');pages[initial].classList.add('active');pages[initial].removeAttribute('inert');current=initial}updateUI();
