const staffMembers = document.querySelector('.staff-members');
const divisions = 7;  //number of image segments
const pink = '#ee1e5a';
const darkPink = '#63001f';
const blue = '#2de0e0';
const darkBlue = "#322387";



// 
//  StaffMember gets the image data of an image, and identifies the transparent sections.
//  If then creates an array of co-ordinates for circles to span the opaque segments.
//
function StaffMember(imageSource, width = 300, height = 300) {

  // Set up DOM
  this.staffMember = document.createElement('div');
  this.staffMember.className = "staff-member";
  this.photo = document.createElement('div');
  this.photo.className = "photo";
  this.background = document.createElement('div');
  this.background.className = "background";
  this.portrait = document.createElement('div');
  this.portrait.className = "portrait";
  this.wedge = document.createElement('div');
  this.wedge.className = "wedge";  
  this.bio = document.createElement('div');
  this.bio.className = "bio";  

  // append DOM elements
  this.photo.appendChild(this.background);  
  this.photo.appendChild(this.portrait); 
  this.staffMember.appendChild(this.photo);  
  this.staffMember.appendChild(this.wedge);  
  staffMembers.appendChild(this.staffMember);  

  this.width = width;
  this.height = height;
  this.circleLocations = [];
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
  this.canvas.width = width;
  this.canvas.height = height;

  this.loadImage(imageSource);
}

StaffMember.prototype.loadImage = function(src){
  this.image = new Image();
  this.image.src = src;
  this.image.onload = () => {
    this.ctx.drawImage( this.image, 0, 0, this.width, this.height )
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.scanForTransparentPixels();
  };
}

StaffMember.prototype.getPixelValue = function(x,y){
  let i = ((y * this.canvas.width) + x) * 4;
  return( this.imageData.data.slice(i, i + 4) )
}

StaffMember.prototype.scanForTransparentPixels = function(){
  
  this.rows = [];
  let data = this.imageData.data;
  const width = this.width;
  const segmentHeight = Math.round(this.height / divisions);

  const getElipse = function(_x,_y,_width){
    let elipse = {
      rad: Math.round(_width * 0.5),
      x: _x + Math.round(_width * 0.5),
      y: _y
    };

    // if elipse starts at left side, allow it to bleed a little
    if (_x == 0){
      elipse.x -=10;
      elipse.rad += 10; 
    }

    // if elipse ends at the right side, allow it to bleed a little
    if (_x + _width == width){
      elipse.x +=10;
      elipse.rad += 10; 
    }

    return elipse;
  }

  // 
  //  Scan through image data, and check for transprent pixels.
  //  
  // 
  for(let y = 0; y < this.height; y += segmentHeight){
    
    let row = [];
    let elipse = {}
    let isOpaque = false;

    for(x = 0; x < this.width; x++){

      if( this.getPixelValue(x,y)[3] > 125 ){
        // If opaque pixel detected -----------
        if(!isOpaque){
          isOpaque = true;
          elipse.x = x;
          elipse.y = y;
        }
      } else{
        // If transparent pixel detected -----------  
        if(isOpaque){
          isOpaque = false;
          row.push(getElipse(elipse.x, elipse.y, x - elipse.x));
        }
      }

    }
    //  If the end of the row is reached, close of unclosed elipse's.
    if(isOpaque){
      row.push(getElipse(elipse.x, elipse.y, x - elipse.x));
    }
    this.rows.push(row);
  }
  console.log( this.rows )

  this.drawElipsesFromTransparentPixelData()
}

