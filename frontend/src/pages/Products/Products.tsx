import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { useCart } from '../../contexts/CartContext';
import { productService, categoryService } from '../../services/productService';
import { Product } from '../../types';
import { ProductModal } from '../../components/ui/ProductModal/ProductModal';
import styles from './Products.module.scss';
import toast from 'react-hot-toast';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('categoria');

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  // Carregar categorias e definir categoria selecionada
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories([{ id: '', name: 'Todos', slug: '' }, ...data]);
        
        if (categorySlug) {
          const category = data.find((cat: { slug: string; }) => cat.slug === categorySlug);
          if (category) {
            setSelectedCategory(category.id);
          } else {
            setSelectedCategory('');
          }
        } else {
          setSelectedCategory('');
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar categorias');
      }
    };

    loadCategories();
  }, [categorySlug]);

  // Carregar produtos com base na categoria selecionada
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        let data;
        
        if (selectedCategory) {
          console.log('Buscando produtos da categoria:', selectedCategory);
          data = await productService.getByCategory(selectedCategory);
        } else {
          console.log('Buscando todos os produtos');
          data = await productService.getAll();
        }
        
        setAllProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        toast.error('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

  // Atualizar URL e categoria selecionada
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    setSelectedCategory(categoryId);
    
    if (category && category.slug) {
      setSearchParams({ categoria: category.slug });
    } else {
      setSearchParams({});
    }
  };

  // Filtrar produtos com base na pesquisa
  const filteredProducts = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTermLower) ||
      product.description.toLowerCase().includes(searchTermLower) ||
      product.category.name.toLowerCase().includes(searchTermLower)
    );
  }, [allProducts, searchTerm]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1); 
      toast.success('Produto adicionado ao carrinho!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar ao carrinho');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        Carregando produtos...
      </div>
    );
  }

  return (
    <div className={styles.products}>
      <div className="container mx-auto px-4">
        <div className={styles.header}>
          <h1>Nossos Produtos</h1>
        </div>

        <div className={styles.filters}>
          <div className={styles.search}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className={styles.categoryFilter}>
            {categories.map(category => (
              <button
                key={category.id}
                className={`${selectedCategory === category.id ? styles.active : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className={styles.productCard}
              onClick={() => handleProductClick(product)}
            >
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className={styles.image} 
              />
              <div className={styles.content}>
                <div className={styles.category}>{product.category.name}</div>
                <h3 className={styles.title}>{product.name}</h3>
                <div className={styles.price}>
                  R$ {product.price.toFixed(2)}
                </div>
                <Button 
                  className={styles.addToCart}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que o modal abra ao clicar no botão
                    handleAddToCart(product);
                  }}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={20} />
                  {product.stock > 0 ? 'Adicionar ao carrinho' : 'Produto indisponível'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={handleCloseModal}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
};

export default Products;