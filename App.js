import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';

// Dados simulados para demonstração
const mockCompanies = [
  { id: 1, nome: 'Loja do João', cnpj: '12.345.678/0001-90', email: 'joao@loja.com', telefone: '(11) 99999-9999' },
  { id: 2, nome: 'Mercado Silva', cnpj: '98.765.432/0001-10', email: 'silva@mercado.com', telefone: '(11) 88888-8888' },
];

const mockEmployees = [
  { id: 1, empresa_id: 1, nome: 'João Silva', cargo: 'Vendedor', email: 'joao@loja.com', ativo: true },
  { id: 2, empresa_id: 1, nome: 'Maria Santos', cargo: 'Caixa', email: 'maria@loja.com', ativo: true },
  { id: 3, empresa_id: 2, nome: 'Pedro Costa', cargo: 'Gerente', email: 'pedro@mercado.com', ativo: true },
];

const mockProducts = [
  { id: 1, empresa_id: 1, nome: 'Camiseta básica', preco: 25.00, estoque: 50, categoria: 'Roupas', codigo_barras: '7891234567890' },
  { id: 2, empresa_id: 1, nome: 'Calça jeans', preco: 75.00, estoque: 30, categoria: 'Roupas', codigo_barras: '7891234567891' },
  { id: 3, empresa_id: 1, nome: 'Smartphone 128 GB', preco: 1200.00, estoque: 10, categoria: 'Eletrônicos', codigo_barras: '7891234567892' },
  { id: 4, empresa_id: 2, nome: 'Arroz tipo 1', preco: 18.00, estoque: 40, categoria: 'Alimentos', codigo_barras: '7891234567893' },
  { id: 5, empresa_id: 2, nome: 'Feijão carioca', preco: 9.00, estoque: 60, categoria: 'Alimentos', codigo_barras: '7891234567894' },
  { id: 6, empresa_id: 2, nome: 'Óleo de soja', preco: 7.00, estoque: 50, categoria: 'Alimentos', codigo_barras: '7891234567895' },
];

