// import NavClient from "@/components/client/Navigasi";
import Navbar from "@/components/client/Navigasi";
import Footer from "@/components/client/Footer";
import ChatButton from "@/components/ChatButton";

const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatButton />
    </div>
  );
};

export default LayoutClient;
