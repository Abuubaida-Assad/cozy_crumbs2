import React from 'react';
import HeroSection from '../components/HeroSection';
import BestsellersSection from '../components/BestsellersSection';
import ArchesDisplay from '../components/ArchesDisplay';
import CelebrateSection from '../components/CelebrateSection';
import CustomerReviews from '../components/CustomerReviews';

export default function HomePage() {
  return (
    <div className="relative bg-[#F8F8F2]">
      {/* 1. Hero Section from Photo 5 */}
      <HeroSection />

      {/* 2. Bestsellers Section from Photo 4 */}
      <BestsellersSection />

      {/* 3. The Best Things in Life are Sweet + Arched Gallery from Photo 1 */}
      <ArchesDisplay />

      {/* 4. Celebrate with Cake from Photo 3 */}
      <CelebrateSection />

      {/* 5. Customer Reviews with Indian Names */}
      <CustomerReviews title="Loved by Cake Lovers Across Hyderabad" />
    </div>
  );
}
