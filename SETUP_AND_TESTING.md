# Setup & Testing Guide

## Local Development Setup

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn/pnpm)
- Git
- Code editor (VS Code recommended)

### Installation Steps

**Step 1: Clone Repository**
```bash
git clone <repository-url>
cd "Dealer PCC, API, Survey Project"
```

**Step 2: Install Dependencies**
```bash
npm install
```

This installs ~300 packages. Takes ~2-5 minutes depending on internet speed.

**Step 3: Setup Environment**
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values (optional for dev)
# nano .env.local
```

**Step 4: Start Development Server**
```bash
npm run dev
```

Output:
```
VITE v5.4.19  ready in 123 ms

➜  Local:   http://localhost:8080/
➜  press h to show help
```

Open your browser → `http://localhost:8080/`

---

## Project Structure Explained

```
src/
├── components/           # React Components
│   ├── layout/          # Page layout (Header, Sidebar)
│   ├── survey/          # Survey form components
│   ├── ui/              # Pre-built UI components (Shadcn)
│   ├── ProtectedRoute   # Authentication wrapper
│   └── NavLink          # Navigation component
│
├── pages/               # Full pages
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Login.tsx        # Login page
│   ├── admin/           # Admin pages
│   ├── api/             # API registration pages
│   ├── pcc/             # PCC management pages
│   ├── mtmeet/          # MT meet pages
│   └── survey/          # Survey pages
│
├── services/            # API calls & business logic
│   ├── auth.ts          # Authentication service
│   ├── pcc.ts           # PCC API calls
│   ├── apiRegistration  # API registration service
│   └── ...other services
│
├── types/               # TypeScript interfaces
│   ├── index.ts         # Common types
│   ├── survey.ts        # Survey types
│   └── ...other types
│
├── contexts/            # React Context (Global State)
│   ├── AuthContext      # Authentication state
│   └── FeatureFlagContext # Feature flags
│
├── hooks/               # Custom React Hooks
│   ├── use-toast        # Toast notifications
│   └── use-mobile       # Mobile detection
│
├── lib/                 # Utilities
│   └── utils.ts         # Helper functions
│
├── utils/               # More utilities
│   └── validation.ts    # Form validation
│
├── App.tsx              # Main App component
├── main.tsx             # React entry point
└── index.css            # Global styles (Tailwind + custom)
```

---

## Development Workflow

### Making Changes

1. **Edit a file** (e.g., `src/pages/Dashboard.tsx`)
2. **Save** (Ctrl+S)
3. **Browser auto-refreshes** (HMR - Hot Module Replacement)
4. Changes appear instantly!

### Create New Page

```typescript
// src/pages/MyNewPage.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MyNewPage() {
  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold">My New Page</h1>
        <Button>Click Me</Button>
      </Card>
    </div>
  );
}
```

### Add New Route

Edit `src/App.tsx`:
```typescript
import MyNewPage from "@/pages/MyNewPage";

<Route path="/my-new-page" element={<MyNewPage />} />
```

### Create New Component

```typescript
// src/components/MyComponent.tsx
import { Button } from "@/components/ui/button";

interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

export default function MyComponent({ title, onSubmit }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
```

---

## Available npm Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:8080)

# Production Build
npm run build            # Create optimized build for production
npm run build:dev        # Build in development mode

# Preview & Testing
npm preview              # Test production build locally
npm run lint             # Run ESLint to check code quality

# Other
npm install              # Install/update dependencies
npm outdated             # Check for outdated packages
npm update               # Update all packages
npm audit                # Check for security issues
```

---

## Build & Deployment Testing

### Step 1: Build Locally
```bash
npm run build
```

This creates `dist/` folder with production-ready files.

```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-XXXX.js   # Minified JavaScript (bundled)
│   ├── index-XXXX.css  # Minified CSS (bundled)
│   └── ...images
└── robots.txt          # SEO
```

### Step 2: Test Build
```bash
npm run preview
```

This runs your built production version locally (http://localhost:4173)

### Step 3: Check File Sizes
```bash
ls -lh dist/
# or with npm
npm run build -- --report
```

### Step 4: Verify No Errors
```bash
npm run lint

