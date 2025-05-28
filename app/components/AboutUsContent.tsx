'use client';

import React from 'react';
import Image from 'next/image';
import CryptoQuoteSlider from './CryptoQuoteSlider';

const AboutUsContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">About Us</h1>
      
      <CryptoQuoteSlider />

      {/* Section for the supervisor */}
      <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
          <div className="relative w-80 h-80 rounded-full overflow-hidden mx-auto">
            <Image
              src="/supervisor.png"
              alt="Project Supervisor"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Project Supervisor</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Our dedicated project supervisor provides invaluable guidance and expertise throughout the development process. With years of experience in the field, they ensure our project maintains high standards and meets all academic requirements.
          </p>
        </div>
      </div>

      {/* Section for the app developer */}
      <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 order-1 md:order-none">
          <h2 className="text-2xl font-semibold mb-4">App Developer</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Our skilled app developer brings the project to life through innovative mobile application development. Specializing in creating user-friendly interfaces and robust backend systems, they ensure a seamless experience for our users.
          </p>
        </div>
        <div className="md:w-1/2 order-2 md:order-none">
          <div className="relative w-80 h-80 rounded-full overflow-hidden mx-auto">
            <Image
              src="/app_developer.png"
              alt="App Developer"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* Section for the AI/ML developer */}
      <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
          <div className="relative w-80 h-80 rounded-full overflow-hidden mx-auto">
            <Image
              src="/ai_ml_developer.png"
              alt="AI/ML Developer"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">AI/ML Developer</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Our AI/ML expert implements cutting-edge machine learning algorithms and artificial intelligence solutions. They work on developing intelligent features that enhance the user experience and provide valuable insights through data analysis.
          </p>
        </div>
      </div>

      {/* Section for the web developer */}
      <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 order-1 md:order-none">
          <h2 className="text-2xl font-semibold mb-4">Web Developer</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Our web developer creates responsive and dynamic web interfaces using modern technologies. They ensure our platform is accessible, performant, and provides an excellent user experience across all devices.
          </p>
        </div>
        <div className="md:w-1/2 order-2 md:order-none">
          <div className="relative w-80 h-80 rounded-full overflow-hidden mx-auto">
            <Image
              src="/web_developer.jpg"
              alt="Web Developer"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsContent; 