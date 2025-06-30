# The Council of the Twenty-Seven - Frontend

A modern, responsive React + Next.js + TypeScript + Tailwind CSS frontend for The Council of the Twenty-Seven application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📋 Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Backend API**: Must be running on http://localhost:8000

## 🛠️ Available NPM Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start development server with hot reload | Development |
| `npm run build` | Build optimized production bundle | Production |
| `npm start` | Start production server (requires build) | Production |
| `npm run lint` | Run ESLint code analysis | Code Quality |
| `npm run lint:fix` | Fix auto-fixable ESLint issues | Code Quality |

## 📁 Project Structure

```
frontend/
├── app/                           # Next.js 14 App Router
│   ├── globals.css               # Global CSS styles and Tailwind imports
│   ├── layout.tsx                # Root layout component (applies to all pages)
│   ├── page.tsx                  # Main application page (home route)
│   └── favicon.ico               # Application favicon
├── components/                    # Reusable React components
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx           # Button component with variants
│   │   ├── card.tsx             # Card layout components
│   │   ├── input.tsx            # Input and textarea components
│   │   └── loading.tsx          # Loading spinner and error components
│   └── Footer.tsx               # Application footer component
├── lib/                          # Utility libraries and services
│   ├── api.ts                   # API service layer for backend communication
│   ├── examples.ts              # Sample questions and utilities
│   ├── perspectives.ts          # Philosophical perspective descriptions
│   └── utils.ts                 # General utility functions
├── public/                       # Static assets (served at root)
│   └── (static files)
├── .env.local                   # Local environment variables (not committed)
├── .env.example                 # Environment variables template
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── postcss.config.js            # PostCSS configuration for Tailwind
├── package.json                 # NPM dependencies and scripts
└── README.md                    # This documentation file
```

## 🔧 Configuration Files

### `next.config.js`
- **Purpose**: Next.js framework configuration
- **Key Features**:
  - Disables telemetry for privacy
  - API proxy rewrites to backend
  - Font optimization settings
  - Production build optimizations

### `tailwind.config.js`
- **Purpose**: Tailwind CSS utility framework configuration
- **Key Features**:
  - Custom color scheme with CSS variables
  - System font stack for better performance
  - Custom animations and keyframes
  - Responsive design utilities
  - Component-specific styling extensions

### `tsconfig.json`
- **Purpose**: TypeScript compiler configuration
- **Key Features**:
  - Strict type checking enabled
  - Path aliases (@/ for src imports)
  - Next.js optimized settings
  - Modern JavaScript target (ES2017)

### `.env.local` / `.env.example`
- **Purpose**: Environment variables configuration
- **Variables**:
  - `NEXT_PUBLIC_API_URL`: Backend API endpoint
  - `NODE_ENV`: Environment mode (development/production)

## 🎯 Core Application Flow

### 1. Question Input (`page.tsx`)
- User enters life question or dilemma
- Provides example questions for inspiration
- Validates input before proceeding
- Implements progressive disclosure UI pattern

### 2. Perspective Selection
- Fetches available philosophical perspectives from API
- Displays perspectives with descriptions
- Allows multiple selection (2-4 recommended)
- Visual feedback for selected items

### 3. Answer Generation
- Sends parallel requests for each selected perspective
- Displays loading states during API calls
- Shows individual answers in organized cards
- Handles errors gracefully with retry options

### 4. Synthesis Generation
- Combines multiple perspective answers
- Generates unified philosophical conclusion
- Presents final synthesis in highlighted format
- Provides option to start new session

## 🌐 API Integration

### Backend Communication (`lib/api.ts`)

The frontend communicates with a FastAPI backend through these endpoints:

```typescript
// Get available philosophical perspectives
GET /perspectives
Response: string[]

// Generate answer from specific perspective  
POST /answer
Body: { question: string, perspective: string }
Response: { perspective: string, answer: string }

// Generate synthesis from multiple answers
POST /conclusion  
Body: { answers: Record<string, string> }
Response: { conclusion: string }
```

