
import React from 'react';
import { MOCK_SERVICE_CATEGORIES } from '../data/mockData';
import ServiceCard from '../components/ServiceCard';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center bg-white p-10 rounded-xl shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Your Gateway to Premier Services</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover everything you need in one place. From thrilling tours and reliable transport to cutting-edge tech solutions and dream properties, we connect you with the best.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_SERVICE_CATEGORIES.map(category => (
            <ServiceCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
