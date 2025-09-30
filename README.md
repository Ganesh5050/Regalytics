# Regalytics UI - Compliance Management Platform

A comprehensive compliance management platform built with React, TypeScript, and modern web technologies. This application provides real-time monitoring, risk assessment, and regulatory compliance tools for financial institutions.

## 🚀 Features

### Core Functionality
- **Real-time Dashboard** - Live monitoring of transactions, alerts, and compliance metrics
- **Client Management** - Comprehensive KYC and risk assessment tools
- **Transaction Monitoring** - Real-time transaction analysis and suspicious activity detection
- **Alert Management** - Intelligent alerting system with priority-based workflows
- **Advanced Reporting** - Customizable reports with analytics and data visualization
- **Audit Trail** - Complete audit logging and compliance tracking

### Technical Features
- **Authentication & Authorization** - Role-based access control with JWT tokens
- **Real-time Updates** - WebSocket connections for live data synchronization
- **Advanced Analytics** - Interactive charts and data visualization
- **Responsive Design** - Mobile-first design with glass-morphism UI
- **Performance Optimized** - Virtualized tables, lazy loading, and caching
- **Type Safety** - Full TypeScript implementation

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, Shadcn/ui
- **Charts**: Recharts, Chart.js
- **State Management**: React Query, Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint, Prettier
- **Testing**: Vitest, React Testing Library

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/regalytics-ui.git
   cd regalytics-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.production.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_WS_URL=ws://localhost:3001/ws
   REACT_APP_USE_REAL_API=false
   ```

4. **Start development server**
   ```bash
npm run dev
```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Deployment

#### Using Docker Compose (Recommended)

1. **Build and deploy**
   ```bash
   # Linux/Mac
   ./deploy.sh

   # Windows
   .\deploy.ps1
   ```

2. **Access the application**
   - Frontend: http://localhost
   - Grafana: http://localhost:3000
   - Prometheus: http://localhost:9090

#### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Serve the built files**
   ```bash
   # Using serve
   npx serve -s dist -l 3000

   # Using nginx
   cp -r dist/* /var/www/html/
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:3001/api` |
| `REACT_APP_WS_URL` | WebSocket URL | `ws://localhost:3001/ws` |
| `REACT_APP_USE_REAL_API` | Use real API vs mock data | `false` |
| `REACT_APP_AUTH_DOMAIN` | Authentication domain | - |
| `REACT_APP_AUTH_CLIENT_ID` | Auth client ID | - |

### API Configuration

The application supports both mock data and real API integration:

- **Mock Mode**: Set `REACT_APP_USE_REAL_API=false` for development
- **Real API**: Set `REACT_APP_USE_REAL_API=true` and configure API endpoints

## 📊 Monitoring & Analytics

### Built-in Monitoring
- **Real-time Status**: API and WebSocket connection monitoring
- **Performance Metrics**: Response times, error rates, uptime
- **User Activity**: Report generation, system usage
- **System Health**: Database, cache, and service status

### External Monitoring
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards
- **Health Checks**: Automated health monitoring

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Test Structure
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration and data flow
- **E2E Tests**: Full user journey testing

## 🚀 Performance

### Optimization Features
- **Code Splitting**: Lazy loading of routes and components
- **Virtual Scrolling**: Efficient rendering of large datasets
- **Memoization**: Optimized re-rendering with React.memo
- **Caching**: Intelligent data caching with React Query
- **Bundle Analysis**: Webpack bundle analyzer integration

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Bundle Size**: < 500KB (gzipped)

## 🔒 Security

### Security Features
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **CSP Headers**: Content Security Policy implementation
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: Security headers configuration

### Security Best Practices
- Environment variables for sensitive data
- HTTPS enforcement in production
- Regular dependency updates
- Security scanning in CI/CD

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run test
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/your-org/regalytics-ui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/regalytics-ui/discussions)
- **Email**: support@regalytics.com

## 🗺️ Roadmap

### Upcoming Features
- [ ] Mobile application (React Native)
- [ ] Advanced AI/ML risk assessment
- [ ] Multi-tenant architecture
- [ ] Advanced workflow automation
- [ ] Integration with external compliance tools

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Advanced reporting and analytics
- **v1.2.0** - Real-time WebSocket integration
- **v1.3.0** - Enhanced security and performance

---

**Built with ❤️ by the Regalytics Team**