### Error Handling
- Network timeouts and connection errors
- Backend service unavailability
- Invalid API responses
- User-friendly error messages with retry options

## 🎨 Styling System

### Tailwind CSS Approach
- **Utility-first CSS**: Rapid prototyping and development
- **Component-based styling**: Consistent design patterns
- **Responsive design**: Mobile-first approach with breakpoints
- **Custom color scheme**: Indigo/blue gradient theme
- **Typography**: System font stack for performance

### Color Palette
```css
Primary: Indigo (600/700 variants)
Background: Gradient (slate-50 → blue-50 → indigo-50)
Text: Gray scale (600/700/900)
Success: Green (500/600)
Error: Red (500/600)
```

### Responsive Breakpoints
```css
sm: 640px   (Mobile landscape)
md: 768px   (Tablet)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)
```

## 🔧 Development Workflow

### Local Development
1. **Start Backend**: Ensure FastAPI server runs on port 8000
2. **Install Dependencies**: `npm install`
3. **Environment Setup**: Copy `.env.example` to `.env.local`
4. **Start Dev Server**: `npm run dev`
5. **Access Application**: http://localhost:3000 (or next available port)

### Code Quality
- **TypeScript**: Strict type checking enforced
- **ESLint**: Code style and error detection
- **Prettier**: Code formatting (if configured)
- **Component Structure**: Functional components with hooks

### Hot Reload
- Automatic page refresh on file changes
- Fast refresh preserves component state
- Error overlay shows compilation issues
- CSS changes apply instantly

## 🚀 Production Deployment

### Build Process
```bash
# Create optimized production build
npm run build

# Outputs to .next/ directory
# Includes static optimization and code splitting
```

### Production Considerations
- **Environment Variables**: Set `NEXT_PUBLIC_API_URL` for production API
- **Static Assets**: Optimize images and fonts
- **CDN Setup**: Serve static files from CDN
- **API Proxy**: Configure reverse proxy for API routes
- **HTTPS**: Ensure secure connections
- **Performance**: Monitor Core Web Vitals

### Deployment Options
- **Vercel**: Seamless Next.js deployment
- **Netlify**: Static site deployment with API proxying
- **Docker**: Containerized deployment
- **Traditional Hosting**: Upload build output to web server

## 🧪 Testing Strategy

### Component Testing
- Unit tests for individual components
- Integration tests for user flows
- API mock testing for backend integration

### Browser Testing
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness testing
- Accessibility compliance (WCAG guidelines)

## 🔍 Debugging and Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Next.js automatically finds available port
# Check terminal output for actual port number
```

**API Connection Errors**
```bash
# Verify backend is running on port 8000
# Check NEXT_PUBLIC_API_URL in .env.local
# Inspect network tab in browser dev tools
```

**Build Errors**
```bash
# Check TypeScript errors: npx tsc --noEmit
# Run linter: npm run lint
# Clear Next.js cache: rm -rf .next
```

### Performance Monitoring
- Use React DevTools for component analysis
- Monitor Network tab for API performance
- Check Lighthouse scores for optimization opportunities

## 📚 Technology Stack

### Core Framework
- **Next.js 14**: React framework with App Router
- **React 18**: UI library with concurrent features
- **TypeScript**: Type-safe JavaScript development

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **CSS Variables**: Dynamic theming support

### Development Tools
- **ESLint**: Code linting and style enforcement
- **PostCSS**: CSS processing for Tailwind
- **Autoprefixer**: CSS vendor prefix automation

### API & State
- **Axios**: HTTP client for API requests
- **React Hooks**: State management (useState, useEffect)
- **Error Boundaries**: Graceful error handling

## 🤝 Contributing

### Code Style
- Use TypeScript for all new components
- Follow existing naming conventions
- Add prop types and component documentation
- Implement responsive design patterns
- Handle loading and error states

### Git Workflow
- Create feature branches from main
- Write descriptive commit messages
- Test changes before submitting
- Update documentation as needed

## 📄 License

This project is part of The Council of the Twenty-Seven application.
