import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, FAB } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ProductService } from '../services/ProductService';
import { SalesService } from '../services/SalesService';
import { formatCurrency, formatDate } from '../utils/theme';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalSales: 0,
    monthlyRevenue: 0
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carregar estatísticas básicas
      const products = await ProductService.getAllProducts();
      const lowStock = await ProductService.getLowStockProducts();
      const salesStats = await SalesService.getSalesStatistics();
      
      setStats({
        totalProducts: products.length,
        lowStockProducts: lowStock.length,
        totalSales: salesStats.totalSales || 0,
        monthlyRevenue: salesStats.monthlyRevenue || 0
      });

      setLowStockItems(lowStock.slice(0, 5)); // Top 5 produtos com estoque baixo

      // Dados para gráfico de vendas (últimos 7 dias)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push({
          date: formatDate(date),
          sales: Math.floor(Math.random() * 10) + 1 // Dados simulados
        });
      }
      setSalesData(last7Days);
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setLoading(false);
    }
  };

  const chartData = {
    labels: salesData.map(item => item.date),
    datasets: [{
      data: salesData.map(item => item.sales),
      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const pieData = [
    {
      name: 'Roupas',
      population: 35,
      color: '#FF6384',
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Alimentos',
      population: 25,
      color: '#36A2EB',
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Eletrônicos',
      population: 20,
      color: '#FFCE56',
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Serviços',
      population: 20,
      color: '#4BC0C0',
      legendFontColor: '#7F7F7F',
    },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <Card>
          <Card.Content>
            <Title>Carregando...</Title>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Estatísticas Principais */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statTitle}>{stats.totalProducts}</Title>
            <Paragraph>Total de Produtos</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statTitle}>{stats.lowStockProducts}</Title>
            <Paragraph>Estoque Baixo</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statTitle}>{stats.totalSales}</Title>
            <Paragraph>Vendas Hoje</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statTitle}>{formatCurrency(stats.monthlyRevenue)}</Title>
            <Paragraph>Receita Mensal</Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* Alertas de Estoque Baixo */}
      {lowStockItems.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>⚠️ Alertas de Estoque</Title>
            {lowStockItems.map((item, index) => (
              <View key={index} style={styles.alertItem}>
                <Paragraph style={styles.alertText}>
                  {item.nome} - Estoque: {item.estoque_atual} {item.unidade}
                </Paragraph>
                <Chip mode="outlined" compact>
                  Crítico
                </Chip>
              </View>
            ))}
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Products')}
              style={styles.button}
            >
              Ver Todos os Produtos
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Gráfico de Vendas */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>📈 Vendas dos Últimos 7 Dias</Title>
          <LineChart
            data={chartData}
            width={screenWidth - 60}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Gráfico de Vendas por Categoria */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>📊 Vendas por Categoria</Title>
          <PieChart
            data={pieData}
            width={screenWidth - 60}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Ações Rápidas */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>⚡ Ações Rápidas</Title>
          <View style={styles.quickActions}>
            <Button 
              mode="outlined" 
              icon="plus"
              onPress={() => navigation.navigate('Products')}
              style={styles.actionButton}
            >
              Novo Produto
            </Button>
            <Button 
              mode="outlined" 
              icon="cart"
              onPress={() => navigation.navigate('Sales')}
              style={styles.actionButton}
            >
              Nova Venda
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* FAB para Nova Venda */}
      <FAB
        style={styles.fab}
        icon="cart-plus"
        onPress={() => navigation.navigate('Sales')}
        label="Nova Venda"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  card: {
    marginBottom: 16,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  alertText: {
    flex: 1,
    marginRight: 8,
  },
  button: {
    marginTop: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
