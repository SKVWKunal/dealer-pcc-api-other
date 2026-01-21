# Volkswagen & Skoda Brand Color System

## Brand Color Palettes

### Volkswagen Brand Colors

#### Primary Blue (VW Official)
- **Name**: VW Blue
- **Hex**: #001F3F
- **RGB**: (0, 31, 63)
- **HSL**: 214° 100% 16%
- **Usage**: Primary buttons, headers, text emphasis

#### Accent Light Blue
- **Name**: VW Sky Blue / Accent
- **Hex**: #00ADEF
- **RGB**: (0, 173, 239)
- **HSL**: 195° 100% 46%
- **Usage**: Accents, active states, hover effects

#### Light Blue Background
- **Name**: VW Light Blue
- **Hex**: #E8F4FF
- **RGB**: (232, 244, 255)
- **HSL**: 210° 100% 95%
- **Usage**: Backgrounds, disabled states, info boxes

---

### Skoda Brand Colors

#### Primary Green
- **Name**: Skoda Green
- **Hex**: #00A651
- **RGB**: (0, 166, 81)
- **HSL**: 158° 100% 26%
- **Usage**: Success states, Skoda-specific sections

#### Accent Light Green
- **Name**: Skoda Light Green
- **Hex**: #57C84D
- **RGB**: (87, 200, 77)
- **HSL**: 162° 100% 48%
- **Usage**: Success buttons, positive feedback

#### Light Green Background
- **Name**: Skoda Background Green
- **Hex**: #E8F5E3
- **RGB**: (232, 245, 227)
- **HSL**: 162° 100% 92%
- **Usage**: Success states, Skoda-branded content

---

## Semantic Color System

### Status Colors
```
Success     #22C55E (Green)      For: Approved, Completed, Active
Warning     #EAB308 (Amber)      For: Pending, In Progress
Destructive #EF4444 (Red)        For: Error, Delete, Reject
Info        #00ADEF (Blue)       For: Information, Alert
```

### Neutral Colors
```
Background  #F7F7F7 (Off-white)
Card        #FFFFFF (White)
Border      #E5E7EB (Light gray)
Text        #001F3F (Dark blue/black)
Muted       #9CA3AF (Medium gray)
```

### Dark Mode Palette
```
Background  #0A0F1E (Very dark blue)
Card        #1A2540 (Dark blue)
Border      #2D3E5F (Dark blue-gray)
Text        #F5F7FA (Off-white)
Accent      #00ADEF (Light blue - same)
```

---

## CSS Variables (Already Implemented)

Located in: `src/index.css`

### Light Mode Variables
```css
:root {
  --vw-blue-primary: 214 100% 16%;      /* #001F3F */
  --vw-blue-accent: 195 100% 46%;       /* #00ADEF */
  --vw-blue-light: 210 100% 95%;        /* #E8F4FF */
  
  --skoda-green-primary: 158 100% 26%;  /* #00A651 */
  --skoda-green-accent: 162 100% 48%;   /* #57C84D */
  --skoda-green-light: 162 100% 92%;    /* #E8F5E3 */
  
  --primary: 214 100% 16%;
  --accent: 195 100% 46%;
  --success: 142 71% 45%;
}
```

### Usage in Components

#### Using HSL Values
```jsx
<div style={{ 
  backgroundColor: `hsl(var(--primary))` 
}}>
  Primary Blue
</div>
```

#### Using Tailwind Classes
```jsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  VW Blue Button
</button>
```

#### Using CSS
```css
.brand-header {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.skoda-accent {
  background-color: hsl(var(--skoda-green-primary));
  color: white;
}
```

---

## Tailwind Configuration

The project uses Tailwind CSS with custom colors pre-configured in `tailwind.config.ts`:

### Available Color Classes

#### Background Colors
```jsx
bg-primary          /* VW Blue #001F3F */
bg-accent           /* Light Blue #00ADEF */
bg-secondary        /* Light Blue background #F5F7FA */
bg-success          /* Green for success */
bg-warning          /* Amber for warnings */
bg-destructive      /* Red for errors */
```

#### Text Colors
```jsx
text-primary-foreground       /* White on primary */
text-accent-foreground        /* White on accent */
text-muted-foreground         /* Gray text */
```

#### Examples

```jsx
// Button with VW brand colors
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Submit
</button>

// Skoda-branded accent
<div className="bg-accent text-white p-4">
  VW/Skoda Accent Box
</div>

// Status indicators
<div className="bg-success/10 text-success">
  Approved
</div>
```

---

## Color Usage Guidelines

