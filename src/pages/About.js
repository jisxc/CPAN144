import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', formData);
  };

  return (
    <>
      <div className="w-[1280px] h-[800px] bg-white flex-col justify-start items-start inline-flex">
        <Header />
        <div className="self-stretch h-[800px] bg-white flex-col justify-start items-start flex">
          <div className="self-stretch h-[800px] px-40 py-5 flex-col justify-start items-start flex">
            <div className="self-stretch p-4 flex-col justify-start items-start inline-flex gap-6">
              <div className="w-72 flex-col justify-start items-start inline-flex">
                <div className="text-[#111616] text-[32px] font-bold font-['Plus Jakarta Sans'] leading-10">
                  About CPAN144 Weather App
                </div>
              </div>
              <div className="self-stretch text-[#111616] text-base font-normal font-['Plus Jakarta Sans'] leading-normal">
                The CPAN144 Weather App provides accurate and timely weather forecasts to help you plan your day. With features like radar maps and severe weather alerts, our app ensures that you stay informed about the weather conditions.
              </div>
              <div className="self-stretch h-10 flex-col justify-start items-start flex">
                <div className="text-[#111616] text-[22px] font-bold font-['Plus Jakarta Sans'] leading-7">
                  Contact Us
                </div>
              </div>
              <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-3 border border-[#dbe2e5] rounded-lg"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-3 border border-[#dbe2e5] rounded-lg"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="p-3 border border-[#dbe2e5] rounded-lg"
                  rows="4"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#33b2e5] text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
