import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../context/profile.context';
import { Container, Loader } from 'rsuite';

const PrivateRoute = ({ children }) => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    // Loading state, show loader logic impl. 
    return (
      <Container>
        <Loader center vertical size="md" content="Loading" speed="slow" />
      </Container>
    );
  }

  if (!profile && !isLoading) {
    // if no profile, redirect to sign-in
    console.log("Profile not found. Redirecting to sign-in...");
    return <Navigate to="/signin" />;
  }

  // Profile exists, allow access
  console.log("Profile found. Rendering private route.");
  return children;
};

export default PrivateRoute;
