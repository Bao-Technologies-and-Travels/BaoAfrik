import React, { useEffect } from 'react';
import userIcon from '../assets/images/admin/user.svg';
import settingIcon from '../assets/images/admin/setting.svg';
import perfomanceIcon from '../assets/images/admin/perfomance.svg';

const CookiePolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <article
          className="bg-white rounded-2xl overflow-hidden animate-fade-in-up border border-gray-100"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #E55325 0%, #F9A825 100%)' }} />
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            <header className="mb-8">
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: '#212121' }}
              >
                Cookie Policy
              </h1>
              <div className="mt-3 h-1 w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #E55325 0%, #F9A825 100%)' }} aria-hidden />
            </header>

            <div style={{ fontFamily: "'Poppins', sans-serif", color: '#6A6A6A' }} className="space-y-6 text-base leading-relaxed">
              <p>
                BaoAfrik uses cookies and similar technologies to ensure the platform functions correctly and to improve user experience.
              </p>

              <div className="rounded-xl py-4 pl-6 pr-5 sm:pl-7 sm:pr-6 border border-gray-100 bg-[#fefaf5] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gray-300" />
                <h2 className="text-base font-semibold text-[#212121] mb-3 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Cookies may be used to:
                </h2>
                <ul className="list-none space-y-3 pl-0" style={{ color: '#6A6A6A' }}>
                  <li className="flex items-start gap-3">
                    <img src={userIcon} alt="" className="mt-0.5 shrink-0 w-5 h-5 opacity-80" aria-hidden />
                    <span>Maintain secure user sessions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <img src={settingIcon} alt="" className="mt-0.5 shrink-0 w-5 h-5 opacity-80" aria-hidden />
                    <span>Remember user preferences</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <img src={perfomanceIcon} alt="" className="mt-0.5 shrink-0 w-5 h-5 opacity-80" aria-hidden />
                    <span>Analyse platform performance</span>
                  </li>
                </ul>
              </div>

              <p>
                You can manage or disable cookies through your browser settings. Some features of the platform may not function properly without cookies enabled.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default CookiePolicy;
