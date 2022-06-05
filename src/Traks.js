import React from 'react';

const Tracks = props => {

    return (
        <section className="collum collum__hidden">
            <div>
                {
                    props.items.map((item, idx) => 
                    <div id="container" className={item.id} >
                        <a key={idx} href={item.track.external_urls.spotify} target="_blank"
                        
                        id="content__track"
                        className={item.track.id}>
                            <img id="img__tarck" src={item.track.album.images[0].url}/>
                            <div id="name" className={item.id} >{item.track.name}</div>
                    </a>
                    </div>)
                }
            </div>
        </section>
        

    );
}

export default Tracks;