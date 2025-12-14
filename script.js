/* ======= STATE ======= */
let speed = 0, disp = 0;
let fuel = 1, health = 1, engineOn = false, kmhMode = true;
let rpm = 0, rpmDisp = 0; // rpmDisp untuk smooth display
const rpmMax = 7000;

/* ======= ELEMENTS ======= */
const speedValue = document.getElementById("speedValue");
const speedRing = document.getElementById("speedRing");
const fuelRing = document.getElementById("fuelRing");
const engineRing = document.getElementById("engineRing");
const rpmBar = document.getElementById("rpmBar");
const rpmBarText = document.getElementById("rpmBarText");
const engineIcon = document.getElementById("engineIcon");
const seatbelt = document.getElementById("seatbelt");
const leftSein = document.getElementById("leftSein");
const rightSein = document.getElementById("rightSein");
const gearValue = document.getElementById("gearValue");
const light1 = document.getElementById("light1");
const light2 = document.getElementById("light2");

/* ======= SCALE ======= */
const scale = document.getElementById("scale");
const maxSpeed = 240, startAngle = -135, sweep = 270;
for (let i = 0; i <= maxSpeed; i += 10) {
    const a = startAngle + (i / maxSpeed) * sweep;
    const t = document.createElement("div");
    t.className = "tick " + (i % 20 === 0 ? "big" : "small");
    t.style.transform = `rotate(${a}deg) translateY(-140px)`;
    scale.appendChild(t);
    if (i % 20 === 0) {
        const n = document.createElement("span");
        n.innerText = i;
        n.style.transform =
            `rotate(${a}deg) translateY(-110px) rotate(${-a}deg) translate(-50%,-50%)`;
        scale.appendChild(n);
    }
}

/* ======= LOOP ======= */
function loop() {
    // Smooth speed
    disp += (speed - disp) * 0.12;
    const displaySpeed = kmhMode ? Math.floor(disp * 3.6) : Math.floor(disp * 2.23694);
    speedValue.innerText = displaySpeed;
    document.querySelector('.unit').innerText = kmhMode ? 'KM/H' : 'MPH';

    const sDeg = Math.min((displaySpeed / maxSpeed) * sweep, sweep);
    speedRing.style.background =
        `conic-gradient(from ${startAngle}deg, var(--accent) ${sDeg}deg, rgba(255,255,255,.08) ${sDeg}deg)`;

    // Mini rings
    const fuelColor = fuel < 0.2 ? "rgba(255,80,80,.45)" : "rgba(154,215,255,.9)";
    const engColor = health < 0.25 ? "rgba(255,80,80,.45)" : "rgba(154,215,255,.9)";
    fuelRing.style.background = `conic-gradient(${fuelColor} ${fuel*360}deg, transparent ${fuel*360}deg)`;
    engineRing.style.background = `conic-gradient(${engColor} ${health*360}deg, transparent ${health*360}deg)`;

    document.querySelector(".fuel").classList.toggle("critical", fuel < 0.2);
    document.querySelector(".engine").classList.toggle("critical", health < 0.25);

    // Smooth RPM
    rpmDisp += (rpm - rpmDisp) * 0.12; // lerp
    const rpmPercent = Math.min(rpmDisp / rpmMax * 100, 100);
    rpmBar.style.width = rpmPercent + "%";
    rpmBarText.innerText = Math.floor(rpmDisp) + " RPM";

    requestAnimationFrame(loop);
}
loop();

/* ======= SERVER FUNCTIONS ======= */
function setEngine(state) {
    engineOn = state;
    engineIcon.classList.toggle("active", state);
}

function setSpeed(s) { speed = s; }

function setRPM(r) { rpm = r * rpmMax; }

function setFuel(f) { fuel = f; }

function setHealth(h) { health = h; }

function setGear(g) {
    if (g === 0) gearValue.innerText = "N";
    else gearValue.innerText = g;
}