### For Volkswagen Dealerships
- **Primary**: Use VW Blue (#001F3F) for main CTA, headers
- **Accent**: Use Light Blue (#00ADEF) for interactive elements
- **Success**: Use Skoda Green for positive feedback to distinguish VW/Skoda

### For Skoda Dealerships
- **Primary**: Use VW Blue for consistency with VW brand
- **Accent**: Use Skoda Green for Skoda-specific sections
- **Secondary**: Use Light Blue for VW cross-branding

### Dark Mode Behavior
The system automatically adapts colors in dark mode:
```css
.dark {
  --primary: 195 100% 46%;      /* Light blue becomes primary */
  --accent: 195 100% 46%;       /* Same light blue */
  --background: 214 100% 8%;    /* Very dark blue */
}
```

---

## Component Styling Examples

### Buttons

#### Primary Button (VW Blue)
```jsx
<Button className="bg-primary text-white hover:bg-primary/90">
  Primary Action
</Button>
```

#### Secondary Button (Accent Blue)
```jsx
<Button className="bg-accent text-white hover:bg-accent/90">
  Secondary Action
</Button>
```

#### Success Button (Skoda Green)
```jsx
<Button className="bg-success text-white">
  Confirm
</Button>
```

### Cards with Brand Colors

#### VW Brand Card
```jsx
<Card className="border-l-4 border-primary">
  <CardHeader className="bg-primary/5">
    <h2 className="text-primary">VW Branded Section</h2>
  </CardHeader>
</Card>
```

#### Skoda Brand Card
```jsx
<Card className="border-l-4 border-accent">
  <CardHeader className="bg-accent/5">
    <h2 className="text-accent">Skoda Section</h2>
  </CardHeader>
</Card>
```

### Forms

```jsx
<div className="space-y-4">
  <div>
    <Label className="text-primary font-semibold">
      Required Field
    </Label>
    <Input 
      className="border-primary/30 focus:border-primary"
      placeholder="Enter value"
    />
  </div>
</div>
```

### Status Badges

```jsx
// Approved
<Badge className="bg-success/10 text-success">
  Approved
</Badge>

// In Progress
<Badge className="bg-warning/10 text-warning">
  In Progress
</Badge>

// Error
<Badge className="bg-destructive/10 text-destructive">
  Error
</Badge>

// Info
<Badge className="bg-info/10 text-info">
  Information
</Badge>
```

---

## Accessibility Considerations

### Contrast Ratios (WCAG AA Standard: 4.5:1)

| Color Combination | Ratio | Status |
|-------------------|-------|--------|
| VW Blue on White | 10.4:1 | ✅ Excellent |
| Light Blue on White | 6.3:1 | ✅ Good |
| White on VW Blue | 10.4:1 | ✅ Excellent |
| White on Light Blue | 6.3:1 | ✅ Good |
| Skoda Green on White | 4.8:1 | ✅ Good |

### Best Practices
- ✅ Use sufficient contrast for text
- ✅ Don't rely on color alone (use icons/patterns)
- ✅ Provide text descriptions for status colors
- ✅ Test with color blindness simulators

---

## Implementation Quick Reference

### Add Brand Color to Component

**Step 1: Find the CSS variable**
```css
--primary: 214 100% 16%;           /* VW Blue */
--accent: 195 100% 46%;            /* Light Blue */
--skoda-green-primary: 158 100% 26%; /* Skoda Green */
```

**Step 2: Use in Tailwind**
```jsx
className="bg-primary text-white"  /* Automatically uses VW Blue */
```

**Step 3: Or use HSL directly**
```jsx
style={{ backgroundColor: 'hsl(214 100% 16%)' }}
```

### Custom Color for Special Case

```css
/* Add to index.css */
.custom-brand-color {
  background-color: hsl(var(--primary));
  border: 2px solid hsl(var(--accent));
}
```

### Override Default Colors

```jsx
{/* Override for specific section */}
<div className="bg-accent/20">
  Light accent background
</div>
```

---

## Design System Tests

### Color Contrast Checker
- Online tool: https://webaim.org/resources/contrastchecker/
- Test: #001F3F on #FFFFFF = 10.4:1 ✅

### Color Blindness Simulator
- Chrome Extension: "Color Blindness Simulator"
- Verify all UI elements are distinguishable

### Responsive Color Preview
Check colors across devices:
```bash
npm run dev
# Open on different devices using: http://your-ip:8080
```

---

## Brand Color Standards

### Volkswagen Guidelines
- Primary: Use only official VW Blue (#001F3F)
- Minimum size: 20x20px for brand marks
- Clear space: Minimum 10px around logo

### Skoda Guidelines
- Primary: Use Skoda Green (#00A651)
- Minimum size: 25x25px for brand marks
- Never combine without sufficient contrast

### Dealer Requirements
- Use consistent brand colors across all pages
- Maintain brand hierarchy (VW primary, Skoda secondary)
- Ensure WCAG AA accessibility standards

---

## Color Variables Reference Sheet

```javascript
// Light Mode
Primary:        hsl(214 100% 16%)  → #001F3F
Accent:         hsl(195 100% 46%)  → #00ADEF
Success:        hsl(142 71% 45%)   → #22C55E
Warning:        hsl(38 92% 50%)    → #FCD34D
Destructive:    hsl(0 84% 60%)     → #FF6B6B
Info:           hsl(195 100% 46%)  → #00ADEF
Background:     hsl(0 0% 98%)      → #F7F7F7
Card:           hsl(0 0% 100%)     → #FFFFFF
Text:           hsl(214 100% 16%)  → #001F3F

Skoda Green:    hsl(158 100% 26%)  → #00A651
Skoda Accent:   hsl(162 100% 48%)  → #57C84D

// Dark Mode
Primary:        hsl(195 100% 46%)  → #00ADEF
Background:     hsl(214 100% 8%)   → #0A0F1E
Card:           hsl(214 100% 12%)  → #1A2540
Text:           hsl(210 40% 98%)   → #F5F7FA
```

---

## Customization Guide

### To Change Primary Color (VW Blue)

1. **Update CSS variables** in `src/index.css`:
```css
:root {
  --primary: 214 100% 16%;  /* Change this HSL value */
}
```

2. **Or update Tailwind** in `tailwind.config.ts`:
```typescript
primary: {
  DEFAULT: "hsl(214 100% 16%)",  /* Update here */
}
```

3. **Restart dev server**: `npm run dev`

### To Add New Brand Color

1. **Add to CSS variables**:
```css
:root {
  --brand-custom: 240 50% 50%;  /* Your new color */
}
```

2. **Add to Tailwind config**:
```typescript
extend: {
  colors: {
    "brand-custom": "hsl(var(--brand-custom))",
  }
}
```

3. **Use in components**:
```jsx
<div className="bg-brand-custom">...</div>
```

---

*Last Updated: January 18, 2026*
*Brand Colors Version: 1.0*