const mockSales = [
  { id: 1, empresa_id: 1, funcionario_id: 1, data: '2024-08-07', valor: 150.00, itens: 3, metodo_pagamento: 'Cartão' },
  { id: 2, empresa_id: 1, funcionario_id: 2, data: '2024-08-07', valor: 85.00, itens: 2, metodo_pagamento: 'Dinheiro' },
  { id: 3, empresa_id: 1, funcionario_id: 1, data: '2024-08-07', valor: 1200.00, itens: 1, metodo_pagamento: 'PIX' },
  { id: 4, empresa_id: 2, funcionario_id: 3, data: '2024-08-07', valor: 45.00, itens: 3, metodo_pagamento: 'Dinheiro' },
  { id: 5, empresa_id: 2, funcionario_id: 3, data: '2024-08-07', valor: 32.00, itens: 2, metodo_pagamento: 'Cartão' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentCompany, setCurrentCompany] = useState(null);
  const [companies] = useState(mockCompanies);
  const [employees] = useState(mockEmployees);
  const [products] = useState(mockProducts);
  const [sales] = useState(mockSales);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para formulários
  const [newCompany, setNewCompany] = useState({ nome: '', cnpj: '', email: '', telefone: '' });
  const [newEmployee, setNewEmployee] = useState({ nome: '', cargo: '', email: '' });
  const [newProduct, setNewProduct] = useState({ nome: '', preco: '', estoque: '', categoria: '', codigo_barras: '' });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    Alert.alert('Sucesso', `${product.nome} adicionado ao carrinho!`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.preco * item.quantity), 0);
  };

  const finishSale = () => {
    if (cart.length === 0) {
      Alert.alert('Erro', 'Adicione produtos ao carrinho antes de finalizar a venda');
      return;
    }
    Alert.alert('Sucesso', `Venda finalizada! Total: ${formatCurrency(getCartTotal())}`);
    setCart([]);
    setCurrentScreen('dashboard');
  };

  const companyProducts = products.filter(product => product.empresa_id === currentCompany?.id);
  const companyEmployees = employees.filter(emp => emp.empresa_id === currentCompany?.id);
  const companySales = sales.filter(sale => sale.empresa_id === currentCompany?.id);
  const lowStockProducts = companyProducts.filter(product => product.estoque <= 15);
  const filteredProducts = companyProducts.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigo_barras.includes(searchTerm)
  );

  const LoginScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>🏢 Sistema de Estoque SaaS</Text>
      <Text style={styles.subtitle}>Faça login com sua empresa</Text>
      
      <View style={styles.loginSection}>
        <Text style={styles.sectionTitle}>Empresas Cadastradas</Text>
        {companies.map(company => (
          <TouchableOpacity 
            key={company.id} 
            style={styles.companyCard}
            onPress={() => {
              setCurrentCompany(company);
              setCurrentScreen('dashboard');
            }}
          >
            <Text style={styles.companyName}>{company.nome}</Text>
            <Text style={styles.companyInfo}>CNPJ: {company.cnpj}</Text>
            <Text style={styles.companyInfo}>{company.email}</Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentScreen('register')}
        >
          <Text style={styles.actionButtonText}>Cadastrar Nova Empresa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const RegisterScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Cadastrar Nova Empresa</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome da Empresa"
        value={newCompany.nome}
        onChangeText={(text) => setNewCompany({...newCompany, nome: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="CNPJ"
        value={newCompany.cnpj}
        onChangeText={(text) => setNewCompany({...newCompany, cnpj: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={newCompany.email}
        onChangeText={(text) => setNewCompany({...newCompany, email: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={newCompany.telefone}
        onChangeText={(text) => setNewCompany({...newCompany, telefone: text})}
      />
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {
          Alert.alert('Sucesso', 'Empresa cadastrada com sucesso!');
          setNewCompany({ nome: '', cnpj: '', email: '', telefone: '' });
          setCurrentScreen('login');
        }}
      >
        <Text style={styles.actionButtonText}>Cadastrar Empresa</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => setCurrentScreen('login')}
      >
        <Text style={styles.secondaryButtonText}>Voltar ao Login</Text>
      </TouchableOpacity>
    </View>
  );

  const DashboardScreen = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Dashboard - {currentCompany.nome}</Text>
      
      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{companyProducts.length}</Text>
          <Text style={styles.statLabel}>Produtos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{companyEmployees.length}</Text>
          <Text style={styles.statLabel}>Funcionários</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{companySales.length}</Text>
          <Text style={styles.statLabel}>Vendas Hoje</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {formatCurrency(companySales.reduce((total, sale) => total + sale.valor, 0))}
          </Text>
          <Text style={styles.statLabel}>Receita Hoje</Text>
        </View>
      </View>

      {/* Alertas de Estoque */}
      {lowStockProducts.length > 0 && (
        <View style={styles.alertSection}>
          <Text style={styles.sectionTitle}>⚠️ Alertas de Estoque</Text>
          {lowStockProducts.map(product => (
            <View key={product.id} style={styles.alertItem}>
              <Text style={styles.alertText}>
                {product.nome} - Estoque: {product.estoque}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Ações Rápidas */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>⚡ Ações Rápidas</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentScreen('products')}
        >
          <Text style={styles.actionButtonText}>Gerenciar Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentScreen('employees')}
        >
          <Text style={styles.actionButtonText}>Gerenciar Funcionários</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentScreen('sales')}
        >
          <Text style={styles.actionButtonText}>Nova Venda</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setCurrentScreen('salesHistory')}
        >
          <Text style={styles.actionButtonText}>Histórico de Vendas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const ProductsScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Produtos - {currentCompany.nome}</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar produtos..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <ScrollView style={styles.productsList}>
        {filteredProducts.map(product => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.nome}</Text>
              <Text style={styles.productCategory}>{product.categoria}</Text>
              <Text style={styles.productCode}>Código: {product.codigo_barras}</Text>
              <Text style={styles.productStock}>
                Estoque: {product.estoque} unidades
              </Text>
            </View>
            <View style={styles.productActions}>
              <Text style={styles.productPrice}>
                {formatCurrency(product.preco)}
              </Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => addToCart(product)}
              >
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => setCurrentScreen('addProduct')}
      >
        <Text style={styles.actionButtonText}>Cadastrar Novo Produto</Text>
      </TouchableOpacity>
    </View>
  );

  const AddProductScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Cadastrar Produto</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={newProduct.nome}
        onChangeText={(text) => setNewProduct({...newProduct, nome: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        value={newProduct.preco}
        onChangeText={(text) => setNewProduct({...newProduct, preco: text})}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Estoque Inicial"
        value={newProduct.estoque}
        onChangeText={(text) => setNewProduct({...newProduct, estoque: text})}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={newProduct.categoria}
        onChangeText={(text) => setNewProduct({...newProduct, categoria: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Código de Barras"
        value={newProduct.codigo_barras}
        onChangeText={(text) => setNewProduct({...newProduct, codigo_barras: text})}
      />
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {
          Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
          setNewProduct({ nome: '', preco: '', estoque: '', categoria: '', codigo_barras: '' });
          setCurrentScreen('products');
        }}
      >
        <Text style={styles.actionButtonText}>Cadastrar Produto</Text>
      </TouchableOpacity>
    </View>
  );

  const EmployeesScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Funcionários - {currentCompany.nome}</Text>
      
      <ScrollView style={styles.employeesList}>
        {companyEmployees.map(employee => (
          <View key={employee.id} style={styles.employeeCard}>
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{employee.nome}</Text>
              <Text style={styles.employeeCargo}>{employee.cargo}</Text>
              <Text style={styles.employeeEmail}>{employee.email}</Text>
            </View>
            <View style={styles.employeeStatus}>
              <Text style={styles.statusText}>
                {employee.ativo ? '🟢 Ativo' : '🔴 Inativo'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => setCurrentScreen('addEmployee')}
      >
        <Text style={styles.actionButtonText}>Cadastrar Funcionário</Text>
      </TouchableOpacity>
    </View>
  );

  const AddEmployeeScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Cadastrar Funcionário</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome do Funcionário"
        value={newEmployee.nome}
        onChangeText={(text) => setNewEmployee({...newEmployee, nome: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo"
        value={newEmployee.cargo}
        onChangeText={(text) => setNewEmployee({...newEmployee, cargo: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={newEmployee.email}
        onChangeText={(text) => setNewEmployee({...newEmployee, email: text})}
      />
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {
          Alert.alert('Sucesso', 'Funcionário cadastrado com sucesso!');
          setNewEmployee({ nome: '', cargo: '', email: '' });
          setCurrentScreen('employees');
        }}
      >
        <Text style={styles.actionButtonText}>Cadastrar Funcionário</Text>
      </TouchableOpacity>
    </View>
  );

  const SalesScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Nova Venda - {currentCompany.nome}</Text>
      
      <View style={styles.salesContainer}>
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Produtos Disponíveis</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <ScrollView style={styles.productsList}>
            {filteredProducts.map(product => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productCard}
                onPress={() => addToCart(product)}
              >
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.nome}</Text>
                  <Text style={styles.productCategory}>{product.categoria}</Text>
                </View>
                <Text style={styles.productPrice}>
                  {formatCurrency(product.preco)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.cartSection}>
          <Text style={styles.sectionTitle}>Carrinho de Compras</Text>
          {cart.length === 0 ? (
            <Text style={styles.emptyCart}>Carrinho vazio</Text>
          ) : (
            <>
              <ScrollView style={styles.cartList}>
                {cart.map(item => (
                  <View key={item.id} style={styles.cartItem}>
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName}>{item.nome}</Text>
                      <Text style={styles.cartItemQuantity}>
                        Qtd: {item.quantity} x {formatCurrency(item.preco)}
                      </Text>
                    </View>
                    <View style={styles.cartItemActions}>
                      <Text style={styles.cartItemTotal}>
                        {formatCurrency(item.preco * item.quantity)}
                      </Text>
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removeFromCart(item.id)}
                      >
                        <Text style={styles.removeButtonText}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              
              <View style={styles.cartTotal}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(getCartTotal())}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.finishButton}
                onPress={finishSale}
              >
                <Text style={styles.finishButtonText}>Finalizar Venda</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );

  const SalesHistoryScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Histórico de Vendas - {currentCompany.nome}</Text>
      
      <ScrollView style={styles.salesHistoryList}>
        {companySales.map(sale => {
          const employee = employees.find(emp => emp.id === sale.funcionario_id);
          return (
            <View key={sale.id} style={styles.saleCard}>
              <View style={styles.saleHeader}>
                <Text style={styles.saleDate}>{formatDate(sale.data)}</Text>
                <Text style={styles.saleValue}>{formatCurrency(sale.valor)}</Text>
              </View>
              <Text style={styles.saleInfo}>Vendedor: {employee?.nome}</Text>
              <Text style={styles.saleInfo}>Itens: {sale.itens}</Text>
              <Text style={styles.saleInfo}>Pagamento: {sale.metodo_pagamento}</Text>
            </View>
          );
        })}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => setCurrentScreen('dashboard')}
      >
        <Text style={styles.secondaryButtonText}>Voltar ao Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  const Navigation = () => (
    <View style={styles.navigation}>
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'dashboard' && styles.activeNavButton]}
        onPress={() => setCurrentScreen('dashboard')}
      >
        <Text style={styles.navButtonText}>📊 Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'products' && styles.activeNavButton]}
        onPress={() => setCurrentScreen('products')}
      >
        <Text style={styles.navButtonText}>📦 Produtos</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'employees' && styles.activeNavButton]}
        onPress={() => setCurrentScreen('employees')}
      >
        <Text style={styles.navButtonText}>👥 Funcionários</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'sales' && styles.activeNavButton]}
        onPress={() => setCurrentScreen('sales')}
      >
        <Text style={styles.navButtonText}>🛒 Vendas</Text>
      </TouchableOpacity>
    </View>
  );

  if (currentScreen === 'login') return <LoginScreen />;
  if (currentScreen === 'register') return <RegisterScreen />;
  if (currentScreen === 'addProduct') return <AddProductScreen />;
  if (currentScreen === 'addEmployee') return <AddEmployeeScreen />;
  if (currentScreen === 'salesHistory') return <SalesHistoryScreen />;

  return (
    <View style={styles.app}>
      {currentScreen === 'dashboard' && <DashboardScreen />}
      {currentScreen === 'products' && <ProductsScreen />}
      {currentScreen === 'employees' && <EmployeesScreen />}
      {currentScreen === 'sales' && <SalesScreen />}
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  loginSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    elevation: 2,
  },
  companyCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyInfo: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    elevation: 1,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  alertSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  alertItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  alertText: {
    color: '#f44336',
  },
  actionsSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    marginVertical: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    elevation: 1,
  },
  productsList: {
    flex: 1,
  },
  productCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
  },
  productCode: {
    fontSize: 10,
    color: '#999',
  },
  productStock: {
    fontSize: 12,
    color: '#666',
  },
  productActions: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
  },
  employeesList: {
    flex: 1,
  },
  employeeCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  employeeCargo: {
    fontSize: 14,
    color: '#666',
  },
  employeeEmail: {
    fontSize: 12,
    color: '#999',
  },
  employeeStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  salesContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  productsSection: {
    flex: 1,
    marginRight: 8,
  },
  cartSection: {
    flex: 1,
    marginLeft: 8,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartItemQuantity: {
    fontSize: 12,
    color: '#666',
  },
  cartItemActions: {
    alignItems: 'flex-end',
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 4,
  },
  removeButton: {
    backgroundColor: '#f44336',
    padding: 4,
    borderRadius: 4,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 10,
  },
  emptyCart: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  cartTotal: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 6,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  finishButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  salesHistoryList: {
    flex: 1,
  },
  saleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  saleDate: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  saleValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  saleInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  navigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 8,
    elevation: 8,
  },
  navButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: '#e3f2fd',
  },
  navButtonText: {
    fontSize: 10,
    color: '#666',
  },
});
