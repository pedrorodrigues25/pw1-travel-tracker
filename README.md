# Voya - Travel Tracker 🌍✈️

A modern web application for tracking, sharing, and managing your travel experiences. Voya helps you preserve memories, plan trips, connect with friends, and visualize your travel journey around the world.

## ✨ Key Features

### User Management
- 👤 **User Registration & Authentication** - Secure account creation and login system
- 📝 **Profile Customization** - Upload profile photo, set bio, and select interests
- 🔒 **Admin Panel** - Full user management with ban/unban capabilities

### Travel Tracking
- ✈️ **Destination Management** - Add, edit, and remove trips with detailed information
- 📸 **Auto Image Fetching** - Automatic destination images from Wikipedia
- 📊 **Travel Statistics** - View your trip progress with interactive charts
- 🗺️ **Suggestions** - Smart city and country recommendations while planning

### Social Features
- 👥 **Friends System** - Add friends and view their recent trips
- 🎯 **Friend Recommendations** - Discover new connections based on interests
- 🤝 **Shared Trips** - See trips you've taken with friends

### Additional Features
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful and intuitive interface with smooth animations
- 💾 **Data Persistence** - All user data is stored locally

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pedrorodrigues25/pw1-travel-tracker.git
   cd pw1-travel-tracker/voya
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the application (split terminal into 2 panels)**

   **Terminal Panel 1 - Start JSON Server:**
   ```bash
   cd voya
   npx json-server --watch db.json --port 3001
   ```

   **Terminal Panel 2 - Start Development Server:**
   ```bash
   cd voya
   npm run dev
   # or
   pnpm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173` (or the URL shown in the dev terminal)

## 👤 Default Admin Account

For testing admin features:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`
- Click **"Admin Login"** button on the login page

## 📚 User Accounts

You can create your own account or use demo accounts already in the database.

## 🔧 API Documentation

### External APIs
- **[REST Countries API](https://restcountries.com/)** - Country data, names, and flags
- **[Wikidata SPARQL](https://query.wikidata.org/)** - City suggestions by country
- **[Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)** - Destination images

### Local API
- **json-server** - RESTful API running on `http://localhost:3001`
- **Database:** `db.json` - Contains users, trips, interests, friends data

## 🏗️ Project Structure

```
voya/
├── src/
│   ├── components/        # Vue components
│   ├── views/            # Page components
│   ├── stores/           # Pinia state management
│   ├── api/              # API integration
│   ├── css/              # Global styles
│   ├── img/              # Images
│   ├── router/           # Vue Router configuration
│   └── main.js           # Entry point
├── db.json               # Local database
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies
```

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| **Vue.js 3** | Frontend framework with Composition API |
| **Pinia** | Lightweight state management |
| **Vite** | Modern build tool & dev server |
| **Vue Router** | Client-side routing |
| **json-server** | Mock REST API for development |
| **CSS3** | Styling with animations & gradients |

## 📋 Available Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/login` | User login |
| `/register` | New user registration |
| `/destinations` | Home/Dashboard with trip summary |
| `/interests` | Interest selection page |
| `/trips` | View all user trips |
| `/recommendations` | Friend recommendations |
| `/friends` | Friend list and management |
| `/profile` | User profile settings |
| `/admin` | Admin dashboard (admin only) |

## 🎮 Usage Guide

### As a Regular User
1. **Register** - Create new account with email and password
2. **Select Interests** - Choose your travel interests (beaches, mountains, culture, etc.)
3. **Add Destinations** - Plan and track your trips with cities and dates
4. **Manage Profile** - Upload photo, write bio, manage interests
5. **Connect with Friends** - Add friends and view their recent trips
6. **View Statistics** - See your travel progress with interactive charts

### As an Admin
1. Click **"Admin Login"** button on login page
2. Enter admin credentials (`admin@gmail.com` / `admin123`)
3. Access admin dashboard with user management
4. **Ban Users** - Select duration (1h, 3h, 6h, 24h, 3 days, 1 week)
5. **Unban Users** - Remove active bans
6. **Delete Users** - Permanently remove user accounts (destructive action)

## 🚫 Important Notes

