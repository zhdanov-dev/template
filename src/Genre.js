import React from 'react';

const Genre = props => {    

    const genreClick = e => {
        props.changed(e.target.className);

    }    

    return (
        <section id={props.selectedValue} className="collum collum__hidden" onClick={genreClick}>
        <a className="link__decoration link__track hover__track link__one" href="#">
          <div className="">
            {props.options.map((item, idx) => 
            <div id="container" className={item.id}>
              <div id="content__track" key={idx + 1} className={item.id}>
              <img key={idx + 1} id="img__tarck" className={item.id} src={item.icons[0].url}/>
                <div id="name" className={item.id}>{item.name}</div></div>
            </div>)}
          </div> 
        </a>
        </section>
    );
}

export default Genre;