import Layout from '@/components/layout/Layout'
import UserLayout from '@/components/user/UserLayout'
import ProfilePage from '@/components/user/UserProfileComponent'
import ProfileSkeleton from '@/components/skeleton/UserProfileSkeleton'
const page = () => {
  
  return (
    <Layout headerStyle={3} footerStyle={1}>
      <UserLayout title="User Profile Page">
        <ProfilePage/>
        {/* <ProfileSkeleton/> */}
      </UserLayout>
    </Layout>
  )
}

export default page