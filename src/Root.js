import React, { useState, useEffect, useRef } from 'react';
import GenreAndPlaylist from './GenreAndPlaylist';
import Traks from './Traks';
import { ClientId, ClientSecret } from './Client';
import axios from 'axios';

import { ThemeContext, themes } from './ThemeContext'
import Toggle from './Toggle'

const Root = () => {
  const [collum, setCollum] = useState('');
  const collumRef = useRef(collum);
  collumRef.current = collum;

  const [flag, setFlag] = useState(false);
  const [fTheme, setFTheme] = useState(true);
  const [token, setToken] = useState('');  
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []});
  const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []});

  const error = (error) => {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
    }
    if (error.request) {
      console.log(error.request);
    }
  }

  useEffect(() => {
    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(ClientId + ':' + ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .catch(error)
    .then(tokenResponse => {      
      setToken(tokenResponse.data.access_token);
      axios('https://api.spotify.com/v1/browse/categories?locale=sv_RU', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .catch(error)
      .then (genreResponse => {        
        setGenres({
          selectedGenre: genres.selectedGenre,
          listOfGenresFromAPI: genreResponse.data.categories.items,
        })
      });
    });
  }, [genres.selectedGenre, ClientId, ClientSecret]); 

  const GenreChanged = (val) => {
    setTimeout(() => {
      setCollum(() => 'two__collum');
    });
    setGenres({
      selectedGenre: val, 
      listOfGenresFromAPI: genres.listOfGenresFromAPI
    });

    axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    })
    .catch(error)
    .then(playlistResponse => {
      setPlaylist({
        selectedPlaylist: playlist.selectedPlaylist,
        listOfPlaylistFromAPI: playlistResponse.data.playlists.items
      })
    });
  }

  const buttonClicked = val => {
    setTimeout(() => {
      setCollum(() => 'three__collum');
    });
    setPlaylist({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
    });

    axios(`https://api.spotify.com/v1/playlists/${val}/tracks?limit=10`, {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .catch(error)
    .then(tracksResponse => {
      setTracks({
        selectedTrack: tracks.selectedTrack,
        listOfTracksFromAPI: tracksResponse.data.items
      })
    });
  }

  const isActive = () => {
    if (collumRef.current === 'two__collum') return 'main__section ' + collum;
    else if (collumRef.current === 'three__collum') return 'main__section ' + collum;
    else return 'main__section';
  }

  const hello = () => {
    if (flag) return 'hello__hidden';
    else return 'hello';
  }

  const collums = () => {
    if (flag) return 'collum';
    else return 'collum collum__hidden';
  }

  const handleClick = () => {
    setFlag(true);
  }

  const buttonOne = () => {
    if (fTheme) return 'material-symbols-outlined btn-toggle button bedtime';
    else return 'material-symbols-outlined btn-toggle button bedtime hidden';
  }

  const buttonTwo = () => {
    if (fTheme) return 'material-symbols-outlined btn-toggle button bedtime hidden';
    else return 'material-symbols-outlined btn-toggle button bedtime';
  }

  return (
    <div className='app'>
        <div className="main__container">
          <div className={isActive()}>
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
                      butOne={buttonOne()}
                      butTwo={buttonTwo()}
                      onChange={() => {
                        if (theme === themes.light) { setTheme(themes.dark); setFTheme(false); }    
                        if (theme === themes.dark) { setTheme(themes.light); setFTheme(true); }
                      }}
                      value={theme === themes.dark} 
                    />
                  )}
                </ThemeContext.Consumer>
                </div>
                <div className="main__account hover__link">Аккаунт</div>
              </div>
            </header>
            <div className={hello()}>
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
		          <GenreAndPlaylist label="Genre" collums={collums()} items={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} onClick={GenreChanged} />
		          <GenreAndPlaylist label="Playlist" collums={collums()} items={playlist.listOfPlaylistFromAPI} selectedValue={playlist.selectedPlaylist} onClick={buttonClicked}  />
		          <Traks collums={collums()} items={tracks.listOfTracksFromAPI} />                          
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