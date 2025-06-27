import Layout from '@/components/layout/Layout'
import UserLayout from '@/components/user/UserLayout'
import ProfilePage from '@/components/user/UserProfileComponent'
import ProfileSkeleton from '@/components/skeleton/UserProfileSkeleton'
const page = () => {
  
  return (
    <Layout>
      <UserLayout title="Profile">
        <ProfilePage/>
        {/* <ProfileSkeleton/> */}
      </UserLayout>
      </Layout>
  )
}

export default page