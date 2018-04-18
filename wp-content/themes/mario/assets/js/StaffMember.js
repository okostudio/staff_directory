
const divisions = 5;  //number of image segments
const pink = '#ee1e5a';
const darkPink = '#63001f';
const blue = '#2de0e0';
const darkBlue = "#322387";



// 
//  StaffMember gets the image data of an image, and identifies the transparent sections.
//  If then creates an array of co-ordinates for circles to span the opaque segments.
//
function StaffMember(staffMemberData, container, width = 220, height = 220) {

  console.log(staffMemberData.secret_photo)

  // Set up DOM
  const newDiv = (_name, _className, _parent) => {
    this[_name] = document.createElement('div');
    this[_name].className = _className;
    if (_parent) this[_parent].appendChild(this[_name]);
  }

  newDiv('staffMember', 'staff-member');
  newDiv('extra', 'extra', 'staffMember');
  newDiv('photo', 'photo', 'staffMember');
  newDiv('help', 'help', 'staffMember');
  newDiv('bio', 'bio', 'staffMember');
  newDiv('background', 'background', 'photo');
  newDiv('portrait', 'portrait', 'photo');
  newDiv('wedge', 'wedge', 'photo');
  newDiv('hitarea', 'hitarea', 'staffMember');
  

  this.staffMember.style.width = width + "px";
  this.staffMember.style.height = height + "px";
  this.staffMember.style.display = "none";
  this.staffMember.classList.add('member' + staffMemberData.id);
  this.class = 'member' + staffMemberData.id;
  container.appendChild(this.staffMember);

  this.data = staffMemberData;
  this.width = width;
  this.height = height;
  this.circleLocations = [];
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
  this.canvas.width = width;
  this.canvas.height = height;

  this.hoverState = false;

  this.loadImage(staffMemberData.photo);

  this.addListeners();

  this.setText()
}



StaffMember.prototype.setText = function () {
  // Name / Nickname / Surname and Job title
  // check for nickname;
  let nickname = "";
  if (this.data.nickname) nickname = `<span class="nickname">&ldquo;${this.data.nickname}&rdquo;</span>`;
  this.bio.innerHTML = `
    <h2>${this.data.first_name} ${nickname} ${this.data.last_name}</h2>
    <h3>${this.data.job_title}</h3>`;

  this.help.innerHTML = `
    <h3 class="label">Come to me for help with:</h3>
    <h2 class="small">${this.data.can_help_with}</h2>`;
}



StaffMember.prototype.loadImage = function (src) {
  this.image = new Image();
  this.image.src = src;
  this.image.width = this.width;
  this.image.height = this.height;
  this.image.onload = () => {
    this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
    this.imageData = this.toGreyScale(this.ctx.getImageData(0, 0, this.width, this.height));
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.putImageData(this.imageData, 0, 0);

    // load temp image, without processing image data
    let temp = new Image();
    temp.src = this.canvas.toDataURL();
    this.portrait.appendChild(temp);
    temp.onload = () => {
      this.staffMember.style.display = "inline-block";
      TweenMax.from(this.staffMember, 0.3, { alpha: 0, ease: Power3.easeIn });
    }
  };
}

StaffMember.prototype.getPixelValue = function (x, y) {
  let i = ((y * this.canvas.width) + x) * 4;
  return (this.imageData.data.slice(i, i + 4))
}

StaffMember.prototype.scanForTransparentPixels = function () {
  // Clear canvas one last time
  this.ctx.clearRect(0, 0, this.width, this.height);

  this.rows = [];
  const width = this.width;
  const segmentHeight = Math.round(this.height / divisions);

  const getElipse = function (_x, _y, _width) {
    let elipse = {
      rad: Math.round(_width * 0.5),
      x: _x + Math.round(_width * 0.5),
      y: _y
    };

    // if elipse starts at left side, allow it to bleed a little
    if (_x == 0) {
      elipse.x -= 10;
      elipse.rad += 10;
    }

    // if elipse ends at the right side, allow it to bleed a little
    if (_x + _width == width) {
      elipse.x += 10;
      elipse.rad += 10;
    }

    return elipse;
  }

  // 
  //  Scan through image data, and check for transprent pixels.
  //  
  for (let y = 0; y < this.height; y += segmentHeight) {

    let row = [];
    let elipse = {}
    let isOpaque = false;

    for (x = 0; x < this.width; x++) {

      if (this.getPixelValue(x, y)[3] > 125) {
        // If opaque pixel detected -----------
        if (!isOpaque) {
          isOpaque = true;
          elipse.x = x;
          elipse.y = y;
        }
      } else {
        // If transparent pixel detected -----------  
        if (isOpaque) {
          isOpaque = false;
          row.push(getElipse(elipse.x, elipse.y, x - elipse.x));
        }
      }

    }
    //  If the end of the row is reached, close of unclosed elipse's.
    if (isOpaque) {
      row.push(getElipse(elipse.x, elipse.y, x - elipse.x));
    }
    this.rows.push(row);
  }
  // console.log( this.rows )

  this.drawElipsesFromTransparentPixelData()
}

