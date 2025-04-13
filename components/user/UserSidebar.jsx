"use client"
import { usePathname } from 'next/navigation';
import { signOut } from '@/features/auth/authSlice';
import { useDispatch } from 'react-redux';

export default function UserSidebar({ isOpen }) {
  const pathname = usePathname();
  const dispatch = useDispatch(); 

  // Function to handle logout action
  const handleLogout = async () => {
    try {
      await dispatch(signOut());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
 
  // Apply conditional classes based on sidebar visibility for mobile and medium screens
  const sidebarClasses = ` p-6 border-r border-gray-200 h-full ${
    isOpen ? 'block' : 'hidden lg:block'
  }`;

  const links = [
    { title: 'Dashboard', path: '/user/dashboard' },
    { title: 'Profile', path: '/user/profile' },
    { title: 'Orders', path: '/user/orders' },
  ];

  return (
    <div className={sidebarClasses}>
      <h1 className="text-3xl font-bold text-gray-700 mb-8">Account</h1>
      <nav className="space-y-4">
        {links.map((link, index) => {
          const isActive = pathname === link.path;
          return (
            <a 
              key={index}
              href={link.path} 
              className={`block py-2 px-3 rounded-md ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 font-medium border-l-4 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              {link.title}
            </a>
          );
        })}
      </nav>
      <div className="mt-auto pt-20">
        <button onClick={handleLogout} className="text-red-500 hover:text-red-800 underline block font-bold" variant='destructive'>Logout</button>
      </div>
    </div>
  );
}