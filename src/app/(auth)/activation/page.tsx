'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const VerifyPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState('Activating your account...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const flow = params.get('flow');

    if (flow === 'activation' && email) {
      fetch(`https://fhard.khoa.email/api/iam/auth/login/activation/${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          setMessage(data.message || 'Activation complete!');
          setTimeout(() => {
            router.push('/login'); // Redirect to login after 3s
          }, 3000);
        })
        .catch(() => {
          setMessage('Activation failed. Please try again later.');
        });
    } else {
      setMessage('Invalid activation link.');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Account Activation</h1>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default VerifyPage;