- ⛔ **Banned users cannot login** until the ban expires
- 🔐 **Admin account** cannot use regular login (must use Admin Login)
- 💾 **Data persistence** - All changes are saved to `db.json`
- 🌐 **Image fetching** - Requires internet connection to fetch images from Wikipedia
- 📱 **Responsive** - Application adapts to all screen sizes

## 🐛 Features & Bug Fixes

### Latest Updates
- ✅ Admin dashboard with user management
- ✅ Ban system with time duration
- ✅ Friend system with recommendations
- ✅ Automatic destination images
- ✅ Travel statistics with charts
- ✅ Responsive design for all devices

## 🤝 Development Team

Developed as part of the **Web Programming 1 Course** at:
**Escola Superior em Media Artes e Design (ESMAD)** - Porto, Portugal
Bachelor's in Technologies and Information Systems for the Web

### Team Members
- **Pedro Rodrigues** 
- **Mariana Ferreira** 
- **Miguel Caldas** 

## 📄 License

This project is created for educational purposes as part of ESMAD curriculum.

## 🤝 Support & Contributing

For questions, improvements, or bug reports, please contact the development team or open an issue on GitHub.

---

**Built with ❤️ for travel enthusiasts | Made with Vue.js & ☕**

---

# Voya - Rastreador de Viagens 🌍✈️

Uma aplicação web moderna para rastrear, partilhar e gerir as suas experiências de viagem. Voya ajuda-o a preservar memórias, planear viagens, conectar-se com amigos e visualizar a sua jornada de viagem em torno do mundo.

## ✨ Funcionalidades Principais

### Gestão de Utilizadores
- 👤 **Registo e Autenticação** - Criação segura de conta e sistema de login
- 📝 **Personalização de Perfil** - Carregar foto de perfil, definir bio e selecionar interesses
- 🔒 **Painel Admin** - Gestão completa de utilizadores com capacidades de ban/unban

### Rastreamento de Viagens
- ✈️ **Gestão de Destinos** - Adicionar, editar e remover viagens com informações detalhadas
- 📸 **Obtenção Automática de Imagens** - Imagens automáticas de destinos da Wikipedia
- 📊 **Estatísticas de Viagem** - Ver o progresso da sua viagem com gráficos interativos
- 🗺️ **Sugestões** - Recomendações inteligentes de cidades e países durante o planeamento

### Funcionalidades Sociais
- 👥 **Sistema de Amigos** - Adicionar amigos e ver as suas viagens recentes
- 🎯 **Recomendações de Amigos** - Descobrir novas conexões com base nos interesses
- 🤝 **Viagens Partilhadas** - Ver viagens que realizou com amigos

### Funcionalidades Adicionais
- 📱 **Design Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- 🎨 **UI Moderna** - Interface bonita e intuitiva com animações suaves
- 💾 **Persistência de Dados** - Todos os dados do utilizador são armazenados localmente

## 🚀 Começar

### Pré-requisitos
- Node.js (v14 ou superior)
- Gestor de pacotes npm ou pnpm

### Instalação

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/pedrorodrigues25/pw1-travel-tracker.git
   cd pw1-travel-tracker/voya
   ```

2. **Instalar dependências**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Iniciar a aplicação (dividir terminal em 2 painéis)**

   **Painel de Terminal 1 - Iniciar JSON Server:**
   ```bash
   cd voya
   npx json-server --watch db.json --port 3001
   ```

   **Painel de Terminal 2 - Iniciar Servidor de Desenvolvimento:**
   ```bash
   cd voya
   npm run dev
   # ou
   pnpm run dev
   ```

4. **Abrir no browser**
   - Navegar para `http://localhost:5173` (ou a URL mostrada no terminal de dev)

## 👤 Conta Admin Padrão

Para testar funcionalidades de admin:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`
- Clique no botão **"Admin Login"** na página de login

## 📚 Contas de Utilizador

Pode criar a sua própria conta ou usar contas de demonstração já na base de dados.

## 🔧 Documentação de API

### APIs Externas
- **[REST Countries API](https://restcountries.com/)** - Dados de países, nomes e bandeiras
- **[Wikidata SPARQL](https://query.wikidata.org/)** - Sugestões de cidades por país
- **[Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)** - Imagens de destinos

### API Local
- **json-server** - API RESTful em execução em `http://localhost:3001`
- **Base de Dados:** `db.json` - Contém dados de utilizadores, viagens, interesses e amigos

