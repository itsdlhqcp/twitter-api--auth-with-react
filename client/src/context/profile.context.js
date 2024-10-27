import React, { createContext, useContext, useEffect, useState } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticationToken = localStorage.getItem('twitter_access_token'); 

    // Only if it's a valid token function to trigger useeffect hook implemented
    if (authenticationToken) {
      const fetchProfile = async () => {
        try {
          const response = await fetch('https://twitter-2-o-server.onrender.com/api/twitter/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ access_token: authenticationToken }),
          });

          const data = await response.json();
          if (response.ok && data?.data?.id) {
            // Assuming the profile data object contains username, name, and id
            const profileData = {
              username: data.data.username,
              name: data.data.name,
              id: data.data.id,
            };
            setProfile(profileData);
            console.log('Profile info:', profileData); 
          } else {
            console.error('Failed to fetch profile:', data);
            setProfile(null);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    } else {
      setIsLoading(false); 
    }
  }, []); 

  return (
    <ProfileContext.Provider value={{ isLoading, profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);




























// testing with dummy data


// import React, { createContext, useContext, useEffect, useState } from 'react';


// const ProfileContext = createContext();

// export const ProfileProvider = ({ children }) => {
//   const [profile, setProfile] = useState(null); // Start with null, not `true`
//   const [isLoading, setIsLoading] = useState(true);
  

//   useEffect(() => {
//     const authenticationToken = localStorage.getItem('twitter_access_token'); // Fetch token from localStorage

//     if ( !profile && authenticationToken) {
//       // Simulate an API call and dummy profile data
//       const fetchProfile = async () => {
//         setIsLoading(true);
//         console.log("Fetching profile..."); // Debug log 

//         // Simulating a delay for fetching data
//         await new Promise(resolve => setTimeout(resolve, 5000)); // 1 second delay

//         // Dummy profile data, as if it came from an API
//         const data = {
//           username: 'PDilhaque65564',
//           name: 'Test User',
//           id: '1234567890',
//         };

//         // Simulating a successful profile fetch
//         setProfile(data);
//         setIsLoading(false);
//         console.log('Profile fetched:', data); // Debugging log
//       };

//       fetchProfile();
//     } else {
//       setProfile(null);
//       setIsLoading(false);
//       console.log("No authentication token found. Profile is null.");
//     }
//   }, [profile]); // Empty dependency array to run only on initial render

//   return (
//     <ProfileContext.Provider value={{ isLoading, profile }}>
//       {children}
//     </ProfileContext.Provider>
//   );
// };

// export const useProfile = () => useContext(ProfileContext);