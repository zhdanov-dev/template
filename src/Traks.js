import React from 'react';

const Tracks = props => {

    return (
        <section className={props.collums}>
            <div>
                {
                    props.items.map((item, idx) => 
                    <div key={idx} className="container" title={item.id} >
                        <a href={item.track.external_urls.spotify} target="_blank"
                        className="content__track"
                        title={item.track.id}>
                            <img className="img__tarck" src={item.track.album.images[0].url}/>
                            <div className="name" title={item.id} >{item.track.name}</div>
                        </a>
                    </div>)
                }
            </div>
        </section>
        

    );
}

export default Tracks;