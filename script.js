let calendarDownloaded = false;

/* ---------------- Firebase Auth ---------------- */
if (!window._firebaseReady) {
  window._firebaseReady = true;
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("Firebase anonymous auth success");
  })
  .catch((error) => {
    console.error("Firebase auth error:", error);
  });
    window.db = firebase.firestore();
  window.plansRef = window.db.collection("datePlans");
}

// Floating hearts
document.addEventListener("DOMContentLoaded", () => {
  const heartsWrap = document.getElementById("hearts");
  if (!heartsWrap) return;

  function spawnHeart(){
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = ["💗","🩵","✨","💫","💞","❤️","❣️"][Math.floor(Math.random() * 7)];
    heart.style.left = Math.random() * 100 + "%";

    const duration = 15 + Math.random() * 10;
    heart.style.animationDuration = duration + "s";

    heartsWrap.appendChild(heart);

    // cleanup after animation
    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  // initial soft burst
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnHeart, i * 600);
  }

  // continuous loop
  setInterval(spawnHeart, 900);
});


// Date logic
document.addEventListener("DOMContentLoaded", () => {
  const dateType = document.getElementById("dateType");
  const details = document.getElementById("dateDetails");

  if (!dateType || !details) return;

  const title = document.getElementById("dateTitle");
  const desc = document.getElementById("dateDesc");
  const her = document.getElementById("herLine");
  const me = document.getElementById("myLine");
  const note = document.getElementById("noteFromMe");

const content = {
  drinks:{
    title:"Drinks & Us Time 🍸",
    desc:"Just us, Bacardi Limon in hand, talking the way we always do when it’s just us.",
    her:["Bacardi Limon","Your glass","That laugh I love"],
    me:["BuzzBalls","My glass","No distractions"],
    note:"I don’t want much, but I need you."
  },

  dinner:{
    title:"Dinner Together 🍽️",
    desc:"Different food, same time, same call — pretending we’re at the same table.",
    her:["Your mom’s rajma","A comfy spot to sit"],
    me:["Chick-fil-A","The call ready"],
    note:"No matter what we’re eating, sharing it with you always feels like home."
  },

  movie:{
    title:"Movie Night 🎬",
    desc:"A movie playing in the background… but you know that’s not the main focus.",
    her:["Snacks","Something comfy i.e sexy too ;)"],
    me:["Movie queued","Lights low"],
    note:"Some things never change — even from miles away."
  },

  music:{
    title:"High Together 🌙",
    desc:"I just miss smoking with you, my favourite thing to do.",
    her:["Your joint","A comfy space"],
    me:["My bong","Water ready"],
    note:"Please laught at everything, I miss your laugh."
  },

  games:{
    title:"Dhinchak Dhinchak 🍻",
    desc:"I want to dannce with you forever",
    her:["No papparazzi","Your dance moves"],
    me:["My drink","Moves ready"],
    note:"If I can't take you to chandini bar, I will make you a chandini bar."
  }
};


  dateType.addEventListener("change", () => {
    const v = dateType.value;
    if (!content[v]) return (details.hidden = true);

    title.textContent = content[v].title;
    desc.textContent = content[v].desc;
    her.textContent = content[v].her.join(" · ");
    me.textContent = content[v].me.join(" · ");
    note.textContent = content[v].note;

    details.hidden = false;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const noBtn = document.getElementById("noBtn");
  const card = document.querySelector(".card");

  if (!noBtn || !card) return;

  // lock size once
  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  noBtn.style.width = w + "px";
  noBtn.style.height = h + "px";

  function dodge(){
    const cardRect = card.getBoundingClientRect();

    const maxX = cardRect.width - w - 20;
    const maxY = cardRect.height - h - 20;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    noBtn.style.transition = "left 0.25s ease-out, top 0.25s ease-out";
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";

    noBtn.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(8deg)" },
        { transform: "rotate(-8deg)" },
        { transform: "rotate(0deg)" }
      ],
      { duration: 250 }
    );
  }

  // Desktop hover
  noBtn.addEventListener("mouseenter", dodge);

  // Mobile tap attempt
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();   // stop the tap
    dodge();
  });
});


/* ---------------- Persistent Background Music ---------------- */

const MUSIC_KEY = "bg_music_state";
const MUSIC_SRC = "assets/YUKON.mp3";

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  if (!audio || !toggle) return;

  audio.src = MUSIC_SRC;
  audio.volume = 0.1;
  audio.loop = true;

  let unlocked = true;

  // Restore state
  const saved = localStorage.getItem(MUSIC_KEY);
  if (saved){
    try{
      const state = JSON.parse(saved);
      audio.currentTime = state.time || 0;
      unlocked = state.unlocked || false;

      if (!state.playing){
        toggle.classList.add("paused");
      } else if (unlocked){
        audio.play().catch(()=>{});
      }
    }catch{}
  }

  // First interaction unlock
  const unlockAudio = () => {
    unlocked = true;
    audio.play().catch(()=>{});
    toggle.classList.remove("paused");

    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("touchstart", unlockAudio);
  };

  if (!unlocked){
    document.addEventListener("click", unlockAudio, { once:true });
    document.addEventListener("touchstart", unlockAudio, { once:true });
  }

  // Toggle play / pause
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();

    if (audio.paused){
      audio.play().catch(()=>{});
      toggle.classList.remove("paused");
    } else {
      audio.pause();
      toggle.classList.add("paused");
    }
  });

  // Persist state
  setInterval(() => {
    localStorage.setItem(MUSIC_KEY, JSON.stringify({
      time: audio.currentTime,
      playing: !audio.paused,
      unlocked
    }));
  }, 1000);
});
function showHeartConfirm(){
  const heart = document.getElementById("heartConfirm");
  if (!heart) return;

  heart.classList.add("show");

  setTimeout(() => {
    heart.classList.remove("show");
  }, 1800);
}

