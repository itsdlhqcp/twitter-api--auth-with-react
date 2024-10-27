import React, { useEffect, useState } from 'react';
import { Button, Container, Drawer, Loader } from 'rsuite';
import { toast, ToastContainer } from 'react-toastify';
import { useProfile } from '../../context/profile.context';

const Dashboard = () => {
  const { profile } = useProfile(); 
  const [userData, setUserData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); // State to show loading while fetching data
  const [hasFetched, setHasFetched] = useState(false); // Track if data was fetched already checking to control take fetch control

  // Function to fetch user data from the backend using the username from profile
  const fetchTwitterData = async (profile) => {
    const token = localStorage.getItem('twitter_access_token'); 

    if (!token) {
      toast.error('No access token found!');
      return;
    }

    try {
      const response = await fetch('https://twitter-2-o-server.onrender.com/api/twitter/usermetrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: token,         
          username: profile,   
        }),
      });

      const data = await response.json();

      if (response.ok && data?.data) {
        setUserData(data.data); 
      } else {
        toast.error('Failed to fetch Twitter user data');
      }
    } catch (error) {
      console.error('Error fetching Twitter data:', error);
      toast.error('Error fetching Twitter user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the Twitter data once the profile and username are available
  useEffect(() => {
    if (profile.username && !hasFetched) {
      fetchTwitterData(profile.username); // Call the fetch function with the profile's username
      setHasFetched(true); // Mark that we've already fetched data for making state update to control it
    }
  }, [profile, hasFetched]); // Add hasFetched as a dependency

  const onXLogout = () => {
    localStorage.removeItem('twitter_access_token'); // Remove token from localStorage
    toast.error('You are Logged Out!');
    setIsLoading(false);
    // setUserData(null);      // (optional as at profile-side if no brearer token - get unauthenticated)
    setTimeout(() => {
      window.location.reload(true); // Reload the page after logout
    }, 500);
  };

  if (isLoading) {
    // Loading state, show loader
    return (
      <Container>
        <Loader center vertical size="md" content="Loading" speed="slow" />
      </Container>
    );
  }

  return (
    <>
      <ToastContainer />
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>
      <div>
      
      <div className='ml-2 mt-3'>
      {userData && (
        <h4>
          You are Signed as <span style={{ color: 'green', fontWeight: 'bold' }}>{userData.name}</span>
        </h4>
      )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '7px' }}>
      {userData && (
          <div 
            style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              border: '2px solid #ddd' 
            }}
          >
            <img 
              src={userData.profile_image_url}
              alt="Profile" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }} 
            />
          </div>
          )}
        </div>
        
      </div>
      
        <br/>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
            <div style={{ backgroundColor: 'lightgray', padding: '10px', borderRadius: '5px' }}>
              <strong className='text-gray-500'>
              {userData.description}
              </strong>
            </div>
          </div>

      <Drawer.Body>
        {userData && (
          <>
          <div>
            <h4 className='text-gray-500 mb-2'>Personal details</h4>
          </div>
          <div>
            <p><strong>Username:</strong>{userData.username}</p>
            <p><strong>Followers:</strong> {userData.public_metrics.followers_count}</p>
            <p><strong>Following:</strong> {userData.public_metrics.following_count}</p>
            <p><strong>Tweets:</strong> {userData.public_metrics.tweet_count}</p>
            <p><strong>Likes:</strong> {userData.public_metrics.like_count}</p>
            <p><strong>Account Created At:</strong>{new Date(userData.created_at).toLocaleString()}</p>
          </div>
          </>
        )}
        <Button
          onClick={onXLogout}
          block
          style={{ backgroundColor: 'red', color: 'white', marginTop: '15px' }}
        >
          Sign Out
        </Button>
      </Drawer.Body>
    </>
  );
};

export default Dashboard;
