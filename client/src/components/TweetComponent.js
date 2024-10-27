import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/profile.context';
import { toast, ToastContainer } from 'react-toastify';

const TweetComponent = () => {
  const { profile } = useProfile(); 
  const [tweets, setTweets] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 

  // Fetch tweets when the profile username is available like logic
  const fetchTweets = async (username) => {
    const token = localStorage.getItem('twitter_access_token'); 

    if (!token) {
      toast.error('No access token found!');
      return;
    }

    try {
      const response = await fetch('https://twitter-2-o-server.onrender.com/twitter/user/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: token, 
          username: username, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTweets(data); 
      } else {
        toast.error('Failed to fetch tweets');
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
      toast.error('Error fetching tweets');
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (profile && profile.username) {
      fetchTweets(profile.username); 
    }
  }, [profile]);

  return (
    <div>
        <ToastContainer/>
        <div className='mt-2 ml-2'>
        <h4>My Tweet Posts</h4>
        </div>
       <hr/>
      {isLoading ? (
        <p>Loading tweets...</p>
      ) : (
        <ul>
          {tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <li key={index}>
                <p>{tweet.full_text}</p>
                <small>{new Date(tweet.created_at).toLocaleString()}</small>
              </li>
            ))
          ) : (<>
          
          <p>No tweets available.</p>
             <br/>
            <hr/>
            <hr/>
            <br/>
            </>
             
          )}
        </ul>
      )}
    </div>
  );
};

export default TweetComponent;






