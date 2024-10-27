import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../context/profile.context';
import { Container, Loader } from 'rsuite';

const PublicRoute = ({ children }) => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    // Loading state, here we impl. the logic to load loader while data setting stages in our app
    return (
      <Container>
        <Loader center vertical size="md" content="Loading" speed="slow" />
      </Container>
    );
  }

  if (profile) {
    // Profile exists, redirect to home ( by using profile context method )
    console.log("Profile found. Redirecting to home...");
    return <Navigate to="/" />;
  }

  // No profile, allow access to public route (e.g., sign-in)
  return children;
};

export default PublicRoute;
