"use client"
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import UserLayout from '@/components/user/UserLayout';
import UserGreeting from '@/components/user/UserGreeting';
import UserStats from '@/components/user/UserStats';
import UserQuickLinks from '@/components/user/UserQuickLinks';
import '@/public/assets/css/tailwind-cdn.css';

export default function Dashboard() {
  const user = {
    name: 'Ismail Abbasi',
    email: 'ismail@example.com',
  };

  const stats = [
    { title: 'Total Orders', value: '12' },
    { title: 'Total Spent', value: 'R$32000' },
    { title: 'Wishlist Items', value: '5' },
    { 
      title: 'Last Order', 
      value: 'Delivered', 
      subtext: 'April 8, 2025'
    },
  ];

  const quickLinks = [
    { title: 'Edit Profile', href: '/user/profile/edit' },
    { title: 'View Orders', href: '/user/orders' },
    { title: 'View Wishlist', href: '/user/wishlist' },
    { title: 'Manage Addresses', href: '/user/addresses' },
  ];

  return (
    <Layout headerStyle={3} footerStyle={1} >
      <UserLayout title={"My Account"}>
        <UserGreeting user={user} />
        <UserStats stats={stats} />
        <UserQuickLinks links={quickLinks} />
      </UserLayout>
    </Layout>
  );
}