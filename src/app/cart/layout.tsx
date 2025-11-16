// app/layout.tsx
import {Header} from "@/components/user/Header";
import {Footer } from "@/components/user/Footer";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
  <>  
    <Header />        
    {children}
    <Footer />
  </>
        
   
  );
}
