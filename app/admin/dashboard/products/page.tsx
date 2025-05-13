import DashboardWrapper from "@/app/components/DashboardWrapper";
import { ProductList } from "@/app/components/ProductList";

const page = () => {
  return (
    <DashboardWrapper>
      <ProductList />
    </DashboardWrapper>
  );
};

export default page;