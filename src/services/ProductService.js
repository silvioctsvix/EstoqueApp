import db from '../database/database';

export const ProductService = {
  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT p.*, c.nome as categoria_nome 
           FROM produtos p 
           LEFT JOIN categorias c ON p.categoria_id = c.id 
           ORDER BY p.nome`,
          [],
          (_, { rows }) => {
            resolve(rows._array);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  },

  getProductByBarcode: (codigoBarras) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT p.*, c.nome as categoria_nome 
           FROM produtos p 
           LEFT JOIN categorias c ON p.categoria_id = c.id 
           WHERE p.codigo_barras = ?`,
          [codigoBarras],
          (_, { rows }) => {
            resolve(rows._array[0]);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  },

  getLowStockProducts: () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT p.*, c.nome as categoria_nome 
           FROM produtos p 
           LEFT JOIN categorias c ON p.categoria_id = c.id 
           WHERE p.estoque_atual <= p.estoque_minimo 
           ORDER BY p.estoque_atual ASC`,
          [],
          (_, { rows }) => {
            resolve(rows._array);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  },

  addProduct: (product) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO produtos 
           (codigo_barras, nome, descricao, preco_custo, preco_venda, estoque_atual, estoque_minimo, categoria_id, fornecedor_id, tipo, unidade)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.codigo_barras,
            product.nome,
            product.descricao,
            product.preco_custo,
            product.preco_venda,
            product.estoque_atual || 0,
            product.estoque_minimo || 10,
            product.categoria_id,
            product.fornecedor_id,
            product.tipo || 'produto',
            product.unidade || 'un'
          ],
          (_, { insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  },

  updateProduct: (id, product) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE produtos SET 
           codigo_barras = ?, nome = ?, descricao = ?, preco_custo = ?, 
           preco_venda = ?, estoque_atual = ?, estoque_minimo = ?, 
           categoria_id = ?, fornecedor_id = ?, tipo = ?, unidade = ?
           WHERE id = ?`,
          [
            product.codigo_barras,
            product.nome,
            product.descricao,
            product.preco_custo,
            product.preco_venda,
            product.estoque_atual,
            product.estoque_minimo,
            product.categoria_id,
            product.fornecedor_id,
            product.tipo,
            product.unidade,
            id
          ],
          (_, { rowsAffected }) => {
            resolve(rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  },

  deleteProduct: (id) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM produtos WHERE id = ?',
          [id],
          (_, { rowsAffected }) => {
            resolve(rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  },

  updateStock: (id, quantidade, tipo = 'entrada') => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        // Primeiro, buscar o produto atual
        tx.executeSql(
          'SELECT estoque_atual FROM produtos WHERE id = ?',
          [id],
          (_, { rows }) => {
            const produto = rows._array[0];
            if (!produto) {
              reject(new Error('Produto não encontrado'));
              return;
            }

            const novoEstoque = tipo === 'entrada' 
              ? produto.estoque_atual + quantidade
              : produto.estoque_atual - quantidade;

            if (novoEstoque < 0) {
              reject(new Error('Estoque insuficiente'));
              return;
            }

            // Atualizar estoque
            tx.executeSql(
              'UPDATE produtos SET estoque_atual = ? WHERE id = ?',
              [novoEstoque, id],
              (_, { rowsAffected }) => {
                // Registrar movimentação
                tx.executeSql(
                  `INSERT INTO movimentacoes (produto_id, tipo, quantidade, observacoes)
                   VALUES (?, ?, ?, ?)`,
                  [id, tipo, quantidade, `Movimentação automática - ${tipo}`],
                  (_, { insertId }) => {
                    resolve({ rowsAffected, movimentacaoId: insertId });
                  },
                  (_, error) => {
                    reject(error);
                  }
                );
              },
              (_, error) => {
                reject(error);
              }
            );
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  },

  getProductsByCategory: (categoriaId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT p.*, c.nome as categoria_nome 
           FROM produtos p 
           LEFT JOIN categorias c ON p.categoria_id = c.id 
           WHERE p.categoria_id = ?
           ORDER BY p.nome`,
          [categoriaId],
          (_, { rows }) => {
            resolve(rows._array);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  },

  searchProducts: (searchTerm) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT p.*, c.nome as categoria_nome 
           FROM produtos p 
           LEFT JOIN categorias c ON p.categoria_id = c.id 
           WHERE p.nome LIKE ? OR p.codigo_barras LIKE ? OR p.descricao LIKE ?
           ORDER BY p.nome`,
          [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
          (_, { rows }) => {
            resolve(rows._array);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }
};
