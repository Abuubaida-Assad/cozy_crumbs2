import React from 'react';
import HeroSection from '../components/HeroSection';
import BestsellersSection from '../components/BestsellersSection';
import ArchesDisplay from '../components/ArchesDisplay';
import CelebrateSection from '../components/CelebrateSection';
import CustomerReviews from '../components/CustomerReviews';

export default function HomePage() {
  return (
    <div className="relative bg-[#F8F8F2]">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Bestsellers Section (Signature Bakes & Direct WhatsApp Order) */}
      <BestsellersSection />

      {/* 3. The Best Things in Life are Sweet + Arched Gallery */}
      <ArchesDisplay />

      {/* 4. Celebrate with Cake */}
      <CelebrateSection />

      {/* 5. Customer Reviews with Indian Names */}
      <CustomerReviews title="Loved by Cake Lovers Across Hyderabad" />
    </div>
  );
}
