// app/iam/users/[id]/page.tsx (Server Component)
import React from 'react';
import SingleUserDetailsClient from './SingleUserDetailsClient';

interface UserDetailsRouteParams {
  id: string;
}

interface UserDetailsProps {
  params: Promise<UserDetailsRouteParams>;
}

export default async function SingleUserDetailsPage({ params }: UserDetailsProps) {
  // This runs on the server and can await the Promise
  const resolvedParams = await params;
  
  // Validate params on server side
  if (!resolvedParams || !resolvedParams.id) {
    return <div className="text-center py-10 text-xl text-red-600">Error: Invalid route parameters.</div>;
  }
  
  const userId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(userId)) {
    return <div className="text-center py-10 text-xl text-red-600">Error: Invalid user ID.</div>;
  }

  // Pass the resolved userId to the client component
  return <SingleUserDetailsClient userId={userId} />;
}