// 
// Takes a 
// 
StaffMember.prototype.drawElipsesFromTransparentPixelData = function(){
  
  const segmentHeight = Math.round(this.height / divisions);
  this.ctx.fillStyle = blue;
  this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  this.ctx.lineWidth = 4;

  for(i = this.rows.length - 1; i > -1 ; --i){
    // clear and reset canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = "source-over";

    // rectangle, to use as image mask
    this.ctx.fillRect(0, (i) * segmentHeight, this.width, segmentHeight);
    // elipses on lower half of mask
    this.ctx.beginPath();
    if(i < this.rows.length - 1){
      this.rows[i+1].map( (elipse) => {
        if(elipse.rad > 10){
          const radiusY = (elipse.rad / this.width) * segmentHeight * 0.66;
          const radiusX = elipse.rad;
          this.ctx.beginPath();
          this.ctx.ellipse(elipse.x, elipse.y, radiusY, radiusX, Math.PI * 0.5, 0, 2 * Math.PI);
          this.ctx.closePath();
          this.ctx.fill();
        }
      });
    }
    
    // draw image over mask area
    this.ctx.globalCompositeOperation = "source-in"; //source-over
    this.ctx.drawImage( this.image, 0, 0, this.width, this.height );

    // draw exposed pink segment on top;
    
    this.ctx.globalCompositeOperation = "source-over";
    this.rows[i].map( (elipse) => {
      if(elipse.rad > 10){
        this.ctx.beginPath();
        const radiusY = (elipse.rad / this.width) * segmentHeight * 0.66 - 2;
        const radiusX = elipse.rad - 2;
        this.ctx.ellipse(elipse.x, elipse.y, radiusY, radiusX, Math.PI * 0.5, 0, 2 * Math.PI);
        
        // create gradient
        let gradient = this.ctx.createLinearGradient(elipse.x - radiusX, elipse.y - radiusY, elipse.x + radiusX, elipse.y + radiusY);
        gradient.addColorStop(0, blue);
        gradient.addColorStop(1, darkBlue);
        this.ctx.fillStyle = gradient;

        this.ctx.fill();
        this.ctx.closePath();
      }
    });

    const img = new Image();
    img.className = "segment segment" + i
    img.src = this.canvas.toDataURL();
    this.portrait.appendChild(img)
  }
  
  // $('.segment').map((i,seg) => {
  //   to(seg, 1, {y: (i * -140) + 375}, 'inOut')
  // })
  // $('.segment').map((i,seg) => {
  //   to(seg, 0.4, {y: 0}, 'out', 1-0.1*i)
  // })
  
  this.staffMember.addEventListener('mouseover', function(){
    const segments = this.querySelectorAll('.segment');
    Array.from(segments).map((segment, i) => {
      kill(segment);
      to(segment, 0.5, {y: 200}, 'inOut', i * 0.05);
    })
    const wedge = this.querySelector('.wedge');
    to(wedge, 0.5, {rotation: 45, transformOrigin: "100% 0%"}, 'inOut', i * 0.05);
  })

  this.staffMember.addEventListener('mouseout', function(){
    const segments = this.querySelectorAll('.segment');
    Array.from(segments).map((segment, i) => {
      kill(segment);
      to(segment, 0.5, {y: 0}, 'inOut', ((divisions+1) * 0.05) - i * 0.05);
    })
    const wedge = this.querySelector('.wedge');
    to(wedge, 0.5, {rotation: 0, transformOrigin: "100% 0%"}, 'inOut', i * 0.05);
  })
}

 
//
//  On image load, draw image ot canvas
//
function imageLoaded(){
    console.log(">> IMAGE LOADED")
    demo.ctx.drawImage(demo.image, 0, 0, demo.image.width, demo.image.height);
    demo.imageData = demo.ctx.getImageData(0,0,demo.image.width,demo.image.height);
    demo.ctx.clearRect(0,0,w,h);

    initDemo();
}


function loop(e){

    demo.ctx.drawImage(demo.image, 0, 0, demo.image.width, demo.image.height);
    demo.imageData = demo.ctx.getImageData(0,0,demo.image.width,demo.image.height);
    demo.ctx.clearRect(0,0,w,h);

    var count = demo.count,
        width = demo.spacing,
        radius = demo.radius,
        r,g,b,
        X,Y;


    for(var x = 0; x < count; x++){
        for(var y = 0; y < count; y++){
            i = (x * count + y) * 4;
            
            // set x * y;
            X = demo.offsets[i/2];
            demo.offsets.push(Math.random() * 500);
            
            r = demo.imageData.data[i];
            g = demo.imageData.data[i+1];
            b = demo.imageData.data[i+2];
            
            demo.ctx.beginPath();
            demo.ctx.ellipse(y * width + demo.offsets[i/4], x * width, radius, radius, 0, Math.PI * 2, false);
            demo.ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
            demo.ctx.fill();
            demo.ctx.closePath();
        }
    }    

}

window.addEventListener('load', init);