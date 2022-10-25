var socket = io();
/* Buttons */
const startbutton = document.getElementById('start');
const endbutton = document.getElementById('finish');
const pausebutton = document.getElementById('pause');
const calcButton = document.getElementById('calorie-calc');

/* Status bar */
const workoutStatus = document.getElementById('status');
const maxbpm = document.getElementById('maxbpm');

/* Information section */
const bpm = document.getElementById('bpm');
const timr = document.querySelector('.container-timer .timerdisplay');
var cyclingMET = 8;
var highest = new Array();
var countdown = 3;
var secs = 0;
var interval = null;
var downloadTimer;

const calpHour = document.getElementById('calphour');
var calorieCounter = 0;
var calorieMinutes = 0;
var calorieHours = 0;
const calorieHTML = document.getElementById('calorie-number');
var calorieValue = 0;
var caloriesPerHour = 0;
var internalTimers;

const distanceMoved = document.getElementById('distance-moved');
const speed = document.getElementById('speed');
var pedalThreshold = 6;
var revolutions = 0;
var revPS = 0;
var distanceCounter = 0;
var distanceMinutes = 0;
var distanceHours = 0;
var cycleRadius = 0.35;
var kmPS = 0;
var km = 0;
var kmPH = 0;

startbutton.addEventListener('click', () => {
    
    bpm.innerText = "Measuring. . .";
    calorieHTML.innerText = "Calculating. . .";
    speed.innerText = "Calculating. . .";
    distanceMoved.innerText = "Calculating. . .";

    setInterval(function () {
        calorieTimer();
        distanceTimer();
    }, 1000);

    setInterval(function () {
        if (cyclingMET == 0) {
            // do nothing
        } else {
            calorieHTML.innerText = calorieValue.toPrecision(3);
        }
    }, 5328)

    var downloadTimer = setInterval(function () {
        if (countdown <= 0) {
            if (interval != null) {
                return;
            }
            interval = setInterval(timer, 1000);
            workoutStatus.style.fontSize = "30px";
            workoutStatus.innerText = "Workout started! Enjoy";
            socket.on('data', data => {
                if (data >= 9) {
                    highest[0] = data;

                    if (data > highest[0]) {
                        highest[0] = data;
                    }

                    bpm.innerText = data;
                }

                revolutions += 1;

                console.log(revolutions);
                rpm = revolutions / distanceMinutes;
                metresPS = rpm * ((2 * Math.PI) / 60) * cycleRadius;
                kmPH = metresPS * 3.6;
                kmPS = kmPH / 3600;
                km = km + kmPS / distanceCounter;

                if (rpm > 85) {
                    cyclingMET = 11;
                }

                speed.innerText = rpm.toPrecision(4);
                distanceMoved.innerText = km.toPrecision(3);
            })
        }
        else {
            workoutStatus.innerText = countdown;
            workoutStatus.style.fontSize = "60px";
        }
        countdown -= 1;
    }, 1000);
});

endbutton.addEventListener('click', () => {
    stop();
    calorieValue = false;
    bpm.innerText = "Workout complete";
    calorieHTML.innerText = "Workout complete";
    speed.innerText = "Workout complete";
    distanceMoved.innerText = "Workout complete";

    if (calorieValue == false) {
        cyclingMET = 0;
    }

    calpHour.innerText = caloriesPerHour.toPrecision(3);

    socket.off('data');

    if (highest[0] != null) {
        maxbpm.innerText = highest[0];
    }

    workoutStatus.innerText = "Workout complete! Check app for some stats!";
});

pausebutton.addEventListener('click', () => {
    cyclingMET = 0;
    socket.off('data');
    workoutStatus.innerText = "Workout paused. . .";
    clearInterval(interval);  
})

function timer() {
    secs++;

    // Format our time
    let hrs = Math.floor(secs / 3600);
    let mins = Math.floor((secs - (hrs * 3600)) / 60);
    let scnd = secs % 60;

    if (scnd < 10) scnd = '0' + scnd;
    if (mins < 10) mins = '0' + mins;
    if (hrs < 10) hrs = '0' + hrs;

    timr.innerText = `${hrs}:${mins}:${scnd}`;

}

function stop() {
    clearInterval(interval);
}

timer();

/* Calories Calculation */
function calorieTimer() {
    calorieCounter = calorieCounter + 1;

    calorieHours = Math.floor(calorieCounter / 3600);
    calorieMinutes = calorieCounter / 60;
    calorieValue = (cyclingMET * 80 * calorieMinutes * 3.5) / 200;
    caloriesPerHour = calorieValue / (calorieMinutes / 60);
}

function distanceTimer() {
    distanceCounter += 1;
    distanceHours = Math.floor(distanceCounter / 3600);
    distanceMinutes = distanceCounter / 60;
}