import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./searchStyle.css";

const Favorites = () =>  {
    const [title, setTitle] = useState("Favorite")
    const [ids, setIds] = useState([])
    const [posters, setPosters] = useState([])
    const [taglines, setTaglines] = useState([])
    const [titles, setTitles] = useState([])
    const [length, setLength] = useState()
    const [test, setTest] = useState({})
    const [there, setThere] = useState(false)
    const [fav, setFav ] = useState()
    const items= [];
    const getRepo = async () =>{
        console.log("fetching")
        await fetch(`/favorites`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTest(data)
                setLength(data.length)
                setIds(data.ids)
                setPosters(data.posters)
                setTaglines(data.taglines)
                setTitles(data.titles)
                setThere(true)
            });        
    };
    useEffect(() => getRepo(), []);
    if (there === true){
        console.log(test)
        console.log(title, ids, titles, posters, taglines, length)
    }
    const Delete =(na) => {
        console.log(na)
        fetch(`/remove/${na}`);

    }

    for (let i = 0; i < length; i++) {
        items.push(
            <div class='item'>
                <p><h2>({i+1}) {titles[i] }</h2>
                <Link to={`/${ids[i]}`}><input type="submit" value="More info"/></Link>
                </p>
                <img src={String(posters[i])} />
                <p>{ taglines[i] }</p>
                    {console.log(ids[i])}
                    <button onClick={() => Delete(ids[i])}>Remove from Favorites</button>
            </div>
        )
    }
    console.log(fav)
     return (
        <>
        <h1>{title} Movies</h1>
        <div class='container'>
            {items}
        </div>
        </>
    )
}

export default Favorites;