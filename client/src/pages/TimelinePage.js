import React, { useState, useEffect } from 'react';
import { List, Loader, Divider } from 'rsuite';
import axios from 'axios';

const TimelinePage = () => {
  const [timeline, setTimeline] = useState([]); // Stores tweets
  const [loading, setLoading] = useState(true); // For showing loader while fetching data
  const [error, setError] = useState(false); // Error state

  // Fetch data from the API
  const fetchTimelineData = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios.get('https://mocki.io/v1/2ab9c75a-8147-4210-9417-e20df461b8c9');
      const data = response.data;

      // If no data, we can show dummy data
      if (data.length === 0) {
        setTimeline([]);
      } else {
        setTimeline(data);
      }
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData(); // Fetch data on component mount
  }, []);

  // Two sets of dummy data to display when no timeline is available
  const dummyDataSet1 = [
    {
      id: 1,
      text: "Oops! Looks like we're out of tweets. Imagine this is something witty.",
    },
    {
      id: 2,
      text: 'No more tweets? Here’s a joke: Why did the JavaScript developer go broke? Because they didn’t know how to "callback" their bank!',
    },
  ];

  const dummyDataSet2 = [
    {
      id: 3,
      text: 'Fun fact: More coffee is consumed by programmers than any other profession!',
    },
    {
      id: 4,
      text: 'Did you hear about the mathematician who’s afraid of negative numbers? He will stop at nothing to avoid them!',
    },
    {
        id: 5,
        text: 'Here we go agian and how is it doing with new ideas',
      },
      {
        id: 6,
        text: 'What about nex gen technologies like Quantum computing and AI over robotics',
      },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h3>Home Timeline</h3>
      <List>
        {loading && <Loader content="Loading tweets..." />}
        {error && (
          <p style={{ color: 'red' }}>Failed to load timeline. Please try again later.</p>
        )}
        {timeline.length > 0 ? (
          timeline.map((tweet, index) => (
            <List.Item key={index} index={index}>
              <div>
                <p>{tweet.text}</p>
                <Divider />
              </div>
            </List.Item>
          ))
        ) : (
          !loading && (
            <>
              {dummyDataSet1.map((tweet) => (
                <List.Item key={tweet.id}>
                  <div>
                    <p>{tweet.text}</p>
                    <Divider />
                  </div>
                </List.Item>
              ))}
              {dummyDataSet2.map((tweet) => (
                <List.Item key={tweet.id}>
                  <div>
                    <p>{tweet.text}</p>
                    <Divider />
                  </div>
                </List.Item>
              ))}
            </>
          )
        )}
      </List>
    </div>
  );
};

export default TimelinePage;