# Fix linting errors automatically
npx eslint . --fix
```

---

## Testing Checklist

### Local Development
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts successfully
- [ ] Application loads at http://localhost:8080
- [ ] No console errors (F12 → Console)
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Forms submit without errors
- [ ] Responsive design (resize browser)

### Code Quality
- [ ] `npm run lint` passes (0 errors/warnings)
- [ ] No TypeScript errors (Ctrl+Shift+B if using VS Code)
- [ ] No console warnings

### Build Process
- [ ] `npm run build` completes successfully
- [ ] No build errors or warnings
- [ ] `dist/` folder created with all assets
- [ ] All CSS is bundled (no separate CSS files in src/)

### Production Build Testing
- [ ] `npm run preview` starts successfully
- [ ] Application loads at preview URL
- [ ] All features work identically to dev
- [ ] No console errors in preview
- [ ] Performance is acceptable

### Performance
- [ ] Bundle size reasonable (<2MB for JavaScript)
- [ ] Images optimized
- [ ] No unused dependencies
- [ ] Lighthouse scores (run in Chrome DevTools → Lighthouse)
  - Performance: > 80
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 90

---

## Debugging Guide

### Browser Console Issues

**White screen after load:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check that API endpoints are correct in `.env.local`

**Component not rendering:**
1. Check if component is imported
2. Verify route path is correct
3. Check for TypeScript errors
4. Clear browser cache (Ctrl+Shift+Delete)

**State not updating:**
1. Check if using hooks correctly (useState, useContext)
2. Verify useEffect dependencies
3. Check for missing async/await
4. Use React DevTools Extension for state inspection

### Build Issues

**Build fails with "Cannot find module"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**TypeScript errors in build**
```bash
# Check specific file
npx tsc --noEmit src/pages/MyPage.tsx

# Generate detailed report
npx tsc --listFiles --noEmit
```

**Slow build times**
```bash
# Check what's taking time
npm run build -- --profile

# Analyze bundle
npm install --save-dev rollup-plugin-visualizer
# Then add to vite.config.ts and check dist/stats.html
```

---

## Common Tasks

### Add New UI Component from Shadcn

```bash
# List available components
npx shadcn-ui@latest list

# Add a component
npx shadcn-ui@latest add dialog

# Now import and use
import { Dialog, DialogContent } from "@/components/ui/dialog";
```

### Install New Package

```bash
npm install package-name

# Or for development only
npm install --save-dev package-name

# Remove package
npm uninstall package-name
```

### Update All Packages

```bash
# Check what's outdated
npm outdated

# Update everything
npm update

# Update to latest major version
npm install -g npm-check-updates
ncu -u
npm install
```

### Check Security Vulnerabilities

```bash
# Find vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Fix including major version changes (use carefully)
npm audit fix --force
```

---

## Git Workflow

### First Time Setup
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Daily Workflow
```bash
# Before starting work
git pull origin main

# Make changes, then:
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin main

# Or for feature branches
git checkout -b feature/my-feature
# ... make changes ...
git push origin feature/my-feature
# Then create Pull Request on GitHub
```

### Good Commit Messages
```
✅ Good:
feat: add user authentication
fix: resolve dashboard loading issue
docs: update README with setup steps

❌ Bad:
updated stuff
fixed bug
changes
```

---

## VSCode Extensions (Optional but Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",              // ESLint
    "esbenp.prettier-vscode",              // Code formatting
    "bradlc.vscode-tailwindcss",           // Tailwind autocomplete
    "vue.volar",                           // TypeScript support
    "dsznajder.es7-react-js-snippets",     // React snippets
    "eamodio.gitlens",                     // Git integration
    "ms-azuretools.vscode-docker"          // Docker support
  ]
}
```

Install via: Extensions icon (Ctrl+Shift+X) → Install recommended

---

## Environment Variables Reference

Available in `vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENVIRONMENT: 'development' | 'production' | 'staging';
}
```

Usage in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const env = import.meta.env.VITE_ENVIRONMENT;
```

---

## Performance Optimization Tips

### Already Implemented ✅
- Code splitting (automatic with Vite)
- Lazy route loading
- Component lazy loading
- Minification
- Tree shaking
- CSS optimization

### Additional Optimizations
```typescript
// Lazy load heavy components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Use Suspense for fallback
<Suspense fallback={<Spinner />}>
  <HeavyComponent />
</Suspense>

// Memoize expensive computations
const MemoComponent = React.memo(MyComponent);
const memoizedValue = useMemo(() => computeExpensiveValue(), [dependency]);
```

---

## Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| Port 8080 already in use | Kill process: `lsof -ti:8080 | xargs kill -9` |
| Node modules corrupted | `rm -rf node_modules && npm install` |
| Cache issues | `npm cache clean --force` |
| Git conflicts | `git merge --abort` then try again |
| TypeScript errors | `npx tsc --noEmit` to see all errors |
| Hot reload not working | Restart dev server: `npm run dev` |

---

## Next Steps

1. ✅ Run `npm install` successfully
2. ✅ Run `npm run dev` and see it working
3. ✅ Open http://localhost:8080 in browser
4. ✅ Make a small change to see HMR work
5. ✅ Run `npm run build` to create production build
6. ✅ Read through component structure
7. ⏭️ Start building your features!

---

*Last Updated: January 18, 2026*
