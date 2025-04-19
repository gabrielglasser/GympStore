import React, { useEffect, useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { Product } from '../../types';
import { Button } from '../../components/ui/Button/Button';
import { Search, Filter } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { ProductModal } from '../../components/ui/ProductModal/ProductModal';

const Products: React.FC = () => {
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Inicializa o estado com o parâmetro da URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get('categoria');
    if (categoryFromUrl) {
      const category = categories.find(cat => cat.slug === categoryFromUrl);
      if (category) {
        setSelectedCategory(category.id);
      }
    }
  }, [searchParams, categories]);

  useEffect(() => {
    setFilteredProducts(() => {
      let result = [...products];
      
      if (searchTerm) {
        result = result.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedCategory) {
        result = result.filter(product => product.categoryId === selectedCategory);
      }
      
      return result;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setSearchParams({ categoria: category.slug });
    } else {
      setSearchParams({});
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success('Produto adicionado ao carrinho!');
  };

  // Função auxiliar para obter a URL da imagem
  const getImageUrl = (product: Product) => {
    return product.image || 'https://res.cloudinary.com/dpenlfh9l/image/upload/v1/gymp/no-image-placeholder.jpg';
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          {/* Filtros */}
          <aside className={`md:w-64 ${isFilterOpen ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Categorias</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    !selectedCategory ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  Todas
                </button>
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1">
            <div className="relative flex-1 mb-6">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center p-2 bg-white border border-gray-300 rounded-lg text-gray-700"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative w-full pt-[100%]"> 
                      <img
                        src={getImageUrl(product)}
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-contain p-4 bg-white"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://res.cloudinary.com/dpenlfh9l/image/upload/v1/gymp/no-image-placeholder.jpg';
                        }}
                      />
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold">Indisponível</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="px-4 py-2"
                          disabled={product.stock === 0}
                        >
                          {product.stock > 0 ? 'Adicionar' : 'Indisponível'}
                        </Button>
                      </div>
                      {product.flavor && (
                        <div className="mt-2 text-sm text-gray-500">
                          Sabor: {product.flavor}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={async () => {
            await handleAddToCart(selectedProduct);
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
};

export default Products;