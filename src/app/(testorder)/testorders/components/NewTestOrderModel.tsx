'use client';

import { FC, useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function NewTestOrderModel({ onClose, onCreated }: Props) {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fhard.khoa.email/api/testorders';
     const [year, month, day] = dateOfBirth.split('-');
    const formattedDate = `${month}/${day}/${year}`;
    try {
      const response = await fetch(`${API_URL}/testorder/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName,
          dateOfBirth: formattedDate,
          gender,
          address,
          phoneNumber,
          email,
        }),
      });

      let data: any = null;
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (err) {
          console.warn('No JSON body in response');
        }
      }

      if (!response.ok) {
        const errMsg = data?.message || 'Failed to create testorder';
        alert(errMsg);
        return;
      }

      onCreated();
    } catch (error) {
      console.error('Error creating testorder:', error);
      alert('Network error, please try again');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg border border-teal-500 p-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">New Testorder</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Patient name */}
            <label className="block">
              <p className="text-sm font-medium mb-1">Patient name</p>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Nguyen Van A"
                required
                className="w-full py-1.5 px-2 rounded-full bg-cyan-100 focus:outline-none text-sm"
              />
            </label>

            {/* Date of birth */}
            <label className="block">
              <p className="text-sm font-medium mb-1">Date of birth</p>
              <input
                type="date"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                required
                className="w-full py-1.5 px-2 rounded-full bg-cyan-100 focus:outline-none text-sm"
              />
            </label>

            {/* Gender */}
            <label className="block">
              <p className="text-sm font-medium mb-1">Gender</p>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as 'MALE' | 'FEMALE')}
                required
                className="w-full py-1.5 px-2 rounded-full bg-cyan-100 focus:outline-none text-sm"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </label>

            {/* Address */}
            <label className="block sm:col-span-2">
              <p className="text-sm font-medium mb-1">Address</p>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter your address"
                required
                className="w-full py-1.5 px-2 rounded-full bg-cyan-100 focus:outline-none text-sm"
              />
            </label>

            {/* Phone number */}
            <label className="block sm:col-span-2">
              <p className="text-sm font-medium mb-1">Phone number</p>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="0908070622"
                required
                className="w-full py-1.5 px-2 rounded-full bg-cyan-100 focus:outline-none text-sm"
              />
            </label>

            {/* Email */}
            <label className="block sm:col-span-2">
              <p className="text-sm font-medium mb-1">Email</p>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nvb@gmail.com"
                required
                className="w-full py-1.5 px-2 rounded-full bg-cyan-100 focus:outline-none text-sm"
              />
            </label>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
            >
              Create &amp; Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
