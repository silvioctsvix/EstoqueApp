import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('estoque.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Tabela de categorias
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS categorias (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          descricao TEXT
        );`
      );

      // Tabela de fornecedores
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS fornecedores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          endereco TEXT,
          contato TEXT
        );`
      );

      // Tabela de produtos
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS produtos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          codigo_barras TEXT UNIQUE,
          nome TEXT NOT NULL,
          descricao TEXT,
          preco_custo REAL NOT NULL,
          preco_venda REAL NOT NULL,
          estoque_atual INTEGER DEFAULT 0,
          estoque_minimo INTEGER DEFAULT 10,
          categoria_id INTEGER,
          fornecedor_id INTEGER,
          tipo TEXT DEFAULT 'produto',
          unidade TEXT DEFAULT 'un',
          FOREIGN KEY (categoria_id) REFERENCES categorias (id),
          FOREIGN KEY (fornecedor_id) REFERENCES fornecedores (id)
        );`
      );

      // Tabela de movimentações de estoque
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS movimentacoes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          produto_id INTEGER,
          tipo TEXT NOT NULL,
          quantidade INTEGER NOT NULL,
          data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
          observacoes TEXT,
          FOREIGN KEY (produto_id) REFERENCES produtos (id)
        );`
      );

      // Tabela de vendas
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS vendas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
          valor_total REAL NOT NULL,
          metodo_pagamento TEXT,
          observacoes TEXT
        );`
      );

      // Tabela de itens da venda
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS itens_venda (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          venda_id INTEGER,
          produto_id INTEGER,
          quantidade INTEGER NOT NULL,
          preco_unitario REAL NOT NULL,
          subtotal REAL NOT NULL,
          FOREIGN KEY (venda_id) REFERENCES vendas (id),
          FOREIGN KEY (produto_id) REFERENCES produtos (id)
        );`
      );
    },
    (error) => {
      console.error('Erro ao criar tabelas:', error);
      reject(error);
    },
    () => {
      console.log('Banco de dados inicializado com sucesso!');
      resolve();
    });
  });
};

