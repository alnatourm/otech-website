import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-otech-dark-950 text-slate-100 selection:bg-otech-cyan-400 selection:text-otech-dark-950">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <About />
        <LeadForm />
      </main>
      <Footer />
    </div>
  );
}
