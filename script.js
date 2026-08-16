import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.querySelector("#webgl");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030509, 0.045);

const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, .1, 100);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.IcosahedronGeometry(2.35, 2);
const wire = new THREE.MeshBasicMaterial({color:0x72f7ff, wireframe:true, transparent:true, opacity:.18});
const core = new THREE.Mesh(geometry, wire);
group.add(core);

const inner = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.45, 1),
  new THREE.MeshBasicMaterial({color:0x586cff, wireframe:true, transparent:true, opacity:.18})
);
group.add(inner);

const particles = new THREE.BufferGeometry();
const count = 1300;
const positions = new Float32Array(count*3);
for(let i=0;i<count;i++){
  const r=THREE.MathUtils.randFloat(4,15);
  const a=Math.random()*Math.PI*2;
  const z=THREE.MathUtils.randFloatSpread(12);
  positions[i*3]=Math.cos(a)*r;
  positions[i*3+1]=Math.sin(a)*r;
  positions[i*3+2]=z;
}
particles.setAttribute("position",new THREE.BufferAttribute(positions,3));
const stars = new THREE.Points(particles,new THREE.PointsMaterial({color:0x9defff,size:.018,transparent:true,opacity:.7}));
scene.add(stars);

const rings=[];
for(let i=0;i<4;i++){
  const ring=new THREE.Mesh(
    new THREE.TorusGeometry(3.1+i*.48,.008,8,180),
    new THREE.MeshBasicMaterial({color:i%2?0x5d6cff:0x72f7ff,transparent:true,opacity:.24-i*.035})
  );
  ring.rotation.x=Math.PI/2 + i*.2;
  ring.rotation.z=i*.6;
  group.add(ring); rings.push(ring);
}

let mouseX=0, mouseY=0, targetX=0, targetY=0;
addEventListener("pointermove",e=>{
  mouseX=(e.clientX/innerWidth-.5);
  mouseY=(e.clientY/innerHeight-.5);
});
let scroll=0, targetScroll=0;
addEventListener("scroll",()=>targetScroll=scrollY);
const sections=[...document.querySelectorAll(".section")];

function animate(){
  requestAnimationFrame(animate);
  targetX += (mouseX-targetX)*.035;
  targetY += (mouseY-targetY)*.035;
  scroll += (targetScroll-scroll)*.055;

  group.rotation.y += .0025;
  group.rotation.x = targetY*.18 + scroll*.00015;
  group.rotation.y += targetX*.0015;
  group.position.y = Math.sin(performance.now()*.0005)*.12 - scroll*.002;
  core.rotation.z += .001;
  inner.rotation.z -= .002;
  rings.forEach((r,i)=>{r.rotation.y += .001*(i+1); r.rotation.x += .0004*(i+1);});
  stars.rotation.y += .00015;

  renderer.render(scene,camera);
}
animate();

addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{threshold:.15});
document.querySelectorAll(".content,.section-label,.event-card,.timeline,.hero-copy").forEach(el=>{
  el.classList.add("reveal"); observer.observe(el);
});

document.querySelectorAll(".event-card").forEach(card=>{
  card.addEventListener("pointermove",e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(700px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-8px)`;
  });
  card.addEventListener("pointerleave",()=>card.style.transform="");
});

const menu=document.querySelector(".menu-btn"), nav=document.querySelector(".nav nav");
menu.addEventListener("click",()=>nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

let pct=0;
const loader=document.querySelector("#loader"), pctEl=document.querySelector("#loadPct");
const timer=setInterval(()=>{
  pct=Math.min(100,pct+Math.floor(Math.random()*13)+5);
  pctEl.textContent=pct+"%";
  if(pct>=100){
    clearInterval(timer);
    setTimeout(()=>{loader.style.opacity="0";setTimeout(()=>loader.remove(),800)},350);
  }
},90);
