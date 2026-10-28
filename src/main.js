import { playlist } from './counter.js'

let currentTrackIndex = 0
let isPlaying = false

const audio = document.getElementById('audio-element')
const playBtn = document.getElementById('play-btn')
const prevBtn = document.getElementById('prev-btn')
const nextBtn = document.getElementById('next-btn')
const trackListContainer = document.getElementById('track-list')

const playerCover = document.getElementById('player-cover')
const playerTitle = document.getElementById('player-title')
const playerArtist = document.getElementById('player-artist')

const progressBar = document.getElementById('progress-bar')
const currentTimeEl = document.getElementById('current-time')
const durationEl = document.getElementById('duration')
const volumeBar = document.getElementById('volume-bar')

function renderTracks() {
	trackListContainer.innerHTML = ''
	playlist.forEach((track, index) => {
		const item = document.createElement('div')
		item.classList.add('track-item')
		item.innerHTML = `
      <div class="track-item-info">
        <img src="${track.cover}" alt="cover" style="width: 48px; height: 48px; border-radius: 4px;">
        <div>
          <div style="color: #fff; font-weight: 500;">${track.title}</div>
          <div style="font-size: 12px; color: #b3b3b3;">${track.artist}</div>
        </div>
      </div>
      <i class="fa-solid fa-play" style="color: #b3b3b3;"></i>
    `
		item.style.display = 'flex'
		item.style.alignItems = 'center'
		item.style.justifyContent = 'space-between'
		item.style.padding = '10px 16px'
		item.style.cursor = 'pointer'

		item.addEventListener('click', () => loadAndPlayTrack(index))
		trackListContainer.appendChild(item)
	})
}

function loadTrack(index) {
	currentTrackIndex = index
	const track = playlist[index]
	audio.src = track.src
	playerCover.src = track.cover
	playerTitle.textContent = track.title
	playerArtist.textContent = track.artist
}

function togglePlay() {
	if (!audio.src) loadTrack(0)

	if (isPlaying) {
		audio.pause()
		playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'
	} else {
		audio.play()
		playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'
	}
	isPlaying = !isPlaying
}

function loadAndPlayTrack(index) {
	loadTrack(index)
	isPlaying = false
	togglePlay()
}

function nextTrack() {
	currentTrackIndex = (currentTrackIndex + 1) % playlist.length
	loadAndPlayTrack(currentTrackIndex)
}

function prevTrack() {
	currentTrackIndex =
		(currentTrackIndex - 1 + playlist.length) % playlist.length
	loadAndPlayTrack(currentTrackIndex)
}

function formatTime(seconds) {
	const min = Math.floor(seconds / 60) || 0
	const sec = Math.floor(seconds % 60) || 0
	return `${min}:${sec < 10 ? '0' : ''}${sec}`
}

audio.addEventListener('timeupdate', () => {
	if (audio.duration) {
		const progressPercent = (audio.currentTime / audio.duration) * 100
		progressBar.value = progressPercent
		currentTimeEl.textContent = formatTime(audio.currentTime)
		durationEl.textContent = formatTime(audio.duration)
	}
})

progressBar.addEventListener('input', () => {
	if (audio.duration) {
		audio.currentTime = (progressBar.value / 100) * audio.duration
	}
})

volumeBar.addEventListener('input', e => {
	audio.volume = e.target.value / 100
})

playBtn.addEventListener('click', togglePlay)
nextBtn.addEventListener('click', nextTrack)
prevBtn.addEventListener('click', prevTrack)
audio.addEventListener('ended', nextTrack)

renderTracks()
loadTrack(0)
