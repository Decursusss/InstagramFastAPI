import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import Post from './posts/Post'
import { Button, Modal, Input} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ImageUpload from './images/ImageUpload'


const BASE_URL='http://localhost:8020'

const theme = createTheme();

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`

  }
}

const useStyles = makeStyles(() => ({
  paper: {
    backgroundColor: 'white',
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
    padding: '16px 32px 24px'
  }
}));



function App() {

  const classes = useStyles();

  const[posts,setPostsState] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [authToken, setAuthToken] = useState(null)
  const [authTokenType, setAuthTokenType] = useState(null)
  const [userId, setUserId] = useState('')
  const [createPost, setCreatePost] = useState(false)

  useEffect(() => {
    const token = window.localStorage.getItem('authToken');
    const tokenType = window.localStorage.getItem('authTokenType');
    const savedUsername = window.localStorage.getItem('username');
    const savedUserId = window.localStorage.getItem('userId');

    if (token) setAuthToken(token);
    if (tokenType) setAuthTokenType(tokenType);
    if (savedUsername) setUsername(savedUsername);
    if (savedUserId) setUserId(savedUserId);
  }, []);


  useEffect(() => {
    if (authToken !== null) {
      window.localStorage.setItem('authToken', authToken);
    }

    if (authTokenType !== null) {
      window.localStorage.setItem('authTokenType', authTokenType);
    }

    if (username !== null && username !== '') {
      window.localStorage.setItem('username', username);
    }

    if (userId !== null && userId !== '') {
      window.localStorage.setItem('userId', userId);
    }
  }, [authToken, authTokenType, username, userId]);



  useEffect(() =>{
    fetch(BASE_URL + '/post/all')
    .then(response => {
      const json = response.json()
      if (response.ok){
        return json;
      }
      throw new Error(json?.detail || `Ошибка загрузки постов. Код ${response.status}`);
    })
    .then(data => {
      const result = data.sort((a, b) => {
        const t_a = a.timestamp.split(/[-T:]/);
        const t_b = b.timestamp.split(/[-T:]/);
        const d_a = new Date(Date.UTC(t_a[0], t_a[1]-1, t_a[2], t_a[3], t_a[4], t_a[5]))
        const d_b = new Date(Date.UTC(t_b[0], t_b[1]-1, t_b[2], t_b[3], t_b[4], t_b[5]))
        return d_b - d_a
      })

      return result
    })
    .then(data => {
      setPostsState(data)
    })
    .catch(error => {
      console.error('Ошибка входа:', error);
    })
  },[])

  const signIn = (event) => {
    event?.preventDefault();

    let formData = new FormData();
    formData.append('username', username)
    formData.append('password', password)

    const requestOptions = {
      method: 'POST',
      body: formData
    }

    fetch(BASE_URL + '/login', requestOptions)
    .then(response => {
      const json = response.json()
      if(response.ok) {
        return json
      }
      throw new Error(json?.detail || `Ошибка загрузки постов. Код ${response.status}`);
    })
    .then(data => {
      setAuthToken(data.access_token);
      setAuthTokenType(data.token_type);
      setUserId(data.user_id);
      setUsername(data.username);
    })
    .catch(error => {
      console.error('Ошибка входа:', error);
    })

    setOpenSignIn(false);
  }

  const signOut = (event) => {
    setAuthToken(null);
    setAuthTokenType(null);
    setUserId(null);
    setUsername('');
    setPassword('');

    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('authTokenType')
    window.localStorage.removeItem('username')
    window.localStorage.removeItem('userId')
  }

  const signUp = (event) => {
    event.preventDefault();

    let json_string = JSON.stringify({
      username: username,
      email: email,
      password: password
    })

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: json_string
    }

    fetch(BASE_URL + '/user/register', requestOptions)
    .then(response => {
      const json = response.json()
      if(response.ok){
        return json;
      }

      throw new Error(json?.detail || `Ошибка загрузки постов. Код ${response.status}`);
    })
    .then(data => {
      signIn();
    })
    .catch(error => {
      console.error('Ошибка входа:', error);
    })

    setOpenSignUp(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <div className='app'>
        <Modal 
          open={openSignIn} 
          onClose={() => setOpenSignIn(false)}
        >
            <div style={modalStyle} className={classes.paper}>
              <form className='app_signin'>
                <center>
                  <img className='app_headerImage'src="https://static.vecteezy.com/system/resources/previews/018/930/415/non_2x/instagram-logo-instagram-icon-transparent-free-png.png" alt="Instagram" />
                </center>
                <Input placeholder='username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input placeholder='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type='submit' onClick={signIn}>Login</Button>
              </form>
            </div>
        </Modal>
        <Modal 
          open={openSignUp} 
          onClose={() => setOpenSignUp(false)}
        >
            <div style={modalStyle} className={classes.paper}>
              <form className='app_signin'>
                <center>
                  <img className='app_headerImage'src="https://static.vecteezy.com/system/resources/previews/018/930/415/non_2x/instagram-logo-instagram-icon-transparent-free-png.png" alt="Instagram" />
                </center>
                <Input placeholder='username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input placeholder='email' type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type='submit' onClick={signUp}>Sign Up</Button>
              </form>
            </div>
        </Modal>

        <Modal
          open={createPost}
          onClose={() => setCreatePost(false)}
        >
            <div className='create_post'>
              <ImageUpload authToken={authToken} authTokenType={authTokenType} setPostsState={setPostsState}/>
            </div>
        </Modal>
        <div className='app_header'>
          <img className='app_headerImage'src="https://static.vecteezy.com/system/resources/previews/018/930/415/non_2x/instagram-logo-instagram-icon-transparent-free-png.png" alt="Instagram" />
          {authToken ? (
              <div>
                <Button onClick={() => setCreatePost(true)}>Create Post</Button>
                <Button onClick={() => signOut()}>Logout</Button>
              </div>
            ) : (
              <div>
                <Button onClick={() => setOpenSignIn(true)}>Login</Button>
                <Button onClick={() => setOpenSignUp(true)}>SignUp</Button>
              </div>
            )
          }
        </div>
        <div className='app_posts'>
          {
            posts.map(post => (
              <Post 
                key={post.id} post = {post} authTokenType={authTokenType} authToken={authToken} setPostsState={setPostsState}
              />
            ))
          }
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
