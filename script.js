// 

const $welcome = document.getElementById("welcome");
const $time = document.getElementById("time");
const $meridiem = document.getElementById("meridiem");
const $settings = document.getElementById("settings");
const $settingsButton = document.getElementById("settingsbutton");
const $24hour = document.getElementById("24hour");
const $settingSeconds = document.getElementById("settingseconds");
const $more = document.getElementById("moremenu");
const $morebutton = document.getElementById("morebutton");

const $dayWeek = document.getElementById("dayweek");
const $dayMonth = document.getElementById("daymonth");
const $dayYear = document.getElementById("dayyear");
const $weekYear = document.getElementById("weekyear");

let format24 = false;
let showSeconds = false;

if (localStorage.length !== 0) {
    format24 = localStorage.getItem("24hour") === "true";
    showSeconds = localStorage.getItem("showSeconds") === "true";

    $24hour.checked = format24;
    $settingSeconds.checked = showSeconds;
}

function twoDigits(num) {
    if (num < 10) {
        return `0${num}`;
    } else {
        return `${num}`;
    }
}

function getCurrentTime(currentTime) {
    let hours = currentTime.getHours();
    let am = true;
    if (!format24 && hours > 12) {
        hours -= 12;
        am = false;
    }
    let minutes = currentTime.getMinutes();
    if (showSeconds) {
        let seconds = currentTime.getSeconds();
        if (format24) {
            $meridiem.innerHTML = "";
            return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
        } else {
            $meridiem.innerHTML = am ? "AM" : "PM";
            return `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
        }
    } else {
    
        if (format24) {
             $meridiem.innerHTML = "";
             return `${twoDigits(hours)}:${twoDigits(minutes)}`;
        } else {
           $meridiem.innerHTML = am ? "AM" : "PM";
            return `${hours}:${twoDigits(minutes)}`;
            }
        }
}

function toggleSettingsButton() {
    $settings.classList.toggle("on");
}

$settingsButton.addEventListener("click", toggleSettingsButton);

// settings input on/off changes from first if 
function changeSettings() {
    format24 = $24hour.checked;
    showSeconds = $settingSeconds.checked;
    localStorage.setItem("format24", format24)
    localStorage.setItem("showSeconds", showSeconds)

    setTime();
}

$24hour.addEventListener("change", changeSettings);
$settingSeconds.addEventListener("change", changeSettings);

//  Your API key for Timur.ikr@gmail.com is: HuZKANxcIKarzEH5wFAVyZjQmRnFr5OIAzJM2Eb3  

function getAPOD() {
    fetch("https://api.nasa.gov/planetary/apod?api_key=HuZKANxcIKarzEH5wFAVyZjQmRnFr5OIAzJM2Eb3")
    .then(response => response.json())
    .then(data => {
        let imageUrl = data.url;
        document.body.style.backgroundImage = `url(${imageUrl})`;
    });
}
getAPOD();

function getWelcome(currentTime) {
    let hours = currentTime.getHours();

    if (hours >= 6 && hours <= 11) {
        return "Welcome, and Good morning";
    } else if (hours >= 12 && hours <= 15) {
        return "Welcome, and Good afternoon";
    } else {
        return "Goodnight";
    }
}

function toggleMenuButton() {
    $more.classList.toggle ("on")
}
$morebutton.addEventListener("click", toggleMenuButton);

let dayOutput = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"];

function getDayOutput(currentTime) {
    const dayIndex = currentTime.getDay();
    
    return dayOutput[dayIndex];
}

// Extra details for the more section
function setMoreDetails(currentTime) {
    let startOfYear = new Date(currentTime.getFullYear(), 0)

    let msFromStartYear = currentTime - startOfYear;
    let days = msFromStartYear / 1000 / 60 / 60 / 24;
    let weeks = days / 7;

    let startOfMonth = new Date(currentTime.getFullYear(), currentTime.getMonth());
    let msFromStartMonth = currentTime - startOfMonth;
    let daysThisMonth = msFromStartMonth / 1000 / 60 / 60 / 24;

    $dayWeek.innerHTML = getDayOutput(currentTime);
    $dayMonth.innerHTML = Math.floor(daysThisMonth)+1;
    $dayYear.innerHTML = Math.floor(days)+1;
    $weekYear.innerHTML = Math.floor(weeks)+1; 
}

function setTime() {
    let currentTime = new Date(Date.now());
    $time.innerHTML = getCurrentTime(currentTime);
    $welcome.innerHTML = getWelcome(currentTime)
    setMoreDetails(currentTime);
}

setInterval(setTime, 1000);
setTime();