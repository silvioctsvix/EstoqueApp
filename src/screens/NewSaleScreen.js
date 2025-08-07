import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Searchbar, Chip, FAB, TextInput, Divider, List, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ProductService } from '../services/ProductService';
import { SalesService } from '../services/SalesService';
import { formatCurrency } from '../utils/theme';

export default function NewSaleScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const [observations, setObservations] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const allProducts = await ProductService.getAllProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = products.filter(product =>
        product.nome.toLowerCase().includes(query.toLowerCase()) ||
        product.codigo_barras.includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Se já existe no carrinho, aumenta a quantidade
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Adiciona novo item ao carrinho
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.preco_venda * item.quantity), 0);
  };

  const getCartItemTotal = (item) => {
    return item.preco_venda * item.quantity;
  };

  const handleFinishSale = async () => {
    if (cart.length === 0) {
      alert('Adicione produtos ao carrinho antes de finalizar a venda');
      return;
    }

    try {
      const saleData = {
        data_venda: new Date().toISOString(),
        valor_total: getCartTotal(),
        metodo_pagamento: paymentMethod,
        observacoes: observations,
        itens: cart.map(item => ({
          produto_id: item.id,
          quantidade: item.quantity,
          preco_unitario: item.preco_venda,
          subtotal: getCartItemTotal(item)
        }))
      };

      await SalesService.createSale(saleData);
      
      // Limpar carrinho e voltar para dashboard
      setCart([]);
      setPaymentMethod('dinheiro');
      setObservations('');
      navigation.navigate('Dashboard');
      
      alert('Venda finalizada com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      alert('Erro ao finalizar venda. Tente novamente.');
    }
  };

  const paymentMethods = [
    { key: 'dinheiro', label: 'Dinheiro', icon: 'cash' },
    { key: 'cartao_credito', label: 'Cartão Crédito', icon: 'credit-card' },
    { key: 'cartao_debito', label: 'Cartão Débito', icon: 'credit-card-outline' },
    { key: 'pix', label: 'PIX', icon: 'qrcode' },
  ];

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
        placeholder="Buscar produtos por nome ou código..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.content}>
        {/* Lista de Produtos */}
        <View style={styles.productsSection}>
          <Title style={styles.sectionTitle}>Produtos Disponíveis</Title>
          <ScrollView style={styles.productsList}>
            {filteredProducts.map((product) => (
              <Card key={product.id} style={styles.productCard}>
                <Card.Content>
                  <View style={styles.productInfo}>
                    <View style={styles.productDetails}>
                      <Title style={styles.productName}>{product.nome}</Title>
                      <Paragraph style={styles.productCode}>
                        Código: {product.codigo_barras}
                      </Paragraph>
                      <Paragraph style={styles.productCategory}>
                        {product.categoria_nome}
                      </Paragraph>
                      <Paragraph style={styles.productStock}>
                        Estoque: {product.estoque_atual} {product.unidade}
                      </Paragraph>
                    </View>
                    <View style={styles.productActions}>
                      <Title style={styles.productPrice}>
                        {formatCurrency(product.preco_venda)}
                      </Title>
                      <Button
                        mode="contained"
                        onPress={() => addToCart(product)}
                        disabled={product.estoque_atual <= 0}
                        style={styles.addButton}
                      >
                        Adicionar
                      </Button>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Carrinho de Compras */}
        <View style={styles.cartSection}>
          <Title style={styles.sectionTitle}>Carrinho de Compras</Title>
          
          {cart.length === 0 ? (
            <Card style={styles.emptyCart}>
              <Card.Content>
                <Paragraph>Carrinho vazio</Paragraph>
                <Paragraph>Adicione produtos para começar uma venda</Paragraph>
              </Card.Content>
            </Card>
          ) : (
            <>
              <ScrollView style={styles.cartList}>
                {cart.map((item) => (
                  <Card key={item.id} style={styles.cartItem}>
                    <Card.Content>
                      <View style={styles.cartItemHeader}>
                        <View style={styles.cartItemInfo}>
                          <Title style={styles.cartItemName}>{item.nome}</Title>
                          <Paragraph style={styles.cartItemPrice}>
                            {formatCurrency(item.preco_venda)} cada
                          </Paragraph>
                        </View>
                        <IconButton
                          icon="delete"
                          onPress={() => removeFromCart(item.id)}
                          style={styles.removeButton}
                        />
                      </View>
                      
                      <View style={styles.cartItemActions}>
                        <View style={styles.quantityControls}>
                          <IconButton
                            icon="minus"
                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          />
                          <Paragraph style={styles.quantityText}>
                            {item.quantity}
                          </Paragraph>
                          <IconButton
                            icon="plus"
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.estoque_atual}
                          />
                        </View>
                        <Title style={styles.cartItemTotal}>
                          {formatCurrency(getCartItemTotal(item))}
                        </Title>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </ScrollView>

              {/* Resumo da Venda */}
              <Card style={styles.summaryCard}>
                <Card.Content>
                  <Title>Resumo da Venda</Title>
                  <Divider style={styles.divider} />
                  
                  <View style={styles.summaryRow}>
                    <Paragraph>Total de Itens:</Paragraph>
                    <Paragraph>{cart.reduce((total, item) => total + item.quantity, 0)}</Paragraph>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Paragraph>Valor Total:</Paragraph>
                    <Title style={styles.totalValue}>
                      {formatCurrency(getCartTotal())}
                    </Title>
                  </View>

                  {/* Método de Pagamento */}
                  <Title style={styles.paymentTitle}>Forma de Pagamento</Title>
                  <View style={styles.paymentMethods}>
                    {paymentMethods.map((method) => (
                      <Chip
                        key={method.key}
                        mode={paymentMethod === method.key ? 'flat' : 'outlined'}
                        onPress={() => setPaymentMethod(method.key)}
                        style={styles.paymentChip}
                        icon={method.icon}
                      >
                        {method.label}
                      </Chip>
                    ))}
                  </View>

                  {/* Observações */}
                  <TextInput
                    label="Observações"
                    value={observations}
                    onChangeText={setObservations}
                    mode="outlined"
                    multiline
                    numberOfLines={2}
                    style={styles.observationsInput}
                  />

                  <Button
                    mode="contained"
                    onPress={handleFinishSale}
                    style={styles.finishButton}
                    icon="check"
                  >
                    Finalizar Venda
                  </Button>
                </Card.Content>
              </Card>
            </>
          )}
        </View>
      </View>
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
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  productsSection: {
    flex: 1,
    marginRight: 8,
  },
  cartSection: {
    flex: 1,
    marginLeft: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 16,
  },
  productsList: {
    flex: 1,
  },
  productCard: {
    marginBottom: 8,
    elevation: 2,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    marginBottom: 2,
  },
  productCode: {
    fontSize: 11,
    color: '#666',
  },
  productCategory: {
    fontSize: 11,
    color: '#2196F3',
  },
  productStock: {
    fontSize: 11,
    color: '#666',
  },
  productActions: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addButton: {
    height: 32,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    marginBottom: 8,
    elevation: 2,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    marginBottom: 2,
  },
  cartItemPrice: {
    fontSize: 11,
    color: '#666',
  },
  removeButton: {
    margin: 0,
  },
  cartItemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemTotal: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  emptyCart: {
    alignItems: 'center',
    padding: 32,
  },
  summaryCard: {
    marginTop: 16,
    elevation: 2,
  },
  divider: {
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  totalValue: {
    color: '#4caf50',
    fontSize: 18,
  },
  paymentTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  paymentChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  observationsInput: {
    marginBottom: 16,
  },
  finishButton: {
    marginTop: 8,
  },
});
