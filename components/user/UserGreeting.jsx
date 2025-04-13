import React from 'react';

export default function UserGreeting({ user }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800">Hi, {user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}