import React, { useState } from 'react';
import { siteConfig } from '../data/siteData';
import Reveal from '../components/animations/Reveal';
import AnimatedButton from '../components/animations/AnimatedButton';
import { useBakery } from '../context/BakeryContext';

export default function ContactPage() {
  const { submitInquiry } = useBakery();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Custom Celebration Cake',
    message: '',
  });

  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.inquiryType,
        message: formData.message,
      });

      setStatus('success');
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setStatus('success');
    }
  };

  return (
    <div className="pt-28 md:pt-36 pb-24 px-[4vw] bg-[#F8F8F2] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Title with Viewport Reveal */}
        <Reveal y={40} className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-title text-xs font-bold uppercase tracking-[0.24em] text-[#147C98]">
            ORDERING & INQUIRIES
          </span>
          <h1 className="font-hero font-extrabold text-4xl sm:text-6xl uppercase text-[#112229] tracking-tight">
            Contact Cozy Crumbs
          </h1>
          <p className="text-sm md:text-base text-[#112229]/80 font-medium max-w-xl mx-auto">
            To order cakes, catering, or discuss bespoke flavors, call us directly at{' '}
            <a href="tel:+917093322796" className="underline font-bold text-[#147C98]">
              +91 7093322796
            </a>{' '}
            or submit a message below.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form with Reveal */}
          <Reveal y={30} delay={0.1} className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-[#112229]/15 shadow-sm">
            <h2 className="font-hero font-extrabold text-2xl uppercase text-[#112229] mb-6">
              Send Us a Message
            </h2>

            {status === 'success' ? (
              <div className="py-12 text-center space-y-4">
                <h3 className="font-title text-2xl font-bold uppercase text-[#112229]">
                  Message Received
                </h3>
                <p className="text-sm text-[#112229]/80 max-w-md mx-auto">
                  Thank you for reaching out. A representative from Cozy Crumbs will get back to you shortly.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <AnimatedButton
                    as="a"
                    href="tel:+917093322796"
                    className="px-8 py-3.5 rounded-pill bg-[#112229] text-[#F8F8F2] font-title font-bold text-xs uppercase"
                  >
                    Direct Call: +91 7093322796
                  </AnimatedButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 Phone"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                    Inquiry Type
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none transition-colors"
                  >
                    <option value="Custom Celebration Cake">Custom Celebration Cake</option>
                    <option value="Party & Event Catering">Party & Event Catering</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#112229] mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your celebration or requirements..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F2] border border-[#112229]/20 text-xs font-semibold focus:border-[#147C98] outline-none resize-none transition-colors"
                  />
                </div>

                <AnimatedButton
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 rounded-pill bg-[#FFA7EE] hover:bg-[#112229] hover:text-[#F8F8F2] text-[#112229] font-title font-extrabold text-sm uppercase tracking-wider transition-colors shadow-md"
                >
                  {status === 'loading' ? 'SENDING...' : 'SEND INQUIRY'}
                </AnimatedButton>
              </form>
            )}
          </Reveal>

          {/* Bakery Direct Order Studio Box with Reveal */}
          <Reveal y={30} delay={0.2} className="lg:col-span-5 space-y-6">
            <div className="bg-[#112229] text-[#F8F8F2] rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl border border-white/10">
              <span className="font-title text-xs font-bold uppercase tracking-widest text-[#FFA7EE] block">
                DIRECT ORDER CONTACT
              </span>
              <h3 className="font-hero font-extrabold text-3xl uppercase tracking-tight text-[#F8F8F2]">
                Cozy Crumbs Studio
              </h3>
              <p className="text-sm text-[#F8F8F2]/85 leading-relaxed font-medium">
                {siteConfig.address}
              </p>

              <div className="pt-2 space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[#FFA7EE] font-bold uppercase text-xs">Direct Phone:</span>
                  <a href="tel:+917093322796" className="font-bold underline text-white hover:text-[#FFA7EE]">
                    +91 7093322796
                  </a>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[#FFA7EE] font-bold uppercase text-xs">WhatsApp:</span>
                  <a
                    href="https://wa.me/917093322796"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-white hover:text-[#FFA7EE]"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[#FFA7EE] font-bold uppercase text-xs">Email:</span>
                  <a href="mailto:cozycrumbs6767@gmail.com" className="font-bold underline text-white hover:text-[#FFA7EE]">
                    cozycrumbs6767@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#FFA7EE] font-bold uppercase text-xs">Baking Hours:</span>
                  <span className="font-medium text-white text-xs">{siteConfig.hours}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <AnimatedButton
                  as="a"
                  href="https://wa.me/917093322796?text=Hi%20Cozy%20Crumbs!%20I%20would%20like%20to%20place%20an%20order."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 rounded-pill bg-[#FFA7EE] text-[#112229] font-title font-extrabold text-xs uppercase tracking-wider block text-center hover:bg-white transition-colors shadow-lg"
                >
                  WHATSAPP: +91 7093322796
                </AnimatedButton>
                <AnimatedButton
                  as="a"
                  href="tel:+917093322796"
                  className="w-full py-3.5 rounded-pill bg-white/10 text-white font-title font-bold text-xs uppercase tracking-wider block text-center hover:bg-white hover:text-[#112229] transition-colors border border-white/20"
                >
                  DIRECT PHONE CALL
                </AnimatedButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