function setHeadlights(state) {
    // 0 = mati, 1 = light1, 2 = light1+light2
    light1.classList.toggle("active", state >= 1);
    light2.classList.toggle("active", state === 2);
}

let leftBlinkInterval = null;
let rightBlinkInterval = null;

function setLeftIndicator(state) {
    if (leftBlinkInterval) clearInterval(leftBlinkInterval);
    leftSein.classList.remove("active");
    if (state) {
        leftBlinkInterval = setInterval(() => {
            leftSein.classList.toggle("active");
        }, 500);
    } else leftBlinkInterval = null;
}

function setRightIndicator(state) {
    if (rightBlinkInterval) clearInterval(rightBlinkInterval);
    rightSein.classList.remove("active");
    if (state) {
        rightBlinkInterval = setInterval(() => {
            rightSein.classList.toggle("active");
        }, 500);
    } else rightBlinkInterval = null;
}

function setSeatbelts(state) { seatbelt.classList.toggle("active", state); }

function setSpeedMode(mode) { kmhMode = (mode === 0); }

/* ======= TEST KEYBOARD (a-z) ======= */
document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    switch(key) {
        case "e": // toggle engine
            setEngine(!engineOn);
            break;
        case "l": // toggle left indicator
            setLeftIndicator(leftBlinkInterval == null);
            break;
        case "r": // toggle right indicator
            setRightIndicator(rightBlinkInterval == null);
            break;
        case "f": // cycle headlights 0-1-2
            let state = 0;
            if (light1.classList.contains("active") && light2.classList.contains("active")) state = 2;
            else if (light1.classList.contains("active")) state = 1;
            state = (state + 1) % 3;
            setHeadlights(state);
            break;
        case "s": // toggle seatbelt
            setSeatbelts(!seatbelt.classList.contains("active"));
            break;
        case "g": // cycle gear 0-N-1-2-3
            let currentGear = gearValue.innerText === "N" ? 0 : parseInt(gearValue.innerText);
            let nextGear = (currentGear + 1) % 4;
            setGear(nextGear);
            break;
        case "k": // toggle speed mode
            setSpeedMode(kmhMode ? 1 : 0);
            break;
        case "t": // tambah speed
            setSpeed(speed + 5);
            break;
        case "y": // kurangi speed
            setSpeed(speed - 5);
            break;
        case "p": // random RPM
            setRPM(Math.random());
            break;
        case "h": // random fuel & health
            setFuel(Math.random());
            setHealth(Math.random());
            break;
    }
});

* ======= TEST KEYBOARD (a-z) ======= */
document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    switch(key) {
        case "e": // toggle engine
            setEngine(!engineOn);
            break;
        case "l": // toggle left indicator
            setLeftIndicator(leftBlinkInterval == null);
            break;
        case "r": // toggle right indicator
            setRightIndicator(rightBlinkInterval == null);
            break;
        case "f": // cycle headlights 0-1-2
            let state = 0;
            if (light1.classList.contains("active") && light2.classList.contains("active")) state = 2;
            else if (light1.classList.contains("active")) state = 1;
            state = (state + 1) % 3;
            setHeadlights(state);
            break;
        case "s": // toggle seatbelt
            setSeatbelts(!seatbelt.classList.contains("active"));
            break;
        case "g": // cycle gear 0-N-1-2-3
            let currentGear = gearValue.innerText === "N" ? 0 : parseInt(gearValue.innerText);
            let nextGear = (currentGear + 1) % 4;
            setGear(nextGear);
            break;
        case "k": // toggle speed mode
            setSpeedMode(kmhMode ? 1 : 0);
            break;
        case "t": // tambah speed
            setSpeed(speed + 5);
            break;
        case "y": // kurangi speed
            setSpeed(speed - 5);
            break;
        case "p": // random RPM
            setRPM(Math.random());
            break;
        case "h": // random fuel & health
            setFuel(Math.random());
            setHealth(Math.random());
            break;
    }
});

