// A small orthographic model. Face coordinates are in pack units, with Y up.
// Keep the model off the page's initial rendering path and draw only on input.
const canvas = document.getElementById('model');
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('Canvas 2D is unavailable');
const separation = document.getElementById('separation');
const faces = [];
let yaw = -.61;
let pitch = .40;
let drag = null;
let selectedLayer = 2;
let polygons = [];
let ratio = 1;

function addFace(layer, points, base, edge = false) {
  faces.push({layer, points, base, edge});
}
function carton() {
  const halfWidth = 1.34;
  const depth = .79;
  const rim = [[-halfWidth,0,-depth],[halfWidth,0,-depth],[halfWidth,0,depth],[-halfWidth,0,depth]];
  const floor = rim.map(([x,,z]) => [x,-.94,z]);
  addFace(0,floor,[155,133,104],true);
  for (let i=0;i<4;i++) {
    const j = (i+1)%4;
    addFace(0,[floor[i],floor[j],rim[j],rim[i]],[192,163,128],true);
    const end = [rim[i],rim[j]].map(([x,,z]) => i%2 === 0
      ? [x*.98,.13,z*1.82] : [x*1.31,.33,z*.93]);
    addFace(0,[rim[i],rim[j],end[1],end[0]],[213,190,158],true);
  }
}
function grid(layer, columns, rows, vertex, color) {
  for (let i=0;i<columns;i++) {
    for (let j=0;j<rows;j++) {
      const a=vertex(i/columns,j/rows), b=vertex((i+1)/columns,j/rows);
      const c=vertex((i+1)/columns,(j+1)/rows), d=vertex(i/columns,(j+1)/rows);
      addFace(layer,[a,d,c],color);
      addFace(layer,[a,c,b],color);
    }
  }
}
function fibre(u,v) {
  const x = (u-.5)*2.52, z = (v-.5)*1.48;
  // Soft rectangular wells model the moulded compartments and their lip.
  const nearX = Math.abs(x)-.61, nearZ = Math.abs(z)-.36;
  const well = Math.exp(-((nearX/.50)**4 + (nearZ/.27)**4));
  return [x,.11-.46*well,z];
}
function film(u,v) {
  const x=(u-.5)*2.69, z=(v-.5)*1.73;
  const crease = .11*Math.cos(x*3.7+z*1.7) + .12*Math.sin(x*2.1-z*4.3);
  const edge = Math.max(Math.abs(u-.5),Math.abs(v-.5));
  return [x+.04*Math.sin(z*6),.2+crease+.13*edge*Math.cos(8*x+3*z),z];
}
carton();
grid(1,32,20,fibre,[220,207,183]);
grid(2,26,18,film,[224,234,219]);

function normal(points) {
  const [a,b,c] = points;
  const ux=b[0]-a[0], uy=b[1]-a[1], uz=b[2]-a[2];
  const vx=c[0]-a[0], vy=c[1]-a[1], vz=c[2]-a[2];
  const x=uy*vz-uz*vy, y=uz*vx-ux*vz, z=ux*vy-uy*vx;
  const length = Math.hypot(x,y,z) || 1;
  return [x/length,y/length,z/length];
}
for (const face of faces) face.normal = normal(face.points);

function trace(points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index++) {
    ctx.lineTo(points[index][0], points[index][1]);
  }
  ctx.closePath();
}

