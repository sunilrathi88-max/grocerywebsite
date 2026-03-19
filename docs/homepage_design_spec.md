# Figma-Ready Frame Spec: rathinaturals.com Homepage Redesign

Based on your current site, here's a complete Figma specification with exact component names, styles, and auto-layout properties.

---

## 🎨 Design System Foundation

### Color Variables (Local Variables)

```
Primary/Brand
├─ primary-purple: #8B5CF6
├─ primary-red: #EF4444
├─ gradient-hero: linear-gradient(135deg, #8B5CF6 0%, #EF4444 100%)

Neutrals
├─ neutral-50: #F8FAFC
├─ neutral-100: #F1F5F9
├─ neutral-200: #E2E8F0
├─ neutral-300: #CBD5E1
├─ neutral-600: #475569
├─ neutral-700: #334155
├─ neutral-900: #0F172A

Semantic
├─ success-green: #10B981
├─ warning-yellow: #F59E0B
├─ accent-orange: #FF6B35
├─ sale-badge: #EF4444

UI States
├─ background-page: #F8FAFC
├─ background-card: #FFFFFF
├─ border-default: #E2E8F0
├─ text-primary: #0F172A
├─ text-secondary: #64748B
├─ text-muted: #94A3B8
```

### Typography (Text Styles)

```
Font Family: "Playfair Display" (Headings), "Inter" (Body)

H1/Hero-Title
├─ Font: Playfair Display, Bold (700)
├─ Size: 56px / 3.5rem
├─ Line height: 64px (114%)
├─ Letter spacing: -1%

H2/Section-Title
├─ Font: Playfair Display, Bold (700)
├─ Size: 36px / 2.25rem
├─ Line height: 44px (122%)
├─ Letter spacing: -0.5%

H3/Card-Title
├─ Font: Inter, Semibold (600)
├─ Size: 20px / 1.25rem
├─ Line height: 28px (140%)

Body/Regular
├─ Font: Inter, Regular (400)
├─ Size: 16px / 1rem
├─ Line height: 24px (150%)

Body/Small
├─ Font: Inter, Regular (400)
├─ Size: 14px / 0.875rem
├─ Line height: 20px (143%)

Label/Pill
├─ Font: Inter, Medium (500)
├─ Size: 12px / 0.75rem
├─ Line height: 16px (133%)
├─ Letter spacing: 2%
├─ Transform: UPPERCASE

Price/Large
├─ Font: Inter, Bold (700)
├─ Size: 24px / 1.5rem
├─ Line height: 32px

Price/Small
├─ Font: Inter, Semibold (600)
├─ Size: 18px / 1.125rem
├─ Line height: 24px
```

### Effects (Shadows)

```
shadow/card
├─ X: 0, Y: 1, Blur: 3, Spread: 0
├─ Color: #0F172A at 10%

shadow/card-hover
├─ X: 0, Y: 4, Blur: 12, Spread: 0
├─ Color: #0F172A at 15%

shadow/button
├─ X: 0, Y: 1, Blur: 2, Spread: 0
├─ Color: #0F172A at 8%
```

---

## 📐 Frame Structure & Components

### Canvas Setup

**Frame Name:** `Homepage-Desktop`

- Width: 1440px
- Height: Auto (expand as content grows)
- Background: `neutral-50`
- Layout: Vertical auto-layout
- Padding: 0
- Gap: 0

**Frame Name:** `Homepage-Mobile`

- Width: 375px
- Height: Auto
- Background: `neutral-50`
- Layout: Vertical auto-layout
- Padding: 0
- Gap: 0

---

## 1️⃣ Top Announcement Bar

**Component:** `TopBar/Announcement`

**Desktop Frame:**

