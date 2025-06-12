# GFashion-Admin

A comprehensive admin dashboard for GFashion e-commerce platform built with React, TypeScript, and Vite. This powerful administrative interface provides complete control over your fashion e-commerce business operations.

## 🌟 Features

**Dashboard Overview**
- Real-time analytics and key performance indicators
- Sales trends and revenue insights
- Quick access to critical business metrics

**User Management**
- View and manage customer accounts
- User activity monitoring
- Account status control and permissions

**Product Management**
- Add, edit, and delete fashion products
- Inventory tracking and stock management
- Product categories and attributes management
- Bulk product operations

**Order Management**
- Process and track customer orders
- Order status updates and fulfillment
- Payment and shipping management
- Order history and analytics

**Review Management**
- Monitor customer product reviews and ratings
- Moderate and respond to customer feedback
- Review analytics and sentiment tracking

**Revenue Analytics**
- Comprehensive sales reporting
- Revenue tracking by period, product, and category
- Financial insights and profit analysis
- Export capabilities for accounting

## 🚀 Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **ESLint** - Code quality and consistency

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Git for version control

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HiQuang210/GFashion-Admin.git
   cd GFashion-Admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Configure your environment variables in `.env.local`:
   ```
   VITE_API_BASE_URL=your_api_endpoint
   VITE_APP_NAME=GFashion Admin
   ```

## 🏃‍♂️ Running the Project

### Development Mode
```bash
npm run dev
# or
yarn dev
```
The application will start at `http://localhost:5173`

### Build for Production
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## 🔧 Development Configuration

### ESLint Configuration for Production

For production applications, we recommend updating the ESLint configuration to enable type-aware lint rules:

1. Configure the top-level `parserOptions` property:
```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

2. Replace `plugin:@typescript-eslint/recommended` with:
   - `plugin:@typescript-eslint/recommended-type-checked` or
   - `plugin:@typescript-eslint/strict-type-checked`

3. Optionally add `plugin:@typescript-eslint/stylistic-type-checked`

4. Install and configure React ESLint plugin:
```bash
npm install eslint-plugin-react --save-dev
```
Add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for GFashion e-commerce platform
