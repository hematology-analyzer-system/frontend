// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await fetch("http://localhost:8080/iam/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();
//     if (res.ok && data.token) {
//       // localStorage.setItem("token", data.token);
//       router.push("/patients/1");
//     } else {
//       alert("Invalid credentials or unverified email.");
//     }
//   };

//   return (
//     <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto mt-10">
//       <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//       <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//       <button type="submit">Login</button>
//     </form>
//   );
// }

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function LoginPage() { // Changed component name and export
  const router = useRouter(); // Initialize useRouter

  // State to hold form data (email and password)
  const [form, setForm] = useState({ // Renamed formData to form
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError('');
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 

    setLoading(true);
    setError('');     

    try {
      // Make a POST request to your backend login endpoint
      const response = await fetch('http://localhost:8080/iam/auth/login', { // Updated URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials : 'include',
        body: JSON.stringify(form), 
      });

      const data = await response.json(); 

      if (response.ok && data.token) { 

        console.log(response);

        router.push("/patients/1");
        console.log('Login successful!');
      } else {
        setError(data.message || 'Invalid credentials or unverified email.'); // Updated error message
        console.error('Login failed:', data);
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Network error or unexpected issue:', err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="username"
              placeholder="your.email@example.com"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out text-gray-800"
            />
          </div>

          {/* Display error message */}
          {error && (
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-300 ease-in-out
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