## 🏗️ Estrutura do Projeto

```
voya/
├── src/
│   ├── components/        # Componentes Vue
│   ├── views/            # Componentes de página
│   ├── stores/           # Gestão de estado Pinia
│   ├── api/              # Integração de API
│   ├── css/              # Estilos globais
│   ├── img/              # Imagens
│   ├── router/           # Configuração Vue Router
│   └── main.js           # Ponto de entrada
├── db.json               # Base de dados local
├── vite.config.js        # Configuração Vite
└── package.json          # Dependências
```

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Propósito |
|-----------|---------|
| **Vue.js 3** | Framework frontend com Composition API |
| **Pinia** | Gestão de estado leve |
| **Vite** | Ferramenta de build moderna e dev server |
| **Vue Router** | Routing no lado do cliente |
| **json-server** | API REST simulada para desenvolvimento |
| **CSS3** | Estilos com animações e gradientes |

## 📋 Rotas Disponíveis

| Rota | Propósito |
|-------|---------|
| `/` | Página de desembarque |
| `/login` | Login de utilizador |
| `/register` | Registo de novo utilizador |
| `/destinations` | Home/Dashboard com resumo de viagens |
| `/interests` | Página de seleção de interesses |
| `/trips` | Ver todas as viagens do utilizador |
| `/recommendations` | Recomendações de amigos |
| `/friends` | Lista de amigos e gestão |
| `/profile` | Configurações de perfil do utilizador |
| `/admin` | Dashboard de admin (apenas admin) |

## 🎮 Guia de Utilização

### Como Utilizador Regular
1. **Registar** - Criar nova conta com email e password
2. **Selecionar Interesses** - Escolher os seus interesses de viagem (praias, montanhas, cultura, etc.)
3. **Adicionar Destinos** - Planear e rastrear as suas viagens com cidades e datas
4. **Gerir Perfil** - Carregar foto, escrever bio, gerir interesses
5. **Conectar com Amigos** - Adicionar amigos e ver as suas viagens recentes
6. **Ver Estatísticas** - Ver o progresso da sua viagem com gráficos interativos

### Como Admin
1. Clique no botão **"Admin Login"** na página de login
2. Introduza credenciais de admin (`admin@gmail.com` / `admin123`)
3. Aceda ao dashboard de admin com gestão de utilizadores
4. **Banir Utilizadores** - Selecionar duração (1h, 3h, 6h, 24h, 3 dias, 1 semana)
5. **Desbanir Utilizadores** - Remover bans ativos
6. **Eliminar Utilizadores** - Remover permanentemente contas de utilizadores (ação destrutiva)

## 🚫 Notas Importantes

- ⛔ **Utilizadores banidos não podem fazer login** até o ban expirar
- 🔐 **Conta admin** não pode usar login regular (deve usar Admin Login)
- 💾 **Persistência de dados** - Todas as alterações são guardadas em `db.json`
- 🌐 **Obtenção de imagens** - Requer ligação à internet para obter imagens da Wikipedia
- 📱 **Responsivo** - A aplicação adapta-se a todos os tamanhos de ecrã

## 🐛 Funcionalidades e Correções

### Atualizações Recentes
- ✅ Dashboard de admin com gestão de utilizadores
- ✅ Sistema de ban com duração de tempo
- ✅ Sistema de amigos com recomendações
- ✅ Imagens de destinos automáticas
- ✅ Estatísticas de viagem com gráficos
- ✅ Design responsivo para todos os dispositivos

## 🤝 Equipa de Desenvolvimento

Desenvolvido como parte do **Curso de Programação Web 1** em:
**Escola Superior em Media Artes e Design (ESMAD)** - Porto, Portugal
Licenciatura em Tecnologias e Sistemas de Informação para a Web

### Membros da Equipa
- **Pedro Rodrigues** 
- **Mariana Ferreira** 
- **Miguel Caldas** 

## 📄 Licença

Este projeto é criado para fins educacionais como parte do currículo ESMAD.

## 🤝 Suporte e Contribuições

Para dúvidas, melhorias ou relatos de bugs, contacte a equipa de desenvolvimento ou abra uma issue no GitHub.

---

