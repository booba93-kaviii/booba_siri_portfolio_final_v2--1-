const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav-links');
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.textContent=open?'✕':'☰';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.textContent='☰';menuButton.setAttribute('aria-expanded','false')}));

// Scroll reveals, subtle cursor light, particles and back-to-top control.
if('IntersectionObserver'in window){const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.section-label,.section-head,.skill-card,.project-card,.journey-track article,.about-grid,.intro-layout,.journey-note').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el)})}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}
const cursorGlow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{if(cursorGlow){cursorGlow.style.left=e.clientX+'px';cursorGlow.style.top=e.clientY+'px'}});
const particleField=document.getElementById('particleField');for(let i=0;i<18;i++){const dot=document.createElement('i');dot.className='particle';dot.style.left=(Math.random()*100)+'%';dot.style.animationDuration=(12+Math.random()*18)+'s';dot.style.animationDelay=(-Math.random()*25)+'s';dot.style.opacity=(.15+Math.random()*.35).toFixed(2);particleField.appendChild(dot)}
const backTop=document.getElementById('backTop');window.addEventListener('scroll',()=>backTop.classList.toggle('show',window.scrollY>500),{passive:true});backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// Spoken introduction: prefer a feminine-sounding English voice if the device has one.
const introText=["Hello! I'm Booba Siri.","I'm a second-year Artificial Intelligence and Data Science student at Velalar College of Engineering and Technology.","I'm curious about technology, passionate about learning, and excited to build ideas that can make a difference.","I'm currently strengthening my programming skills and exploring artificial intelligence, data, and emerging technologies.","This is just the beginning of my journey. Thank you for visiting my portfolio. Let's connect!"];
const play=document.getElementById('playIntro'),pause=document.getElementById('pauseIntro'),stop=document.getElementById('stopIntro'),status=document.getElementById('voiceStatus'),caption=document.getElementById('spokenCaption'),stage=document.getElementById('videoStage'),progress=document.getElementById('voiceProgress'),voiceSelect=document.getElementById('voiceSelect'),stageState=document.getElementById('stageState');
let part=0,active=false,paused=false,voices=[],currentUtterance=null;
function loadVoices(){if(!('speechSynthesis'in window))return;voices=speechSynthesis.getVoices();const previous=voiceSelect.value;voiceSelect.innerHTML='<option value="auto">Best available English voice</option>';voices.filter(v=>/^en(-|_)/i.test(v.lang)).forEach((v,i)=>{const option=document.createElement('option');option.value=String(voices.indexOf(v));option.textContent=`${v.name} — ${v.lang}${/female|samantha|aria|zira|jenny|susan|karen|moira|tessa|victoria/i.test(v.name)?' · feminine-sounding':''}`;voiceSelect.appendChild(option)});if([...voiceSelect.options].some(o=>o.value===previous))voiceSelect.value=previous}
if('speechSynthesis'in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices}else{status.textContent='VOICE NOT SUPPORTED IN THIS BROWSER';play.disabled=true}
function chooseVoice(){const selected=voiceSelect.value;if(selected!=='auto'&&voices[Number(selected)])return voices[Number(selected)];const english=voices.filter(v=>/^en(-|_)/i.test(v.lang));return english.find(v=>/female|samantha|aria|zira|jenny|susan|karen|moira|tessa|victoria/i.test(v.name))||english.find(v=>/en-IN/i.test(v.lang))||english.find(v=>/en-GB|en-US/i.test(v.lang))||english[0]||null}
function updateProgress(){progress.style.width=(part/introText.length*100)+'%'}
function speakPart(){if(!active||paused)return;if(part>=introText.length){finishIntro();return}const line=introText[part];caption.textContent='“'+line+'”';status.textContent='INTRO PLAYING · '+(part+1)+' / '+introText.length;stageState.textContent='SPEAKING';updateProgress();currentUtterance=new SpeechSynthesisUtterance(line);currentUtterance.lang='en-IN';currentUtterance.rate=.93;currentUtterance.pitch=1.08;const voice=chooseVoice();if(voice){currentUtterance.voice=voice;currentUtterance.lang=voice.lang}currentUtterance.onend=()=>{if(!active||paused)return;part++;speakPart()};currentUtterance.onerror=event=>{if(event.error==='canceled'||event.error==='interrupted')return;status.textContent='VOICE UNAVAILABLE — TRY ANOTHER VOICE';stageState.textContent='VOICE ERROR';stage.classList.remove('speaking');active=false;play.textContent='▶';pause.disabled=true};speechSynthesis.speak(currentUtterance);stage.classList.add('speaking')}
function finishIntro(){active=false;paused=false;stage.classList.remove('speaking');status.textContent='INTRO COMPLETE · PLAY AGAIN';stageState.textContent='COMPLETE';play.textContent='↻';pause.disabled=true;progress.style.width='100%';part=0}
function startIntro(){if(!('speechSynthesis'in window)){status.textContent='VOICE NOT SUPPORTED IN THIS BROWSER';return}speechSynthesis.cancel();part=0;active=true;paused=false;play.textContent='▶';pause.disabled=false;pause.textContent='Ⅱ';speakPart()}
function pauseIntro(){if(!active||!('speechSynthesis'in window))return;if(!paused){speechSynthesis.pause();paused=true;status.textContent='INTRO PAUSED';stageState.textContent='PAUSED';stage.classList.remove('speaking');pause.textContent='▶'}else{speechSynthesis.resume();paused=false;status.textContent='INTRO PLAYING · '+(part+1)+' / '+introText.length;stageState.textContent='SPEAKING';stage.classList.add('speaking');pause.textContent='Ⅱ'}}
function stopIntro(){if('speechSynthesis'in window)speechSynthesis.cancel();active=false;paused=false;part=0;stage.classList.remove('speaking');status.textContent='INTRO STOPPED';stageState.textContent='READY';play.textContent='▶';pause.textContent='Ⅱ';pause.disabled=true;progress.style.width='0%';caption.textContent='“Hello! I\'m Booba Siri.”'}
play.addEventListener('click',()=>{if(active&&paused){pauseIntro();return}if(active){stopIntro();return}startIntro()});pause.addEventListener('click',pauseIntro);stop.addEventListener('click',stopIntro);voiceSelect.addEventListener('change',()=>{if(active)startIntro()});document.getElementById('introJump').addEventListener('click',()=>document.getElementById('intro').scrollIntoView({behavior:'smooth'}));window.addEventListener('beforeunload',()=>{if('speechSynthesis'in window)speechSynthesis.cancel()});

