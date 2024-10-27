const express = require('express');
// const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json());
// const REACT_APP_TWITTER_CLIENT_ID ='MmsxeUVOTGtwQ2pmT0FCc29RMVA6MTpjaQ'
const REACT_APP_TWITTER_CLIENT_ID = process.env.REACT_APP_TWITTER_CLIENT_ID;
const REACT_APP_TWITTER_CLIENT_SECRET= process.env.REACT_APP_TWITTER_CLIENT_SECRET

app.use(cors({ origin: "https://twitter-2-o-client.vercel.app", credentials: true }));
app.use(express.json());

// Twitter OAuth credentials
const CALLBACK_URL = 'https://twitter-2-o-client.vercel.app/signin'; // Registered callback URL

// Base64 encode client_id:client_secret for Basic Auth
const base64Credentials = Buffer.from(`${REACT_APP_TWITTER_CLIENT_ID}:${REACT_APP_TWITTER_CLIENT_SECRET}`).toString('base64');

// Endpoint to exchange authorization code for access token
app.post('/api/twitter/token', async (req, res) => {
  const { code, code_verifier } = req.body;

  const body = new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    client_id: REACT_APP_TWITTER_CLIENT_ID,
    redirect_uri: CALLBACK_URL,
    code_verifier,
  });

  try {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${base64Credentials}`,
      },
      body: body.toString(),
    });

    const data = await response.json();
    
    if (response.ok) {
      res.json(data); // Successfully obtained access token
    } else {
      console.error('Error exchanging token:', data);
      res.status(response.status).json(data); // Handle error response
    }
  } catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});

let cachedUserData = null;
let cachedTimestamp = null;
const CACHE_EXPIRATION_MS = 10 * 60 * 1000; // Cache for 5 minutes

app.post('/api/twitter/user', async (req, res) => {
  const { access_token } = req.body; // Get the access token from the request body

  // Check if we have cached data and if it hasn't expired
  if (cachedUserData && cachedTimestamp && Date.now() - cachedTimestamp < CACHE_EXPIRATION_MS) {
    return res.json(cachedUserData); // Serve cached data
  }

  try {
    const response = await fetch('https://api.twitter.com/2/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`, // Use the access token as Bearer token
      },
    });

    const data = await response.json();

    if (response.ok) {
      cachedUserData = data; // Cache the user data
      cachedTimestamp = Date.now(); // Store the timestamp of when the data was fetched
      return res.json(data); // Return the user data to the frontend
    } else {
      console.error('Error fetching Twitter user details:', data);
      return res.status(response.status).json(data); // Handle errors by sending them to the frontend
    }
  } catch (error) {
    console.error('Failed to fetch Twitter user details:', error);
    return res.status(500).json({ error: 'Failed to fetch Twitter user details' });
  }
});

app.post('/api/twitter/usermetrics', async (req, res) => {
  const { access_token, username } = req.body; // Extract access_token and username from the request

  if (!access_token || !username) {
    return res.status(400).json({ error: 'Access token and username are required.' });
  }

  try {
    // Make request to Twitter API with the provided username
    const twitterResponse = await fetch(`https://api.twitter.com/2/users/by/username/${username}?user.fields=created_at,description,profile_image_url,public_metrics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`, // Pass the access token in the Authorization header
      },
    });

    const data = await twitterResponse.json();

    if (twitterResponse.ok) {
      // You may also want to cache this data similarly if needed
      return res.json(data); // Return the user data to the frontend
    } else {
      console.error('Error fetching Twitter user details:', data);
      return res.status(twitterResponse.status).json(data); // Handle errors by sending them to the frontend
    }
  } catch (error) {
    console.error('Failed to fetch Twitter user details:', error);
    return res.status(500).json({ error: 'Failed to fetch Twitter user details' });
  }
});


app.post('/api/twitter/user/tweets', async (req, res) => {
  const { access_token, username } = req.body; // Extract access_token and username from the request

  if (!access_token || !username) {
    return res.status(400).json({ error: 'Access token and username are required.' });
  }

  try {
    // Make request to Twitter API with the provided username
    const twitterResponse = await fetch(`https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=10&tweet_mode=extended`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`, // Pass the access token in the Authorization header
      },
    });

    const data = await twitterResponse.json();

    if (twitterResponse.ok) {
      return res.json(data); // Return the tweets to the frontend
    } else {
      console.error('Error fetching tweets:', data);
      return res.status(twitterResponse.status).json(data); // Handle errors by sending them to the frontend
    }
  } catch (error) {
    console.error('Failed to fetch tweets:', error);
    return res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

// Endpoint to clear the cache on logout
app.post('/api/twitter/logout', (req, res) => {
  cachedUserData = null; // Clear cached user data
  cachedTimestamp = null; // Clear cached timestamp
  res.json({ message: 'Logged out and cache cleared.' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})