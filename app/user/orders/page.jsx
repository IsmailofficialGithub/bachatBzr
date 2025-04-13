import Layout from '@/components/layout/Layout'
import UserLayout from '@/components/user/UserLayout'
import UserOrderComponent from '@/components/user/UserOrderComponent'

const page = () => {
  return (
    <Layout headerStyle={3} footerStyle={1}>
      <UserLayout title="User User Order">
        <UserOrderComponent/>
      </UserLayout>
    </Layout>
  )
}

export default page