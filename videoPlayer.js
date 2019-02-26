var containerVideo = document.querySelector('.c-video')
var video = document.querySelector('.videoPlayer')
var progress = document.querySelector('.purple-bar')
var progressBar = document.querySelector('.video-progress-bar')
var btnPlay = document.getElementById('play-pause')
var btnVolume = document.getElementById('volume')
var volumeBar = document.querySelector('.volume-bar')
var volume = document.querySelector('.slider-vol')
var timer = document.querySelector('.video-time')
var dragVol = false
var dragProg = false

function mute() {
    if (video.muted) {
        video.muted = false
        checkVol()
    } else {
        video.muted = true
        btnVolume.querySelector('.fa-volume-up').style.display = 'none'
        btnVolume.querySelector('.fa-volume-down').style.display = 'none'
        btnVolume.querySelector('.fa-volume-mute').style.display = 'block'
    }
}

function checkVol(){
    if (video.volume > 0.5) {
        btnVolume.querySelector('.fa-volume-up').style.display = 'block'
        btnVolume.querySelector('.fa-volume-down').style.display = 'none'
        btnVolume.querySelector('.fa-volume-mute').style.display = 'none'
    } else if(video.volume > 0.03) {
        btnVolume.querySelector('.fa-volume-up').style.display = 'none'
        btnVolume.querySelector('.fa-volume-down').style.display = 'block'
        btnVolume.querySelector('.fa-volume-mute').style.display = 'none'
    }else{
        btnVolume.querySelector('.fa-volume-up').style.display = 'none'
        btnVolume.querySelector('.fa-volume-down').style.display = 'none'
        btnVolume.querySelector('.fa-volume-mute').style.display = 'block'
    }
}

function togglePlayPause() {
    if (video.paused) {
        btnPlay.className = 'pause';
        video.play();
    } else {
        btnPlay.className = 'play';
        video.pause();
    }
}

function updateTime() {
    let hour = Math.floor(video.duration / 3600)
    let min = Math.floor(video.duration / 60)
    let seg = Math.floor(((video.duration / 60) % 1) * 60)

    let currenthour = Math.floor(video.currentTime / 3600)
    let currentmin = Math.floor(video.currentTime / 60)
    let currentseg = Math.floor(((video.currentTime / 60) % 1) * 60)

    timer.innerHTML = convertTime(currenthour, currentmin, currentseg) + ' | ' + convertTime(hour, min, seg)
}

function convertTime(horas, minutos, segundos) {
    let temHoras = false
    if (horas < 10 && horas > 0) {
        horas = '0' + String(horas)
        temHoras = true
    } else {
        horas = String(horas)
    }
    if (minutos < 10) {
        minutos = '0' + String(minutos)
    } else if (minutos > 59) {
        horas += Math.floor(minutos / 60)
        minutos = minutos - (Math.floor(minutos / 60) * 60)
    }
    if (segundos < 10) {
        segundos = '0' + String(segundos)
    } else if (segundos > 59) {
        minutos += Math.floor(segundos / 60)
        segundos = segundos - (Math.floor(segundos / 60) * 60)
    }
    if (temHoras) {
        return String(horas) + ':' + String(minutos) + ':' + String(segundos)
    } else {
        return String(minutos) + ':' + String(segundos)
    }

}

function startDragVol(event) {
    if (event.type == 'mousedown') {
        dragVol = true
    } else {
        dragVol = false
    }
}

function startDragProg(event) {
    if (event.type == 'mousedown') {
        dragProg = true
    } else {
        dragProg = false
    }
}

function dragVolume(event) {
    if (video.muted) {
        video.muted = false
    }
    if (dragVol) {
        let w = volumeBar.clientWidth - 2
        let x = event.offsetX
        let pctVol = x / w
        volume.style.width = x - 2 + 'px'
        video.volume = pctVol
        checkVol()
    }
}

function updateVol(event) {
    if (video.muted) {
        video.muted = false
    }
    let w = volumeBar.clientWidth - 2
    let x = event.offsetX
    let pctVol = x / w
    volume.style.width = x + 'px'
    video.volume = pctVol
    checkVol()
}

function dragSeeker(event) {
    if (dragProg) {
        let clickPoint = (event.offsetX / progressBar.clientWidth) * 100
        progress.style.width = clickPoint
        video.currentTime = (video.duration * clickPoint) / 100
    }
}

function seeker() {
    let clickPoint = (event.offsetX / progressBar.clientWidth) * 100
    progress.style.width = clickPoint
    video.currentTime = (video.duration * clickPoint) / 100
}

btnPlay.onclick = function () {
    togglePlayPause()
}

video.onclick = function () {
    togglePlayPause()
}

video.addEventListener('timeupdate', function () {
    var progressPosition = video.currentTime / video.duration
    progress.style.width = progressPosition * 100 + '%'
    if (video.ended) {
        btnPlay.className = 'play'
    }
})

progressBar.addEventListener('mousedown', startDragProg)
progressBar.addEventListener('mousemove', dragSeeker)
progressBar.addEventListener('click', seeker)

volumeBar.addEventListener('mousedown', startDragVol)
volumeBar.addEventListener('mousemove', dragVolume)
volumeBar.addEventListener('click', updateVol)

btnVolume.addEventListener('click', mute)

containerVideo.addEventListener('mouseup', startDragProg)
containerVideo.addEventListener('mouseup', startDragVol)

setInterval(updateTime, 100)