# Product Spec: Spice Freshness Calculator Tool

**Goal:** Create a high-value, shareable interactive asset that food bloggers and home cooks will link to/bookmark.
**Core Value:** "Is this spice safe to use, or is it ruining my food?"
**URL Slug:** `/tools/spice-freshness-calculator`

---

## 1. The Logic Engine (Scoring Algorithm)

The calculator generates a **Freshness Score (0-100)** based on 4 weighted factors.

### **Factor A: Spice Category (Base Decay Rate)**

_Different spices age at different speeds._

- **Whole Spices (Cardamom pods, Peppercorns):** Decay Rate = 0.5 (Slowest)
- **Ground Roots (Turmeric, Ginger):** Decay Rate = 1.0 (Standard)
- **Ground Leafy/Herbs (Oregano, Kasuri Methi):** Decay Rate = 1.5 (Fast)
- **Oil-Rich Blends (Garam Masala, Curry Powder):** Decay Rate = 1.2 (Moderate)

### **Factor B: Storage Environment (The Multiplier)**

_How the user stores it amplifies the decay._

- **Cool, Dark, Airtight (Ideal):** Multiplier = 1.0x
- **Open Packet / Loose:** Multiplier = 3.0x
- **Near Stove (Heat exposure):** Multiplier = 2.5x
- **Glass Jar in Light:** Multiplier = 1.5x
- **Freezer (For certain spices):** Multiplier = 0.2x (Preserves)

### **Factor C: Time (The Variable)**

- Input: Months since purchase/opening.
- **Formula:** `Decay Points = (Months × Category Rate × Storage Multiplier)`

### **Factor D: Sensory Override (The "Kill Switch")**

_User answers simple Yes/No checks. These override mathematical scores._

- **Smell:** "Weak/Cardboard-like" -> Max Score capped at 40. "Musty/Moldy" -> Score = 0 (Immediate Discard).
- **Visual:** "Faded Color" -> -20 pts. "Clumping/Moisture" -> Score = 0 (Immediate Discard).

---

## 2. User Experience (UX) Flow

### **Step 1: The Input (Simple Card Interface)**

_Headline:_ "Check Your Spice Pantry Health"

- **Dropdown:** "What spice are you checking?" (Searchable list connected to Factor A categories)
- **Number Input:** "How many months ago did you buy it?"
- **Icons (Select One):** "Where does it live?"
  - [Icon: Cabinet] Cool & Dark
  - [Icon: Sun] Shelf near window
  - [Icon: Fire] Shelf above stove
  - [Icon: Packet] Rolled up packet
- **Slider:** "How does it smell?" (Strong/Rich <---> Weak/Dusty <---> Bad/Musty)

### **Step 2: The Diagnosis (Instant Result)**

_(No page reload, instant JS calculation)_

**Visual Output:**

- **Gauge Chart:** 0 (Red) to 100 (Green).
- **The Verdict:**
  - **90-100:** "Chef's Kiss! Perfectly Potent."
  - **60-89:** "Still Good. Use a pinch more for flavor."
  - **40-59:** "Past Prime. Toast it to revive, or use double quantity."
  - **0-39:** "Flavor Ghost. It's mostly just dust now. Replace it."

**Actionable Tip (Dynamic based on input):**

- _If 'Near Stove' selected:_ "Your spice is cooking before you use it! Heat destroys essential oils. Move it to a cooler drawer."
- _If 'Turmeric' & Score < 50:_ "Old turmeric loses its anti-inflammatory potency. Time for a fresh batch."

### **Step 3: Conversion (The Hook)**

- **"Replace This Now":** One-click button to add the specific fresh spice (e.g., Tattva Lakadong Turmeric) to cart with a 10% "Pantry Refresh" discount.
- **"Share Result":** "My pantry scored 42/100 😱 Check yours here!" (Twitter/WhatsApp link).

---

## 3. SEO & Link-Building Hooks

- **Embed Code:** "Add this calculator to your food blog" button (provides iframe code).
- **Data Schema:** Mark up the result as a `Review` or `HowTo` step for rich snippets.
- **Keywords:** "does garam masala expire", "shelf life of cardamom", "how to store spices".

---

## 4. Development Implementation Plan

- **Tech:** React Component (embedded in existing `data/tools/` structure if possible).
- **State:** Simple local state (no backend required for calculation).
- **Assets:** Need 4-5 SVG icons for storage methods.
