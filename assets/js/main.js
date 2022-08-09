/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');




const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Faded',
            singer: 'Vicetone',
            path: './assets/music/Faded.mp3',
            image: './assets/images/faded.png'
        },
        {
            name: 'Fallingdown',
            singer: 'fallingdown',
            path: './assets/music/fallingdown.mp3',
            image: './assets/images/stay.png'
        },
        {
            name: 'My Heart Will Go On',
            singer: 'Carpenters',
            path: './assets/music/MyHeartWillGoOn.mp3',
            image: './assets/images/Carpenters.jpg'
        },
        {
            name: 'PrettyBoy',
            singer: 'M2M',
            path: './assets/music/PrettyBoy.mp3',
            image: './assets/images/M2M.jpg'
        },
        {
            name: 'Rather Be',
            singer: 'CelineDion',
            path: './assets/music/Rather Be.mp3',
            image: './assets/images/CelineDion.jpg'
        },
        {
            name: 'ShalalaLala',
            singer: 'Vengaboys',
            path: './assets/music/ShalalaLala.mp3',
            image: './assets/images/Vengaboys.jpg'
        },
        {
            name: 'stay',
            singer: 'Stay',
            path: './assets/music/stay.mp3',
            image: './assets/images/stay.png'
        },
        {
            name: 'TakeMeToYourHeart',
            singer: 'MichaelLearnsTo',
            path: './assets/music/TakeMeToYourHeart.mp3',
            image: './assets/images/MichaelLearnsTo.jpg'
        },
        {
            name: 'Yesterday One More',
            singer: 'Ratherbe',
            path: './assets/music/YesterdayOnceMore.mp3',
            image: './assets/images/ratherbe.jpg'
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    //load song
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    // xu ly su kien
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth

        // xu ly CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // xu ly phong to, thu nho cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // xu ly khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // khi song dc player
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing');
            cdThumbAnimate.play()
        }

        // khi song bi pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing');
            cdThumbAnimate.pause()
        }

        // khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // xu ly khi tua bai hat
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
            // const width = _this.clientWidth
            // const clickX = e.offsetX
            // const duration = audio.duration
            // audio.currentTime = (clickX / width) * duration
        }

        // xu ly next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // xu ly prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }

        // xu ly random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // xu ly repeat song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // xu ly next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vao playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                // xu ly khi click vao song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }

            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 100)
        
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        //dinh nghia ra thuoc tinh cho object
        this.defineProperties()
        // lang nghe  / xu ly cac su kien (DOM events)
        this.handleEvents()
        
        // load thong tin song dau tien vao UI khi chay app
        this.loadCurrentSong()

        // render song
        this.render()
    }
}

app.start();









































































