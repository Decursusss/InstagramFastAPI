import React, {useState, useEffect} from 'react';
import { Button, Modal, Input} from '@mui/material';
import './ImageUpload.css';

const BASE_URL='http://localhost:8020'

function ImageUpload({authToken, authTokenType, setPostsState}) {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)

    const handleChange = (event) => {
        if (event.target.files[0]) {
            setImage(event.target.files[0])
        }
    }

    const handleUpload = (event) => {
        event?.preventDefault();

        const formData = new FormData();
        formData.append('file', image)

        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': authTokenType + ' ' + authToken
            }),
            body: formData
        }

        fetch(BASE_URL + '/post/image', requestOptions)
        .then(response => {
            const json = response.json()
            if(response.ok){
                return json
            }

            throw response
        })
        .then(data => {
            const image_url = data.filename;
            createPost({image_url});
        })
        .catch(error => {
            console.error('Error apeared', error)
        })
        .finally(() => {
            setCaption('');
            setImage(null);
            document.getElementById('fileInput').value = null;
        })
    }

    const createPost = ({image_url}) => {
        const json_string = JSON.stringify({
            'image_url': image_url,
            'image_url_type': 'relative',
            'content': caption,
            'user_id': window.localStorage.getItem('userId')
        })

        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': authTokenType + ' ' + authToken,
                'Content-Type': 'application/json',
            }),
            body: json_string
        }

        fetch(BASE_URL + '/post', requestOptions)
        .then(response => {
            const json = response.json()
            if(response.ok){
                return json
            }

            throw response
        })
        .then(data => {
            setPostsState(prevPosts => [data, ...prevPosts]);
        })
        .catch(error => {
            console.error('Some error apeared ', error)
        })
    }

    return (
        <div className='imageupload'>
            <input className='post_caption' type='text' placeholder='Enter a caption' onChange={(event)=> setCaption(event.target.value)} value={caption}>
            </input>
            <input type='file' id='fileInput' onChange={handleChange}></input>
            <Button className='imageupload_button' onClick={handleUpload} variant="contained" 
                    color="inherit" 
                    size='small' 
                    sx={{
                        padding: '5px 10px',
                        fontSize: '14px',
                        marginTop: '10px',
                    }}
            >Upload</Button>
        </div>
    )
}

export default ImageUpload;