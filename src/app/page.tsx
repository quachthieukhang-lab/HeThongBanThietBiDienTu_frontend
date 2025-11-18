import useSWR from "swr";
import  BannerSection  from "@/components/user/home/BannerSection";
import  SubcategoriesSection  from "@/components/user/home/SubcategoriesSection";
import BrandList from "@/components/user/home/BrandList";
import ProductList from "@/components/user/product/ProductList";
import WishlistSection from "@/components/user/home/WishListSection";
import { Footer } from "@/components/user/Footer";
import { Header } from "@/components/user/Header";
export default function Home() {
  
  return (
    <>
    <Header />
<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e0f2fe,_#ffffff)] mx-auto px-12 py-12 space-y-5">
    {/* <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white mx-auto px-12 py-12 space-y-5"> */}
        <BannerSection />
        <SubcategoriesSection />
        <BrandList />
        <WishlistSection />
        <ProductList />
    </div>
    <Footer />
    </>
    
  )
}