function draw() {
  if (!canvas.closest('dialog').open) return;
  const {width,height}=canvas.getBoundingClientRect();
  ratio=Math.min(devicePixelRatio || 1,2);
  if (canvas.width!==Math.round(width*ratio) || canvas.height!==Math.round(height*ratio)) {
    canvas.width=Math.round(width*ratio);
    canvas.height=Math.round(height*ratio);
  }
  ctx.setTransform(ratio,0,0,ratio,0,0);
  ctx.clearRect(0,0,width,height);
  const scale=Math.min(width/4.65,height/4.9);
  const spread=.05 + Number(separation.value)*.012;
  const centerY=height*.52+scale*(spread-.32);
  const cy=Math.cos(yaw), sy=Math.sin(yaw), cp=Math.cos(pitch), sp=Math.sin(pitch);
  function project([x,y,z],layer) {
    const rotatedZ=-x*sy+z*cy;
    const vertical=y+layer*spread;
    return [width*.5 + (x*cy+z*sy)*scale,centerY-(vertical*cp-rotatedZ*sp)*scale, vertical*sp+rotatedZ*cp];
  }
  const shadow=ctx.createRadialGradient(width/2,centerY+scale*1.05,0,width/2,centerY+scale*1.05,scale*1.5);
  shadow.addColorStop(0,'rgba(75,52,26,.22)');
  shadow.addColorStop(1,'rgba(75,52,26,0)');
  ctx.save();
  ctx.translate(0,(centerY+scale*1.05)*.8);
  ctx.scale(1,.2);
  ctx.fillStyle=shadow;
  ctx.fillRect(0,0,width,height*4);
  ctx.restore();
  polygons = faces.map(face => {
    const points=face.points.map(p => project(p,face.layer));
    const depth=points.reduce((sum,p)=>sum+p[2],0)/points.length;
    return {face,points,depth};
  });
  polygons.sort((a,b)=>a.depth-b.depth);
  for (const {face,points} of polygons) {
    const [nx,ny,nz]=face.normal;
    const light=.73+.24*Math.abs(ny*.86 - (nx*cy+nz*sy)*.38 + (-nx*sy+nz*cy)*.34);
    const sheen=Math.abs(ny*.86+(nx*sy-nz*cy)*.52);
    const isFilm = face.layer === 2;
    const isSelected = face.layer === selectedLayer;
    const base = isSelected ? [155, 177, 94] : face.base;
    const rgb = isFilm && !isSelected
      ? [197 + sheen * 55, 207 + sheen * 43, 195 + sheen * 53]
      : base.map(value => Math.round(value * light));
    const alpha = isFilm ? (isSelected ? .53 : .33) + sheen * .34 : 1;
    ctx.fillStyle = 'rgba(' + [...rgb, alpha].join(',') + ')';
    trace(points);
    ctx.fill();
    ctx.strokeStyle = face.edge ? 'rgba(82,68,47,.54)' : ctx.fillStyle;
    ctx.lineWidth=face.edge?1:.55;
    ctx.stroke();
  }
}
let frame;
function schedule() {
  if (frame) return;
  frame=requestAnimationFrame(()=>{frame=0; draw();});
}
function turn(direction) { yaw+=direction*Math.PI/12; schedule(); }
document.getElementById('turn-left').onclick=()=>turn(-1);
document.getElementById('turn-right').onclick=()=>turn(1);
separation.oninput=schedule;
canvas.onpointerdown=event=>{
  if (event.button !== 0 || drag) return;
  drag = {id: event.pointerId, x: event.clientX, y: event.clientY, moved: false};
  canvas.setPointerCapture(event.pointerId);
};
canvas.onpointermove=event=>{
  if (drag?.id !== event.pointerId) return;
  const dx = event.clientX - drag.x;
  const dy = event.clientY - drag.y;
  if (!drag.moved && Math.hypot(dx, dy) < 5) return;
  yaw += dx * .013;
  pitch = Math.min(.83, Math.max(.1, pitch + dy * .005));
  Object.assign(drag, {x: event.clientX, y: event.clientY, moved: true});
  schedule();
};
canvas.onpointerup = event => {
  if (drag?.id !== event.pointerId || drag.moved) return;
  const {left, top} = canvas.getBoundingClientRect();
  const x = (event.clientX - left) * ratio;
  const y = (event.clientY - top) * ratio;
  // Polygons are painted back to front, so test the visible surface first.
  for (let index = polygons.length - 1; index >= 0; index--) {
    const {face, points} = polygons[index];
    trace(points);
    if (!ctx.isPointInPath(x, y)) continue;
    canvas.dispatchEvent(new CustomEvent('layerselect', {detail: face.layer}));
    break;
  }
};
canvas.onlostpointercapture = event => {
  if (drag?.id === event.pointerId) drag = null;
};
canvas.onkeydown=event=>{
  if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  turn(event.key==='ArrowRight'?1:-1);
};
new ResizeObserver(schedule).observe(canvas);
export function selectLayer(layer) {
  selectedLayer = layer;
  schedule();
}