export const insertInitialData = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Inserir categorias padrão
      const categorias = [
        { nome: 'Roupas', descricao: 'Vestuário em geral' },
        { nome: 'Alimentos', descricao: 'Produtos alimentícios' },
        { nome: 'Eletrônicos', descricao: 'Produtos eletrônicos' },
        { nome: 'Papelaria', descricao: 'Material escolar e escritório' },
        { nome: 'Serviços', descricao: 'Serviços diversos' }
      ];

      categorias.forEach(categoria => {
        tx.executeSql(
          'INSERT OR IGNORE INTO categorias (nome, descricao) VALUES (?, ?)',
          [categoria.nome, categoria.descricao]
        );
      });

      // Inserir produtos de exemplo
      const produtos = [
        // Roupas
        { codigo_barras: '7891234567890', nome: 'Camiseta básica', descricao: 'Camiseta 100% algodão', preco_custo: 15.00, preco_venda: 25.00, estoque_atual: 50, categoria_id: 1, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567891', nome: 'Calça jeans', descricao: 'Calça jeans masculina', preco_custo: 45.00, preco_venda: 75.00, estoque_atual: 30, categoria_id: 1, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567892', nome: 'Jaqueta corta-vento', descricao: 'Jaqueta esportiva', preco_custo: 60.00, preco_venda: 100.00, estoque_atual: 20, categoria_id: 1, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567893', nome: 'Vestido midi', descricao: 'Vestido feminino', preco_custo: 35.00, preco_venda: 60.00, estoque_atual: 15, categoria_id: 1, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567894', nome: 'Meia esportiva', descricao: 'Meia para esportes', preco_custo: 8.00, preco_venda: 15.00, estoque_atual: 100, categoria_id: 1, tipo: 'produto', unidade: 'par' },

        // Alimentos
        { codigo_barras: '7891234567895', nome: 'Arroz tipo 1', descricao: 'Arroz branco 5kg', preco_custo: 12.00, preco_venda: 18.00, estoque_atual: 40, categoria_id: 2, tipo: 'produto', unidade: 'kg' },
        { codigo_barras: '7891234567896', nome: 'Feijão carioca', descricao: 'Feijão carioca 1kg', preco_custo: 6.00, preco_venda: 9.00, estoque_atual: 60, categoria_id: 2, tipo: 'produto', unidade: 'kg' },
        { codigo_barras: '7891234567897', nome: 'Macarrão espaguete', descricao: 'Macarrão 500g', preco_custo: 2.50, preco_venda: 4.00, estoque_atual: 80, categoria_id: 2, tipo: 'produto', unidade: 'pct' },
        { codigo_barras: '7891234567898', nome: 'Óleo de soja', descricao: 'Óleo de soja 900ml', preco_custo: 4.50, preco_venda: 7.00, estoque_atual: 50, categoria_id: 2, tipo: 'produto', unidade: 'l' },
        { codigo_barras: '7891234567899', nome: 'Açúcar cristal', descricao: 'Açúcar cristal 1kg', preco_custo: 3.00, preco_venda: 5.00, estoque_atual: 70, categoria_id: 2, tipo: 'produto', unidade: 'kg' },

        // Eletrônicos
        { codigo_barras: '7891234567900', nome: 'Smartphone 128 GB', descricao: 'Smartphone Android', preco_custo: 800.00, preco_venda: 1200.00, estoque_atual: 10, categoria_id: 3, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567901', nome: 'Fone de ouvido Bluetooth', descricao: 'Fone sem fio', preco_custo: 50.00, preco_venda: 80.00, estoque_atual: 25, categoria_id: 3, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567902', nome: 'Smart TV 50"', descricao: 'TV Smart 50 polegadas', preco_custo: 1500.00, preco_venda: 2200.00, estoque_atual: 5, categoria_id: 3, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567903', nome: 'Carregador portátil 10000mAh', descricao: 'Power bank', preco_custo: 30.00, preco_venda: 50.00, estoque_atual: 20, categoria_id: 3, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567904', nome: 'Notebook 15,6"', descricao: 'Notebook i5 8GB', preco_custo: 2000.00, preco_venda: 2800.00, estoque_atual: 3, categoria_id: 3, tipo: 'produto', unidade: 'un' },

        // Papelaria
        { codigo_barras: '7891234567905', nome: 'Caderno espiral 100 folhas', descricao: 'Caderno escolar', preco_custo: 8.00, preco_venda: 12.00, estoque_atual: 45, categoria_id: 4, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567906', nome: 'Caneta esferográfica azul', descricao: 'Caneta azul', preco_custo: 1.50, preco_venda: 2.50, estoque_atual: 200, categoria_id: 4, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567907', nome: 'Lápis HB nº 2', descricao: 'Lápis escolar', preco_custo: 0.80, preco_venda: 1.50, estoque_atual: 300, categoria_id: 4, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567908', nome: 'Borracha escolar', descricao: 'Borracha branca', preco_custo: 1.00, preco_venda: 2.00, estoque_atual: 150, categoria_id: 4, tipo: 'produto', unidade: 'un' },
        { codigo_barras: '7891234567909', nome: 'Agenda 2026', descricao: 'Agenda anual', preco_custo: 15.00, preco_venda: 25.00, estoque_atual: 30, categoria_id: 4, tipo: 'produto', unidade: 'un' },

        // Serviços
        { codigo_barras: '7891234567910', nome: 'Corte de cabelo masculino', descricao: 'Corte tradicional', preco_custo: 0.00, preco_venda: 25.00, estoque_atual: 999, categoria_id: 5, tipo: 'servico', unidade: 'un' },
        { codigo_barras: '7891234567911', nome: 'Barba completa', descricao: 'Barba e bigode', preco_custo: 0.00, preco_venda: 20.00, estoque_atual: 999, categoria_id: 5, tipo: 'servico', unidade: 'un' },
        { codigo_barras: '7891234567912', nome: 'Sobrancelha com navalha', descricao: 'Design de sobrancelha', preco_custo: 0.00, preco_venda: 15.00, estoque_atual: 999, categoria_id: 5, tipo: 'servico', unidade: 'un' },
        { codigo_barras: '7891234567913', nome: 'Cópia de chave Yale', descricao: 'Cópia de chave', preco_custo: 0.00, preco_venda: 8.00, estoque_atual: 999, categoria_id: 5, tipo: 'servico', unidade: 'un' },
        { codigo_barras: '7891234567914', nome: 'Abertura de porta emergencial', descricao: 'Serviço de emergência', preco_custo: 0.00, preco_venda: 50.00, estoque_atual: 999, categoria_id: 5, tipo: 'servico', unidade: 'un' }
      ];

      produtos.forEach(produto => {
        tx.executeSql(
          `INSERT OR IGNORE INTO produtos
           (codigo_barras, nome, descricao, preco_custo, preco_venda, estoque_atual, categoria_id, tipo, unidade)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [produto.codigo_barras, produto.nome, produto.descricao, produto.preco_custo, produto.preco_venda, produto.estoque_atual, produto.categoria_id, produto.tipo, produto.unidade]
        );
      });
    },
    (error) => {
      console.error('Erro ao inserir dados iniciais:', error);
      reject(error);
    },
    () => {
      console.log('Dados iniciais inseridos com sucesso!');
      resolve();
    });
  });
};

export default db;
