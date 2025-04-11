import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { useCart } from '../../contexts/CartContext';
import { productService, categoryService } from '../../services/productService';
import { Product } from '../../types';
import styles from './Products.module.scss';
import toast from 'react-hot-toast';

const Products: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Armazena todos os produtos
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart } = useCart();

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories([{ id: '', name: 'Todos' }, ...data]);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar categorias');
      }
    };
    loadCategories();
  }, []);

  // Carregar produtos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        let data;
        if (selectedCategory && selectedCategory !== 'Todos') {
          data = await productService.getByCategory(selectedCategory);
        } else {
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

  // Filtrar produtos baseado na pesquisa
  const filteredProducts = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTermLower) ||
      product.description.toLowerCase().includes(searchTermLower) ||
      product.category.name.toLowerCase().includes(searchTermLower)
    );
  }, [allProducts, searchTerm]);

  const handleAddToCart = (product: Product) => {
    try {
      addToCart(product);
      toast.success('Produto adicionado ao carrinho!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar ao carrinho');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
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
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={20} />
                  {product.stock > 0 ? 'Adicionar ao carrinho' : 'Produto indisponível'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;