// 
// Takes a thing...
// 
StaffMember.prototype.drawElipsesFromTransparentPixelData = function () {
  this.portrait.innerHTML = "";

  const segmentHeight = Math.round(this.height / divisions);
  this.ctx.fillStyle = blue;
  this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  this.ctx.lineWidth = 4;

  for (i = this.rows.length - 1; i > -1; --i) {
    // clear and reset canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = "source-over";

    // rectangle, to use as image mask
    this.ctx.fillRect(0, (i) * segmentHeight, this.width, segmentHeight);
    // elipses on lower half of mask
    this.ctx.beginPath();
    if (i < this.rows.length - 1) {
      this.rows[i + 1].map((elipse) => {
        if (elipse.rad > 10) {
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
    this.ctx.drawImage(this.image, 0, 0, this.width, this.height);

    let segmentData = this.ctx.getImageData(0, 0, this.width, this.height);
    segmentData = this.toGreyScale(segmentData);

    // clear current image data
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Put greyscale image data, and convert to Data URL
    this.ctx.putImageData(segmentData, 0, 0);


    // draw exposed pink segment on top;
    this.ctx.globalCompositeOperation = "source-over";
    this.rows[i].map((elipse) => {
      if (elipse.rad > 10) {
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

    // make sure elipses aren't visible behind portrait
    this.ctx.globalCompositeOperation = "destination-in";
    this.ctx.drawImage(this.image, 0, 1, this.width, this.height);

    const img = new Image();
    img.className = "segment segment" + i
    img.src = this.canvas.toDataURL();
    this.portrait.appendChild(img);

  }
}

StaffMember.prototype.addListeners = function () {
  const THIS = this;
  this.staffMember.addEventListener('mouseover', function (e) {
    if(e.target.className.indexOf('hitarea') > -1){
      if (!THIS.isSplit) {
        THIS.isSplit = true;
        THIS.scanForTransparentPixels();
      }

      const segments = this.querySelectorAll('.segment');
      Array.from(segments).map((segment, i) => {
        kill(segment);
        to(segment, 0.4, { y: 200 }, 'inOut', i * 0.06);
      })
      const wedge = this.querySelector('.wedge');
      to(wedge, 0.4, { rotation: 45, transformOrigin: "100% 0%" }, 'inOut');

      const help = this.querySelector('.help');
      kill(help);
      set(help, { y: -20, alpha: 0 });
      to(help, 0.4, { y: 0, alpha: 1 }, 'out', 0.2);
    }
  })

  this.staffMember.addEventListener('mouseout', function (e) {
    
    const segments = this.querySelectorAll('.segment');
    if(e.target.className.indexOf('hitarea') > -1){
      Array.from(segments).map((segment, i) => {
        kill(segment);
        to(segment, 0.4, { y: 0 }, 'out', ((divisions + 1) * 0.01) - i * 0.01);
      })
      const wedge = this.querySelector('.wedge');
      to(wedge, 0.4, { rotation: 0, transformOrigin: "100% 0%" }, 'inOut');

      const help = this.querySelector('.help');
      kill(help);
      to(help, 0.2, { y: -20, alpha: 0 }, 'out');
      to(this, 0.3, { width: 220}, 'out');

      to(this.querySelector('.extra'), 0.3, { width: "100%" }, 'out')

    }
  })

  this.staffMember.addEventListener('click', function (e) {
    to(this.querySelector('.extra'), 0.3, {width: "100%"}, 'out')
  })
};

StaffMember.prototype.toGreyScale = function (image) {
  // convery image data to greyscale;
  for (let i = 0; i < image.data.length; i += 4) {
    const rgb = image.data.slice(i, i + 3);
    const brightness = Math.round((rgb[0] + rgb[1] + rgb[2]) / 3);
    image.data[i] = brightness;
    image.data[i + 1] = brightness;
    image.data[i + 2] = brightness;
  }
  return (image);
};

//
//  On image load, draw image ot canvas
//
function imageLoaded() {
  console.log(">> IMAGE LOADED")
  demo.ctx.drawImage(demo.image, 0, 0, demo.image.width, demo.image.height);
  demo.imageData = demo.ctx.getImageData(0, 0, demo.image.width, demo.image.height);
  demo.ctx.clearRect(0, 0, w, h);

  initDemo();
};


function loop(e) {

  demo.ctx.drawImage(demo.image, 0, 0, demo.image.width, demo.image.height);
  demo.imageData = demo.ctx.getImageData(0, 0, demo.image.width, demo.image.height);
  demo.ctx.clearRect(0, 0, w, h);

  var count = demo.count,
    width = demo.spacing,
    radius = demo.radius,
    r, g, b,
    X, Y;

  for (var x = 0; x < count; x++) {
    for (var y = 0; y < count; y++) {
      i = (x * count + y) * 4;

      // set x * y;
      X = demo.offsets[i / 2];
      demo.offsets.push(Math.random() * 500);

      r = demo.imageData.data[i];
      g = demo.imageData.data[i + 1];
      b = demo.imageData.data[i + 2];

      demo.ctx.beginPath();
      demo.ctx.ellipse(y * width + demo.offsets[i / 4], x * width, radius, radius, 0, Math.PI * 2, false);
      demo.ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
      demo.ctx.fill();
      demo.ctx.closePath();
    }
  }

}