- Width: Fill container (1440px)
- Height: 40px
- Background: `warning-yellow` with 10% opacity (#F59E0B1A)
- Auto-layout: Horizontal, center aligned
- Padding: Horizontal 60px

**Content:**

- Text: "🎉 Free shipping on all orders over ₹999 | Lab-tested purity guaranteed"
- Style: `Body/Small`, color: `neutral-900`

**Mobile:**

- Height: 48px
- Padding: 16px
- Text centered, smaller font if needed

---

## 2️⃣ Header / Navigation

**Component:** `Header/Main`

**Desktop Frame:**

- Width: Fill (1440px)
- Height: 80px
- Background: `#FFFFFF`
- Border: Bottom 1px, color `border-default`
- Position: Fixed (sticky)
- Auto-layout: Horizontal
- Padding: Horizontal 60px, Vertical 16px
- Gap: 48px

**Structure (Left to Right):**

### Logo Section

**Frame:** `Header/Logo`

- Width: Hug
- Auto-layout: Horizontal, center aligned
- Gap: 8px

**Content:**

- Text: "Rathi Naturals." (replace with logo image)
- Style: `H3/Card-Title`, size 24px
- Color: `neutral-900`

### Navigation Menu

**Frame:** `Header/Nav`

- Width: Hug
- Auto-layout: Horizontal, center aligned
- Gap: 32px

**Nav Items (Component:** `NavLink/Default`)

- Each link: Frame with auto-layout
- Padding: 8px 0px
- Text style: `Body/Regular`, medium (500)
- Color: `text-primary`
- Hover state: Add 2px bottom border, color `primary-purple`

**Links:** Home, Products ▾, Offers, Recipes, Blog, Contact

### Right Section

**Frame:** `Header/Actions`

- Width: Hug
- Auto-layout: Horizontal, right aligned
- Gap: 16px

**Components:**

1. Search bar (input field 200px wide)
2. Dark mode toggle icon
3. Wishlist icon with badge
4. Cart icon with badge (shows "1")
5. Login button

**Button Specs:**

- Component: `Button/Primary-Small`
- Padding: 12px 24px
- Radius: 8px
- Background: `primary-purple`
- Text: "Login", style `Body/Small`, medium, white

**Mobile Header:**

- Height: 64px
- Padding: 16px
- Show: Logo (left) + Hamburger menu (right)
- Hide desktop nav, show overlay menu on tap

---

## 3️⃣ Hero Section (Carousel)

**Component:** `Hero/ProductSlide`

**Desktop Frame:**

- Width: Fill (1440px)
- Height: 640px
- Background: `gradient-hero` (purple to red)
- Auto-layout: Horizontal
- Padding: 0

**Layout Structure:**

### Left Content Area

**Frame:** `Hero/Content`

- Width: 50% (720px)
- Padding: 80px 60px
- Auto-layout: Vertical, left aligned
- Gap: 24px

**Elements:**

1. **Pill Badge**
   - Component: `Badge/Pill-White`
   - Padding: 8px 16px
   - Radius: 999px
   - Background: `#FFFFFF` at 20%
   - Text: "WORLD'S FINEST GRADE A"
   - Style: `Label/Pill`, color white

2. **Headline**
   - Text: "Himalayan Saffron"
   - Style: `H1/Hero-Title`, color white
   - Width: 520px max

3. **Subheadline**
   - Text: "Pure Kashmiri Mongra saffron. Hand-harvested at dawn for maximum potency and aroma."
   - Style: `Body/Regular`, size 18px
   - Color: white at 90%
   - Width: 480px max

4. **CTA Button**
   - Component: `Button/Primary-Large-White`
   - Padding: 16px 32px
   - Radius: 999px (pill shape)
   - Background: white
   - Text: "Shop Saffron →"
   - Style: `Body/Regular`, medium (500), color `neutral-900`
   - Shadow: `shadow/button`

### Right Visual Area

**Frame:** `Hero/Visual`

- Width: 50% (720px)
- Contains large product image/illustration
- Use image with watermark/silhouette overlay

**Navigation Controls:**

**Arrow Buttons:**

- Component: `Hero/Arrow-Button`
- Size: 48×48px circle
- Position: Absolute, left & right edges
- Background: white at 20%
- Icon: chevron, 24px, white
- Hover: white at 40%

**Dot Indicators:**

- Component: `Hero/Dots`
- Position: Absolute bottom, center
- 3 dots, 8px diameter
- Gap: 8px
- Active: white, Inactive: white at 40%

**Mobile Hero:**

- Stack vertical: image on top (320px height), content below
- Padding: 40px 20px
- Full width

---

## 4️⃣ Why Choose Section (Benefits)

**Component:** `Section/Benefits`

**Desktop Frame:**

- Width: Fill (1440px)
- Padding: 80px 60px
- Background: `neutral-100`
- Auto-layout: Vertical
- Gap: 48px

**Section Header:**
**Frame:** `SectionHeader/Center`

- Width: Fill
- Auto-layout: Vertical, center aligned
- Gap: 12px

**Content:**

- Title: "Why Choose Our Spices"
- Style: `H2/Section-Title`, color `text-primary`
- Subtitle: "Sourced from the best regions with lab-tested purity"
- Style: `Body/Regular`, color `text-secondary`

**Cards Grid:**
**Frame:** `Benefits/Grid`

- Width: Fill (1200px content area)
- Auto-layout: Horizontal
- Gap: 24px
- Distribution: Space evenly

**Card Component:** `BenefitCard/Default`

- Width: 360px (1/3 minus gaps)
- Height: Hug (min 240px)
- Padding: 32px
- Radius: 16px
- Background: white
- Border: 1px, color `border-default`
- Shadow: `shadow/card`
- Auto-layout: Vertical
- Gap: 16px

**Card Content:**

1. Icon circle (48×48px, background `primary-purple` at 10%)
2. Title (Style: `H3/Card-Title`)
3. Description (Style: `Body/Small`, color `text-secondary`, 3 lines)
4. Link "Learn more →" (Style: `Body/Small`, color `primary-purple`)

**Example Cards:**

- Card 1: "Sourced from Best Regions"
- Card 2: "Lab-Tested Purity"
- Card 3: "Sealed for Freshness"

**Mobile:**

- Stack vertical, 1 card per row
- Card width: Fill minus 32px padding
- Gap: 16px

---

## 5️⃣ Featured Products Grid

**Component:** `Section/Products`

**Desktop Frame:**

- Width: Fill (1440px)
- Padding: 80px 60px
- Background: white
- Auto-layout: Vertical
- Gap: 32px

**Header Row:**
**Frame:** `Products/Header`

- Width: Fill
- Auto-layout: Horizontal, space between
- Align: Center

**Left Side:**

- Title: "Featured Products"
- Style: `H2/Section-Title`

**Right Side:**
**Frame:** `Products/Filters`

- Auto-layout: Horizontal
- Gap: 12px

**Filter Chips:** (Component: `Chip/Filter`)

- Padding: 8px 16px
- Radius: 999px
- Border: 1px, color `border-default`
- Text: `Body/Small`, medium
- Active state: Background `primary-purple`, text white

**Chips:** All | Spices | Nuts | Gift Boxes | Combos

**Products Grid:**
**Frame:** `Products/Grid`

- Width: Fill
- Auto-layout: Horizontal, wrap
- Gap: 24px (both H & V)
- Columns: 3 per row

**Product Card Component:** `ProductCard/Default`

- Width: 360px
- Height: Hug (approx 420px)
- Radius: 16px
- Background: white
- Border: 1px, color `border-default`
- Shadow: `shadow/card`
- Hover: lift -2px, shadow `shadow/card-hover`
- Auto-layout: Vertical
- Padding: 0
- Gap: 0

**Card Structure:**

1. **Image Container**
   - Frame: 360×260px
   - Radius: 16px top corners only
   - Image: Object-fit cover
   - Overlay badges (top-left): "SALE" or "LOW STOCK"

2. **Quick Actions (Overlay on hover)**
   - Frame: Horizontal, center
   - 2 buttons: "View" and "Add"
   - Button size: 100×40px
   - Radius: 8px
   - Gap: 8px

3. **Content Area**
   - Padding: 20px
   - Auto-layout: Vertical
   - Gap: 12px

   **Elements:**
   - Product name (Style: `H3/Card-Title`)
   - Stock status badge (pill shape, 12px text)
   - Price row:
     - Current price: `Price/Large`, color `text-primary`
     - Original price: `Body/Small`, strikethrough, color `text-muted`
   - Star rating + count (14px stars, gold color #F59E0B)

4. **Action Icons (top-right)**
   - Wishlist heart icon
   - Compare icon
   - Position: Absolute

**Mobile:**

- 1 card per row, full width minus padding
- Image height: 220px

---

## 6️⃣ Testimonials Section

**Component:** `Section/Testimonials`

**Desktop Frame:**

- Width: Fill (1440px)
- Padding: 80px 60px
- Background: white
- Auto-layout: Vertical
- Gap: 48px

**Header:**

- Title: "What Our Customers Say"
- Style: `H2/Section-Title`, center aligned

**Carousel:**
**Frame:** `Testimonials/Carousel`

- Width: 960px (centered)
- Height: Hug
- Auto-layout: Horizontal
- Gap: 24px
- Overflow: Hidden

**Testimonial Card:** `TestimonialCard/Default`

- Width: 440px
- Height: 240px
- Padding: 32px
- Radius: 16px
- Background: `neutral-50`
- Auto-layout: Vertical
- Gap: 16px

**Card Content:**

1. 5-star row (16px stars, color `warning-yellow`)
2. Quote text (Style: `Body/Regular`, italic, 4 lines max)
3. **Customer Row:**
   - Auto-layout: Horizontal, gap 12px
   - Avatar: 40×40px circle
   - Name: `Body/Small`, semibold
