# 🛰️ Fleet Tracker Dashboard (React + TypeScript + Leaflet)

Sistema interativo de monitoramento geográfico de unidades operacionais com rastreio de rotas, status operacional e performance por estado. Desenvolvido em React + TypeScript + Leaflet.

---

## 🧠 Visão Geral

Este projeto exibe um mapa interativo com a **localização e rotas de equipamentos móveis**, apresentando também seu **status operacional atual** com cores distintas e um resumo de **ganho por hora** com base no estado e modelo da unidade.

---

## 🚀 Tecnologias Utilizadas

- React 19
- TypeScript
- React-Leaflet
- Leaflet
- Material UI (MUI)
- Dados locais mockados em JSON

---

## 📦 Como rodar o projeto

1. Instale as dependências:
```bash
npm install


2. Iniciar o servidor:
```bash
npm start

3.Acesse no navegador:
http://localhost:3000



🎯 Funcionalidades
📍 Exibição da última localização conhecida de cada unidade

📊 Cálculo dinâmico de ganhos por hora baseado no estado atual

🧭 Visualização da rota completa histórica

🟢🟡🔴 Estados coloridos para fácil interpretação:

Operando: verde

Parado: amarelo

Manutenção: vermelho


🧩 Componentes chave
App.tsx
Renderiza o mapa principal com status por cor e markers personalizados com rotas.

EquipmentRouteSearch.tsx
Permite selecionar uma unidade e visualizar toda a sua movimentação histórica como linha no mapa (Polyline), além de mostrar o estado atual via ícone e popup.

HourlyEarningsDisplay.tsx
Mostra o ganho por hora da unidade com base no estado atual, utilizando dados do modelo.


🧪 Dados Simulados
O projeto utiliza arquivos JSON simulando dados reais, incluindo:

Histórico de posições GPS

Mudança de estados operacionais

Ganhos por modelo/estado

Os arquivos são modularizados e importados diretamente no código como objetos tipados.



























