import React from 'react';

export default function UserQuickLinks({ links }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Links</h2>
      <div className="space-y-3">
        {links.map((link, index) => (
          <a 
            href={link.href} 
            key={index} 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <span className="mr-2">→</span>
            <span>{link.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}