const DATE_VIBE_CONTENT = {
  "drinks": {
    whatSheNeeds: ["Bacardi Limon"],
    whatIGot: ["Buzzballs"],
    food: {
      hers: "McDonald’s",
      mine: "Chick-fil-A"
    }
  },

  "smoke": {
    whatSheNeeds: ["joints"],
    whatIGot: ["bong"],
    food: {
      hers: "Ice-Cream Pistachio and Silk",
      mine: "Pizza Hut"
    }
  },

  "games": {
    whatSheNeeds: ["Bacardi Limon"],
    whatIGot: ["Buzzballs"],
    food: {
      hers: "Munchies",
      mine: "Hello Fresh"
    }
  },

  "movie": {
    whatSheNeeds: ["Bacardi Limon", "joints"],
    whatIGot: ["Beers", "bong"],
    food: {
      hers: "Snacks",
      mine: "Snacks"
    }
  },
  "dinner": {
    whatSheNeeds: ["Diet Coke"],
    whatIGot: ["Coca Cola"],
    food: {
      hers: "Your mom’s cooking",
      mine: "DoorDash"
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form || !window.plansRef) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const plan = {
  dateVibe: document.getElementById("dateType")?.value || "",
  day: document.getElementById("daySelect")?.value || "",
  timeVibe: document.getElementById("timeVibe")?.value || "",
  
  startTimeIST:
    document.getElementById("timeVibe")?.value === "Your morning"
      ? "11:00"
      : "21:00",
  endTimeIST:
    document.getElementById("timeVibe")?.value === "Your morning"
      ? "13:00"
      : "23:00",

  noteFromMe: document.getElementById("noteFromMe")?.value || "",

  timezone: "Asia/Kolkata",
  source: "planner-web-v1",
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
};

const vibeContent = DATE_VIBE_CONTENT[plan.dateVibe] || {
  whatSheNeeds: [],
  whatIGot: [],
  food: { hers: "", mine: "" }
};

plan.whatSheNeeds = vibeContent.whatSheNeeds;
plan.whatIGot = vibeContent.whatIGot;
plan.food = vibeContent.food;

    try {
      console.log("Saving plan", plan);
      const icsContent = generateICS(plan);
      await window.plansRef.add(plan);
      if (!calendarDownloaded) {
  downloadICS(icsContent);
  calendarDownloaded = true;
}
      showHeartConfirm(); // ❤️ THIS IS THE MOMENT
    } 
    catch (err) {
      console.error("Save failed", err);
      alert("Something went wrong saving this 💔");
    }

function downloadICS(icsContent) {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "our-date-night.ics";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
    const calendarUID = `date-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    plan.calendarUID = calendarUID;


emailjs.send("service_2lfp7w5", "template_jca1wi3", {
  name: "Asher ❤️",
  vibe: plan.dateVibe,
  day: plan.day,
  time: plan.timeVibe === "Your morning" ? "11:00 AM IST" : "9:00 PM IST",
  food_her: plan.food?.hers || "",
  food_me: plan.food?.mine || "",
  her_drinks: (plan.whatSheNeeds || []).join(", "),
  my_drinks: (plan.whatIGot || []).join(", "),
  note: plan.noteFromMe || "Just us 💕",
})
.then(() => {
  console.log("✅ Email sent successfully");
})
.catch(err => {
  console.error("❌ Email send failed", err);
});


  });
});

function generateICS(plan) {
  // --- resolve date (next selected day) ---
  if (!plan.day || !["Friday","Saturday","Sunday"].includes(plan.day)) {
  console.error("Invalid day for ICS generation", plan.day);
  return null;
}
  const dayMap = {
    Friday: 5,
    Saturday: 6,
    Sunday: 0
  };

  const now = new Date();
  const targetDay = dayMap[plan.day];
  const eventDate = new Date(now);

  while (eventDate.getDay() !== targetDay) {
    eventDate.setDate(eventDate.getDate() + 1);
  }

  const yyyy = eventDate.getFullYear();
  const mm = String(eventDate.getMonth() + 1).padStart(2, "0");
  const dd = String(eventDate.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}${mm}${dd}`;

  // --- time logic (IST) ---
  const startTime =
    plan.timeVibe === "Your morning" ? "110000" : "210000";
  const endTime =
    plan.timeVibe === "Your morning" ? "130000" : "230000";

  // --- description (escaped for ICS) ---
  const description = [
    `Vibe: ${plan.dateVibe}`,
    `Day: ${plan.day}`,
    `Her drinks: ${(plan.whatSheNeeds || []).join(", ")}`,
    `My drinks: ${(plan.whatIGot || []).join(", ")}`,
    `Food (hers): ${plan.food?.hers || ""}`,
    `Food (mine): ${plan.food?.mine || ""}`,
    plan.noteFromMe ? `Note: ${plan.noteFromMe}` : ""
  ]
    .filter(Boolean)
    .join("\\n");

  const ics = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART;TZID=Asia/Kolkata:${dateStr}T${startTime}
DTEND;TZID=Asia/Kolkata:${dateStr}T${endTime}
SUMMARY:💖 Our Date Night
DESCRIPTION:${description}

BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Date night reminder 💖
END:VALARM

END:VEVENT
END:VCALENDAR
`.trim();

return ics;
}

