import useSWR from "swr";
import  BannerSection  from "@/components/user/home/BannerSection";
import  SubcategoriesSection  from "@/components/user/home/SubcategoriesSection";
import BrandList from "@/components/user/home/BrandList";
import ProductList from "@/components/user/product/ProductList";
export default function Home() {
  
  return (
    <div className=" mx-auto px-12 py-12 space-y-5">
        <BannerSection />
        <SubcategoriesSection />
        <BrandList />
        <ProductList />
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of the application.</p>
    </div>
  )
}