# Quick Reference Guide

## One Aftersales - Dealer Service Management Platform

### Available Scripts

```bash
# Development
npm run dev          # Start development server on port 8080

# Build
npm run build        # Production build
npm run build:dev    # Development build

# Preview
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

### Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── dist/               # Production build output
```

### Key Features

- **PCC Management** - Dealer participation in Performance Center Program
- **Surveys** - Technical, Warranty, and Workshop surveys
- **MT Meets** - Event registration and management
- **API Registration** - API registration and documentation
- **Admin Console** - Audit logs and module management

### Tech Stack

- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS + Shadcn UI
- React Router v6
- React Query (TanStack Query)
- React Hook Form + Zod validation

### Brand Colors

**Volkswagen:**
- Primary: #001F3F
- Accent: #00ADEF

**Skoda:**
- Primary: #00A651

### Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for AWS and production hosting instructions.
