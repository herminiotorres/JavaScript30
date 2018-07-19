const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(localMediaStream => {
      console.log(localMediaStream);
      /*
        [Deprecation] URL.createObjectURL with media streams is deprecated and will be removed in M68, around July 2018. Please use HTMLMediaElement.srcObject instead.
        video.src = window.URL.createObjectURL(localMediaStream);
      */ 
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(error => {
      console.error(`OH NO!!! `, error);
    });
}

function paintToCanvas() {
  const [width, height] = [video.videoWidth, video.videoHeight];
  [canvas.width, canvas.height] = [width, height];
  
  setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    
    // pixels = redEffect(pixels);
    // pixels = greenEffect(pixels);
    // pixels = blueEffect(pixels);
    // pixels = rgbSplit(pixels);
    pixels = rbgScreen(pixels);
    
    // ctx.globalAlpha = 0.1;
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 10);
}

function takePhoto() {
  // played the sound
  snap.currentTime = 0;
  snap.play();
  
  // take the data out of the canvas
  const data = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', `${Number(new Date(), 10)}`);
  link.textContent = 'Download Image';
  link.innerHTML = `<img src="${data}" alt="Your Photo">`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
  }
  return pixels;
}

function greenEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] - 50; // RED
    pixels.data[i + 1] = pixels.data[i + 1] + 100; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
  }
  return pixels;
}

function blueEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] - 50; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] + 100; // BLUE
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 300] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 350] = pixels.data[i + 2]; // BLUE
  }
  return pixels;
}

function rbgScreen(pixels) {
  const levels = {};
  
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });
  
  for(i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];
    
    if(red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);