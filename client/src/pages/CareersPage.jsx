import React, { useState } from 'react';
import { careersData, siteConfig } from '../data/siteData';

export default function CareersPage() {
  const [appliedRole, setAppliedRole] = useState(null);
  const [applicant, setApplicant] = useState({ name: '', email: '', portfolio: '', note: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleApply = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="pt-28 md:pt-36 pb-24 px-[4vw] bg-[#FAF8F5] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-title text-xs font-bold uppercase tracking-[0.28em] text-[#147C98]">
            JOIN OUR TEAM
          </span>
          <h1 className="font-title text-4xl sm:text-6xl font-black uppercase text-[#112229] tracking-tight">
            Careers at Cozy Crumbs
          </h1>
          <p className="text-sm md:text-base text-[#112229]/75 max-w-xl mx-auto leading-relaxed">
            We are always seeking passionate sugar confectioners, sourdough fermenters, and warm hospitality associates who cherish real culinary craft.
          </p>
        </div>

        {/* Culture & Benefits Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#112229]/10 space-y-2">
            <span className="text-3xl">🌿</span>
            <h3 className="font-title text-lg font-bold uppercase text-[#112229]">Culinary Respect</h3>
            <p className="text-xs text-[#112229]/70 leading-relaxed">
              Real stone ovens, European butter, wild levains, and zero artificial premixes. True baking craftsmanship.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#112229]/10 space-y-2">
            <span className="text-3xl">📈</span>
            <h3 className="font-title text-lg font-bold uppercase text-[#112229]">Continuous Mentorship</h3>
            <p className="text-xs text-[#112229]/70 leading-relaxed">
              Masterclasses with veteran pastry chefs, sugar flower workshops, and specialty barista certifications.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#112229]/10 space-y-2">
            <span className="text-3xl">🥐</span>
            <h3 className="font-title text-lg font-bold uppercase text-[#112229]">Bakers' Perks</h3>
            <p className="text-xs text-[#112229]/70 leading-relaxed">
              Daily fresh bakery allowance, comprehensive health cover, balanced schedules, and milestone celebration bonuses.
            </p>
          </div>
        </div>

        {/* Open Positions List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-2xl font-black uppercase text-[#112229]">
              Open Positions ({careersData.length})
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider text-[#147C98]">
              Hyderabad Studio & Outlets
            </span>
          </div>

          <div className="space-y-4">
            {careersData.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#112229]/10 hover:border-[#147C98] transition-all duration-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#147C98]">
                    <span className="bg-[#FFDAED] px-3 py-1 rounded-pill font-title uppercase font-bold text-[#112229]">
                      {job.department}
                    </span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.experience}</span>
                  </div>

                  <h3 className="font-title text-xl sm:text-2xl font-black uppercase text-[#112229]">
                    {job.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#112229]/75 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedRole(job);
                      setIsSubmitted(false);
                    }}
                    className="px-8 py-3.5 rounded-pill bg-[#112229] hover:bg-[#147C98] text-white font-title text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Apply for Role →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Modal */}
        {appliedRole && (
          <div className="fixed inset-0 z-[35000] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-[#112229]/75 backdrop-blur-sm"
              onClick={() => setAppliedRole(null)}
            />
            <div className="relative z-[35001] w-full max-w-xl bg-[#FAF8F5] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
              <button
                type="button"
                onClick={() => setAppliedRole(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white border border-[#112229]/15 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>

              <div>
                <span className="font-title text-xs font-bold uppercase tracking-widest text-[#147C98]">
                  APPLICATION FORM
                </span>
                <h3 className="font-title text-2xl font-black uppercase text-[#112229] mt-1">
                  {appliedRole.title}
                </h3>
                <p className="text-xs text-[#112229]/60">{appliedRole.location}</p>
              </div>

              {isSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-[#FFDAED] text-[#147C98] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-title text-xl font-bold uppercase text-[#112229]">
                    Application Submitted!
                  </h4>
                  <p className="text-xs text-[#112229]/70 max-w-sm mx-auto">
                    Thank you, {applicant.name}. Our Head of People will review your details and connect with you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAppliedRole(null)}
                    className="mt-4 px-6 py-2.5 rounded-pill bg-[#112229] text-white text-xs font-title font-bold uppercase"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#112229] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={applicant.name}
                      onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                      placeholder="Chef Aarav Patel"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#112229]/15 text-xs font-medium focus:border-[#147C98] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#112229] mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={applicant.email}
                      onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                      placeholder="aarav@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#112229]/15 text-xs font-medium focus:border-[#147C98] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#112229] mb-1">Portfolio or LinkedIn URL</label>
                    <input
                      type="url"
                      value={applicant.portfolio}
                      onChange={(e) => setApplicant({ ...applicant, portfolio: e.target.value })}
                      placeholder="https://instagram.com/mybakes or LinkedIn"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#112229]/15 text-xs font-medium focus:border-[#147C98] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#112229] mb-1">Tell us about your baking experience</label>
                    <textarea
                      rows={3}
                      value={applicant.note}
                      onChange={(e) => setApplicant({ ...applicant, note: e.target.value })}
                      placeholder="Which doughs, laminations, or celebration cakes do you love crafting most?..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#112229]/15 text-xs font-medium focus:border-[#147C98] outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-pill bg-[#FFA7EE] hover:bg-[#112229] hover:text-white text-[#112229] font-title text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                  >
                    Submit Application →
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
