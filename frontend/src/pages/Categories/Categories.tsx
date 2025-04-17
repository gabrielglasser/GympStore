import React from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../types';
import { AlertCircle } from 'lucide-react';

const Categories: React.FC = () => {
  const { categories, isLoading, error } = useCategories();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Erro ao carregar categorias</h2>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Categorias</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore nossa seleção de produtos por categoria e encontre exatamente o que você precisa
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories?.map((category: Category) => (
              <Link
                key={category.id}
                to={`/produtos?categoria=${category.slug}`}
                className="group relative h-64 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/90 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                  <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;