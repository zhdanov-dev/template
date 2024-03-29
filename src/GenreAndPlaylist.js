import React from 'react';

const GenreAndPlaylist = props => {    

    const genreClick = e => {
        props.onClick(e.target.title);
    }

    return (
        <section id={props.selectedValue} className={props.collums} onClick={genreClick}>
        <a className="link__decoration link__track hover__track link__one" href="#">
          <div>
            {props.items.map((item, idx) => 
            <div className="container" key={idx + 1} title={item.id}>
              <div className="content__track" title={item.id}>
                <img className="img__tarck" title={item.id} src={item.icons ? item.icons[0].url : item.images[0].url}/>
                <div className="name" title={item.id}>{item.name}</div>
              </div>
            </div>)}
          </div> 
        </a>
        </section>
    );
}

export default GenreAndPlaylist;