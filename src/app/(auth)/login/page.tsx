// File: src/app/(auth)/login/page.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DoctorImage from '@/assets/images/MaleDoctor.png';
import GoogleIcon from '@/assets/icons/Google';
import apiIAM from '@/lib/api/apiIAM';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/iam/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const response2 = await fetch('http://localhost:8080/iam/auth/me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        });

        const roleData = await response2.json();
        if (response2.ok) {
          localStorage.setItem('userId', JSON.stringify(roleData.userId));
          localStorage.setItem('fullName', JSON.stringify(roleData.fullName));
          localStorage.setItem('email', JSON.stringify(roleData.email));
          localStorage.setItem('privilege_ids', JSON.stringify(roleData.privilege_ids));
        }

        router.push('/iam/users/profile');
      } else {
        setError(data.message || 'Invalid Username or Password!');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side */}
        <div className="flex flex-col justify-center items-center p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h2>
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Enter your user name"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400"
              required
            />
            <div className="flex justify-between text-sm text-gray-600">
              <label>
                <input type="checkbox" className="mr-1" /> Remember me
              </label>
              <a href="/forgotPassword" className="hover:underline">Forgot password?</a>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-full text-white font-semibold ${loading ? 'bg-blue-300' : 'bg-blue-800 hover:bg-blue-900'}`}
            >
              {loading ? 'Logging in...' : 'Sign in'}
            </button>
            <div className="flex items-center gap-2">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-500 text-sm">Or sign in with</span>
              <hr className="flex-1 border-gray-300" />
            </div>
            <button type="button" className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-full">
              <span className="text-lg"><GoogleIcon/></span> Sign in with Google
            </button>
          </form>
          <a href="/choose-role" className="text-sm text-gray-500 mt-4 hover:underline">Back to choose role</a>
        </div>

        {/* Right Side */}
        <div className="bg-gradient-to-br from-teal-500 to-blue-800 text-white flex flex-col items-center justify-center p-10">
          <h2 className="text-3xl font-bold mb-4">Hello user!</h2>
          <Image src={DoctorImage} alt="Doctor" width={300} height={300} className="mb-4" />
          <p className="text-center text-sm max-w-sm mb-6">
            Please register with your official credentials to use all site features. If you don't have an account, press the sign-up button below.
          </p>
          <a href="/register" className="bg-gradient-to-r from-sky-400 to-blue-700 px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
