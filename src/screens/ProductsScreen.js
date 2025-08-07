import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Searchbar, Chip, FAB, IconButton, Menu, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ProductService } from '../services/ProductService';
import { formatCurrency } from '../utils/theme';

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const allProducts = await ProductService.getAllProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      
      // Extrair categorias únicas
      const uniqueCategories = [...new Set(allProducts.map(p => p.categoria_nome))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterProducts(query, selectedCategory);
  };

  const handleCategoryFilter = (category) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    filterProducts(searchQuery, newCategory);
  };

  const filterProducts = (query, category) => {
    let filtered = products;

    // Filtro por busca
    if (query) {
      filtered = filtered.filter(product =>
        product.nome.toLowerCase().includes(query.toLowerCase()) ||
        product.codigo_barras.includes(query)
      );
    }

    // Filtro por categoria
    if (category) {
      filtered = filtered.filter(product => product.categoria_nome === category);
    }

    setFilteredProducts(filtered);
  };

  const getStockStatus = (stock) => {
    if (stock <= 5) return { color: '#f44336', text: 'Crítico' };
    if (stock <= 15) return { color: '#ff9800', text: 'Baixo' };
    return { color: '#4caf50', text: 'OK' };
  };

  const toggleMenu = (productId) => {
    setMenuVisible(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleEditProduct = (product) => {
    // Implementar edição de produto
    console.log('Editar produto:', product);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await ProductService.deleteProduct(productId);
      loadProducts(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  const handleStockMovement = (product) => {
    // Implementar movimentação de estoque
    console.log('Movimentar estoque:', product);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Card>
          <Card.Content>
            <Title>Carregando produtos...</Title>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de Busca */}
      <Searchbar
        placeholder="Buscar produtos..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* Filtros de Categoria */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
        <Chip
          mode={selectedCategory === null ? 'flat' : 'outlined'}
          onPress={() => handleCategoryFilter(null)}
          style={styles.categoryChip}
        >
          Todas
        </Chip>
        {categories.map((category, index) => (
          <Chip
            key={index}
            mode={selectedCategory === category ? 'flat' : 'outlined'}
            onPress={() => handleCategoryFilter(category)}
            style={styles.categoryChip}
          >
            {category}
          </Chip>
        ))}
      </ScrollView>

      {/* Lista de Produtos */}
      <ScrollView style={styles.productsList}>
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.estoque_atual);
          
          return (
            <Card key={product.id} style={styles.productCard}>
              <Card.Content>
                <View style={styles.productHeader}>
                  <View style={styles.productInfo}>
                    <Title style={styles.productName}>{product.nome}</Title>
                    <Paragraph style={styles.productCode}>
                      Código: {product.codigo_barras}
                    </Paragraph>
                    <Paragraph style={styles.productCategory}>
                      {product.categoria_nome}
                    </Paragraph>
                  </View>
                  
                  <Menu
                    visible={menuVisible[product.id] || false}
                    onDismiss={() => toggleMenu(product.id)}
                    anchor={
                      <IconButton
                        icon="dots-vertical"
                        onPress={() => toggleMenu(product.id)}
                      />
                    }
                  >
                    <Menu.Item
                      onPress={() => {
                        handleEditProduct(product);
                        toggleMenu(product.id);
                      }}
                      title="Editar"
                      leadingIcon="pencil"
                    />
                    <Menu.Item
                      onPress={() => {
                        handleStockMovement(product);
                        toggleMenu(product.id);
                      }}
                      title="Movimentar Estoque"
                      leadingIcon="package-variant"
                    />
                    <Divider />
                    <Menu.Item
                      onPress={() => {
                        handleDeleteProduct(product.id);
                        toggleMenu(product.id);
                      }}
                      title="Excluir"
                      leadingIcon="delete"
                      titleStyle={{ color: '#f44336' }}
                    />
                  </Menu>
                </View>

                <View style={styles.productDetails}>
                  <View style={styles.priceContainer}>
                    <Paragraph style={styles.priceLabel}>Preço de Venda:</Paragraph>
                    <Title style={styles.priceValue}>
                      {formatCurrency(product.preco_venda)}
                    </Title>
                  </View>

                  <View style={styles.stockContainer}>
                    <Paragraph style={styles.stockLabel}>Estoque:</Paragraph>
                    <View style={styles.stockInfo}>
                      <Title style={[styles.stockValue, { color: stockStatus.color }]}>
                        {product.estoque_atual} {product.unidade}
                      </Title>
                      <Chip 
                        mode="outlined" 
                        compact 
                        style={[styles.stockChip, { borderColor: stockStatus.color }]}
                        textStyle={{ color: stockStatus.color }}
                      >
                        {stockStatus.text}
                      </Chip>
                    </View>
                  </View>
                </View>

                {product.descricao && (
                  <Paragraph style={styles.productDescription}>
                    {product.descricao}
                  </Paragraph>
                )}
              </Card.Content>
            </Card>
          );
        })}

        {filteredProducts.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title>Nenhum produto encontrado</Title>
              <Paragraph>
                {searchQuery || selectedCategory 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Adicione seu primeiro produto'
                }
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* FAB para Adicionar Produto */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          // Implementar adição de produto
          console.log('Adicionar novo produto');
        }}
        label="Novo Produto"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  productsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  productCard: {
    marginBottom: 12,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    marginBottom: 4,
  },
  productCode: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  priceValue: {
    fontSize: 18,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  stockContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  stockLabel: {
    fontSize: 12,
    color: '#666',
  },
  stockInfo: {
    alignItems: 'flex-end',
  },
  stockValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stockChip: {
    height: 20,
  },
  productDescription: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyCard: {
    marginTop: 32,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
