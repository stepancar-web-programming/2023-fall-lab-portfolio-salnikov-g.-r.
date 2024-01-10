$(document).ready(function () {
  $(".header__burger").click(function (event) {
    $(".header__burger").toggleClass("header__burger_active");
    $(".header__menu").toggleClass("header__menu_active");
    $(".body").toggleClass("lock");
  });
});

const owl = $(".owl-carousel");

owl.owlCarousel({
  center: true,
  loop: true,
  margin: 40,
  startPosition: 5,
  items: 3,
});

$(".slider__btn--prev").click(function () {
  owl.trigger("next.owl.carousel");
});

$(".slider__btn--next").click(function () {
  owl.trigger("perv.owl.carousel");
});

// ------------------------PLAYER-------------------

const player = document.querySelector(".player"),
  playBtn = document.querySelector(".play"),
  prevBtn = document.querySelector(".prev"),
  nextBtn = document.querySelector(".next"),
  audio = document.querySelector(".audio"),
  title = document.querySelector(".song"),
  cover = document.querySelector(".cover__img"),
  imgsrc = document.querySelector(".controls__play__path"),
  controlsPlay = document.querySelector(".controls__play");
const progressSlider = document.querySelector(".progress-slider");

const songs = [
  "Скриптонит, T-Fest - Ламбада",
  "Eurythmics - Sweet Dreams Are Made of This",
  "ACDC - Back In Black",
  "Leningrad - WWW",
  "Queen - The Show Must Go On",
];

let songIndex = 0;

function loadSong(song) {
  title.innerHTML = song;
  audio.src = `audio/${song}.mp3`;
  cover.src = `img/player/${songIndex + 1}.jpg`;
}

loadSong(songs[songIndex]);

function playSong() {
  player.classList.add("play");
  imgsrc.setAttribute(
    "d",
    "M10.5195 0.269531H15.5V17.7305H10.5195V0.269531ZM0.5 17.7305V0.269531H5.48047V17.7305H0.5Z"
  );
  controlsPlay.setAttribute("viewBox", "0 0 16 18");
  audio.play();
}

function pauseSong() {
  player.classList.remove("play");
  imgsrc.setAttribute(
    "d",
    "M0.0195312 0.269531L13.7305 9L0.0195312 17.7305V0.269531Z"
  );
  controlsPlay.setAttribute("viewBox", "0 0 10 18");
  audio.pause();
}

