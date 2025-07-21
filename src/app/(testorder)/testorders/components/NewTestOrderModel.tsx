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
  const [gender, setGender] = useState('MALE');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = async () => {
    // 1. Tạo patient
    const patRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/testorder'}/api/patients`,
      {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          fullName, dateOfBirth, gender, address, phone, email
        })
      }
    );
    if (!patRes.ok) {
      alert('Failed to create patient');
      return;
    }
    const patient = await patRes.json();
    // 2. Tạo testorder
    const toRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/testorder'}/api/test-orders`,
      {
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          runBy: 'tech',             // hoặc lấy từ user hiện tại
          runAt: new Date().toISOString(),
          status: 'PENDING',
          patient: { id: patient.id }
        })
      }
    );
    if (!toRes.ok) {
      alert('Failed to create testorder');
      return;
    }
    onCreated();  // đóng modal và reload danh sách
  };

  return (
    
    // chỉ show phần body form để bạn so sánh
<div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
  <div className="
      relative bg-white rounded-lg border border-teal-500
      p-4 
      w-full sm:w-3/4 md:w-1/2 lg:w-1/3
    ">
    <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200">
      <X size={20} />
    </button>

    <h2 className="text-2xl font-bold mb-4 text-center">New Testorder</h2>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"> {/* chuyển sang 2 cột, giảm gap */}
      {/* Patient name */}
      <label className="block">
        <p className="text-sm font-medium mb-1">Patient name</p>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder="Nguyen Van A"
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
          className="w-full py-1.5 px-2 rounded-full bg-cyan-100 focus:outline-none text-sm"
        />
      </label>

      {/* Gender */}
      <label className="block">
        <p className="text-sm font-medium mb-1">Gender</p>
        <select
          value={gender}
          onChange={e => setGender(e.target.value as 'MALE'|'FEMALE')}
          className="w-full py-1.5 px-2 rounded-full bg-cyan-100 focus:outline-none text-sm"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </label>

      {/* Age */}
      <label className="block">
        <p className="text-sm font-medium mb-1">Age</p>
        <input
          type="number"
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="18"
          className="w-full py-1.5 px-2 rounded-full bg-gray-300 focus:outline-none text-sm"
        />
      </label>

      {/* Address */}
      <label className="block sm:col-span-2"> {/* span full width */}
        <p className="text-sm font-medium mb-1">Address</p>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Enter your address"
          className="w-full py-1.5 px-2 rounded-full bg-cyan-100 focus:outline-none text-sm"
        />
      </label>

      {/* Phone */}
      <label className="block sm:col-span-2">
        <p className="text-sm font-medium mb-1">Phone number</p>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="0772 812 432"
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
          placeholder="nva@gmail.com"
          className="w-full py-1.5 px-2 rounded-full bg-cyan-100 focus:outline-none text-sm"
        />
      </label>
    </div>

    {/* Save button */}
    <div className="flex justify-end mt-4">
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
      >
        Create &amp; Save
      </button>
    </div>
  </div>
</div>

  );
}