// Interactive skill explorer: category filters, live search and expandable learning cards.
const skillFilters=document.querySelectorAll('.skill-filter');
const skillCards=[...document.querySelectorAll('.skill-card-rich')];
const skillSearch=document.getElementById('skillSearch');
const skillResultCount=document.getElementById('skillResultCount');
const skillsEmpty=document.getElementById('skillsEmpty');
let activeSkillCategory='all';
function filterSkillCards(){
  const query=(skillSearch?.value||'').trim().toLowerCase();let visible=0;
  skillCards.forEach(card=>{
    const categoryMatch=activeSkillCategory==='all'||card.dataset.category===activeSkillCategory;
    const textMatch=!query||(card.dataset.search+' '+card.innerText).toLowerCase().includes(query);
    const show=categoryMatch&&textMatch;card.classList.toggle('is-hidden',!show);
    if(!show)card.open=false;else visible++;
  });
  if(skillResultCount)skillResultCount.textContent=`${visible} ${visible===1?'learning topic':'learning topics'}`;
  if(skillsEmpty)skillsEmpty.hidden=visible!==0;
}
skillFilters.forEach(button=>button.addEventListener('click',()=>{
  activeSkillCategory=button.dataset.filter;
  skillFilters.forEach(item=>{const selected=item===button;item.classList.toggle('active',selected);item.setAttribute('aria-pressed',String(selected))});
  filterSkillCards();
}));
skillSearch?.addEventListener('input',filterSkillCards);
skillSearch?.addEventListener('keydown',event=>{if(event.key==='Escape'){skillSearch.value='';filterSkillCards();skillSearch.blur()}});
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'&&skillSearch){event.preventDefault();skillSearch.focus();document.getElementById('skills').scrollIntoView({behavior:'smooth',block:'start'})}});
skillCards.forEach(card=>card.addEventListener('toggle',()=>{
  if(card.open)skillCards.forEach(other=>{if(other!==card)other.open=false});
}));
filterSkillCards();
