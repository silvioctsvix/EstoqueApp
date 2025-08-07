# Sistema de Gerenciamento de Estoque e Vendas - SaaS

## 📱 Sobre o Projeto

Sistema SaaS (Software as a Service) desenvolvido em React Native + Expo para gerenciamento de estoque e vendas de múltiplas empresas. O aplicativo foi criado como parte de uma atividade extensionista da UNINTER, focando na inclusão digital e no crescimento econômico local.

A ideia é trabalhar com os principais comerciantes através do centro comunitário do bairro para obter financiamento de uma VPS para hospedar o projeto.

Foi realizado duante o planejamento do projeto, um levanamento e identificamos que com um invetimento de apenas 100 reais por mês é possível contratar uma VPS e o pagamento ficará na resonsabilidade do presidente do centro comunitário recolher donativos junto ao comercio local.

**🚀 VERSÃO ATUAL**: Sistema simplificado com dados mockados para demonstração imediata.

Tod os fontes estão disponiveis no github no link abaixo:

https://github.com/silvioctsvix/EstoqueApp

## 🗺️ Setor de Aplicação

### 📍 Local de Implementação
**Cidade Continental, Município de Serra - ES**

O projeto foi desenvolvido especificamente para atender ao bairro Cidade Continental, localizado no Município de Serra, Espírito Santo. Esta região foi escolhida por apresentar um cenário ideal para implementação de soluções digitais para pequenos negócios, com foco na inclusão tecnológica e desenvolvimento econômico local.

### 🎯 Público-Alvo
**Pequeno Comércio Local**

O sistema foi projetado especificamente para atender pequenos comerciantes locais da Cidade Continental, incluindo:
- **Lojas de roupas** e vestuário
- **Mercados** e mercearias
- **Papelarias** e lojas de material escolar
- **Barbearias** e salões de beleza
- **Chaveiros** e prestadores de serviços
- **Lojas de eletrônicos** e acessórios
- **Farmácias** e drogarias
- **Padarias** e confeitarias

### 🏪 Características do Público-Alvo
- **Baixo conhecimento técnico** em sistemas digitais
- **Necessidade de controle simples** de estoque e vendas
- **Orçamento limitado** para soluções tecnológicas
- **Importância do controle financeiro** para sobrevivência do negócio
- **Dificuldade com planilhas** e sistemas complexos

## 🎯 Objetivos

- ✅ Sistema SaaS para múltiplas empresas
- ✅ Controle integrado de estoque e vendas por empresa
- ✅ Gestão de funcionários por empresa
- ✅ Interface simples e intuitiva em português
- ✅ Promoção da inclusão digital para pequenos negócios

## 🚀 Funcionalidades SaaS

### 🏢 Gestão de Empresas
- Cadastro de múltiplas empresas
- Isolamento completo de dados por empresa
- CNPJ, email e telefone das empresas

### 👥 Gestão de Funcionários
- Cadastro de funcionários por empresa
- Controle de status ativo/inativo
- Associação com vendas realizadas

### 📊 Dashboard Empresarial
- Estatísticas específicas por empresa
- Alertas de estoque baixo
- Receita e vendas do dia
- Ações rápidas de navegação

### 📦 Gestão de Produtos
- Produtos específicos por empresa
- Código de barras individual
- Categorização e busca
- Controle de preços e estoque

### 🛒 Sistema de Vendas
- Carrinho de compras por empresa
- Histórico de vendas isolado
- Múltiplas formas de pagamento
- Controle automático de estoque

### 📈 Histórico de Vendas
- Vendas filtradas por empresa
- Detalhes completos (vendedor, data, valor)
- Método de pagamento registrado

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **React Native Web** - Suporte para web
- **Dados Mockados** - Para demonstração imediata

## 📱 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)

### Instalação Rápida

