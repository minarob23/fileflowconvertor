# Design Guidelines: Document-to-PDF Converter

## Design Approach
**Selected Approach**: Design System with Productivity Focus

**Inspiration**: Dropbox, Notion, Linear - Clean utility applications that prioritize clarity, efficiency, and trust. The design should feel professional, reliable, and make complex file operations feel simple.

**Core Principles**:
- Clarity over decoration
- Progressive disclosure of complexity
- Immediate visual feedback for all actions
- Trust through consistency and polish

---

## Color Palette

**Light Mode**:
- Primary: 217 91% 60% (Trustworthy blue for CTAs and interactive elements)
- Background: 0 0% 100% (Pure white)
- Surface: 220 13% 97% (Subtle gray for cards/containers)
- Border: 220 13% 91% (Dividers and outlines)
- Text Primary: 222 47% 11% (Near black for headings)
- Text Secondary: 215 14% 34% (Muted for descriptions)
- Success: 142 71% 45% (Conversion complete)
- Error: 0 84% 60% (Failed conversions)
- Warning: 38 92% 50% (Processing state)

**Dark Mode**:
- Primary: 217 91% 60% (Same blue, works on dark)
- Background: 222 47% 11% (Deep navy-black)
- Surface: 217 33% 17% (Elevated surfaces)
- Border: 217 33% 24% (Subtle borders)
- Text Primary: 210 40% 98% (Near white)
- Text Secondary: 217 20% 65% (Muted gray)

---

## Typography

**Font Families**:
- Primary: Inter (via Google Fonts) - Clean, modern, excellent readability
- Monospace: JetBrains Mono - For file names and technical details

**Type Scale**:
- Hero/Display: text-5xl font-bold (Dashboard headings)
- Page Title: text-3xl font-semibold (Section headers)
- Card Title: text-lg font-semibold (File names, conversion cards)
- Body: text-base font-normal (Descriptions, status messages)
- Small: text-sm (Metadata, timestamps)
- Tiny: text-xs (Labels, helper text)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 24 for consistency
- Micro spacing: p-2, gap-2 (tight groups)
- Standard spacing: p-4, gap-4, mb-6 (component padding)
- Section spacing: p-8, py-12 (card interiors)
- Page spacing: p-16, py-24 (outer containers)

**Container Strategy**:
- Max-width: max-w-7xl mx-auto (main dashboard)
- Upload area: max-w-3xl mx-auto (focused conversion zone)
- Auth pages: max-w-md mx-auto (narrow forms)

**Grid System**:
- File history: grid-cols-1 gap-4 (mobile stacks)
- Stats dashboard: grid md:grid-cols-3 gap-6 (metrics)
- Feature showcase: grid md:grid-cols-2 gap-8 (balanced content)

---

## Component Library

**Navigation**:
- Fixed top navbar with logo, navigation links, user profile
- Height: h-16 with backdrop blur effect
- Minimal, clean with primary actions on right
- Mobile: Hamburger menu with slide-out drawer

**File Upload Zone**:
- Large drag-and-drop area with dashed border (border-dashed border-2)
- Center-aligned upload icon (cloud-arrow-up, size 48px)
- "Drop files here or click to browse" messaging
- Accepted formats displayed below: .docx, .xlsx, .pptx
- Hover state: Background shifts to surface color with border highlight
- Active drag state: Primary color border with elevated shadow

**File Cards** (Conversion History):
- White/Surface background with subtle shadow and rounded corners (rounded-xl)
- Left: Document icon with colored background matching file type (Word=blue, Excel=green, PPT=orange)
- Center: Filename (truncated with ellipsis), file size, timestamp
- Right: Status badge (Success/Processing/Failed with appropriate colors) + Download button
- Hover: Gentle lift effect (shadow increase)

**Progress Indicators**:
- Linear progress bar with animated gradient during conversion
- Percentage display above bar
- Processing spinner icon for queued files
- Smooth transitions between states

**Buttons**:
- Primary: Solid primary color background, white text, rounded-lg, px-6 py-3
- Secondary: Border with primary color, primary text color, same padding
- Danger: Red background for delete actions
- All buttons: Smooth hover scale (scale-105) and shadow increase

**Form Inputs** (Auth):
- Full-width inputs with consistent height (h-12)
- Border in default state, primary border on focus
- Clear placeholder text
- Labels above inputs (text-sm font-medium mb-2)
- Error states with red border + error message below

**Status Badges**:
- Rounded-full px-3 py-1 text-xs font-medium
- Success: Green background (opacity 20%) with dark green text
- Processing: Yellow/Orange with animated pulse
- Failed: Red background with white text

**Dashboard Stats Cards**:
- Grid layout with 3 columns on desktop
- Icon + number + label structure
- Subtle background with border
- Conversions today, Total files, Success rate metrics

---

## Animations

**Minimal, Purposeful Motion**:
- File upload: Subtle fade-in and slide-up when added to queue
- Progress bar: Smooth width transition (transition-all duration-300)
- Button hover: Quick scale (transition-transform duration-150)
- Status changes: Color fade transitions (transition-colors)
- NO scroll-triggered animations, parallax, or decorative motion

---

## Page-Specific Layouts

**Landing/Marketing Page**:
- Hero: Clean centered layout with headline, subheadline, primary CTA
- Background: Subtle gradient from white to surface color
- Hero image: Illustration showing document conversion flow (right side, 50% width)
- Features: 3-column grid showcasing key benefits with icons
- How it works: 3-step visual process (upload → convert → download)
- Footer: Minimal with links, no newsletter signup

**Dashboard** (Post-login):
- Top stats row: 3 metric cards
- Main area: File upload zone (prominent when no files)
- Conversion history: Chronological list with filters (All/Completed/Failed)
- Empty state: Friendly illustration + "Upload your first document" message

**Authentication Pages**:
- Centered card on clean background
- Logo at top
- Form fields with good spacing (mb-4)
- Social login buttons with icons (Google, GitHub)
- Clear navigation between login/signup/reset password

---

## Images

**Hero Section**: Yes, include a hero image
- Modern 3D illustration showing documents transforming into PDFs
- Positioned on right 50% of hero section
- Style: Clean, minimal, uses primary color palette
- Alternative: Abstract geometric representation of file conversion

**Dashboard Empty State**:
- Illustration of cloud upload or document icon
- Friendly, encouraging visual

**File Type Icons**:
- Use Font Awesome or Heroicons for standard file icons
- Custom colored backgrounds for each type in conversion history

---

## Accessibility & Dark Mode

- Maintain full dark mode support across entire application
- All form inputs, cards, and interactive elements styled for both themes
- WCAG AA contrast ratios maintained in both modes
- Focus states clearly visible with primary color ring
- Screen reader labels for all interactive elements