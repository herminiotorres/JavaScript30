/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggleButton = player.querySelector('.toggle');
const fullscreenButton = player.querySelector('.fullscreen__button');
const skipButons = Array.from(player.querySelectorAll('[data-skip]'));
const ranges = Array.from(player.querySelectorAll('.player__slider'));
let mousedown = false;
let fullscreen = false;

/* Build out functions */
function togglePlay() {
  // if(video.paused) {
  //   video.play();
  // } else {
  //   video.pause();
  // }

  const action = video.paused ? 'play' : 'pause';
  video[action]();
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggleButton.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(event) {
  const scrubTime = (event.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function toggleFullScreen() {
  if(!fullscreen) {
    fullscreen = !fullscreen;
    launchIntoFullscreen(video);
  } else {
    fullscreen = !fullscreen;
    exitFullscreen();
  }
}

// Find the right method, call on correct element
function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

// Whack fullscreen
function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
toggleButton.addEventListener('click', togglePlay);
skipButons.map(button => button.addEventListener('click', skip));
ranges.map(range => range.addEventListener('change', handleRangeUpdate));
ranges.map(range => range.addEventListener('mousemove', handleRangeUpdate));
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (event) => mousedown && scrub(event));
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mousedown', () => mousedown = true);
fullscreenButton.addEventListener('click', toggleFullScreen);
document.addEventListener('keydown', (event) => {
  if(event.keyCode === 70) toggleFullScreen()
})
document.addEventListener('keydown', (event) => {
  if(event.keyCode === 32) togglePlay()
});
