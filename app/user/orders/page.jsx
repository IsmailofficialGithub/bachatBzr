import Layout from '@/components/layout/Layout'
import UserLayout from '@/components/user/UserLayout'
import UserOrderComponent from '@/components/user/UserOrderComponent'

const page = () => {
  return (
      <UserLayout title="User User Order">
        <UserOrderComponent/>
      </UserLayout>
  )
}

export default page