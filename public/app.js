const API = (function() {
    
    const clientId = 'e61c783f7e744bb8b6f4ddbfe09aba41';
    const clientSecret = '5936e0ef5d0d4715b9a29cb816bb301a';

    const _getToken = async () => {
        // получаем токен
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const jsonData = await result.json();
        return jsonData.access_token;
    }
    
    const _getGenres = async (token) => {
        // получаем список жанров
        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_RU`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const jsonData = await result.json();
        return jsonData.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {
        // получаем список плейлистов по выбранному жанру 
        const limit = 20;
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const jsonData = await result.json();
        return jsonData.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {
        // получаем спиок треков выбранного плейлиста
        const limit = 20;
        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const jsonData = await result.json();
        return jsonData.items;
    }

    return {
        // принимаемые/возвращаемые значения
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
    }
})();

const Interface = (function() {
    const DOMElements = {
        selectGenre: '#genre',
        selectPlaylist: '#select_playlist',
        playlist: '.playlist',
        tracks: '#tracks'
    }

    return {
        clickAction() {
            return {
                // поля для взаимодейтвия с разметкой
                genre: document.querySelector(DOMElements.selectGenre),
                track: document.querySelector(DOMElements.playlist),
                forResetplaylist: document.querySelector(DOMElements.selectPlaylist),
                forResettracks: document.querySelector(DOMElements.tracks),
            }
        },

        // разметка для жанров
        createGenre(text, value, img) {
            const temp = `
                <section class="collum">
                <a class="link__decoration link__track hover__track link__one" href="#">
                    <div class="container ${value}">
                        <img class="img__tarck ${value}" src="${img}" alt="">
                        <div class="content__track ${value}">
                            <playlist class="name__track ${value}">${text}</playlist>
                        </div> 
                    </div> 
                </a>
                </section>
                `;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', temp);
        }, 

        // разметка для плейлистов
        createPlaylist(text, value, img) {
            const temp = `
                <section class="collum">
                <a class="link__decoration link__track hover__track link__one" href="#">
                    <div class="container ${value}">
                        <img class="img__tarck ${value}" src="${img}" alt="">
                        <div class="content__track ${value}">
                            <playlist class="name__track ${value}">${text}</playlist>
                        </div> 
                    </div> 
                </a>
                </section>
                `;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', temp);
        },

        // разметка для треков
        createTrack(name, name_ar, img, link) {
            const temp = `
                <section class="collum">
                <a class="link__decoration link__track hover__track link__one" target="_blank" href="${link}">
                    <div class="container">
                        <img class="img__tarck" src="${img}" alt="">
                        <div class="content__track">
                            <playlist class="name__track"><b>${name}</b> - ${name_ar}</playlist>
                        </div> 
                    </div> 
                </a>
                </section>
                `;
            document.querySelector(DOMElements.tracks).insertAdjacentHTML('beforeend', temp);
        },
        
        // удаление треков (при смне плейлиста)
        resetTracks() {
            this.clickAction().forResettracks.innerHTML = '';
        },

        // удаление плейлиста и, соответственно, треков (при смене жанра)
        resetPlaylist() {
            this.clickAction().forResetplaylist.innerHTML = '';
            this.resetTracks();
        },
    }
})();

// пременная для хранения токена
let cashToken = '';
const getCashToken = (token) => { cashToken = token }

const APP = (function(Interface, API) {
    // загрузка жанров
    const action = Interface.clickAction();
    const loadGenres = async () => {
        const token = await API.getToken();           
        getCashToken(token);
        const genres = await API.getGenres(token);
        genres.forEach(element => Interface.createGenre(element.name, element.id, element.icons[0].url));
    }

    // загрузка плейлистов после клика по жанру
    action.genre.addEventListener('click', async (e) => {
        let targetClick = e.target.classList[1];
        Interface.resetPlaylist();
        const token = cashToken;      
        const genreId = targetClick;             
        const playlist = await API.getPlaylistByGenre(token, genreId);
        playlist.forEach(playlist => Interface.createPlaylist(playlist.name, playlist.tracks.href, playlist.images[0].url));
        document.querySelector('.main__section').classList.add('two__collum');
    });
    
    // загрузка треков поле клика по плелисту
    action.track.addEventListener('click', async (e) => {
        Interface.resetTracks();
        const token = cashToken;        
        let targetClick = e.target.classList[1];
        const tracks = await API.getTracks(token, targetClick);
        tracks.forEach(element => Interface.createTrack(element.track.name, element.track.artists[0].name, element.track.album.images[0].url, element.track.external_urls.spotify)); 
    });

    return {
        start() {
            loadGenres();
        }
    }

})(Interface, API);
// "запускаем" приложение, загружая список жанров

const start = document.querySelector('.start');
start.addEventListener('click', () => {
    document.querySelector('.hello').classList.add('hello__hidden');
    APP.start();
})