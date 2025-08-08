'use client';

import { FC, useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function NewPatientModel({ onClose, onCreated }: Props) {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fhard.khoa.email/api';
    //  const [year, month, day] = dateOfBirth.split('-');
    // const formattedDate = `${year}-${day}-${month}`;
    try {
      const response = await fetch(`${API_URL}/patients/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName,
          address,
          gender,
          dateOfBirth,
          phone,
          email
        }),
      });

      // let data: any = null;
      // const contentType = response.headers.get('Content-Type');
      // if (contentType && contentType.includes('application/json')) {
      //   try {
      //     data = await response.json();
      //   } catch (err) {
      //     console.warn('No JSON body in response');
      //   }
      // }

      if (!response.ok) {
        const errMsg ='Failed to create patient';
        alert(errMsg);
        // window.location.reload();
        return;
      }

      onCreated();
    } catch (error) {
      console.error('Error creating patient:', error);
      alert('Network error, please try again');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl p-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">New Patient</h2>

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
                className="input w-full py-2 rounded-full text-sm"
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
                className="input w-full py-2 rounded-full focus:outline-none text-sm"
              />
            </label>

            {/* Gender */}
            <label className="block">
              <p className="text-sm font-medium mb-1">Gender</p>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as 'MALE' | 'FEMALE')}
                required
                className="input w-full py-2 rounded-full focus:outline-none text-sm"
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
                className="input w-full py-2 rounded-full focus:outline-none text-sm"
              />
            </label>

            {/* Phone number */}
            <label className="block sm:col-span-2">
              <p className="text-sm font-medium mb-1">Phone number</p>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0908070622"
                required
                className="input w-full py-2 rounded-full focus:outl text-sm"
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
                className="input w-full py-2 rounded-full focus:outline-none text-sm"
              />
            </label>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="button max-w-[200px] text-white rounded-full text-sm"
            >
              Create &amp; Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
