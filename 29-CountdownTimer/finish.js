// javascript code
let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = Array.from(document.querySelectorAll('[data-time]'));
const alarmClock = document.querySelector('.display__alarm-clock');

function startTimer() {
  // stoped the sound
  alarmClock.pause();
  alarmClock.currentTime = 0;

  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = (now + (seconds * 1000));
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    // check if we should stop it!
    if(secondsLeft < 0) {
      // played the sound
      alarmClock.currentTime = 0;
      alarmClock.play();

      clearInterval(countdown);
      return;
    }

    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = (seconds % 60);

  const display = `${formatTimer(minutes)}:${formatTimer(remainderSeconds)}`;

  timerDisplay.textContent = display;
  document.title = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  endTime.textContent = `Be Back At ${formatTimer(hour)}:${formatTimer(minutes)}`;
}

function formatTimer(timer) {
  return `${timer < 10 ? '0' : ''}${timer}`;
}

function getCustomForm(event) {
  // stoped the sound
  alarmClock.pause();
  alarmClock.currentTime = 0;

  event.preventDefault();
  const minutes = this.minutes.value;
  this.reset();
  timer(minutes * 60);
}

buttons.map(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', getCustomForm);
