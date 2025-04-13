
import DashboardWrapper from "@/app/components/DashboardWrapper";
import { ProductList } from "@/app/components/ProductList";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const page = () => {
  return (
    <DashboardWrapper>
      {/* Header */}
      <div className="flex flex-row gap-3 justify-between item-center mb-3">
        <h1 className="text-3xl">Products</h1>
        <div className="flex flex-row gap-3 ">
          <Link href={"/admin/dashboard/products/add"}>
            <Button variant={"default"}>Add</Button>
          </Link>
        </div>
      </div>

      <div>
        <ProductList />
      </div>
    </DashboardWrapper>
  );
};

export default page;
