import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Comments = () => {
    const[commentInfo, setCommentInfo] = useState({})
    console.log(commentInfo)
    const items = []
    const MyComments = () => {
        fetch(`/reviewbbgurl`)
        .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setCommentInfo(data)
                });
    }
    useEffect(() => MyComments(), []);
    console.log(commentInfo)
    const DeleteComment = (e,b) => {
        console.log("Before \n",commentInfo)
        let temp3 = commentInfo
        if(b !== -1){
            console.log(items)
            temp3.movie_ids.splice(b,1)
            temp3.ratings.splice(b,1)
            temp3.texts.splice(b,1)
            items.splice(b,1)
            temp3.length = temp3.length -1
            setCommentInfo(temp3)
            console.log("After\n",commentInfo)
            console.log(items)
        }
        console.log("After\n",commentInfo)
        console.log(items)
        fetch(`/delete_comment/${e}`)
        
    }
    console.log("After\n",commentInfo)
    for(let i=0; i<commentInfo.length; i++){
        console.log(commentInfo.movies[commentInfo.movie_ids[i]][0])
        items.push(
            <>
            <p>({i+1}). {commentInfo.movies[commentInfo.movie_ids[i]][0]}</p><button onClick={() => DeleteComment(commentInfo.review_ids[i],i)}>Delete Comment</button><br />
            <p>rating: {commentInfo.ratings[i]}</p>
            <p>review: {commentInfo.texts[i]}</p>
            <br /><br />
            </>
        )
    }
  return (
    <div>Reviews 
        {items}
    </div>
  )
}

export default Comments