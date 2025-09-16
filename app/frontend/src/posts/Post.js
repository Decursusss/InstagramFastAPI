import React, {useState, useEffect} from "react";
import './Post.css';
import { Avatar, Button } from '@mui/material';

const BASE_URL='http://localhost:8020/'

function Post({key, post, authTokenType, authToken, setPostsState}) {
    const [imageUrl, setImageUrl] = useState('')
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')

    useEffect(() => {
        if (post.image_url_type === 'absolute') {
            setImageUrl(post.image_url)
        } else {
            setImageUrl(BASE_URL + post.image_url)
        }
    }, [])

    useEffect(() => {
        setComments(post.comments)
    }, [])

    const handleDeletePost = (event, id) => {
        event?.preventDefault();

        const requestOptions = {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': authTokenType + ' ' + authToken
            })
        }

        fetch(BASE_URL + `post/delete/${id}`, requestOptions)
        .then(response => {
            const json = response.json()

            if(response.ok){
                return json
            }

            throw json
        })
        .then(data => {
            console.log('deleted', data);
            setPostsState(prevPosts => prevPosts.filter(p => p.id !== id));
        })
        .catch(error => {
            console.error("Error apeared" + error)
        })
    }

    const postComment = (event) => {
        event?.preventDefault();

        const json_string = JSON.stringify({
            'username': window.localStorage.getItem('username'),
            'text': newComment,
            'post_id': post.id
        })

        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': authTokenType + ' ' + authToken,
                'Content-Type': 'application/json',
            }),
            body: json_string
        }

        fetch(BASE_URL + 'comment', requestOptions)
        .then(response => {
            const json = response.json()
            if(response.ok){
                return json
            }

            throw json
        })
        .then(data => {
            fetchComments()
            setNewComment('')
        })
        .catch(error => {
            console.error("Error apeared ", error)
        })
    }

    const fetchComments = () => {
        fetch(BASE_URL + `comment/all/${post.id}`)
        .then(response => {
            const json = response.json()
            if(response.ok){
                return json
            }

            throw json
        })
        .then(data => {
            setComments(data);
        })
        .catch(error => {
            console.error(error)
        })
    }

    return (
        <div className='post'>
            <div className="post_header">
                <Avatar alt="Uknown" src="" />
                <div className="post_headerInfo">
                    <h3>{post.user.username}</h3>
                    <Button 
                    className="post_delete" 
                    variant="contained" 
                    color="inherit" 
                    size='small' 
                    sx={{
                        borderRadius: '12px',
                        padding: '5px 10px',
                        fontSize: '12px'
                    }}
                    onClick={(e) => handleDeletePost(e, post.id)}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <img className='post_image' src={imageUrl}/>

            <h4 className='post_text'>{post.content}</h4>

            <div className='post_comments'>
                {
                    comments.map((comments) => (
                        <p>
                            <strong>{comments.username}:</strong> {comments.text}
                        </p>
                    ))
                }
            </div>
            {authToken && (
                <form className="post_commentbox">
                    <input 
                    className="post_input" 
                    type="text" 
                    placeholder="Add comment ..." 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} />
                    <button className="post_button" type="submit" disabled={!newComment} onClick={postComment}>Post</button>
                </form>
            )}
        </div>
    )
}

export default Post;