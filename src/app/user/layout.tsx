// app/layout.tsx
import {Header} from "@/components/user/Header";
import {Footer } from "@/components/user/Footer";
import ChatWidget from "@/components/user/ChatWidget";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
  <>  
    <Header />        
    {children}
    <ChatWidget />
    <Footer />
  </>
        
   
  );
}
