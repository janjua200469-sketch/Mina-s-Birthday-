const $ = s => document.querySelector(s);
const intro = $("#intro"), site = $("#site"), loader = $("#loader");
const music = $("#music"), playBtn = $("#playBtn"), musicToggle = $("#musicToggle");
const musicStatus = $("#musicStatus");

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("gone"), 500);
});

async function startMusic() {
  try {
    await music.play();
    playBtn.textContent = "Ⅱ";
    musicToggle.textContent = "♫";
    musicStatus.textContent = "Now playing ♫ Die With A Smile";
  } catch(e) {
    musicStatus.textContent = "Tap the music button once to start the song.";
  }
}

$("#openBtn").addEventListener("click", async () => {
  intro.classList.add("hidden");
  site.classList.remove("hidden");
  window.scrollTo(0,0);
  await startMusic();
});

function toggleMusic(){
  if(music.paused){
    startMusic();
  } else {
    music.pause();
    playBtn.textContent="▶";
    musicToggle.textContent="♪";
    musicStatus.textContent="Music paused";
  }
}
playBtn.addEventListener("click", toggleMusic);
musicToggle.addEventListener("click", toggleMusic);

// ---------------- This or That ----------------
const choices = [
  ["Rainy evening", "Night drive"],
  ["Movie together", "Talk until 4 AM"],
  ["Forehead kiss", "Cheek kiss"],
  ["Cuddles", "Teasing"],
  ["Mountains", "Beach"],
  ["Sunset", "City lights"],
  ["Handwritten letter", "Surprise gift"],
  ["Matching outfits", "Matching playlists"]
];

const choiceWrap = $("#thisOrThat");
choices.forEach((pair, i) => {
  const row = document.createElement("div");
  row.className = "choice-row";
  row.innerHTML = `
    <div class="choice-question">${i+1}. Choose one</div>
    <div class="choice-buttons">
      <button type="button" data-choice="${i}" data-value="${pair[0]}">${pair[0]}</button>
      <button type="button" data-choice="${i}" data-value="${pair[1]}">${pair[1]}</button>
    </div>`;
  choiceWrap.appendChild(row);
});

choiceWrap.addEventListener("click", e => {
  if(!e.target.matches("button[data-choice]")) return;
  const idx=e.target.dataset.choice;
  document.querySelectorAll(`button[data-choice="${idx}"]`).forEach(b=>b.classList.remove("selected"));
  e.target.classList.add("selected");
});

$("#checkChoices").addEventListener("click", () => {
  const picked = [...document.querySelectorAll(".choice-row")].map(row => {
    const btn=row.querySelector("button.selected");
    return btn ? btn.dataset.value : null;
  });
  const answered=picked.filter(Boolean).length;
  const result=$("#choiceResult");
  if(!answered){
    result.textContent="Pick at least one — then save your choices. ♡";
    result.classList.add("show");
    return;
  }
  result.innerHTML=`You picked <strong>${answered}/${choices.length}</strong>. Your choices are saved on this page. ♡`;
  result.classList.add("show");
});

// ---------------- Complete My Sentence ----------------
const sentences = [
  "When I see your name pop up on my phone, I ______.",
  "My favourite thing about you is ______.",
  "If we were together right now, I'd ______.",
  "I knew you were special when ______.",
  "One thing I want to experience with you is ______.",
  "When we're old, I hope we're ______.",
  "You make me feel ______."
];

const sentenceWrap=$("#sentenceGame");
sentences.forEach((text,i)=>{
  const box=document.createElement("label");
  box.className="sentence-item";
  box.innerHTML=`<span>${text}</span><input type="text" data-sentence="${i}" maxlength="120" placeholder="Write your answer...">`;
  sentenceWrap.appendChild(box);
});

