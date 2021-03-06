const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Click Pow Get Down",
            singer: "Raftaar x Fortnite",
            path: "./audio/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK-7128950.mp3",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "./audio/HoaTanTinhTanNewVersion-GiangJolee-7183041.mp3",
            image:
                "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path:
                "./audio/DeVuong-DinhDungACV-7121634.mp3",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "Mantoiyat",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "./audio/ChayVeNoiPhiaAnh-KhacViet-7129688.mp3",
            image:
                "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "Aage Chal",
            singer: "Raftaar",
            path: "./audio/ChayVeNoiPhiaAnh-KhacViet-7129688.mp3",
            image:
                "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "./audio/ChayVeNoiPhiaAnh-KhacViet-7129688.mp3",
            image:
                "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "./audio/ChayVeNoiPhiaAnh-KhacViet-7129688.mp3",
            image:
                "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "./audio/ChayVeNoiPhiaAnh-KhacViet-7129688.mp3",
            image:
                "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
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

        playList.innerHTML = htmls.join('');
    },

    handleEvents: function (){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // quay cd
        cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause();

        document.onscroll = function (){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // X??? l?? s??? ki???n play

        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }

        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRandom', _this.isRandom);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click(); 
            }
        }

        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if( songNode ||
                e.target.closest('.option')
            ){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }

    },

    defineProperty: function (){
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    scrollToActiveSong: function (){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            }, 500);
        })
    },

    loadCurrentSong: function(){

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;

    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let currentSongIndex = this.currentIndex;
        do{
            this.currentIndex = Math.floor(Math.random() * this.songs.length);
        }while(this.currentIndex === currentSongIndex);
        
        this.loadCurrentSong();
    },

    start: function () {
        this.loadConfig();
        this.defineProperty();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
        randomBtn.classList.toggle("active", _this.isRandom);
        randomBtn.classList.toggle("active", _this.isRepeat);
    }

}

app.start();

