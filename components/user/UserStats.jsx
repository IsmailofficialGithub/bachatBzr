import Link from 'next/link';
import React from 'react';

export default function UserStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-md border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-2">{stat.title}</h3>
          <Link href="/user/orders"> <p className="text-2xl font-bold text-blue-700">{stat.value}</p></Link>
          {stat.subtext && <p className="text-gray-600 mt-1">{stat.subtext}</p>}
        </div>
      ))}
    </div>
  );
}