$("#revealLetter").addEventListener("click",()=>{
  const answers=[...document.querySelectorAll("#sentenceGame input")].map(x=>x.value.trim());
  const answered=answers.filter(Boolean).length;
  const result=$("#sentenceResult");
  if(!answered){
    result.textContent="Write at least one answer first. ♡";
    result.classList.add("show");
    return;
  }
  const lines=sentences.map((s,i)=>{
    const clean=s.replace("______","_____");
    return `<p><strong>${clean}</strong><br>${answers[i] || "—"}</p>`;
  }).join("");
  result.innerHTML=`
    <div class="love-letter-result">
      <div class="script result-title">Your little love letter</div>
      ${lines}
      <div class="script sign">— ♡</div>
    </div>`;
  result.classList.add("show");
  result.scrollIntoView({behavior:"smooth",block:"center"});
});

// ---------------- One More Surprise ----------------
const surpriseModal = $("#surpriseModal");
const closeSurprise = $("#closeSurprise");

function openSurprise(){
  surpriseModal.classList.add("show");
  surpriseModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  for(let i=0;i<45;i++) setTimeout(createHeart, i*18);
}

function closeSurpriseModal(){
  surpriseModal.classList.remove("show");
  surpriseModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

$("#celebrateBtn").addEventListener("click", openSurprise);
closeSurprise.addEventListener("click", closeSurpriseModal);
surpriseModal.querySelector(".surprise-backdrop").addEventListener("click", closeSurpriseModal);
document.addEventListener("keydown", e => { if(e.key === "Escape") closeSurpriseModal(); });
$("#surpriseMusic").addEventListener("click", async () => {
  await startMusic();
  closeSurpriseModal();
});

function createHeart(){
  const h=document.createElement("div");
  h.textContent = Math.random()>.25 ? "♥" : "✦";
  h.style.position="fixed";
  h.style.left=(Math.random()*100)+"vw";
  h.style.bottom="-20px";
  h.style.zIndex=60;
  h.style.pointerEvents="none";
  h.style.color=["#d7ad5a","#9e1735","#a86bd1","#f5d78a"][Math.floor(Math.random()*4)];
  h.style.fontSize=(12+Math.random()*22)+"px";
  h.style.transition="transform 2.5s linear, opacity 2.5s";
  document.body.appendChild(h);
  requestAnimationFrame(()=>{
    h.style.transform=`translateY(-${window.innerHeight+80}px) rotate(${Math.random()*360}deg)`;
    h.style.opacity="0";
  });
  setTimeout(()=>h.remove(),2600);
}


/* MINA FIXED SURPRISE JS START */
(function () {
  function initMinaSurprise() {
    var modal = document.getElementById('surpriseModal');
    if (!modal) return;

    var audio = document.querySelector('audio');
    var openButton = null;

    // Find the actual "ONE MORE SURPRISE" button/link without depending on
    // its original class or id.
    var candidates = document.querySelectorAll('button, a, [role="button"]');
    candidates.forEach(function (el) {
      var text = (el.textContent || '').trim().replace(/\s+/g, ' ').toUpperCase();
      if (text.indexOf('ONE MORE SURPRISE') !== -1) openButton = el;
    });

    function openSurprise(e) {
      if (e) e.preventDefault();
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('surprise-open');
      document.body.style.overflow = 'hidden';
    }

    function closeSurprise(e) {
      if (e) e.preventDefault();
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('surprise-open');
      document.body.style.overflow = '';
    }

    if (openButton) {
      openButton.addEventListener('click', openSurprise);
    }

    modal.querySelectorAll('[data-close-surprise]').forEach(function (el) {
      el.addEventListener('click', closeSurprise);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeSurprise(e);
    });

    var songButton = document.getElementById('playOurSong');
    if (songButton) {
      songButton.addEventListener('click', function () {
        if (!audio) {
          audio = document.createElement('audio');
          audio.src = 'die-with-a-smile.mp3';
          audio.preload = 'auto';
          document.body.appendChild(audio);
        }
        audio.play().catch(function () {
          // Browser autoplay/user-gesture restrictions are handled silently.
        });
        songButton.textContent = '♫ PLAYING OUR SONG';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMinaSurprise);
  } else {
    initMinaSurprise();
  }
})();
 /* MINA FIXED SURPRISE JS END */
