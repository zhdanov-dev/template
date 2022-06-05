import React, { useState, useEffect } from 'react';
import Playlist from './Playlist';
import Genre from './Genre';
import Traks from './Traks';
import { Client } from './Client';
import axios from 'axios';

import { ThemeContext, themes } from './ThemeContext'
import Toggle from './Toggle'

const Root = () => {
  
  const spotify = Client();  

  const [token, setToken] = useState('');  
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []});
  const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []});


  useEffect(() => {

    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      setToken(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/browse/categories?locale=sv_RU', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => {        
        setGenres({
          selectedGenre: genres.selectedGenre,
          listOfGenresFromAPI: genreResponse.data.categories.items,
        })
      });
      
    });

  }, [genres.selectedGenre, spotify.ClientId, spotify.ClientSecret]); 

  const genreChanged = val => {
    let col = document.querySelector(".main__section");
    col.classList.add("two__collum");
    setGenres({
      selectedGenre: val, 
      listOfGenresFromAPI: genres.listOfGenresFromAPI
    });

    axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    })
    .then(playlistResponse => {
      setPlaylist({
        selectedPlaylist: playlist.selectedPlaylist,
        listOfPlaylistFromAPI: playlistResponse.data.playlists.items
      })
    });


  }

  const playlistChanged = val => {
    let col = document.querySelector(".main__section");
    col.classList.add("three__collum");
    setPlaylist({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
    });
  }

  const buttonClicked = e => {
    e.preventDefault();

    axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`, {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .then(tracksResponse => {
      setTracks({
        selectedTrack: tracks.selectedTrack,
        listOfTracksFromAPI: tracksResponse.data.items
      })
    });
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
          <div onClick={buttonClicked} className="main__section">
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
		          <Genre label="Genre :"  options={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} changed={genreChanged} />
		          <Playlist label="Playlist :" options={playlist.listOfPlaylistFromAPI} selectedValue={playlist.selectedPlaylist} changed={playlistChanged}  />
		          <Traks items={tracks.listOfTracksFromAPI}  />                          
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