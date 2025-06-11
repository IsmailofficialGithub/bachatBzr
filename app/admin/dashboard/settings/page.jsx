"use client"
import DashboardWrapper from '@/app/components/DashboardWrapper'
import AccessForm from '../../../components/AccessForm'
import {AdminSettingsWrapper } from '@/app/components/AdminSettingWrapper'
import '@/public/assets/css/tailwind-cdn.css'

const Settings = () => {
  return (
    <DashboardWrapper>
      <AdminSettingsWrapper>
        <AccessForm />
      </AdminSettingsWrapper>
    </DashboardWrapper>
  )
}

export default Settings