playBtn.addEventListener("click", () => {
  const isPlaying = player.classList.contains("play");
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

function nextSong() {
  progressSlider.value = 0;
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

nextBtn.addEventListener("click", nextSong);

function prevSong() {
  progressSlider.value = 0;
  songIndex = (songs.length + songIndex - 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

prevBtn.addEventListener("click", prevSong);

audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  const progressPercentage = (currentTime / duration) * 3000;
  progressSlider.value = progressPercentage;
  if (isNaN(duration)) {
    progressSlider.value = 0;
  }
});

progressSlider.addEventListener("input", () => {
  const progressValue = progressSlider.value;
  const duration = audio.duration;
  const currentTime = (progressValue * duration) / 3000;
  audio.currentTime = currentTime;
});

audio.addEventListener("ended", nextSong);

// ---------------------------- ЭКВАЛАЙЗЕР ----------------------------
const columnsGap = 50;
const columnCount = 80;

const canvas = document.getElementById("player-fireplace");
const ctx = canvas.getContext("2d");

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let source = audioCtx.createMediaElementSource(audio);
let analyser = audioCtx.createAnalyser();
source.connect(analyser); // Подключаем анализатор к элементу audio
analyser.connect(audioCtx.destination);
let frequencyData = new Uint8Array(columnCount);

window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
  const parentElement = canvas.parentElement;
  canvas.width = parentElement.offsetWidth;
  canvas.height = parentElement.offsetHeight;
}

function centerCanvas() {
  const parentElement = canvas.parentElement;
  const parentWidth = parentElement.offsetWidth;
  const parentHeight = parentElement.offsetHeight;
  console.log(parentElement);

  const canvasLeft = (parentWidth - canvas.width) / 2;
  const canvasTop = (parentHeight - canvas.height) / 2;

  canvas.style.left = `${canvasLeft}px`;
  canvas.style.top = `${canvasTop}px`;
}

window.addEventListener("load", () => {
  resizeCanvas();
  centerCanvas();
});

window.addEventListener("resize", () => {
  resizeCanvas();
  centerCanvas();
});

function drawColumn(x, width, height) {
  const gradient = ctx.createLinearGradient(
    0,
    -height / 4,
    0,
    canvas.height / 2
  );
  gradient.addColorStop(1, "#2387f9");
  gradient.addColorStop(0.8, "#6eaafa");

  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 5;
  ctx.fillStyle = gradient;
  ctx.fillRect(x, canvas.height / 2, width, -height / 2);
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;

  const gradient2 = ctx.createLinearGradient(0, canvas.height, 0, height / 4);
  gradient2.addColorStop(1, "#0076ff");
  gradient2.addColorStop(0.2, "#aecdfa");

  ctx.fillStyle = gradient2;
  ctx.fillRect(x, canvas.height / 2, width, height / 2);
}


function render() {
  analyser.getByteFrequencyData(frequencyData);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const maxColumnHeight = canvas.height; // Максимальная высота колонки
  const columnWidth =
    (canvas.width - columnsGap * (columnCount - 1)) / columnCount;
  ctx.beginPath();
  ctx.strokeStyle = "#ff0077";
  ctx.lineWidth = 3;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  for (let i = 0; i < frequencyData.length; i++) {
    const columnHeight = (frequencyData[i] / 270) * maxColumnHeight;
    const xPos = i * (columnWidth + columnsGap);
    const currentHeight = parseFloat(canvas.dataset[`columnHeight${i}`]) || 0;
    const targetHeight = columnHeight;
    const ease = 0.2; // Параметр сглаживания для плавности анимации
    const newHeight = currentHeight + (targetHeight - currentHeight) * ease;
    canvas.dataset[`columnHeight${i}`] = newHeight;
    // Рисование колонки
    drawColumn(xPos, columnWidth, newHeight);
  }
  ctx.stroke();
  ctx.closePath();

  window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);

// ------------------------------VIDEO-----------------------------
const video = document.querySelector(".video"),
  playButton = document.querySelector(".controls__video__play"),
  playButtonsvg = document.querySelector(".controls__video__play__btn"),
  stopButton = document.querySelector(".controls__stop"),
  playButtonImg = document.querySelector(".controls__video__play__path"),
  progress = document.querySelector(".progress-video-slider"),
  time = document.querySelector(".controls__time");

function toggleVideoStatus() {
  if (video.paused) {
    video.play();
    playButtonImg.setAttribute(
      "d",
      "M10.5195 0.269531H15.5V17.7305H10.5195V0.269531ZM0.5 17.7305V0.269531H5.48047V17.7305H0.5Z"
    );
    playButtonsvg.setAttribute("viewBox", "0 0 16 18");
  } else {
    video.pause();
    playButtonImg.setAttribute(
      "d",
      "M0.0195312 0.269531L13.7305 9L0.0195312 17.7305V0.269531Z"
    );
    playButtonsvg.setAttribute("viewBox", "0 0 10 18");
  }
}

playButton.addEventListener("click", toggleVideoStatus);

video.addEventListener("click", toggleVideoStatus);

function stopVideo() {
  video.currentTime = 0;
  video.pause();
  playButtonImg.setAttribute(
    "d",
    "M0.0195312 0.269531L13.7305 9L0.0195312 17.7305V0.269531Z"
  );
  playButtonsvg.setAttribute("viewBox", "0 0 10 18");
}

stopButton.addEventListener("click", stopVideo);

video.addEventListener("timeupdate", () => {
  const currentTime = video.currentTime;
  const duration = video.duration;
  const progressPercentage = (currentTime / duration) * 3000;
  progress.value = progressPercentage;
  if (isNaN(duration)) {
    progressSlider.value = 0;
  }
  let minutes = Math.floor(video.currentTime / 60);
  if (minutes < 10) {
    minutes = "0" + String(minutes);
  }
  let seconds = Math.floor(video.currentTime % 60);
  if (seconds < 10) {
    seconds = "0" + String(seconds);
  }
  time.innerHTML = `${minutes}:${seconds}`;
});

progress.addEventListener("input", () => {
  const progressValue = progress.value;
  const duration = video.duration;
  const currentTime = (progressValue * duration) / 3000;
  video.currentTime = currentTime;
});

video.addEventListener("ended", stopVideo);
