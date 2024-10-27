import React, { useEffect, useState } from 'react'; 
import { Button, Col, Container, Grid, Panel, Row } from 'rsuite';
import TwitterIcon from '@rsuite/icons/legacy/Twitter';
import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

const REACT_APP_TWITTER_CLIENT_ID = process.env.REACT_APP_TWITTER_CLIENT_ID;
const TWITTER_STATE = process.env.REACT_APP_TWITTER_STATE;
const TWITTER_CODE_CHALLENGE = process.env.REACT_APP_TWITTER_CODE_CHALLENGE;
const TWITTER_SCOPE = process.env.REACT_APP_TWITTER_SCOPE.split(" ").join(" ");
// const TWITTER_AUTH_URL = process.env.REACT_APP_TWITTER_AUTH_URL;
// const CALLBACK_URL = process.env.REACT_APP_CALLBACK_URL;

//testing
// console.log('Client ID xxxxxxxxxxxxxxxxxx:', process.env.REACT_APP_TWITTER_CLIENT_ID);
// console.log('Twitter state xxxxxxxxxxxxxxxxxx:', process.env.REACT_APP_TWITTER_STATE);
// console.log('Twitter code challenge xxxxxxxxxxxxxxxxxx:', process.env.REACT_APP_TWITTER_AUTH_URL);

// Helper function to construct Twitter OAuth URL
const getTwitterOAuthUrl = (redirectUri) =>
  getURLWithQueryParams(process.env.REACT_APP_TWITTER_AUTH_URL, {
    response_type: "code",
    client_id: REACT_APP_TWITTER_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: TWITTER_SCOPE,
    state: TWITTER_STATE,
    code_challenge: TWITTER_CODE_CHALLENGE,
    code_challenge_method: "plain",
  });

const getURLWithQueryParams = (baseUrl, params) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `${baseUrl}?${query}`;
};

const SignIn = () => {
  const [accessToken, setAccessToken] = useState(null);
  // const navigate = useNavigate();
  
  // Function to redirect to Twitter OAuth
  const signInWithProvider = () => {
    const oauthUrl = getTwitterOAuthUrl(process.env.REACT_APP_CALLBACK_URL);
    window.location.href = oauthUrl;
  };

  const onXLogin = () => {
    signInWithProvider();
  };

  // Function to exchange the authorization code for an access token
  const exchangeCodeForToken = async (authorizationCode) => {
    try {
      const response = await fetch('https://twitter-2-o-server.onrender.com/api/twitter/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authorizationCode, code_verifier: TWITTER_CODE_CHALLENGE }),
      });

      const data = await response.json(); 

      if (data.access_token) {
        localStorage.setItem('twitter_access_token', data.access_token);
        setAccessToken(data.access_token);
        console.log('Access Token:', data.access_token);
        toast.success('Successfully logged in with Twitter!')
      } else {
        console.error('Error exchanging code for token:', data);
        toast.error('Error while logging in with Twitter')
      }
    } catch (error) {
      console.error('Failed to exchange authorization code:', error);
      toast.error('Failed to complete the login process')
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    const state = urlParams.get('state');

    if (authorizationCode && state === TWITTER_STATE) {
      exchangeCodeForToken(authorizationCode);
      // Reload the page after 8 seconds 
      // Such with that time user basic data get stored at profile context safely , fetching agin at sigin page avaided
      setTimeout(() => {
        console.log('Reloading page...');
        // eslint-disable-next-line no-self-assign
        window.location.href = window.location.href; 
      }, 9000);
    }
  }, []);

  return (
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
          <ToastContainer />
            <Panel>
              <div className="text-center mb-3">
                <h2>Welcome to MyTweet</h2>
                <p>Let's have fun with Personal Twitter</p>
              </div>

              <div className="mt-3">
                <Button
                  block
                  style={{ backgroundColor: '#1DA1F2', color: 'black', fontWeight: 'bold' }}
                  onClick={onXLogin}
                >
                  Sign In with Twitter
                </Button>
              </div>

              {accessToken && (
                <div className="text-center mt-3">
                  <p>You are logged in with Twitter Successfully Now!!</p>
                </div>
              )}

              <div className="text-center mt-3">
                <TwitterIcon style={{ fontSize: '2rem', color: '#1DA1F2' }} />
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default SignIn;