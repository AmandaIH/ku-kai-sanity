# Sanity + Nuxt Boilerplate

A modern, multilingual content management system built with [Sanity](https://www.sanity.io/) and [Nuxt 4](https://nuxt.com/), featuring a flexible content structure with reusable blocks and internationalization support.

## 🏗️ Project Structure

This is a monorepo containing two main applications:

- **Studio** (`apps/studio/`) - Sanity Content Studio for content management
- **Web** (`apps/web/`) - Nuxt 4 frontend application

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies for both apps
pnpm install
```

### 2. Update Dependencies

When you need to update dependencies, make sure to use `pnpm update` to properly update the lock file:

```bash
# Update all dependencies and regenerate the lock file
pnpm update

# Or update specific packages
pnpm update <package-name>
```

**Important**: Always run `pnpm update` instead of manually editing package.json files to ensure the lock file is properly synchronized.

### 3. Environment Setup

You'll need to set up environment variables for both applications. Check the respective README files in each app directory for specific requirements:

- [Studio Environment Setup](./apps/studio/README.md)
- [Web Environment Setup](./apps/web/README.md)

### 4. Run Development Servers

#### Option A: Run Both Apps Simultaneously

```bash
# Start both Sanity Studio and Nuxt dev servers
pnpm run dev:studio  # Starts Sanity Studio (usually on http://localhost:3333)
pnpm run dev:web     # Starts Nuxt dev server (usually on http://localhost:3000)
```

#### Option B: Run Apps Individually

```bash
# Start only Sanity Studio
pnpm --filter checkmate-sanity-studio dev

# Start only Nuxt web app
pnpm --filter checkmate-sanity-nuxt dev
```

## 🛠️ Available Scripts

### Root Level Scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev:studio` | Start Sanity Studio development server |
| `pnpm run dev:web` | Start Nuxt development server |

### Studio Scripts (`apps/studio/`)

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm start` | Start production server |
| `pnpm build` | Build for production |
| `pnpm deploy` | Deploy to Sanity |

### Web Scripts (`apps/web/`)

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm generate` | Generate static site |
| `pnpm preview` | Preview production build |

## 🌐 Access Points

Once running, you can access:

- **Sanity Studio**: http://localhost:3333
- **Nuxt Web App**: http://localhost:3000

## 📁 Key Features

### Content Blocks
The project includes a flexible content block system with:
- Hero sections
- Text and image combinations
- Galleries and sliders
- Forms and accordions
- Video integration
- Archive functionality

### Internationalization
- Multi-language support
- Language switching
- SEO optimization for each locale

### Development Tools
- TypeScript support
- Tailwind CSS for styling
- GSAP for animations
- SCSS preprocessing
- ESLint and Prettier configuration

## 🔧 Development Workflow

1. **Content Management**: Use Sanity Studio to create and manage content
2. **Frontend Development**: Build the frontend in the Nuxt app
3. **Content Integration**: The Nuxt app fetches content from Sanity via the Sanity client
4. **Real-time Updates**: Changes in Sanity Studio are reflected in real-time on the frontend

## 📚 Documentation

- [Sanity Documentation](https://www.sanity.io/docs)
- [Nuxt Documentation](https://nuxt.com/docs)
- [Content Blocks Guide](./content-blocks.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both applications
5. Submit a pull request

## 📄 License

This project is private and unlicensed.

---

For more detailed information about each application, see the README files in their respective directories:
- [Studio README](./apps/studio/README.md)
- [Web README](./apps/web/README.md) 