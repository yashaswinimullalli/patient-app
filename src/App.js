import React , { useState, useEffect, useRef } from "react";

// ─── Injected Google Font ───────────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Sora:wght@300;400;500;600&display=swap');

    :root {
      --bg:        #030d1a;
      --surface:   #071628;
      --card:      #0c2040;
      --border:    #0e3d6a;
      --cyan:      #00d4ff;
      --green:     #00ff9d;
      --amber:     #ffb800;
      --red:       #ff2d55;
      --text:      #c8e8f8;
      --muted:     #3a6a9a;
      --glow-c:    rgba(0,212,255,0.18);
      --glow-g:    rgba(0,255,157,0.15);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; background: var(--bg); }
    body { font-family: 'Sora', sans-serif; color: var(--text); overflow-x: hidden; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--surface); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

    /* Scanline bg effect */
    .scanlines::before {
      content: ''; pointer-events: none;
      position: fixed; inset: 0; z-index: 999;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0px, transparent 3px,
        rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px
      );
    }

    /* Grid bg */
    .grid-bg {
      background-image:
        linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* Pulse animation */
    @keyframes pulse-ring {
      0%   { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes float-up {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    @keyframes slide-in-right {
      from { transform: translateX(40px); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes slide-in-up {
      from { transform: translateY(30px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes progress-fill {
      from { width: 0%; }
    }

    .float-up   { animation: float-up 0.5s ease forwards; }
    .slide-right{ animation: slide-in-right 0.4s ease forwards; }
    .slide-up   { animation: slide-in-up 0.4s ease forwards; }

    /* Buttons */
    .btn-primary {
      background: linear-gradient(135deg, var(--cyan), #007acc);
      border: none; border-radius: 8px;
      color: #fff; cursor: pointer;
      font-family: 'Sora', sans-serif;
      font-weight: 600; letter-spacing: 0.03em;
      padding: 12px 28px; font-size: 0.95rem;
      transition: all 0.2s;
      box-shadow: 0 0 16px rgba(0,212,255,0.3);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 28px rgba(0,212,255,0.5); }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .btn-secondary {
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 8px; color: var(--text);
      cursor: pointer; font-family: 'Sora', sans-serif;
      font-size: 0.9rem; padding: 10px 22px;
      transition: all 0.2s;
    }
    .btn-secondary:hover { border-color: var(--cyan); color: var(--cyan); }

    /* Card */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      position: relative; overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    }

    /* Input */
    .input-field {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; color: var(--text);
      font-family: 'Sora', sans-serif; font-size: 0.95rem;
      padding: 12px 16px; width: 100%;
      transition: border-color 0.2s;
      outline: none;
    }
    .input-field:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(0,212,255,0.1); }
    .input-field::placeholder { color: var(--muted); }

    /* Risk badges */
    .badge-critical { background: rgba(255,45,85,0.15); color: var(--red);   border: 1px solid rgba(255,45,85,0.4); }
    .badge-high     { background: rgba(255,184,0,0.15);  color: var(--amber); border: 1px solid rgba(255,184,0,0.4); }
    .badge-medium   { background: rgba(0,212,255,0.12);  color: var(--cyan);  border: 1px solid rgba(0,212,255,0.4); }
    .badge-low      { background: rgba(0,255,157,0.12);  color: var(--green); border: 1px solid rgba(0,255,157,0.4); }

    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      border-radius: 20px; font-size: 0.75rem;
      font-weight: 600; padding: 3px 10px; letter-spacing: 0.05em;
    }

    /* Progress bar */
    .progress-bar {
      background: var(--border); border-radius: 4px;
      height: 6px; overflow: hidden;
    }
    .progress-fill {
      height: 100%; border-radius: 4px;
      animation: progress-fill 1s ease;
    }

    /* Hospital card hover */
    .hospital-card { cursor: pointer; transition: all 0.2s; }
    .hospital-card:hover { border-color: var(--cyan); transform: translateY(-2px); }
    .hospital-card.selected { border-color: var(--cyan); background: rgba(0,212,255,0.07); }

    /* Token display */
    .token-number {
      font-family: 'Orbitron', sans-serif;
      font-size: 5rem; font-weight: 900;
      background: linear-gradient(135deg, var(--cyan), var(--green));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      line-height: 1;
      filter: drop-shadow(0 0 20px rgba(0,212,255,0.5));
    }

    /* Live indicator */
    .live-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--green);
      animation: blink 1.5s infinite;
      box-shadow: 0 0 8px var(--green);
      display: inline-block;
    }

    /* Step indicator */
    .step-dot {
      width: 10px; height: 10px; border-radius: 50%;
      border: 2px solid var(--border);
      transition: all 0.3s;
    }
    .step-dot.active { background: var(--cyan); border-color: var(--cyan); box-shadow: 0 0 8px var(--cyan); }
    .step-dot.done { background: var(--green); border-color: var(--green); }

    /* Map simulation */
    .map-container {
      background: radial-gradient(ellipse at center, #071e38 0%, var(--bg) 70%);
      border: 1px solid var(--border);
      border-radius: 12px; position: relative;
      overflow: hidden;
    }
    .map-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(0,212,255,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.06) 1px, transparent 1px);
      background-size: 32px 32px;
    }
    .map-pin {
      position: absolute;
      transform: translate(-50%, -50%);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .map-pin:hover { transform: translate(-50%, -55%) scale(1.2); }

    /* Spinner */
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--cyan);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    /* Queue row */
    .queue-row { transition: all 0.3s; }
    .queue-row:hover { background: rgba(0,212,255,0.04); }

    /* Textarea */
    textarea.input-field { resize: vertical; min-height: 100px; }

    /* Nav */
    .nav-tab {
      background: transparent; border: none;
      color: var(--muted); cursor: pointer;
      font-family: 'Sora', sans-serif; font-size: 0.85rem;
      padding: 8px 16px; border-radius: 6px;
      transition: all 0.2s;
    }
    .nav-tab.active { color: var(--cyan); background: rgba(0,212,255,0.08); }

    /* Score bar */
    .score-bar { height: 4px; background: var(--border); border-radius: 2px; }
    .score-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--cyan), var(--green)); }

    /* Glow divider */
    .glow-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
      margin: 16px 0;
    }
  `}</style>
);

// ─── Family Members Storage (localStorage) ───────────────────────────────────
const FAMILY_STORAGE_KEY = "authenx_family_members";

function getFamilyMembers() {
  try {
    const stored = localStorage.getItem(FAMILY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFamilyMember(member) {
  try {
    const members = getFamilyMembers();
    const newMember = {
      id: Date.now().toString(),
      ...member,
      createdAt: new Date().toISOString()
    };
    members.push(newMember);
    localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(members));
    return newMember;
  } catch (error) {
    console.error("Failed to save family member:", error);
    return null;
  }
}

function updateFamilyMember(id, updates) {
  try {
    const members = getFamilyMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...updates };
      localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(members));
      return members[index];
    }
    return null;
  } catch (error) {
    console.error("Failed to update family member:", error);
    return null;
  }
}

function deleteFamilyMember(id) {
  try {
    const members = getFamilyMembers();
    const filtered = members.filter(m => m.id !== id);
    localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Failed to delete family member:", error);
    return false;
  }
}

// ─── Haversine Distance (km) ─────────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 10) / 10;
}

// ─── Fetch Real Hospitals via Anthropic AI Web Search ────────────────────────
const SPEC_POOL = [
  ["General Medicine","Surgery","ENT","Ophthalmology"],
  ["Cardiology","Neurology","Orthopedics","ICU"],
  ["Dermatology","Pediatrics","Gynecology","Oncology"],
  ["Gastroenterology","Urology","Nephrology","Psychiatry"],
  ["Orthopedics","Spine Surgery","Rheumatology","Physiotherapy"],
  ["Obstetrics","Gynecology","Neonatology","Pediatrics"],
];

// ─── Fetch Real Hospitals via Anthropic API + Web Search ─────────────────────
async function fetchHospitalsFromOverpass(lat, lng, onStatus) {
  onStatus && onStatus("Searching for nearby hospitals...\nPlease wait a moment.");

  const radius = 15000; // 15km radius

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="clinic"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="clinic"](around:${radius},${lat},${lng});
    );
    out center tags;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain"
    },
    body: query
  });

  if (!response.ok) {
    throw new Error("Overpass API error: " + response.status);
  }

  const data = await response.json();

  if (!data.elements || data.elements.length === 0) {
    return [];
  }

  onStatus && onStatus(`✓ Found ${data.elements.length} hospitals`);

  const hospitals = data.elements
    .filter(el => el.tags && el.tags.name)
    .map((el, idx) => {
      const hLat = el.lat || el.center?.lat;
      const hLng = el.lon || el.center?.lon;

      if (!hLat || !hLng) return null;

      return {
        id: "h_" + idx,
        name: el.tags.name,
        address:
          el.tags["addr:full"] ||
          `${el.tags["addr:street"] || ""} ${el.tags["addr:housenumber"] || ""}`.trim() ||
          "",
        lat: hLat,
        lng: hLng,
        distance: haversine(lat, lng, hLat, hLng),
        rating: 4.0,
        reviews: 100,
        type: el.tags.amenity === "clinic" ? "Clinic" : "Hospital",
        specializations: SPEC_POOL[idx % SPEC_POOL.length],
        openTime: "00:01",
        closeTime: "23:59",
        lunchBreak: null,
        teaBreak: null,
        phone: el.tags.phone || "N/A",
        emergency: el.tags.emergency === "yes",
        beds: 100,
        source: "OpenStreetMap"
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 15);

  return hospitals;
}

// ─── Utilities ───────────────────────────────────────────────────────────────
function getTimeMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function nowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function checkHospitalAvailability(hospital) {
  const now = nowMinutes();
  const open  = getTimeMinutes(hospital.openTime);
  const close = getTimeMinutes(hospital.closeTime);

  if (now < open || now > close) {
    return { available: false, reason: "Closed", next: hospital.openTime };
  }
  if (hospital.lunchBreak) {
    const ls = getTimeMinutes(hospital.lunchBreak.start);
    const le = getTimeMinutes(hospital.lunchBreak.end);
    if (now >= ls && now <= le) {
      return { available: false, reason: "Lunch Break", next: hospital.lunchBreak.end };
    }
  }
  if (hospital.teaBreak) {
    const ts = getTimeMinutes(hospital.teaBreak.start);
    const te = getTimeMinutes(hospital.teaBreak.end);
    if (now >= ts && now <= te) {
      return { available: false, reason: "Tea Break", next: hospital.teaBreak.end };
    }
  }
  return { available: true };
}

function getRiskColor(risk) {
  const map = { critical: "var(--red)", high: "var(--amber)", medium: "var(--cyan)", low: "var(--green)" };
  return map[risk?.toLowerCase()] || "var(--muted)";
}

function getRiskBadgeClass(risk) {
  const map = { critical: "badge-critical", high: "badge-high", medium: "badge-medium", low: "badge-low" };
  return map[risk?.toLowerCase()] || "badge-medium";
}

function getRiskPriority(risk) {
  const map = { critical: 4, high: 3, medium: 2, low: 1 };
  return map[risk?.toLowerCase()] || 1;
}

function scoreHospital(hospital, specialization, riskLevel) {
  const riskP = getRiskPriority(riskLevel);
  const distScore = Math.max(0, 10 - hospital.distance);
  const ratingScore = hospital.rating * 2;
  const reviewScore = Math.min(hospital.reviews / 1000, 3);
  const specMatch = hospital.specializations.some(s =>
    s.toLowerCase().includes(specialization?.toLowerCase() || "")
  ) ? 5 : 0;
  const total = (riskP * 3) + distScore + ratingScore + reviewScore + specMatch;
  return Math.round(total * 10) / 10;
}

// ─── Token Store ─────────────────────────────────────────────────────────────
const tokenDB = {};
function generateTokenForHospital(hospitalId, riskLevel) {
  if (!tokenDB[hospitalId]) {
    tokenDB[hospitalId] = {
      queue: [], currentToken: 0, nextToken: 1
    };
  }
  const db = tokenDB[hospitalId];
  const token = {
    id: db.nextToken++,
    risk: riskLevel,
    priority: getRiskPriority(riskLevel),
    time: new Date(),
    waitMins: 0
  };
  db.queue.push(token);
  db.queue.sort((a, b) => b.priority - a.priority || a.time - b.time);
  const pos = db.queue.findIndex(t => t.id === token.id);
  token.waitMins = pos * 12;
  return { token, position: pos + 1, total: db.queue.length, queue: [...db.queue] };
}

// ─── AI Symptom Analysis ─────────────────────────────────────────────────────
async function analyzeSymptoms(symptoms) {
  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are a medical triage AI. Analyze the following symptoms and return a JSON object only (no markdown, no explanation):
Symptoms: "${symptoms}"

Return exactly this JSON structure:
{
  "specialization": "the medical specialty needed (e.g. Cardiology, General Medicine, Dermatology, Orthopedics, Neurology, Pediatrics, Gynecology, Gastroenterology, ENT, Ophthalmology, Psychiatry)",
  "riskLevel": "Critical|High|Medium|Low",
  "conditions": ["possible condition 1", "possible condition 2"],
  "reasoning": "one sentence explanation",
  "urgency": "immediate|urgent|semi-urgent|non-urgent",
  "recommendation": "brief triage recommendation"
}`
        }]
      })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback local logic
    const s = symptoms.toLowerCase();
    if (s.includes("chest") || s.includes("heart") || s.includes("breath"))
      return { specialization: "Cardiology", riskLevel: "Critical", conditions: ["Possible cardiac event"], reasoning: "Chest/breathing symptoms require immediate attention.", urgency: "immediate", recommendation: "Go to emergency immediately." };
    if (s.includes("fever") || s.includes("cold") || s.includes("cough"))
      return { specialization: "General Medicine", riskLevel: "Medium", conditions: ["Viral infection","Flu"], reasoning: "Fever symptoms suggest viral or bacterial infection.", urgency: "urgent", recommendation: "See a general physician soon." };
    if (s.includes("skin") || s.includes("rash") || s.includes("itch"))
      return { specialization: "Dermatology", riskLevel: "Low", conditions: ["Dermatitis","Allergic reaction"], reasoning: "Skin symptoms are generally non-urgent.", urgency: "non-urgent", recommendation: "Schedule a dermatology appointment." };
    if (s.includes("bone") || s.includes("joint") || s.includes("fracture"))
      return { specialization: "Orthopedics", riskLevel: "High", conditions: ["Fracture","Joint disorder"], reasoning: "Bone/joint pain needs prompt evaluation.", urgency: "urgent", recommendation: "Get an X-ray and orthopedic consultation." };
    if (s.includes("head") || s.includes("dizz") || s.includes("neuro"))
      return { specialization: "Neurology", riskLevel: "High", conditions: ["Migraine","Neurological disorder"], reasoning: "Neurological symptoms require evaluation.", urgency: "urgent", recommendation: "See a neurologist." };
    return { specialization: "General Medicine", riskLevel: "Medium", conditions: ["Unspecified condition"], reasoning: "General symptoms assessed.", urgency: "semi-urgent", recommendation: "Consult a general physician." };
  }
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function HexIcon({ icon, color = "var(--cyan)", size = 40 }) {
  return (
    <div style={{
      width: size, height: size,
      background: `rgba(0,0,0,0.3)`,
      border: `1px solid ${color}`,
      borderRadius: 10, display: "flex",
      alignItems: "center", justifyContent: "center",
      boxShadow: `0 0 12px ${color}33`,
      fontSize: size * 0.45, flexShrink: 0
    }}>{icon}</div>
  );
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  return (
    <span style={{ fontSize: "0.8rem", color: "var(--amber)" }}>
      {"★".repeat(full)}{"☆".repeat(5 - full)}
      <span style={{ color: "var(--amber)", marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

// ─── Reverse Geocoding to get area name ──────────────────────────────────────
async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { 'User-Agent': 'AuthenX-Hospital-App' } }
    );
    const data = await response.json();
    
    if (data.address) {
      const parts = [];
      if (data.address.suburb || data.address.neighbourhood) parts.push(data.address.suburb || data.address.neighbourhood);
      if (data.address.city || data.address.town || data.address.village) parts.push(data.address.city || data.address.town || data.address.village);
      if (data.address.state) parts.push(data.address.state);
      return parts.join(", ") || data.display_name;
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

// ─── Search addresses via multiple sources ───────────────────────────────────
async function searchAddresses(query) {
  if (!query || query.length < 3) return [];
  
  const results = [];
  
  try {
    // Try Nominatim first (best for specific places like colleges, hospitals)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`;
    console.log("Searching Nominatim:", nominatimUrl);
    
    const nominatimResponse = await fetch(nominatimUrl, { 
      headers: { 
        'User-Agent': 'AuthenX-Hospital-App',
        'Accept': 'application/json'
      } 
    });
    
    if (nominatimResponse.ok) {
      const nominatimData = await nominatimResponse.json();
      console.log("Nominatim results:", nominatimData);
      
      nominatimData.forEach(item => {
        // Build a better display name
        let cityName = "";
        if (item.address) {
          const parts = [];
          
          // For specific places (colleges, hospitals, etc.)
          if (item.name && item.type !== 'administrative') {
            parts.push(item.name);
          }
          
          // Add area/suburb
          if (item.address.suburb || item.address.neighbourhood) {
            parts.push(item.address.suburb || item.address.neighbourhood);
          }
          
          // Add city
          if (item.address.city || item.address.town || item.address.village) {
            parts.push(item.address.city || item.address.town || item.address.village);
          }
          
          // Add state
          if (item.address.state) {
            parts.push(item.address.state);
          }
          
          cityName = parts.filter(Boolean).join(", ");
        }
        
        if (!cityName) {
          cityName = item.display_name;
        }
        
        results.push({
          display: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          city: cityName,
          type: item.type || 'location',
          importance: item.importance || 0
        });
      });
    }
  } catch (error) {
    console.error("Nominatim search error:", error);
  }
  
  // Try Photon API as backup (OpenStreetMap-based, no rate limits)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`;
    console.log("Searching Photon:", photonUrl);
    
    const photonResponse = await fetch(photonUrl);
    
    if (photonResponse.ok) {
      const photonData = await photonResponse.json();
      console.log("Photon results:", photonData);
      
      if (photonData.features) {
        photonData.features.forEach(feature => {
          const props = feature.properties;
          const coords = feature.geometry.coordinates;
          
          // Build city name
          const parts = [];
          if (props.name) parts.push(props.name);
          if (props.city || props.town || props.village) parts.push(props.city || props.town || props.village);
          if (props.state) parts.push(props.state);
          if (props.country) parts.push(props.country);
          
          const cityName = parts.filter(Boolean).join(", ");
          
          // Check if this result is already in our list (avoid duplicates)
          const isDuplicate = results.some(r => 
            Math.abs(r.lat - coords[1]) < 0.001 && 
            Math.abs(r.lng - coords[0]) < 0.001
          );
          
          if (!isDuplicate && cityName) {
            results.push({
              display: cityName,
              lat: coords[1],
              lng: coords[0],
              city: cityName,
              type: props.type || 'location',
              importance: 0.5
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Photon search error:", error);
  }
  
  // Sort by importance and remove duplicates
  const uniqueResults = results
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 8);
  
  console.log("Final results:", uniqueResults);
  return uniqueResults;
}

// ─── STEP 1: Location ─────────────────────────────────────────────────────────
function LocationStep({ onNext }) {
  const [mode, setMode]       = useState("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [confirming, setConfirming] = useState(false);
  
  // Manual search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleAuto = async () => {
    setLoading(true); setError(null); setConfirming(false);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        
        // Get area name
        const areaName = await reverseGeocode(lat, lng);
        
        setDetectedLocation({ lat, lng, city: areaName });
        setLoading(false);
        setConfirming(true);
      },
      () => { 
        setLoading(false); 
        setError("GPS access denied. Please enter your location manually."); 
        setMode("manual"); 
      }
    );
  };

  const handleConfirmLocation = () => {
    onNext(detectedLocation);
  };

  const handleRetryDetection = () => {
    setDetectedLocation(null);
    setConfirming(false);
    handleAuto();
  };

  const handleSearchInput = (value) => {
    setSearchQuery(value);
    console.log("Search input:", value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search
    if (value.length >= 3) {
      setSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        console.log("Fetching results for:", value);
        const results = await searchAddresses(value);
        console.log("Got results:", results);
        setSearchResults(results);
        setSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setSearching(false);
    }
  };

  const handleSelectAddress = (result) => {
    onNext({ lat: result.lat, lng: result.lng, city: result.city });
  };

  return (
    <div className="float-up" style={{ maxWidth: 520, margin: "0 auto", padding: "40px 20px" }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 50, height: 50, background: "linear-gradient(135deg,var(--cyan),var(--green))",
            borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, boxShadow: "0 0 24px rgba(0,212,255,0.4)"
          }}>⚕️</div>
          <div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.8rem", fontWeight: 900, color: "var(--cyan)", letterSpacing: "0.1em" }}>
              AUTHEN<span style={{ color: "var(--green)" }}>X</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.2em" }}>AI-POWERED HEALTHCARE TRIAGE</div>
          </div>
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: 360, margin: "0 auto" }}>
          Intelligent hospital recommendation & priority queue system
        </p>
      </div>

      <div className="card" style={{ padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Orbitron", fontSize: "1rem", letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: 6 }}>
            📍 LOCATE YOU
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>We need your location to find nearby hospitals</p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button onClick={() => setMode("auto")}
            style={{
              flex: 1, padding: "10px 0", border: "1px solid",
              borderColor: mode === "auto" ? "var(--cyan)" : "var(--border)",
              borderRadius: 8, background: mode === "auto" ? "rgba(0,212,255,0.1)" : "transparent",
              color: mode === "auto" ? "var(--cyan)" : "var(--muted)",
              cursor: "pointer", fontSize: "0.85rem", fontFamily: "Sora", fontWeight: 600,
              transition: "all 0.2s"
            }}>
            🌐 Auto-Detect
          </button>
          <button onClick={() => setMode("manual")}
            style={{
              flex: 1, padding: "10px 0", border: "1px solid",
              borderColor: mode === "manual" ? "var(--cyan)" : "var(--border)",
              borderRadius: 8, background: mode === "manual" ? "rgba(0,212,255,0.1)" : "transparent",
              color: mode === "manual" ? "var(--cyan)" : "var(--muted)",
              cursor: "pointer", fontSize: "0.85rem", fontFamily: "Sora", fontWeight: 600,
              transition: "all 0.2s"
            }}>
            📌 Search Address
          </button>
        </div>

        {mode === "auto" && !confirming && (
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 20px" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "linear-gradient(135deg,var(--cyan),var(--green))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem", position: "relative", zIndex: 1,
                boxShadow: "0 0 20px rgba(0,212,255,0.4)"
              }}>📍</div>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  border: "2px solid var(--cyan)",
                  animation: `pulse-ring ${1.5 + i * 0.4}s ease-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0
                }} />
              ))}
            </div>
            {error && <p style={{ color: "var(--red)", fontSize: "0.85rem", marginBottom: 16 }}>{error}</p>}
            <button className="btn-primary" onClick={handleAuto} disabled={loading} style={{ width: "100%" }}>
              {loading ? "Detecting Location…" : "Detect My Location"}
            </button>
          </div>
        )}

        {mode === "auto" && confirming && detectedLocation && (
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              background: "rgba(0,212,255,0.08)", 
              border: "1px solid var(--cyan)", 
              borderRadius: 10, 
              padding: "20px", 
              marginBottom: 20 
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📍</div>
              <div style={{ 
                fontFamily: "Orbitron", 
                fontSize: "0.85rem", 
                color: "var(--cyan)", 
                letterSpacing: "0.1em", 
                marginBottom: 8 
              }}>
                DETECTED LOCATION
              </div>
              <div style={{ 
                fontSize: "1.1rem", 
                fontWeight: 600, 
                color: "var(--text)", 
                marginBottom: 6 
              }}>
                {detectedLocation.city}
              </div>
              <div style={{ 
                fontSize: "0.75rem", 
                color: "var(--muted)", 
                fontFamily: "monospace" 
              }}>
                {detectedLocation.lat.toFixed(4)}, {detectedLocation.lng.toFixed(4)}
              </div>
            </div>

            <div style={{ 
              background: "rgba(255,184,0,0.08)", 
              border: "1px solid rgba(255,184,0,0.3)", 
              borderRadius: 8, 
              padding: "12px", 
              marginBottom: 20,
              fontSize: "0.85rem",
              color: "var(--muted)"
            }}>
              ⚠️ Is this your correct location?
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button 
                className="btn-primary" 
                onClick={handleConfirmLocation} 
                style={{ flex: 1 }}
              >
                ✓ Yes, Continue
              </button>
              <button 
                className="btn-secondary" 
                onClick={handleRetryDetection} 
                style={{ flex: 1 }}
              >
                🔄 Re-detect
              </button>
            </div>

            <button 
              onClick={() => { setMode("manual"); setConfirming(false); setDetectedLocation(null); }}
              style={{
                marginTop: 12,
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                fontSize: "0.8rem",
                textDecoration: "underline",
                width: "100%"
              }}
            >
              Enter location manually instead
            </button>
          </div>
        )}

        {mode === "manual" && (
          <div style={{ position: "relative" }}>
            <div style={{ marginBottom: 12 }}>
              <input 
                className="input-field" 
                placeholder="Search: City, College, Hospital, Landmark (e.g., IIT Bombay, Apollo Hospital)"
                value={searchQuery} 
                onChange={e => handleSearchInput(e.target.value)}
                style={{ paddingRight: 40 }}
              />
              {searching && (
                <div style={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  width: 20,
                  height: 20,
                  border: "2px solid var(--border)",
                  borderTopColor: "var(--cyan)",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite"
                }}>
                </div>
              )}
            </div>

            {searchQuery.length > 0 && searchQuery.length < 3 && (
              <div style={{
                fontSize: "0.75rem",
                color: "var(--muted)",
                marginBottom: 12,
                padding: "8px 12px",
                background: "rgba(0,212,255,0.05)",
                borderRadius: 6
              }}>
                💡 Type at least 3 characters to search
              </div>
            )}

            {searchResults.length > 0 && (
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                maxHeight: 320,
                overflowY: "auto",
                marginBottom: 12
              }}>
                {searchResults.map((result, idx) => {
                  // Get icon based on type
                  const getIcon = (type) => {
                    if (type.includes('college') || type.includes('university') || type.includes('school')) return '🎓';
                    if (type.includes('hospital') || type.includes('clinic')) return '🏥';
                    if (type.includes('city') || type.includes('town') || type.includes('village')) return '🏙️';
                    if (type.includes('suburb') || type.includes('neighbourhood')) return '🏘️';
                    if (type.includes('building')) return '🏢';
                    return '📍';
                  };
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectAddress(result)}
                      style={{
                        padding: "12px 16px",
                        borderBottom: idx < searchResults.length - 1 ? "1px solid var(--border)" : "none",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ fontSize: "1.2rem", flexShrink: 0 }}>
                        {getIcon(result.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "var(--text)",
                          marginBottom: 4
                        }}>
                          {result.city}
                        </div>
                        <div style={{
                          fontSize: "0.75rem",
                          color: "var(--muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {result.display}
                        </div>
                      </div>
                      <div style={{
                        fontSize: "0.75rem",
                        color: "var(--cyan)",
                        flexShrink: 0
                      }}>
                        →
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {searchQuery.length >= 3 && !searching && searchResults.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "rgba(255,184,0,0.05)",
                border: "1px solid rgba(255,184,0,0.2)",
                borderRadius: 8,
                marginBottom: 12
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🔍</div>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 8 }}>
                  No locations found for "{searchQuery}"
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  Try: "Bengaluru", "Mumbai", "Delhi", or your city name
                </div>
              </div>
            )}

            {searchQuery.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "rgba(0,212,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: 8
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🗺️</div>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 8 }}>
                  Start typing to search for your location
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", opacity: 0.7, lineHeight: 1.5 }}>
                  Examples:<br/>
                  🎓 "IIT Delhi", "Christ University Bangalore"<br/>
                  🏥 "Apollo Hospital", "AIIMS"<br/>
                  🏙️ "Koramangala", "Andheri Mumbai"
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 20 }}>
        {[["🏥","Real Hospital Data"],["🤖","AI Triage"],["🎫","Smart Queue"]].map(([icon, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 2: Select or Add Family Member ─────────────────────────────────────
function FamilyMemberStep({ onNext, onBack }) {
  const [familyMembers, setFamilyMembers] = useState(getFamilyMembers());
  const [mode, setMode] = useState("select"); // "select" or "add"
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  const [newMember, setNewMember] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    emergencyContact: "",
    emergencyRelation: "",
    existingConditions: [],
    allergies: "",
    medications: "",
    relation: "Self"
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setNewMember(p => ({ ...p, [k]: v }));

  const CONDITIONS = ["Diabetes","Hypertension","Heart Disease","Asthma","Thyroid","Cancer","Kidney Disease","None"];
  const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown"];
  const RELATIONS = ["Self","Spouse","Parent","Child","Sibling","Grandparent","Other"];

  const toggleCondition = (c) => {
    if (c === "None") { set("existingConditions", []); return; }
    const curr = newMember.existingConditions;
    set("existingConditions", curr.includes(c) ? curr.filter(x => x !== c) : [...curr.filter(x => x !== "None"), c]);
  };

  const validateNewMember = () => {
    const e = {};
    if (!newMember.name.trim()) e.name = "Name is required";
    if (!newMember.age || newMember.age < 1 || newMember.age > 120) e.age = "Valid age required";
    if (!newMember.gender) e.gender = "Gender is required";
    if (!newMember.phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveNewMember = () => {
    if (!validateNewMember()) return;
    
    const saved = saveFamilyMember(newMember);
    if (saved) {
      setFamilyMembers(getFamilyMembers());
      setMode("select");
      setNewMember({
        name: "", age: "", gender: "", bloodGroup: "", phone: "",
        emergencyContact: "", emergencyRelation: "",
        existingConditions: [], allergies: "", medications: "", relation: "Self"
      });
      setErrors({});
    }
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
  };

  const handleContinueWithMember = () => {
    if (selectedMember) {
      onNext({
        name: selectedMember.name,
        age: selectedMember.age,
        gender: selectedMember.gender,
        blood: selectedMember.bloodGroup,
        phone: selectedMember.phone,
        emergency_contact: selectedMember.emergencyContact,
        emergency_relation: selectedMember.emergencyRelation,
        existing_conditions: selectedMember.existingConditions || [],
        allergies: selectedMember.allergies || "",
        medications: selectedMember.medications || "",
        symptoms: "",
        duration: "",
        severity: "moderate",
        pain_scale: 5,
        additional: ""
      });
    }
  };

  const handleDeleteMember = (id) => {
    if (deleteFamilyMember(id)) {
      setFamilyMembers(getFamilyMembers());
      setShowDeleteConfirm(null);
      if (selectedMember?.id === id) {
        setSelectedMember(null);
      }
    }
  };

  const Label = ({ text, required }) => (
    <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 5, fontWeight: 600, letterSpacing: "0.05em" }}>
      {text} {required && <span style={{ color: "var(--red)" }}>*</span>}
    </div>
  );
  
  const Err = ({ k }) => errors[k] ? (
    <div style={{ color: "var(--red)", fontSize: "0.72rem", marginTop: 3 }}>⚠ {errors[k]}</div>
  ) : null;

  return (
    <div className="slide-up" style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button className="btn-secondary" onClick={onBack} style={{ padding: "8px 14px" }}>←</button>
        <div>
          <h2 style={{ fontFamily: "Orbitron", fontSize: "1rem", letterSpacing: "0.1em", color: "var(--cyan)" }}>
            FAMILY MEMBERS
          </h2>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            Select a saved member or add a new one
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setMode("select")}
          style={{
            flex: 1, padding: "10px 0", border: "1px solid",
            borderColor: mode === "select" ? "var(--cyan)" : "var(--border)",
            borderRadius: 8, background: mode === "select" ? "rgba(0,212,255,0.1)" : "transparent",
            color: mode === "select" ? "var(--cyan)" : "var(--muted)",
            cursor: "pointer", fontSize: "0.85rem", fontFamily: "Sora", fontWeight: 600,
            transition: "all 0.2s"
          }}>
          👥 Select Member ({familyMembers.length})
        </button>
        <button onClick={() => setMode("add")}
          style={{
            flex: 1, padding: "10px 0", border: "1px solid",
            borderColor: mode === "add" ? "var(--cyan)" : "var(--border)",
            borderRadius: 8, background: mode === "add" ? "rgba(0,212,255,0.1)" : "transparent",
            color: mode === "add" ? "var(--cyan)" : "var(--muted)",
            cursor: "pointer", fontSize: "0.85rem", fontFamily: "Sora", fontWeight: 600,
            transition: "all 0.2s"
          }}>
          ➕ Add New Member
        </button>
      </div>

      {/* SELECT MODE */}
      {mode === "select" && (
        <div>
          {familyMembers.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>👨‍👩‍👧‍👦</div>
              <h3 style={{ fontFamily: "Orbitron", fontSize: "0.95rem", color: "var(--cyan)", marginBottom: 8 }}>
                NO FAMILY MEMBERS SAVED
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 20 }}>
                Add family members to save their details for quick access in future visits
              </p>
              <button className="btn-primary" onClick={() => setMode("add")}>
                ➕ Add First Member
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                {familyMembers.map((member) => (
                  <div key={member.id}
                    className={`card ${selectedMember?.id === member.id ? "selected" : ""}`}
                    onClick={() => handleSelectMember(member)}
                    style={{
                      padding: "16px 18px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      borderColor: selectedMember?.id === member.id ? "var(--cyan)" : "var(--border)"
                    }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: "50%",
                        background: selectedMember?.id === member.id ? "linear-gradient(135deg,var(--cyan),var(--green))" : "rgba(0,212,255,0.1)",
                        border: `2px solid ${selectedMember?.id === member.id ? "var(--cyan)" : "var(--border)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.5rem", flexShrink: 0
                      }}>
                        {member.gender === "Male" ? "👨" : member.gender === "Female" ? "👩" : "👤"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 600, fontSize: "1rem" }}>{member.name}</span>
                          <span className="badge" style={{ background: "rgba(0,212,255,0.1)", color: "var(--cyan)", border: "1px solid rgba(0,212,255,0.3)", fontSize: "0.7rem" }}>
                            {member.relation}
                          </span>
                          {member.bloodGroup && member.bloodGroup !== "Unknown" && (
                            <span className="badge" style={{ background: "rgba(255,45,85,0.1)", color: "var(--red)", border: "1px solid rgba(255,45,85,0.3)", fontSize: "0.7rem" }}>
                              🩸 {member.bloodGroup}
                            </span>
                          )}
                        </div>
                        <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 6 }}>
                          {member.age} years • {member.gender} • 📱 {member.phone}
                        </div>
                        {member.existingConditions && member.existingConditions.length > 0 && (
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                            {member.existingConditions.slice(0, 3).map(c => (
                              <span key={c} style={{
                                background: "rgba(255,184,0,0.08)",
                                border: "1px solid rgba(255,184,0,0.2)",
                                borderRadius: 4, padding: "2px 6px",
                                fontSize: "0.7rem", color: "var(--amber)"
                              }}>{c}</span>
                            ))}
                            {member.existingConditions.length > 3 && (
                              <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                                +{member.existingConditions.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(member.id); }}
                        style={{
                          background: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: 6, color: "var(--red)",
                          cursor: "pointer", padding: "6px 10px",
                          fontSize: "0.75rem", transition: "all 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--red)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedMember && (
                <button className="btn-primary" onClick={handleContinueWithMember} style={{ width: "100%", fontSize: "1rem", padding: "14px" }}>
                  Continue with {selectedMember.name} →
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* ADD MODE */}
      {mode === "add" && (
        <div>
          <div className="card" style={{ padding: 22, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>👤</div>
              <span style={{ fontFamily: "Orbitron", fontSize: "0.78rem", letterSpacing: "0.1em", color: "var(--cyan)" }}>BASIC INFORMATION</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <Label text="Full Name" required />
                <input className="input-field" placeholder="e.g. Rajesh Kumar"
                  value={newMember.name} onChange={e => set("name", e.target.value)}
                  style={{ borderColor: errors.name ? "var(--red)" : "" }} />
                <Err k="name" />
              </div>

              <div>
                <Label text="Relation" required />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {RELATIONS.map(r => (
                    <button key={r} onClick={() => set("relation", r)} style={{
                      padding: "7px 12px", border: "1px solid",
                      borderColor: newMember.relation === r ? "var(--cyan)" : "var(--border)",
                      borderRadius: 6, background: newMember.relation === r ? "rgba(0,212,255,0.12)" : "transparent",
                      color: newMember.relation === r ? "var(--cyan)" : "var(--muted)",
                      cursor: "pointer", fontSize: "0.78rem", fontFamily: "Sora", transition: "all 0.2s"
                    }}>{r}</button>
                  ))}
                </div>
              </div>

              <div>
                <Label text="Age" required />
                <input className="input-field" type="number" placeholder="e.g. 28"
                  value={newMember.age} onChange={e => set("age", e.target.value)}
                  style={{ borderColor: errors.age ? "var(--red)" : "" }} />
                <Err k="age" />
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <Label text="Gender" required />
                <div style={{ display: "flex", gap: 6 }}>
                  {["Male","Female","Other"].map(g => (
                    <button key={g} onClick={() => set("gender", g)} style={{
                      flex: 1, padding: "10px 6px", border: "1px solid",
                      borderColor: newMember.gender === g ? "var(--cyan)" : "var(--border)",
                      borderRadius: 7, background: newMember.gender === g ? "rgba(0,212,255,0.12)" : "transparent",
                      color: newMember.gender === g ? "var(--cyan)" : "var(--muted)",
                      cursor: "pointer", fontSize: "0.8rem", fontFamily: "Sora", transition: "all 0.2s"
                    }}>{g}</button>
                  ))}
                </div>
                <Err k="gender" />
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <Label text="Blood Group" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 5 }}>
                  {BLOOD_GROUPS.map(b => (
                    <button key={b} onClick={() => set("bloodGroup", b)} style={{
                      padding: "7px 4px", border: "1px solid",
                      borderColor: newMember.bloodGroup === b ? "var(--red)" : "var(--border)",
                      borderRadius: 6, background: newMember.bloodGroup === b ? "rgba(255,45,85,0.12)" : "transparent",
                      color: newMember.bloodGroup === b ? "var(--red)" : "var(--muted)",
                      cursor: "pointer", fontSize: "0.72rem", fontFamily: "Sora", transition: "all 0.2s"
                    }}>{b}</button>
                  ))}
                </div>
              </div>

              <div>
                <Label text="Mobile Number" required />
                <input className="input-field" placeholder="+91 98765 43210"
                  value={newMember.phone} onChange={e => set("phone", e.target.value)}
                  style={{ borderColor: errors.phone ? "var(--red)" : "" }} />
                <Err k="phone" />
              </div>

              <div>
                <Label text="Emergency Contact" />
                <input className="input-field" placeholder="Name & Number"
                  value={newMember.emergencyContact} onChange={e => set("emergencyContact", e.target.value)} />
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <Label text="Emergency Contact Relation" />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Spouse","Parent","Child","Sibling","Friend","Other"].map(r => (
                    <button key={r} onClick={() => set("emergencyRelation", r)} style={{
                      padding: "6px 12px", border: "1px solid",
                      borderColor: newMember.emergencyRelation === r ? "var(--amber)" : "var(--border)",
                      borderRadius: 6, background: newMember.emergencyRelation === r ? "rgba(255,184,0,0.1)" : "transparent",
                      color: newMember.emergencyRelation === r ? "var(--amber)" : "var(--muted)",
                      cursor: "pointer", fontSize: "0.78rem", fontFamily: "Sora", transition: "all 0.2s"
                    }}>{r}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 22, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>📋</div>
              <span style={{ fontFamily: "Orbitron", fontSize: "0.78rem", letterSpacing: "0.1em", color: "var(--amber)" }}>MEDICAL HISTORY</span>
            </div>

            <div style={{ marginBottom: 14 }}>
              <Label text="Existing Conditions (select all that apply)" />
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {CONDITIONS.map(c => (
                  <button key={c} onClick={() => toggleCondition(c)} style={{
                    padding: "7px 13px", border: "1px solid",
                    borderColor: newMember.existingConditions.includes(c) ? "var(--amber)" : "var(--border)",
                    borderRadius: 6, background: newMember.existingConditions.includes(c) ? "rgba(255,184,0,0.1)" : "transparent",
                    color: newMember.existingConditions.includes(c) ? "var(--amber)" : "var(--muted)",
                    cursor: "pointer", fontSize: "0.78rem", fontFamily: "Sora", transition: "all 0.2s"
                  }}>{c}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <Label text="Known Allergies" />
                <input className="input-field" placeholder="e.g. Penicillin, Latex"
                  value={newMember.allergies} onChange={e => set("allergies", e.target.value)} />
              </div>
              <div>
                <Label text="Current Medications" />
                <input className="input-field" placeholder="e.g. Metformin 500mg"
                  value={newMember.medications} onChange={e => set("medications", e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-secondary" onClick={() => setMode("select")} style={{ flex: 1 }}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSaveNewMember} style={{ flex: 2 }}>
              💾 Save Member
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }} onClick={() => setShowDeleteConfirm(null)}>
          <div className="card" style={{ padding: 24, maxWidth: 400, width: "100%" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: "2rem", textAlign: "center", marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontFamily: "Orbitron", fontSize: "0.9rem", color: "var(--red)", textAlign: "center", marginBottom: 12 }}>
              DELETE MEMBER?
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", textAlign: "center", marginBottom: 20 }}>
              This will permanently remove this family member's saved information.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMember(showDeleteConfirm)}
                style={{
                  flex: 1, padding: "12px 28px", background: "var(--red)",
                  border: "none", borderRadius: 8, color: "#fff",
                  cursor: "pointer", fontFamily: "Sora", fontWeight: 600,
                  fontSize: "0.9rem", transition: "all 0.2s"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STEP 3: Patient Details (Symptoms Only) ─────────────────────────────────
function PatientDetailsStep({ onNext, onBack, patient }) {
  const [form, setForm] = useState({
    symptoms: "",
    duration: "",
    severity: "moderate",
    pain_scale: 5,
    additional: ""
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.symptoms.trim()) e.symptoms = "Please describe your symptoms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      // Merge symptoms with existing patient data
      onNext({
        ...patient,
        symptoms: form.symptoms,
        duration: form.duration,
        severity: form.severity,
        pain_scale: form.pain_scale,
        additional: form.additional
      });
    }
  };

  const Label = ({ text, required }) => (
    <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 5, fontWeight: 600, letterSpacing: "0.05em" }}>
      {text} {required && <span style={{ color: "var(--red)" }}>*</span>}
    </div>
  );
  
  const Err = ({ k }) => errors[k] ? (
    <div style={{ color: "var(--red)", fontSize: "0.72rem", marginTop: 3 }}>⚠ {errors[k]}</div>
  ) : null;

  const SEVERITY_OPTS = [
    { val: "mild",     label: "Mild",     desc: "Minor discomfort",     color: "var(--green)" },
    { val: "moderate", label: "Moderate", desc: "Affects daily life",   color: "var(--cyan)"  },
    { val: "severe",   label: "Severe",   desc: "Hard to function",     color: "var(--amber)" },
    { val: "critical", label: "Critical", desc: "Emergency / life risk", color: "var(--red)"  },
  ];
  const DURATION_OPTS = ["< 1 hour","1–6 hours","6–24 hours","1–3 days","3–7 days","> 1 week"];

  return (
    <div className="slide-up" style={{ maxWidth: 620, margin: "0 auto", padding: "24px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button className="btn-secondary" onClick={onBack} style={{ padding: "8px 14px" }}>←</button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "Orbitron", fontSize: "1rem", letterSpacing: "0.1em", color: "var(--cyan)" }}>
            CURRENT SYMPTOMS
          </h2>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            Describe what you're experiencing right now
          </div>
        </div>
      </div>

      {/* Patient Info Summary */}
      <div className="card" style={{ padding: 16, marginBottom: 20, background: "rgba(0,212,255,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg,var(--cyan),var(--green))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.4rem"
          }}>
            {patient.gender === "Male" ? "👨" : patient.gender === "Female" ? "👩" : "👤"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 3 }}>
              {patient.name}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              {patient.age} years • {patient.gender} • 📱 {patient.phone}
              {patient.blood && patient.blood !== "Unknown" && (
                <span style={{ marginLeft: 8 }}>• 🩸 {patient.blood}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Symptoms Section ── */}
      <div className="card" style={{ padding: 22, marginBottom: 14, borderColor: "rgba(0,212,255,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,255,157,0.1)", border: "1px solid rgba(0,255,157,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>🩺</div>
          <span style={{ fontFamily: "Orbitron", fontSize: "0.78rem", letterSpacing: "0.1em", color: "var(--green)" }}>DESCRIBE YOUR SYMPTOMS</span>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Label text="What are you experiencing?" required />
          <textarea className="input-field" rows={4}
            placeholder="e.g. Severe chest pain radiating to left arm, shortness of breath, dizziness for past 2 hours…"
            value={form.symptoms} onChange={e => set("symptoms", e.target.value)}
            style={{ borderColor: errors.symptoms ? "var(--red)" : "" }} />
          <Err k="symptoms" />
        </div>

        {/* Quick Symptom Presets */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 8 }}>⚡ Quick select common symptoms:</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              ["💔 Chest / Heart", "chest pain, shortness of breath, palpitations"],
              ["🤒 Fever / Flu",   "high fever, headache, body ache, chills"],
              ["🦷 Stomach Pain",  "severe abdominal pain, nausea, vomiting"],
              ["🦴 Bone / Joint",  "severe joint pain, swelling, difficulty walking"],
              ["🧠 Neuro / Head",  "dizziness, severe headache, vision blur, numbness"],
              ["🩹 Skin / Rash",   "skin rash, severe itching, redness, swelling"],
            ].map(([label, val]) => (
              <button key={label} onClick={() => set("symptoms", val)} style={{
                background: form.symptoms === val ? "rgba(0,212,255,0.1)" : "transparent",
                border: `1px solid ${form.symptoms === val ? "var(--cyan)" : "var(--border)"}`,
                borderRadius: 7, color: form.symptoms === val ? "var(--cyan)" : "var(--muted)",
                cursor: "pointer", fontSize: "0.78rem", fontFamily: "Sora",
                padding: "8px 10px", textAlign: "left", transition: "all 0.2s"
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Label text="How long have you had these symptoms?" />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {DURATION_OPTS.map(d => (
              <button key={d} onClick={() => set("duration", d)} style={{
                padding: "7px 12px", border: "1px solid",
                borderColor: form.duration === d ? "var(--cyan)" : "var(--border)",
                borderRadius: 6, background: form.duration === d ? "rgba(0,212,255,0.1)" : "transparent",
                color: form.duration === d ? "var(--cyan)" : "var(--muted)",
                cursor: "pointer", fontSize: "0.75rem", fontFamily: "Sora", transition: "all 0.2s"
              }}>{d}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Label text="Severity Level" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {SEVERITY_OPTS.map(s => (
              <button key={s.val} onClick={() => set("severity", s.val)} style={{
                padding: "10px 6px", border: "1px solid",
                borderColor: form.severity === s.val ? s.color : "var(--border)",
                borderRadius: 8, background: form.severity === s.val ? `${s.color}18` : "transparent",
                color: form.severity === s.val ? s.color : "var(--muted)",
                cursor: "pointer", fontFamily: "Sora", transition: "all 0.2s", textAlign: "center"
              }}>
                <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.66rem", marginTop: 3, opacity: 0.8 }}>{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label text={`Pain Scale: ${form.pain_scale}/10`} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--green)" }}>No Pain</span>
            <input type="range" min={0} max={10} value={form.pain_scale}
              onChange={e => set("pain_scale", Number(e.target.value))}
              style={{ flex: 1, accentColor: form.pain_scale >= 7 ? "var(--red)" : form.pain_scale >= 4 ? "var(--amber)" : "var(--green)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--red)" }}>Worst</span>
            <div style={{
              minWidth: 36, height: 36, borderRadius: "50%",
              background: form.pain_scale >= 8 ? "var(--red)" : form.pain_scale >= 5 ? "var(--amber)" : "var(--green)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Orbitron", fontWeight: 700, fontSize: "0.85rem", color: "#000",
              boxShadow: `0 0 10px ${form.pain_scale >= 8 ? "var(--red)" : form.pain_scale >= 5 ? "var(--amber)" : "var(--green)"}`
            }}>{form.pain_scale}</div>
          </div>
        </div>
      </div>

      {/* ── Additional Notes ── */}
      <div className="card" style={{ padding: 22, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,212,255,0.08)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>📝</div>
          <span style={{ fontFamily: "Orbitron", fontSize: "0.78rem", letterSpacing: "0.1em", color: "var(--muted)" }}>ADDITIONAL NOTES</span>
        </div>
        <textarea className="input-field" rows={2}
          placeholder="Any other information the doctor should know…"
          value={form.additional} onChange={e => set("additional", e.target.value)} />
      </div>

      <button className="btn-primary" onClick={handleNext} style={{ width: "100%", fontSize: "1rem", padding: "14px" }}>
        Find Hospitals Near Me →
      </button>
    </div>
  );
}

// ─── STEP 4: Hospitals ────────────────────────────────────────────────────────
function HospitalsStep({ location, patient, onNext, onBack }) {
  const [loading, setLoading]     = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [tab, setTab]             = useState("map");
  const [selected, setSelected]   = useState(null);
  const [retryKey, setRetryKey]   = useState(0);

  const [fetchStatus, setFetchStatus] = useState("Initializing…");
  const [fetchError, setFetchError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setFetchError(null);
      try {
        setFetchStatus("Connecting to OpenStreetMap…");
        const results = await fetchHospitalsFromOverpass(
          location.lat, location.lng,
          (msg) => { if (!cancelled) setFetchStatus(msg); }
        );
        if (cancelled) return;
        if (results.length === 0) {
          setFetchError("No hospitals found within 15km. Try a different location.");
          setLoading(false);
          return;
        }
        setHospitals(results);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setFetchError("Failed: " + err.message);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [location.lat, location.lng, retryKey]);

  const renderMapPins = () => {
    if (hospitals.length === 0) return null;
    const lats = hospitals.map(h => h.lat);
    const lngs = hospitals.map(h => h.lng);
    const pad = 0.01;
    const minLat = Math.min(...lats) - pad, maxLat = Math.max(...lats) + pad;
    const minLng = Math.min(...lngs) - pad, maxLng = Math.max(...lngs) + pad;
    const latRange = maxLat - minLat || 0.02;
    const lngRange = maxLng - minLng || 0.02;
    return hospitals.map((h) => {
      const left = ((h.lng - minLng) / lngRange) * 100;
      const top  = (1 - (h.lat - minLat) / latRange) * 100;
      const avail = checkHospitalAvailability(h);
      return (
        <div key={h.id} className="map-pin"
          onClick={() => { setSelected(h.id); setTab("list"); }}
          style={{ left: `${Math.min(90,Math.max(10,left))}%`, top: `${Math.min(90,Math.max(10,top))}%` }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
            background: selected === h.id ? "var(--cyan)" : avail.available ? "var(--green)" : "var(--red)",
            border: "2px solid rgba(255,255,255,0.3)",
            boxShadow: `0 0 12px ${selected === h.id ? "var(--cyan)" : avail.available ? "var(--green)" : "var(--red)"}`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ transform: "rotate(45deg)", fontSize: "0.8rem" }}>🏥</span>
          </div>
          <div style={{
            position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.85)", border: "1px solid var(--border)",
            borderRadius: 4, padding: "2px 8px", fontSize: "0.7rem",
            whiteSpace: "nowrap", color: "var(--text)"
          }}>{h.name}</div>
        </div>
      );
    });
  };

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 20, padding: "0 20px" }}>
      <div className="spinner" />
      <div style={{ fontFamily: "Orbitron", fontSize: "0.85rem", color: "var(--cyan)", letterSpacing: "0.15em" }}>
        FETCHING NEARBY HOSPITALS…
      </div>
      <div style={{ color: "var(--cyan)", fontSize: "0.82rem", textAlign: "center", whiteSpace: "pre-line" }}>
        {fetchStatus}
      </div>
      {patient && (
        <div style={{ background: "rgba(0,212,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", fontSize: "0.78rem", color: "var(--muted)" }}>
          👤 {patient.name}, {patient.age}y • 🩺 {patient.symptoms?.slice(0,40)}…
        </div>
      )}
      <div style={{ fontSize: "0.72rem", color: "var(--muted)", opacity: 0.6 }}>
        📡 AI Web Search • {location.city}
      </div>
    </div>
  );

  if (fetchError) return (
    <div style={{ maxWidth: 500, margin: "60px auto", padding: "0 20px" }}>
      <div className="card" style={{ padding: 28, borderColor: "rgba(255,45,85,0.4)", background: "rgba(255,45,85,0.05)" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12, textAlign: "center" }}>⚠️</div>
        <h3 style={{ fontFamily: "Orbitron", color: "var(--red)", fontSize: "0.9rem", textAlign: "center", marginBottom: 12 }}>
          COULD NOT FETCH HOSPITALS
        </h3>
        <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 6, padding: "10px 14px", fontFamily: "monospace", fontSize: "0.78rem", color: "#ff8888", marginBottom: 20, wordBreak: "break-all" }}>
          {fetchError}
        </div>
        <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 20 }}>
          Something went wrong while searching for hospitals near your location. Check your connection and retry.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" onClick={() => { setLoading(true); setFetchError(null); setRetryKey(k => k + 1); }} style={{ flex: 1 }}>
            🔄 Retry
          </button>
          <button className="btn-secondary" onClick={onBack} style={{ flex: 1 }}>
            ← Change Location
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="slide-up" style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button className="btn-secondary" onClick={onBack} style={{ padding: "8px 14px" }}>←</button>
        <div>
          <h2 style={{ fontFamily: "Orbitron", fontSize: "1rem", letterSpacing: "0.1em", color: "var(--cyan)" }}>
            NEARBY HOSPITALS
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
            📍 {location.city} • {hospitals.length} facilities found
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", opacity: 0.6, marginTop: 2 }}>
            🔍 Real data via AI Web Search • No API key required
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {["list","map"].map(t => (
            <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t === "list" ? "☰ List" : "🗺 Map"}
            </button>
          ))}
        </div>
      </div>

      {tab === "map" && (
        <div className="map-container" style={{ height: 320, marginBottom: 20 }}>
          <div className="map-grid" />
          <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.7)", padding: "6px 12px", borderRadius: 6, fontSize: "0.72rem", color: "var(--muted)" }}>
            <span className="live-dot" style={{ marginRight: 6 }} />LIVE MAP VIEW
          </div>
          {/* User pin */}
          <div className="map-pin" style={{ left: "50%", top: "50%" }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "var(--cyan)", border: "3px solid white",
              boxShadow: "0 0 16px var(--cyan)"
            }} />
          </div>
          {renderMapPins()}
          <div style={{ position: "absolute", bottom: 10, right: 10, fontSize: "0.7rem", color: "var(--muted)", display: "flex", gap: 12 }}>
            <span><span style={{ color: "var(--green)" }}>● </span>Open</span>
            <span><span style={{ color: "var(--red)" }}>● </span>Unavailable</span>
            <span><span style={{ color: "var(--cyan)" }}>● </span>Selected</span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {hospitals.map((h, i) => {
          const avail = checkHospitalAvailability(h);
          const isSelected = selected === h.id;
          return (
            <div key={h.id} className={`card hospital-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelected(isSelected ? null : h.id)}
              style={{ padding: "14px 18px", animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <HexIcon icon="🏥" color={avail.available ? "var(--green)" : "var(--red)"} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{h.name}</span>
                    {!avail.available && (
                      <span className="badge badge-critical" style={{ fontSize: "0.7rem" }}>
                        {avail.reason} • Opens {avail.next}
                      </span>
                    )}
                    {avail.available && <span className="badge badge-low" style={{ fontSize: "0.7rem" }}>● Open</span>}
                    {h.emergency && <span className="badge" style={{ background: "rgba(255,45,85,0.1)", color: "var(--red)", border: "1px solid rgba(255,45,85,0.3)", fontSize: "0.7rem" }}>🚨 Emergency</span>}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: 6 }}>{h.address}</div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ color: "var(--amber)", fontSize: "0.82rem" }}>★ {h.rating}</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>💬 {h.reviews.toLocaleString()} reviews</span>
                    <span style={{ color: "var(--cyan)", fontSize: "0.82rem" }}>📍 {h.distance} km</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>🏢 {h.beds} beds</span>
                    {h.source === "Web Search" && (
                      <span style={{ color: "#7ec8e3", fontSize: "0.72rem", opacity: 0.7 }}>🔍 Web</span>
                    )}
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: 10 }}>
                      <div className="glow-divider" />
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 6 }}>Specializations:</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {h.specializations.map(s => (
                          <span key={s} style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 4, padding: "2px 8px", fontSize: "0.75rem", color: "var(--cyan)" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: "16px 20px", background: "rgba(0,212,255,0.04)" }}>
        <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 10 }}>
          💡 Hospitals loaded for <strong style={{ color: "var(--cyan)" }}>{patient?.name}</strong>. Click below to run AI triage on your symptoms.
        </div>
        <button className="btn-primary" onClick={() => onNext(hospitals)} style={{ width: "100%" }}>
          🤖 Analyze Symptoms & Get AI Recommendation →
        </button>
      </div>
    </div>
  );
}

// ─── STEP 4: AI Analysis + Hospital Recommendation ───────────────────────────
function RecommendationStep({ data, onNext, onBack }) {
  const { patient, hospitals } = data;
  const [analysis, setAnalysis]   = useState(null);
  const [analyzing, setAnalyzing] = useState(true);
  const [selected, setSelected]   = useState(null);
  const [error, setError]         = useState(null);

  useEffect(() => {
    async function run() {
      try {
        // Build rich symptom context from full patient data
        const ctx = `
Patient: ${patient.name}, ${patient.age} years old, ${patient.gender}
Blood Group: ${patient.blood || "Unknown"}
Existing Conditions: ${patient.existing_conditions?.join(", ") || "None"}
Allergies: ${patient.allergies || "None"}
Current Medications: ${patient.medications || "None"}
Symptoms: ${patient.symptoms}
Duration: ${patient.duration || "Not specified"}
Severity: ${patient.severity}
Pain Scale: ${patient.pain_scale}/10
Additional Notes: ${patient.additional || "None"}
        `.trim();
        const result = await analyzeSymptoms(ctx);
        setAnalysis(result);
        setAnalyzing(false);
      } catch(e) {
        setError(e.message);
        setAnalyzing(false);
      }
    }
    run();
  }, []);

  const filtered = analysis ? hospitals
    .map(h => ({ ...h, score: scoreHospital(h, analysis.specialization, analysis.riskLevel) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) : [];

  const maxScore = filtered.length ? Math.max(...filtered.map(h => h.score)) : 1;

  useEffect(() => {
    if (filtered.length) setSelected(filtered[0].id);
  }, [analysis]);

  const urgencyColors = { immediate: "var(--red)", urgent: "var(--amber)", "semi-urgent": "var(--cyan)", "non-urgent": "var(--green)" };

  if (analyzing) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 420, gap: 20 }}>
      <div className="spinner" style={{ borderTopColor: "var(--green)", width: 50, height: 50 }} />
      <div style={{ fontFamily: "Orbitron", fontSize: "0.9rem", color: "var(--green)", letterSpacing: "0.15em", animation: "blink 1.2s infinite" }}>
        AI ANALYZING PATIENT DATA…
      </div>
      <div style={{ color: "var(--muted)", fontSize: "0.82rem", textAlign: "center", maxWidth: 320 }}>
        Processing symptoms, medical history & risk factors for <strong style={{ color: "var(--cyan)" }}>{patient.name}</strong>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 380 }}>
        {["Symptom Classification","Risk Assessment","Specialization Match","Hospital Scoring"].map(s => (
          <span key={s} style={{ background: "rgba(0,212,255,0.06)", border: "1px solid var(--border)", borderRadius: 20, padding: "4px 10px", fontSize: "0.72rem", color: "var(--muted)" }}>{s}</span>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 500, margin: "60px auto", padding: "0 20px" }}>
      <div className="card" style={{ padding: 24, borderColor: "rgba(255,45,85,0.4)" }}>
        <div style={{ color: "var(--red)", marginBottom: 12 }}>⚠ AI Analysis Failed: {error}</div>
        <button className="btn-primary" onClick={() => { setAnalyzing(true); setError(null); }}>Retry</button>
      </div>
    </div>
  );

  const uColor = urgencyColors[analysis?.urgency] || "var(--cyan)";

  return (
    <div className="slide-up" style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button className="btn-secondary" onClick={onBack} style={{ padding: "8px 14px" }}>←</button>
        <div>
          <h2 style={{ fontFamily: "Orbitron", fontSize: "1rem", letterSpacing: "0.1em", color: "var(--cyan)" }}>
            AI TRIAGE COMPLETE
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}> AI Medical Analysis • {patient.name}</div>
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="card" style={{ padding: 16, marginBottom: 14, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--cyan), var(--green))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", flexShrink: 0
        }}>👤</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 2 }}>{patient.name}</div>
          <div style={{ display: "flex", gap: 12, fontSize: "0.78rem", color: "var(--muted)", flexWrap: "wrap" }}>
            <span>🎂 {patient.age} yrs • {patient.gender}</span>
            {patient.blood && <span>🩸 {patient.blood}</span>}
            <span>📱 {patient.phone}</span>
            {patient.duration && <span>⏱ {patient.duration}</span>}
            <span>💢 Pain: {patient.pain_scale}/10</span>
          </div>
          {patient.existing_conditions?.length > 0 && (
            <div style={{ fontSize: "0.72rem", color: "var(--amber)", marginTop: 4 }}>
              ⚠ Existing: {patient.existing_conditions.join(", ")}
            </div>
          )}
        </div>
        <div className={`badge ${getRiskBadgeClass(analysis.riskLevel)}`} style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
          {analysis.riskLevel} Risk
        </div>
      </div>

      {/* AI Analysis Card */}
      <div className="card" style={{ padding: 22, marginBottom: 14, background: "rgba(0,255,157,0.03)", borderColor: "rgba(0,255,157,0.2)" }}>
        <div style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 12 }}>🤖 AI DIAGNOSIS INDICATORS</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <span className={`badge ${getRiskBadgeClass(analysis.riskLevel)}`}>⚠ {analysis.riskLevel} Risk</span>
          <span className="badge" style={{ background: "rgba(0,255,157,0.1)", color: "var(--green)", border: "1px solid rgba(0,255,157,0.3)" }}>🏥 {analysis.specialization}</span>
          <span className="badge" style={{ background: "rgba(0,0,0,0.3)", color: uColor, border: `1px solid ${uColor}44` }}>⏱ {analysis.urgency}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 6 }}>ASSESSMENT</div>
            <div style={{ fontSize: "0.85rem", lineHeight: 1.5 }}>{analysis.reasoning}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 8 }}>💊 {analysis.recommendation}</div>
          </div>
          {analysis.conditions?.length > 0 && (
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 6 }}>POSSIBLE CONDITIONS</div>
              {analysis.conditions.map(c => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem" }}>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ranked Hospitals */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "Orbitron", fontSize: "0.82rem", color: "var(--cyan)", letterSpacing: "0.1em", marginBottom: 12 }}>
          🏆 RANKED HOSPITAL MATCHES — {analysis.specialization}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((h, i) => {
            const avail = checkHospitalAvailability(h);
            const scorePercent = (h.score / maxScore) * 100;
            const isSelected = selected === h.id;
            return (
              <div key={h.id} className={`card hospital-card ${isSelected ? "selected" : ""}`}
                onClick={() => avail.available && setSelected(h.id)}
                style={{ padding: "14px 18px", opacity: avail.available ? 1 : 0.55, cursor: avail.available ? "pointer" : "not-allowed" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: i === 0 ? "linear-gradient(135deg,#ffd700,#ff8c00)" : "var(--surface)",
                    border: `1px solid ${i === 0 ? "#ffd700" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Orbitron", fontWeight: 700, fontSize: "0.9rem",
                    color: i === 0 ? "#000" : "var(--muted)"
                  }}>{i === 0 ? "★" : i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3, flexWrap: "wrap", gap: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{h.name}</span>
                      <div style={{ display: "flex", gap: 5 }}>
                        {i === 0 && <span className="badge badge-low" style={{ fontSize: "0.68rem" }}>⭐ Best Match</span>}
                        {!avail.available && <span className="badge badge-critical" style={{ fontSize: "0.68rem" }}>{avail.reason}</span>}
                        {avail.available && <span className="badge badge-low" style={{ fontSize: "0.68rem" }}>● Open</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 6 }}>{h.address}</div>
                    <div style={{ display: "flex", gap: 12, fontSize: "0.78rem", color: "var(--muted)", marginBottom: 8, flexWrap: "wrap" }}>
                      <span>★ {h.rating}</span>
                      <span>📍 {h.distance} km</span>
                      <span>💬 {h.reviews.toLocaleString()}</span>
                      <span>🏢 {h.type}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="score-bar" style={{ flex: 1 }}>
                        <div className="score-fill" style={{ width: `${scorePercent}%`, transition: "width 0.9s ease" }} />
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "var(--cyan)", fontWeight: 700, minWidth: 32 }}>{h.score.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: "16px 20px", background: "rgba(0,212,255,0.04)" }}>
        <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 12 }}>
          {selected
            ? <span>Booking token for <strong style={{ color: "var(--cyan)" }}>{patient.name}</strong> at <strong style={{ color: "var(--cyan)" }}>{filtered.find(h => h.id === selected)?.name}</strong></span>
            : "Select an available hospital above"}
        </div>
        <button className="btn-primary" disabled={!selected} style={{ width: "100%" }}
          onClick={() => {
            const hospital = filtered.find(h => h.id === selected);
            const avail = checkHospitalAvailability(hospital);
            onNext({ hospital, analysis, avail });
          }}>
          🎫 Generate Priority Token for {patient.name} →
        </button>
      </div>
    </div>
  );
}

// ─── STEP 5: Token + Queue ────────────────────────────────────────────────────
function TokenStep({ data, onRestart }) {
  const { hospital, analysis, avail, patient } = data;
  const [tokenData, setTokenData]   = useState(null);

  useEffect(() => {
    if (avail.available) {
      const result = generateTokenForHospital(hospital.id, analysis.riskLevel);
      setTokenData(result);
    }
  }, [avail.available, hospital.id, analysis.riskLevel]);

  if (!avail.available) return (
    <div className="slide-up" style={{ maxWidth: 540, margin: "0 auto", padding: "40px 20px" }}>
      <div className="card" style={{ padding: 32, textAlign: "center", borderColor: "rgba(255,45,85,0.3)" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🚫</div>
        <h2 style={{ fontFamily: "Orbitron", color: "var(--red)", marginBottom: 8 }}>UNAVAILABLE</h2>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>
          {hospital.name} is currently on <strong style={{ color: "var(--amber)" }}>{avail.reason}</strong>
        </p>
        <div className="card" style={{ padding: 16, marginBottom: 24, background: "rgba(0,212,255,0.06)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Next Available Slot</div>
          <div style={{ fontFamily: "Orbitron", color: "var(--cyan)", fontSize: "1.5rem", marginTop: 4 }}>
            {avail.next}
          </div>
        </div>
        <button 
          onClick={onRestart} 
          style={{ 
            width: "100%",
            padding: "14px 28px",
            background: "linear-gradient(135deg, #ff2d55, #ff6b6b)",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer",
            fontFamily: "Sora",
            fontWeight: 600,
            fontSize: "1rem",
            letterSpacing: "0.03em",
            transition: "all 0.2s",
            boxShadow: "0 0 16px rgba(255,45,85,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 0 28px rgba(255,45,85,0.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 0 16px rgba(255,45,85,0.3)";
          }}
        >
          🏠 Home
        </button>
      </div>
    </div>
  );

  if (!tokenData) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
      <div className="spinner" />
    </div>
  );

  const { token, position, total, queue } = tokenData;

  return (
    <div className="slide-up" style={{ maxWidth: 620, margin: "0 auto", padding: "24px 20px" }}>
      {/* Success Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontFamily: "Orbitron", fontSize: "0.75rem", letterSpacing: "0.2em", color: "var(--green)", marginBottom: 8 }}>
          ✅ TOKEN GENERATED SUCCESSFULLY
        </div>
        <h1 style={{ fontFamily: "Orbitron", color: "var(--text)", fontSize: "1.2rem" }}>{hospital.name}</h1>
        <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 4 }}>{hospital.address}</div>
      </div>

      {/* Token card */}
      <div className="card" style={{ padding: 32, textAlign: "center", marginBottom: 20, background: "radial-gradient(ellipse at center, rgba(0,212,255,0.05) 0%, transparent 70%)" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", letterSpacing: "0.15em", marginBottom: 8 }}>TOKEN NUMBER</div>
            <div className="token-number">T{String(token.id).padStart(3,"0")}</div>
            <div style={{ marginTop: 8, fontFamily: "Orbitron", fontSize: "0.85rem", color: "var(--text)", letterSpacing: "0.05em" }}>
              {patient?.name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 4 }}>
              {patient?.age}y • {patient?.gender} {patient?.blood ? `• 🩸 ${patient.blood}` : ""}
            </div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span className={`badge ${getRiskBadgeClass(analysis.riskLevel)}`}>
                ⚠ {analysis.riskLevel} Priority
              </span>
              <span className="badge badge-low">🏥 {analysis.specialization}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
            {[
              ["Position in Queue", `${position} of ${total}`, "📍"],
              ["Est. Wait Time", token.waitMins ? `~${token.waitMins} min` : "<5 min", "⏱"],
              ["Priority Level", analysis.riskLevel, "🔥"]
            ].map(([label, val, icon]) => (
              <div key={label} className="card" style={{ padding: "14px 12px", textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{icon}</div>
                <div style={{ fontFamily: "Orbitron", fontSize: "1rem", color: "var(--cyan)", fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Live indicator */}
          <div className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 10, marginBottom: 16, background: "rgba(0,255,157,0.04)" }}>
            <span className="live-dot" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text)", fontWeight: 600 }}>Live Queue Tracking Active</div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Updates every 30 seconds • Show this token at reception</div>
            </div>
            <div style={{ fontFamily: "Orbitron", fontSize: "0.75rem", color: "var(--green)" }}>LIVE</div>
          </div>

          {analysis.riskLevel === "Critical" && (
            <div className="card" style={{ padding: 14, background: "rgba(255,45,85,0.08)", borderColor: "rgba(255,45,85,0.4)", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: "1.5rem" }}>🚨</span>
                <div>
                  <div style={{ color: "var(--red)", fontWeight: 700, fontSize: "0.9rem" }}>CRITICAL — Immediate Attention Required</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Please proceed to emergency immediately. Inform staff of your critical status.</div>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={onRestart} 
            style={{ 
              width: "100%", 
              marginTop: 20,
              padding: "14px 28px",
              background: "linear-gradient(135deg, #ff2d55, #ff6b6b)",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              cursor: "pointer",
              fontFamily: "Sora",
              fontWeight: 600,
              fontSize: "1rem",
              letterSpacing: "0.03em",
              transition: "all 0.2s",
              boxShadow: "0 0 16px rgba(255,45,85,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 28px rgba(255,45,85,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(255,45,85,0.3)";
            }}
          >
            🏠 Home
          </button>

      {/* Queue Section */}
      <div style={{ marginTop: 20 }}>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
            <span className="live-dot" />
            <span style={{ fontFamily: "Orbitron", fontSize: "0.82rem", letterSpacing: "0.1em", color: "var(--cyan)" }}>
              LIVE PRIORITY QUEUE
            </span>
            <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--muted)" }}>{total} patients</span>
          </div>
          {queue.slice(0, 8).map((q, i) => {
            const isCurrent = i === 0;
            const isMine    = q.id === token.id;
            return (
              <div key={q.id} className="queue-row" style={{
                padding: "12px 18px", borderBottom: "1px solid rgba(14,61,106,0.5)",
                background: isMine ? "rgba(0,212,255,0.07)" : isCurrent ? "rgba(0,255,157,0.04)" : "transparent",
                display: "flex", alignItems: "center", gap: 12
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: isCurrent ? "var(--green)" : "var(--surface)",
                  border: `1px solid ${isCurrent ? "var(--green)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Orbitron", fontSize: "0.8rem", fontWeight: 700,
                  color: isCurrent ? "var(--bg)" : "var(--muted)",
                  flexShrink: 0
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontFamily: "Orbitron", color: isMine ? "var(--cyan)" : "var(--text)", fontSize: "0.9rem" }}>
                      T{String(q.id).padStart(3,"0")}
                    </span>
                    <span className={`badge ${getRiskBadgeClass(q.risk)}`}>{q.risk}</span>
                    {isMine && <span className="badge badge-medium">← You</span>}
                    {isCurrent && <span className="badge badge-low">▶ Now Serving</span>}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 2 }}>
                    Wait: ~{(i * 12)} min • Registered: {new Date(q.time).toLocaleTimeString()}
                  </div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%",
                  background: getRiskColor(q.risk),
                  boxShadow: `0 0 6px ${getRiskColor(q.risk)}`
                }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]   = useState(0);
  const [data, setData]   = useState({});

  const steps = ["Location","Family","Symptoms","Hospitals","Analysis","Token"];

  return (
    <>
      <FontLink />
      <div className="scanlines grid-bg" style={{ minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(3,13,26,0.95)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "12px 24px", display: "flex", alignItems: "center", gap: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.3rem" }}>⚕️</span>
            <span style={{ fontFamily: "Orbitron", fontWeight: 900, color: "var(--cyan)", fontSize: "1rem", letterSpacing: "0.1em" }}>
              AUTHEN<span style={{ color: "var(--green)" }}>X</span>
            </span>
          </div>
          {/* Step progress */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div className={`step-dot ${i === step ? "active" : i < step ? "done" : ""}`} />
                  <span style={{ fontSize: "0.6rem", color: i === step ? "var(--cyan)" : i < step ? "var(--green)" : "var(--muted)" }}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 24, height: 1, background: i < step ? "var(--green)" : "var(--border)", marginBottom: 12 }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
            <span className="live-dot" style={{ marginRight: 5 }} />
            LIVE
          </div>
        </div>

        {/* Main content */}
        <div style={{ paddingBottom: 60 }}>
          {step === 0 && (
            <LocationStep onNext={loc => { setData(d => ({ ...d, location: loc })); setStep(1); }} />
          )}
          {step === 1 && (
            <FamilyMemberStep
              onNext={patient => { setData(d => ({ ...d, patient })); setStep(2); }}
              onBack={() => setStep(0)} />
          )}
          {step === 2 && (
            <PatientDetailsStep
              patient={data.patient}
              onNext={patient => { setData(d => ({ ...d, patient })); setStep(3); }}
              onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <HospitalsStep
              location={data.location}
              patient={data.patient}
              onNext={hospitals => { setData(d => ({ ...d, hospitals })); setStep(4); }}
              onBack={() => setStep(2)} />
          )}
          {step === 4 && (
            <RecommendationStep
              data={{ patient: data.patient, hospitals: data.hospitals }}
              onNext={rd => { setData(d => ({ ...d, ...rd })); setStep(5); }}
              onBack={() => setStep(3)} />
          )}
          {step === 5 && (
            <TokenStep
              data={{ hospital: data.hospital, analysis: data.analysis, avail: data.avail, patient: data.patient }}
              onRestart={() => { setData({}); setStep(0); }} />
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "20px", borderTop: "1px solid var(--border)", fontSize: "0.72rem", color: "var(--muted)" }}>
          AuthenX AI Healthcare Platform • Real Hospital Data via AI Web Search
        </div>
      </div>
    </>
  );
}