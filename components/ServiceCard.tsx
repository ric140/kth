
import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceCategory, ServiceCategoryType } from '../types';

interface ServiceCardProps {
  category: ServiceCategory;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ category }) => {
  const Icon = category.icon;

  const cardContent = (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="bg-primary text-secondary p-6 flex justify-center items-center">
        <Icon className="h-16 w-16" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
        <p className="text-gray-600 flex-grow">{category.description}</p>
      </div>
      <div className="p-6 bg-gray-50 mt-auto">
        <div className="text-primary hover:text-primary-dark font-semibold flex items-center justify-end">
          <span>Explore More</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );

  if (category.type === ServiceCategoryType.EXTERNAL) {
    return (
      <a href={category.externalUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    );
  }

  return (
    <Link to={`/services/${category.id}`} className="block h-full">
      {cardContent}
    </Link>
  );
};

export default React.memo(ServiceCard);
