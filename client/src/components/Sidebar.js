import React from 'react';
import DashboardToogle from './dashboard/DashboardToogle';
import { useProfile } from '../context/profile.context';
import TweetComponent from './TweetComponent';
import AddNewTweet from './AddNewTweet';

const Sidebar = () => {

  const { profile } = useProfile();
  return (
    <div className="h-100 pt-3">
      <div>
        <DashboardToogle />
        <AddNewTweet/>
      </div>
      <div className='mt-1'
        style={{
          backgroundColor: 'grey', 
          padding: '10px',
          textAlign: 'center',
          borderTop: '1px solid #ddd', 
          color: 'white', 
        }}
      >Let's Tweet-
        <strong>{profile.name}<br/>🕊🕊</strong>
      </div>
      <TweetComponent/>
    </div>
  );
};

export default Sidebar;

