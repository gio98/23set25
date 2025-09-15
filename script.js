"use strict";

var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight,
    
  hue = 217,
  stars = [],
  count = 0,
  maxStars = 1400;

// Variabili per effetti speciali del pulsante
let loveMode = false;
let specialHearts = [];
const maxSpecialHearts = 50;
const initialHearts = 10; // Numero di cuori iniziali da mostrare

// Thanks @jackrugile for the performance tip! https://codepen.io/jackrugile/pen/BjBGoM
// Cache gradient
var canvas2 = document.createElement('canvas'),
    ctx2 = canvas2.getContext('2d');
    canvas2.width = 100;
    canvas2.height = 100;
var half = canvas2.width/2,
    gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#fff');
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
    gradient2.addColorStop(1, 'transparent');

    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

// End cache

function random(min, max) {
  if (arguments.length < 2) {
    max = min;
    min = 0;
  }
  
  if (min > max) {
    var hold = max;
    max = min;
    min = hold;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maxOrbit(x,y) {
  var max = Math.max(x,y),
      diameter = Math.round(Math.sqrt(max*max + max*max));
  return diameter/2;
}

var Star = function() {

  this.orbitRadius = random(maxOrbit(w,h));
  this.radius = random(60, this.orbitRadius) / 12;
  this.orbitX = w / 2;
  this.orbitY = h / 2;
  this.timePassed = random(0, maxStars);
  this.speed = random(this.orbitRadius) / 50000;
  this.alpha = random(2, 10) / 10;

  count++;
  stars[count] = this;
}

Star.prototype.draw = function() {
  var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
      y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
      twinkle = random(10);

  if (twinkle === 1 && this.alpha > 0) {
    this.alpha -= 0.05;
  } else if (twinkle === 2 && this.alpha < 1) {
    this.alpha += 0.05;
  }

  ctx.globalAlpha = this.alpha;
    ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
  this.timePassed += this.speed;
}

for (var i = 0; i < maxStars; i++) {
  new Star();
}

// Crea alcuni cuori speciali all'avvio della pagina
for (let i = 0; i < initialHearts; i++) {
  createSpecialHeart();
}

// Variabili per la finestra modale
const modal = document.getElementById('love-modal');
const closeButton = document.querySelector('.close-button');

// Aggiungi l'event listener per il pulsante
document.getElementById('love-button').addEventListener('click', function() {
  loveMode = !loveMode;
  
  if (loveMode) {
    // Cambia il colore delle stelle quando si attiva la modalità amore
    hue = 330; // Tonalità rosa
    
    // Aggiungi molti cuori all'inizio
    for (let i = 0; i < 20; i++) {
      createSpecialHeart();
    }
    
    // Cambia il testo del pulsante
    this.textContent = 'Ti Amo! ❤️';
    
    // Aggiungi una classe per l'effetto pulsante
    document.querySelectorAll('.romantic-text').forEach(el => {
      el.style.color = '#ff80ab';
    });
    
    // Apri la finestra modale
    modal.style.display = 'block';
  } else {
    // Ripristina il colore originale delle stelle
    hue = 217;
    
    // Svuota l'array dei cuori speciali
    specialHearts = [];
    
    // Ripristina il testo del pulsante
    this.textContent = 'Click Me!';
    
    // Ripristina il colore del testo
    document.querySelectorAll('.romantic-text').forEach(el => {
      el.style.color = '#ffcce6';
    });
  }
});

// Chiudi la modale quando si clicca sulla X
closeButton.addEventListener('click', function() {
  modal.style.display = 'none';
});

// Chiudi la modale quando si clicca fuori dalla modale
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Funzione per creare cuori speciali che partono dal basso
function createSpecialHeart() {
  const heart = {
    // Posiziona sempre i cuori in basso per l'effetto di salita
    x: Math.random() * w,
    y: h,
    size: Math.random() * 30 + 10,
    speedY: Math.random() * 5 + 2,
    speedX: Math.random() * 4 - 2,
    color: `hsl(${Math.random() * 60 + 320}, 100%, 70%)`,
    rotation: Math.random() * Math.PI,
    opacity: 0, // Inizia con opacità 0 per l'effetto di fade-in
    age: 0 // Per tracciare l'età del cuore e gestire l'animazione di ingresso
  };
  specialHearts.push(heart);
  
  // Limita il numero di cuori speciali
  if (specialHearts.length > maxSpecialHearts) {
    specialHearts.shift();
  }
}

// Funzione per disegnare i cuori speciali
function drawSpecialHearts() {
  // Rimuovi la condizione che impedisce di disegnare i cuori quando loveMode è false
  ctx.save();
  for (let i = 0; i < specialHearts.length; i++) {
    const heart = specialHearts[i];
    
    // Aggiorna l'età del cuore
    heart.age += 0.016; // Circa 60fps
    
    // Gestisci l'animazione di ingresso (fade-in)
    if (heart.age < 1) {
      heart.opacity = heart.age; // Aumenta gradualmente l'opacità fino a 1
    } else {
      heart.opacity = 0.8; // Opacità normale dopo l'animazione di ingresso
    }
    
    // Aggiorna la posizione
    heart.y -= heart.speedY;
    heart.x += heart.speedX;
    heart.rotation += 0.02;
    
    // Disegna il cuore
    ctx.fillStyle = heart.color;
    ctx.globalAlpha = heart.opacity;
    ctx.save();
    ctx.translate(heart.x, heart.y);
    ctx.rotate(heart.rotation);
    
    // Disegna la forma del cuore
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(heart.size / 2, -heart.size / 2, heart.size, 0, 0, heart.size);
    ctx.bezierCurveTo(-heart.size, 0, -heart.size / 2, -heart.size / 2, 0, 0);
    ctx.fill();
    ctx.restore();
    
    // Rimuovi i cuori che sono usciti dallo schermo
    if (heart.y < -heart.size) {
      specialHearts.splice(i, 1);
      i--;
    }
  }
  ctx.restore();
}

function animation() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = loveMode ? 'hsla(330, 64%, 6%, 1)' : 'hsla(' + hue + ', 64%, 6%, 1)';
    ctx.fillRect(0, 0, w, h)
  
  ctx.globalCompositeOperation = 'lighter';
  for (var i = 1, l = stars.length; i < l; i++) {
    stars[i].draw();
  };
  
  // Disegna i cuori speciali
  drawSpecialHearts();
  
  // Crea nuovi cuori speciali in modalità amore o casualmente anche in modalità normale
  if ((loveMode && Math.random() > 0.9) || (!loveMode && Math.random() > 0.99)) {
    createSpecialHeart();
  }
  
  window.requestAnimationFrame(animation);
}

animation();