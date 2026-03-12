"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Menu from "@/components/Menu";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import OrderModal from "@/components/OrderModal";
import ReserveModal from "@/components/ReserveModal";

export default function Home() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isReserveOpen, setIsReserveOpen] = useState(false);

  return (
    <>
      <Navbar onOrderClick={() => setIsOrderOpen(true)} />
      <main>
        <Hero
          onOrderClick={() => setIsOrderOpen(true)}
          onReserveClick={() => setIsReserveOpen(true)}
        />
        <About />
        <Menu />
        <Reviews />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
      />
      <ReserveModal
        isOpen={isReserveOpen}
        onClose={() => setIsReserveOpen(false)}
      />
    </>
  );
}
