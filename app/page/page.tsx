import Image from "next/image";
import About from "../components/Landing Page/About";
import { Navbar } from "../components/Landing Page/Navbar";
import { Hero } from "../components/Landing Page/Hero";
import Features from "../components/Landing Page/Features";
import { News } from "../components/Landing Page/News";
import { Voting } from "../components/Landing Page/Voting";
import { Footer } from "../components/Footer/Footer";

export default async function Home() {

  return (
    <div className="items-center">
        <Hero />
        <About />
        <Features />
        <Voting />
        <News />
        <Footer />
    </div>
  );
}