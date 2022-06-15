import React, { useState, useEffect, useRef } from 'react';
import GenreAndPlaylist from './GenreAndPlaylist';
import Traks from './Traks';
import { ClientId, ClientSecret } from './Client';
import axios from 'axios';

import { ThemeContext, themes } from './ThemeContext'
import Toggle from './Toggle'

const Root = () => {
  
  const controller = new AbortController();

  const [collum, setCollum] = useState(0);
  const collumRef = useRef(collum);
  collumRef.current = collum;

  const [token, setToken] = useState('');  
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []});
  const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []});

  useEffect(() => {

    axios('https://accounts.spotify.com/api/token', {
      signal: controller.signal,
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(ClientId + ':' + ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      }
      if (error.request) {
        console.log(error.request);
      }
    })
    .then(tokenResponse => {      
      setToken(tokenResponse.data.access_token);
      axios('https://api.spotify.com/v1/browse/categories?locale=sv_RU', {
        signal: controller.signal,
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
        }
        if (error.request) {
          console.log(error.request);
        }
      })
      .then (genreResponse => {        
        setGenres({
          selectedGenre: genres.selectedGenre,
          listOfGenresFromAPI: genreResponse.data.categories.items,
        })
      });
      controller.abort();
    });
  }, [genres.selectedGenre, ClientId, ClientSecret]); 

  const GenreChanged = (val) => {
    setTimeout(() => {
      setCollum(() => 2);
      if (collumRef.current === 2) document.querySelector(".main__section").classList.add("two__collum");
    });
    setGenres({
      selectedGenre: val, 
      listOfGenresFromAPI: genres.listOfGenresFromAPI
    });

    axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
      signal: controller.signal,
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      }
      if (error.request) {
        console.log(error.request);
      }
    })
    .then(playlistResponse => {
      setPlaylist({
        selectedPlaylist: playlist.selectedPlaylist,
        listOfPlaylistFromAPI: playlistResponse.data.playlists.items
      })
    });
    controller.abort();
  }

  const buttonClicked = val => {
    setTimeout(() => {
      setCollum(() => 3);
      if (collumRef.current === 3) document.querySelector(".main__section").classList.add("three__collum");
    });
    setPlaylist({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
    });

    axios(`https://api.spotify.com/v1/playlists/${val}/tracks?limit=10`, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      }
      if (error.request) {
        console.log(error.request);
      }
    })
    .then(tracksResponse => {
      setTracks({
        selectedTrack: tracks.selectedTrack,
        listOfTracksFromAPI: tracksResponse.data.items
      })
    });
    controller.abort();
  }

  const handleClick = e => {
    let lets = document.querySelector(".hello");
    let col = document.querySelectorAll(".collum");
    lets.classList.add("hello__hidden");
    for (var i = 0; i < col.length; i++) {
      col[i].classList.toggle("collum__hidden");
    }
  }

  return (
    
    <div className='app'>
        <div className="main__container">
          <div className="main__section">
            <header className="main__header">
              <div className="main__logo">
                <a className="logo__link link__decoration" href="#">
                  <p className="text__logo">SpotifyStats</p>
                </a>          
              </div>
              <nav className="header__nav">
                <a className="header__link hover__link link__decoration" href="#">Треки</a>
                <a className="header__link hover__link link__decoration" href="#">Исполнители</a>
                <a className="header__link hover__link link__decoration" href="#">Жанры</a>
                <a className="header__link hover__link link__decoration" href="#">История</a>
              </nav>
              <div className="theme__acc">
                <div className="theme__icon">
                <ThemeContext.Consumer>
                  {({ theme, setTheme }) => (
                    <Toggle
                      onChange={() => {
                        if (theme === themes.light) setTheme(themes.dark);    
                        if (theme === themes.dark) setTheme(themes.light);
                        const btn = document.querySelectorAll(".button");
                        for (var i = 0; i < btn.length; i++) {
                          btn[i].classList.toggle("hidden");
                        }
                      }}
                      value={theme === themes.dark} 
                    />
                  )}
                </ThemeContext.Consumer>
                </div>
                <div className="main__account hover__link">Аккаунт</div>
              </div>
            </header>
            <div className="hello">
              <h1>
                Привет!<br />
              </h1>
              <h2>
                Функционал связаный с авторизацией сейчас недоступен.<br />
                Вы можете подобрать себе плейлист по жанру!<br />
                Для этого: выберете жанр, затем выберете плейлист и вуаля, у Вас есть список треков.
              </h2>
              <div onClick={handleClick} className="start">Let's Go!</div>
            </div>
		          <GenreAndPlaylist label="Genre" items={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} onClick={GenreChanged} />
		          <GenreAndPlaylist label="Playlist" items={playlist.listOfPlaylistFromAPI} selectedValue={playlist.selectedPlaylist} onClick={buttonClicked}  />
		          <Traks items={tracks.listOfTracksFromAPI} />                          
          </div>
        </div>
        <hr className="hr" />
        <footer className="footer">
          <div className="footer__content">© 2022 - SpotifyStats</div>
        </footer>
      </div>
  );
}

export default Root;