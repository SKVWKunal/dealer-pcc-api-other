# Quick Start Guide - One Aftersales

## 🚀 Get Started in 5 Minutes

### For Developers

#### 1. Clone & Setup (2 minutes)
```bash
git clone <your-repo-url>
cd "Dealer PCC, API, Survey Project"
npm install
```

#### 2. Start Development (1 minute)
```bash
npm run dev
```

Open browser: **http://localhost:8080**

#### 3. Start Building! (2 minutes)
Edit any file in `src/` → Changes appear instantly in browser

---

### For Project Managers / Stakeholders

#### Want to see the latest build?
1. Go to: https://your-vercel-domain.vercel.app
2. (Or wherever you deployed it)

#### Report an issue?
1. Create GitHub Issue
2. Describe what you see vs. what you expect
3. Include browser console errors (F12)

#### Request a feature?
1. Create GitHub Discussion
2. Explain the use case
3. Include mockups/wireframes if possible

---

## 📁 Where to Find Things

| Task | Location |
|------|----------|
| **Want to add a page?** | Create in `src/pages/` |
| **Want to add a component?** | Create in `src/components/` |
| **Want to call an API?** | Add service in `src/services/` |
| **Want to add a form?** | Use `src/components/ui/` components |
| **Want to change colors?** | Edit `src/index.css` (already VW/Skoda branded!) |
| **Want to deploy?** | See `DEPLOYMENT.md` |

---

## 🎨 Design System

### Brand Colors (Already Applied)
- **VW Blue**: Primary actions and headers
- **Light Blue**: Accents and interactive elements
- **Skoda Green**: Success and positive states
- **Smart Dark Mode**: Automatically adapts in dark mode

See `BRAND_COLORS.md` for detailed color reference.

### Components Available
All UI components are pre-built and ready to use:
```jsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// ... and many more in src/components/ui/
```

Full list in: `src/components/ui/`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | Project overview & features |
| **SETUP_AND_TESTING.md** | Local setup & development guide |
| **DEPLOYMENT.md** | Hosting & deployment options (with steps!) |
| **BRAND_COLORS.md** | Color palette & usage guide |
| **.env.example** | Environment variables template |

---

## ✅ Testing Before Deploy

```bash
# 1. Check for code issues
npm run lint

# 2. Build for production
npm run build

# 3. Test production build locally
npm run preview
```

All tests pass? ✅ Ready to deploy!

---

## 🌐 Deployment (Choose One)

### Option 1: Vercel (Recommended - 5 min)
```bash
1. Push code to GitHub
2. Go to vercel.com
3. Click "New Project"
4. Select your repo
5. Click "Deploy"
```
Done! Get automatic URL like: `your-project.vercel.app`

### Option 2: Netlify (Also Easy)
```bash
1. Go to netlify.com
2. Click "New site from Git"
3. Select repo
4. Auto-detects build settings
5. Deploy
```

### Option 3: Other Platforms
See detailed steps in `DEPLOYMENT.md`:
- AWS S3 + CloudFront
- GitHub Pages
- Docker + VPS
- Azure Static Web Apps

---

## 🔧 Common Tasks

### Add a New Page
```typescript
// 1. Create file: src/pages/MyPage.tsx
import { Button } from "@/components/ui/button";

export default function MyPage() {
  return <div>Hello!</div>;
}

// 2. Add route in src/App.tsx
<Route path="/my-page" element={<MyPage />} />

// 3. Add link in navigation
// (usually in src/components/layout/Sidebar.tsx or Header.tsx)
```

### Create a Form
```typescript
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MyForm() {
  const { register, handleSubmit } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("name")} />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Call an API
```typescript
// 1. Add service in src/services/myService.ts
export async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}

// 2. Use in component
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/services/myService";

export function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

---

## ⚠️ Common Gotchas

### "Port 8080 is already in use"
```bash
# Kill the process
lsof -ti:8080 | xargs kill -9
npm run dev
```

### "Changes aren't showing up"
```bash
# Clear browser cache
Ctrl + Shift + Delete

# Or restart dev server
Stop: Ctrl+C
Start: npm run dev
```

### "Build fails with TypeScript errors"
```bash
# See all errors
npx tsc --noEmit

# Fix them or ignore with @ts-ignore (not recommended)
```

