var canvas,ctx,
    particles = {
      count: 1500,
      array: [],
      mouseX: 0,
      mouseY: 0,
      scrollY: 0
    };


function initParticles(){
  if(!document.getElementById("particles")){
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'particles');
    document.body.appendChild(canvas);
  } else {
    canvas = document.getElementById("particles");
  }
  ctx = canvas.getContext("2d");

  particles.scrollY = document.documentElement.scrollTop
  onResizeParticles();
  canvas.loopParticles = window.setInterval(loopParticles,  1000/25)
}

function onResizeParticles(e){
  canvas.width = document.querySelector('canvas').clientWidth;
  canvas.height = document.querySelector('canvas').clientHeight;

  // == init particles ==============
  particles.array = [];
  var random,
      size,
      alpha
  for(i = 0; i < particles.count; ++i){
    random = Math.random();
    if(random > 0.95){
      size = 5 + (3 * Math.random());
    } else if(random > 0.8){
      size = 3 + (2 * Math.random());
    } else if(random > 0.65){
      size = 2 + Math.random();
    } else {
      size = 1 + Math.random();
    }

    // x
    particles.array.push(canvas.width * Math.random())
    // y
    particles.array.push(canvas.height * Math.random())
    // rotation
    particles.array.push(roundom(360))    
    // size
    particles.array.push(size)
    // color
    // particles.array.push(randomColor());
    // particles.array.push('rgba(255,255,255,'+Math.random()+')')
    alpha = (size + 15) / 20;
    random = Math.random();
    if(random > 0.667){
      particles.array.push('rgba(96,191,192,'+alpha+')')
    } else if(random > 0.333){  
      particles.array.push('rgba(46,43,109,'+alpha+')')
    } else {
      particles.array.push('rgba(217,33,76,'+alpha+')')
    }
    
    // x dirrection
    particles.array.push( (Math.random() + 0.5) * size * 0.15 );
    // y direction
    particles.array.push( (Math.random() - 0.5) * size * 0.2 );
  }

  drawParticlesCanvas();  
}


function drawParticlesCanvas(){
  var w = canvas.width,
      h = canvas.height;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for(i = 0; i < particles.array.length; i += 7){
    drawTriangle(ctx, particles.array[i], particles.array[i+1], particles.array[i+2], particles.array[i+3], particles.array[i+4])
  }
}

// == loopParticles =======================================
function loopParticles(e){
  var direction = {
    x: (particles.mouseX - (canvas.width / 2)) / (canvas.width / 2),
    y: (particles.mouseY - (canvas.height / 2)) / (canvas.height / 2)
  }

  particles.scrollDifference = (particles.scrollY - document.documentElement.scrollTop) * 0.05;
  // console.log(particles.scrollDifference)

  // console.log(direction)
  var px, py,
      padding = 100;

  for(i = 0; i < particles.array.length; i += 7){
    // move particles
    px = particles.array[i] + particles.array[i + 5];
    py = particles.array[i + 1] + particles.array[i + 6] + (particles.scrollDifference * particles.array[i+3]);
    
    // if particles are out of range, move them to the opposite end of screen and randomize adjacent coordinates.
    if(px < -padding || px > canvas.width + padding) py = Math.random() * canvas.height;
    if(py < -padding || py > canvas.height + padding) px = Math.random() * canvas.width;
    if(px < -padding) px = canvas.width + padding;
    if(px > canvas.width + padding) px = -padding;
    if(py < -padding) py = canvas.height + padding;
    if(py > canvas.height + padding) py = -padding;

    particles.array[i] = px;
    particles.array[i+1] = py;
  }

  pointParticlesAtMouse();
  drawParticlesCanvas();

  particles.scrollY = document.documentElement.scrollTop;
}

// == Helpers =====================================

var displacementStrength = 10;
function drawTriangle(context, x, y, rotation, triangleSize, color){
  
  var x0 = Math.sin((rotation) * Math.PI / 180) * triangleSize * displacementStrength;
  var y0 = Math.cos((rotation) * Math.PI / 180) * triangleSize * displacementStrength;
  var x1 = Math.sin((rotation + 30) * Math.PI / 180) * triangleSize;
  var y1 = Math.cos((rotation + 30) * Math.PI / 180) * triangleSize;
  var x2 = Math.sin((rotation - 30) * Math.PI / 180) * triangleSize;
  var y2 = Math.cos((rotation - 30) * Math.PI / 180) * triangleSize;
  
  if(color) context.fillStyle = color;
  context.globalAlpha = 0.333;
  context.beginPath();
  context.moveTo(x+x0,y+y0);
  context.lineTo(x+x0+x1,y+y0+y1)
  context.lineTo(x+x0+x2,y+y0+y2);
  context.closePath();
  context.fill();

}

function randomColor(){
  return('rgb(' + roundom(255) + ',' + roundom(255) + ',' + roundom(255) + ')')
}

function roundom(n){
  return Math.round(Math.random() * n);
}

function onMouseMove(e){
  particles.mouseX = e.clientX,
  particles.mouseY = e.clientY,
      
  drawParticlesCanvas();
}

function pointParticlesAtMouse(){
  var pX, pY, angle;
  for(i = 0; i < particles.array.length; i += 7){
    pX = particles.array[i] - particles.mouseX;
    pY = particles.array[i+1] - particles.mouseY;
    angle = Math.atan2(pX,pY) * 180/Math.PI;
    particles.array[i+2] = angle;
  }
}

window.addEventListener('resize', onResizeParticles)
window.addEventListener('mousemove', onMouseMove)
window.addEventListener('load', initParticles);


function generatePassword(passwordLength){
  var password = "";
  var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz.!@#$%&"
  for(i = 0; i < passwordLength; i++){
    var letter = alpha[ Math.round( Math.random() * alpha.length ) ];
    password += letter;
  }
  console.log(password)
}