import db from '../database/database';
import { ProductService } from './ProductService';

export const SalesService = {
  createSale: (saleData) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        // Inserir venda
        tx.executeSql(
          `INSERT INTO vendas (data_venda, valor_total, metodo_pagamento, observacoes)
           VALUES (?, ?, ?, ?)`,
          [
            saleData.data_venda,
            saleData.valor_total,
            saleData.metodo_pagamento,
            saleData.observacoes
          ],
          (_, { insertId: vendaId }) => {
            // Inserir itens da venda
            let itemsProcessed = 0;
            saleData.itens.forEach(item => {
              tx.executeSql(
                `INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                  vendaId,
                  item.produto_id,
                  item.quantidade,
                  item.preco_unitario,
                  item.subtotal
                ],
                (_, { insertId }) => {
                  // Atualizar estoque do produto
                  ProductService.updateStock(item.produto_id, item.quantidade, 'saida')
                    .then(() => {
                      itemsProcessed++;
                      if (itemsProcessed === saleData.itens.length) {
                        resolve(vendaId);
                      }
                    })
                    .catch(error => {
                      reject(error);
                    });
                },
                (_, error) => {
                  reject(error);
                }
              );
            });
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  },

  getAllSales: () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT v.*, COUNT(iv.id) as total_itens
           FROM vendas v
           LEFT JOIN itens_venda iv ON v.id = iv.venda_id
           GROUP BY v.id
           ORDER BY v.data_venda DESC`,
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

  getSaleById: (saleId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        // Buscar dados da venda
        tx.executeSql(
          'SELECT * FROM vendas WHERE id = ?',
          [saleId],
          (_, { rows: vendas }) => {
            if (vendas._array.length === 0) {
              reject(new Error('Venda não encontrada'));
              return;
            }

            const venda = vendas._array[0];

            // Buscar itens da venda
            tx.executeSql(
              `SELECT iv.*, p.nome as produto_nome, p.codigo_barras
               FROM itens_venda iv
               LEFT JOIN produtos p ON iv.produto_id = p.id
               WHERE iv.venda_id = ?`,
              [saleId],
              (_, { rows: itens }) => {
                resolve({
                  ...venda,
                  itens: itens._array
                });
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

  getSalesByPeriod: (startDate, endDate) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT v.*, COUNT(iv.id) as total_itens
           FROM vendas v
           LEFT JOIN itens_venda iv ON v.id = iv.venda_id
           WHERE DATE(v.data_venda) BETWEEN DATE(?) AND DATE(?)
           GROUP BY v.id
           ORDER BY v.data_venda DESC`,
          [startDate, endDate],
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

  getSalesReportByProduct: (startDate, endDate) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT 
             p.nome as produto_nome,
             p.codigo_barras,
             c.nome as categoria_nome,
             SUM(iv.quantidade) as quantidade_vendida,
             SUM(iv.subtotal) as valor_total_vendido,
             AVG(iv.preco_unitario) as preco_medio
           FROM itens_venda iv
           LEFT JOIN produtos p ON iv.produto_id = p.id
           LEFT JOIN categorias c ON p.categoria_id = c.id
           LEFT JOIN vendas v ON iv.venda_id = v.id
           WHERE DATE(v.data_venda) BETWEEN DATE(?) AND DATE(?)
           GROUP BY iv.produto_id
           ORDER BY valor_total_vendido DESC`,
          [startDate, endDate],
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

  getSalesReportByCategory: (startDate, endDate) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT 
             c.nome as categoria_nome,
             COUNT(DISTINCT iv.produto_id) as produtos_vendidos,
             SUM(iv.quantidade) as quantidade_vendida,
             SUM(iv.subtotal) as valor_total_vendido
           FROM itens_venda iv
           LEFT JOIN produtos p ON iv.produto_id = p.id
           LEFT JOIN categorias c ON p.categoria_id = c.id
           LEFT JOIN vendas v ON iv.venda_id = v.id
           WHERE DATE(v.data_venda) BETWEEN DATE(?) AND DATE(?)
           GROUP BY c.id
           ORDER BY valor_total_vendido DESC`,
          [startDate, endDate],
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

  getSalesStatistics: () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        // Estatísticas gerais
        tx.executeSql(
          `SELECT 
             COUNT(*) as total_vendas,
             SUM(valor_total) as valor_total_vendido,
             AVG(valor_total) as ticket_medio
           FROM vendas
           WHERE DATE(data_venda) = DATE('now')`,
          [],
          (_, { rows: stats }) => {
            const estatisticas = stats._array[0];

            // Vendas do mês
            tx.executeSql(
              `SELECT SUM(valor_total) as vendas_mes
               FROM vendas
               WHERE strftime('%Y-%m', data_venda) = strftime('%Y-%m', 'now')`,
              [],
              (_, { rows: mes }) => {
                resolve({
                  totalSales: estatisticas.total_vendas || 0,
                  dailyRevenue: estatisticas.valor_total_vendido || 0,
                  averageTicket: estatisticas.ticket_medio || 0,
                  monthlyRevenue: mes._array[0].vendas_mes || 0
                });
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

  deleteSale: (saleId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        // Primeiro, buscar os itens da venda para reverter o estoque
        tx.executeSql(
          'SELECT produto_id, quantidade FROM itens_venda WHERE venda_id = ?',
          [saleId],
          (_, { rows: itens }) => {
            let itemsProcessed = 0;
            const totalItems = itens._array.length;

            if (totalItems === 0) {
              // Se não há itens, apenas deletar a venda
              tx.executeSql(
                'DELETE FROM vendas WHERE id = ?',
                [saleId],
                (_, { rowsAffected }) => {
                  resolve(rowsAffected);
                },
                (_, error) => {
                  reject(error);
                }
              );
              return;
            }

            // Reverter estoque de cada item
            itens._array.forEach(item => {
              ProductService.updateStock(item.produto_id, item.quantidade, 'entrada')
                .then(() => {
                  itemsProcessed++;
                  if (itemsProcessed === totalItems) {
                    // Deletar itens da venda
                    tx.executeSql(
                      'DELETE FROM itens_venda WHERE venda_id = ?',
                      [saleId],
                      (_, { rowsAffected: itemsDeleted }) => {
                        // Deletar a venda
                        tx.executeSql(
                          'DELETE FROM vendas WHERE id = ?',
                          [saleId],
                          (_, { rowsAffected: vendaDeleted }) => {
                            resolve({ itemsDeleted, vendaDeleted });
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
                  }
                })
                .catch(error => {
                  reject(error);
                });
            });
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }
};