### "API calls not working"
1. Check `.env.local` has correct `VITE_API_URL`
2. Check API endpoint is running
3. Check browser console (F12) for CORS errors
4. Check Network tab in DevTools to see actual request

---

## 📞 Getting Help

### Problem: I don't know how to do X

1. **Search the codebase**: Use Ctrl+Shift+F in VS Code
2. **Look at existing examples**: Browse `src/pages/` and `src/components/`
3. **Check documentation**: Search in `*.md` files
4. **Search online**: Stack Overflow, React docs, Tailwind docs

### Problem: Something is broken

1. **Check console errors**: Open F12 → Console tab
2. **Search GitHub issues**: Same problem reported?
3. **Create new issue**: Describe the problem + console errors
4. **Contact development team**: For urgent issues

### Problem: I want to learn more

- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Shadcn UI: https://ui.shadcn.com
- Vite: https://vitejs.dev

---

## 🚀 Your Development Workflow

```
1. Pull latest code
   git pull origin main

2. Create feature branch
   git checkout -b feature/my-feature

3. Start dev server
   npm run dev

4. Make changes
   Edit src/ files

5. Test locally
   npm run lint && npm run build && npm run preview

6. Commit changes
   git add .
   git commit -m "feat: add my feature"

7. Push and create PR
   git push origin feature/my-feature
   (Create Pull Request on GitHub)

8. Merge after review
   (GitHub merge button)

9. Deploy to production
   (Auto-deploy from main branch)
```

---

## 💡 Pro Tips

### Tip 1: Use VS Code Extensions
```
ESLint - Catch errors while typing
Prettier - Auto-format code
Tailwind CSS IntelliSense - Auto-complete Tailwind classes
GitLens - See git history in editor
```

### Tip 2: Keyboard Shortcuts
```
Ctrl+Shift+F    Search workspace
Ctrl+P          Quick file open
Ctrl+H          Find & replace
Ctrl+/          Comment/uncomment
Ctrl+Shift+B    Run build task
F12             Open DevTools
```

### Tip 3: Use React DevTools
- Chrome/Firefox extension: "React Developer Tools"
- Inspect component props and state
- Track re-renders
- Performance profiling

### Tip 4: Create Reusable Components
- Don't repeat code
- Extract to `src/components/`
- Make it configurable via props
- Add TypeScript types

### Tip 5: Use Git Effectively
```bash
# Commit frequently with good messages
git commit -m "fix: resolve button styling issue"

# Create feature branches for big changes
git checkout -b feature/new-survey-type

# Use git log to see history
git log --oneline -10
```

---

## 📊 Project Stats

```
Framework:        React 18 with TypeScript
Build Tool:       Vite (Lightning fast! ⚡)
Styling:          Tailwind CSS + Shadcn UI
Components:       50+ Pre-built UI components
Bundle Size:      ~150KB (gzipped)
Build Time:       ~5 seconds
Dev Server:       Hot reload (changes instant!)
Package Count:    ~300 dependencies
```

---

## ✨ Features at a Glance

- ✅ Modern React with TypeScript
- ✅ Beautiful UI with Tailwind CSS
- ✅ Dark mode support
- ✅ Responsive design (mobile-first)
- ✅ Form validation (Zod)
- ✅ Data fetching (React Query)
- ✅ Charts & visualizations (Recharts)
- ✅ Authentication ready
- ✅ Protected routes
- ✅ API integration ready
- ✅ Admin console included
- ✅ Export functionality
- ✅ Audit logging
- ✅ Survey management

---

## 📱 Testing on Mobile

```bash
# Get your machine IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig                # Windows → look for IPv4 Address

# Access on phone (same WiFi)
http://192.168.1.100:8080
```

---

## 🎯 Success Criteria Checklist

Before marking project as "ready":

- [ ] Code builds without errors (`npm run build`)
- [ ] No linting issues (`npm run lint`)
- [ ] All pages load correctly
- [ ] Forms validate properly
- [ ] API calls work
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Deployed and accessible
- [ ] Team is trained

---

## 📞 Contact & Support

- **Development Lead**: [Name/Email]
- **Documentation**: This repo's `/docs` folder
- **Issues**: GitHub Issues
- **Chat**: [Slack/Teams channel]
- **Status Page**: [Link]

---

**Ready to start? Go to terminal and type:**

```bash
npm install && npm run dev
```

**Welcome to the team! 🎉**

---

*Last Updated: January 18, 2026*
*Version: 1.0*