1. **Clone o repositório**
```bash
git clone https://github.com/silvioctsvix/EstoqueApp
cd EstoqueApp
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**
```bash
npm start
```

4. **Acesse no navegador**
- Pressione `w` no terminal para abrir no navegador
- Ou escaneie o QR Code com Expo Go no celular

### Comandos Disponíveis
```bash
npm start          # Inicia o servidor de desenvolvimento
npm run web        # Executa na web (recomendado)
npm run android    # Executa no Android
npm run ios        # Executa no iOS (apenas macOS)
```

## 🎯 Como Usar o Sistema

### 1. **Login/Cadastro**
- Escolha uma empresa existente ou cadastre uma nova
- Sistema de multi-tenancy com isolamento de dados

### 2. **Dashboard**
- Visualize estatísticas da empresa
- Acesse alertas de estoque baixo
- Use ações rápidas para navegar

### 3. **Gestão de Funcionários**
- Cadastre funcionários da empresa
- Visualize status ativo/inativo
- Associe vendas aos funcionários

### 4. **Gestão de Produtos**
- Cadastre produtos específicos da empresa
- Inclua código de barras
- Controle preços e estoque

### 5. **Sistema de Vendas**
- Realize vendas com carrinho de compras
- Registre método de pagamento
- Controle automático de estoque

### 6. **Histórico de Vendas**
- Consulte vendas da empresa
- Visualize detalhes completos
- Acompanhe performance

## 📊 Dados de Exemplo Incluídos

### Empresas
- **Loja do João** (CNPJ: 12.345.678/0001-90)
- **Mercado Silva** (CNPJ: 98.765.432/0001-10)

### Funcionários
- João Silva (Vendedor) - Loja do João
- Maria Santos (Caixa) - Loja do João  
- Pedro Costa (Gerente) - Mercado Silva

### Produtos por Empresa
**Loja do João:**
- Camiseta básica (R$ 25,00)
- Calça jeans (R$ 75,00)
- Smartphone 128 GB (R$ 1.200,00)

**Mercado Silva:**
- Arroz tipo 1 (R$ 18,00)
- Feijão carioca (R$ 9,00)
- Óleo de soja (R$ 7,00)

### Vendas de Exemplo
- Vendas registradas com funcionários e métodos de pagamento
- Dados isolados por empresa

## 🎨 Interface

- **Design responsivo** para web e mobile
- **Interface em português** para facilitar o uso
- **Ícones intuitivos** para melhor usabilidade
- **Navegação clara** entre funcionalidades
- **Cores consistentes** seguindo padrões de UX

## 📱 Compatibilidade

- **Web**: Navegadores modernos (Chrome, Firefox, Safari, Edge)
- **Android**: 5.0 (API 21) ou superior
- **iOS**: 11.0 ou superior

## 🔧 Configurações

### Dados Mockados
- Sistema atual usa dados simulados para demonstração
- Fácil de testar sem configuração de banco de dados
- Dados isolados por empresa

### Navegação
- Sistema de navegação por telas
- Botões de voltar em todas as telas
- Menu inferior para acesso rápido

## 📈 Funcionalidades SaaS

### Multi-tenancy
- Cada empresa tem dados completamente isolados
- Login específico por empresa
- Dashboard personalizado

### Gestão Completa
- Produtos por empresa
- Funcionários por empresa
- Vendas por empresa
- Relatórios por empresa

## 🤝 Contribuição

Este projeto foi desenvolvido como atividade acadêmica. Para contribuições:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é parte de uma atividade extensionista da UNINTER.

## 👨‍💻 Desenvolvedor

**Silvio Cesar Teixeira dos Santos**
- RU: 520890
- Curso: Bacharelado em Sistemas de Informação
- Disciplina: Atividade Extensionista I

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique a documentação
- Consulte os logs do console
- Entre em contato com o desenvolvedor

## 📋 Planejamento e Mapeamento das Tarefas

### 🔍 Análise do Processo Atual

#### Situação Identificada na Cidade Continental
Durante o mapeamento realizado no bairro Cidade Continental, foi identificado que os pequenos comerciantes utilizam métodos manuais e arcaicos para controle de estoque e vendas:

**Métodos Atuais Utilizados:**
- **Controle manual** em cadernos e agendas
- **Planilhas básicas** no Excel (quando disponível)
- **Memória** para controle de estoque
- **Calculadora** para totais de vendas
- **Sem backup** de informações importantes
- **Dificuldade** para identificar produtos com estoque baixo
- **Falta de relatórios** de vendas e lucratividade

#### Problemas Identificados
1. **Perda de vendas** por falta de produtos no estoque
2. **Compra excessiva** de produtos que não vendem
3. **Dificuldade** para controlar preços e margens
4. **Falta de visibilidade** sobre o desempenho do negócio
5. **Tempo desperdiçado** com controles manuais
6. **Risco de perda** de informações importantes

### 🎯 Mapeamento das Tarefas

#### Fase 1: Pesquisa e Análise
- [x] **Levantamento** dos tipos de negócios na Cidade Continental
- [x] **Identificação** das necessidades dos comerciantes
- [x] **Análise** dos processos atuais de controle
- [x] **Definição** do público-alvo e escopo

#### Fase 2: Planejamento Técnico
- [x] **Escolha** da tecnologia (React Native + Expo)
- [x] **Definição** da arquitetura SaaS
- [x] **Planejamento** do banco de dados
- [x] **Design** da interface do usuário

#### Fase 3: Desenvolvimento
- [x] **Configuração** do ambiente de desenvolvimento
- [x] **Implementação** do sistema de login por empresa
- [x] **Desenvolvimento** do módulo de produtos
- [x] **Criação** do sistema de vendas
- [x] **Implementação** do dashboard empresarial
- [x] **Desenvolvimento** do histórico de vendas

#### Fase 4: Testes e Validação
- [x] **Testes** de funcionalidades básicas
- [x] **Validação** da interface com usuários
- [x] **Ajustes** baseados no feedback
- [x] **Documentação** completa do sistema

### 📊 Análise dos Dados

#### Dados Coletados na Cidade Continental
- **Tipos de negócios**: 8 categorias principais identificadas
- **Tamanho médio**: 1-5 funcionários por estabelecimento
- **Volume de produtos**: 50-500 produtos por negócio
- **Vendas diárias**: 10-100 transações por dia
- **Necessidade tecnológica**: Alta demanda por soluções simples

#### Requisitos Funcionais Identificados
1. **Controle de estoque** em tempo real
2. **Sistema de vendas** com carrinho de compras
3. **Cadastro de produtos** com código de barras
4. **Relatórios** de vendas e estoque
5. **Alertas** de estoque baixo
6. **Controle de funcionários** por empresa
7. **Histórico** de vendas detalhado

### 🎯 Objetivos de Impacto

#### Para os Comerciantes da Cidade Continental
- **Redução de 30%** nas perdas por estoque desatualizado
- **Aumento de 20%** na eficiência operacional
- **Melhoria de 40%** no controle financeiro
- **Economia de 2-3 horas** diárias em controles manuais

#### Para o Desenvolvimento Local
- **Inclusão digital** dos pequenos comerciantes
- **Fortalecimento** do comércio local
- **Geração de empregos** na área de tecnologia
- **Modelo replicável** para outros bairros

## 🚀 Próximos Passos

Para evolução do sistema:
- Implementar banco de dados real (SQLite/PostgreSQL)
- Adicionar autenticação de usuários
- Implementar backup na nuvem
- Adicionar relatórios avançados
- Implementar scanner de código de barras real
- **Expansão** para outros bairros da Serra
- **Treinamento** dos comerciantes da Cidade Continental
- **Parcerias** com associações comerciais locais

---

**Sistema de Gerenciamento de Estoque e Vendas - SaaS**  
*Desenvolvido com ❤️ para pequenos empreendedores*
