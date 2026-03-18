import React from 'react';
import PillarPageLayout from '../../components/layouts/PillarPageLayout';

const IndianSpicesGuide: React.FC = () => {
  const sections = [
    { id: "introduction", title: "Why Single-Origin Matters in Spices" },
    { id: "ramganj-mandi-coriander", title: "Ramganj Mandi: India's Coriander Capital" },
    { id: "salem-turmeric", title: "Salem Turmeric vs Regular Turmeric" },
    { id: "mathania-chilli", title: "Mathania Chilli: The Premium Red Spice" },
    { id: "stone-ground", title: "The Cold-Ground Difference" }
  ];

  const faqs = [
    {
      question: "Why should I buy spices from Ramganj Mandi?",
      answer: "Ramganj Mandi is historically renowned for producing the highest volatile oil content coriander in India. Sourcing directly from here ensures maximum aroma and flavor, unlike mass-market blends that mix various low-grade regional yields."
    },
    {
      question: "What is the difference between hot-ground and cold-ground spices?",
      answer: "Mass-production hot-grinding utilizes high-speed machines that can heat spices over 90°C, destroying essential volatile oils. Cold-grinding is a slow process that preserves the spice's natural aroma, medicinal properties, and vibrant color."
    },
    {
      question: "How can I tell if Salem Turmeric is authentic?",
      answer: "Authentic Salem Turmeric is distinguished by its exceptionally high curcumin content (above 3%) and deep, fluorescent yellow-orange color. It has a significantly earthier, more robust flavor profile compared to generic turmeric powder."
    }
  ];

  return (
    <PillarPageLayout
      title="Complete Guide to Indian Spices: Origins, Uses & Quality"
      description="Discover everything you need to know about authentic Indian spices. From recognizing single-origin Salem turmeric to understanding the flavor advantage of cold-grinding heritage."
      author="Rathi Naturals Master Blenders"
      lastUpdated={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      sections={sections}
      faqs={faqs}
    >
      <section id="introduction" className="scroll-mt-24 mb-12">
        <h2>Why Single-Origin Matters in Spices</h2>
        <p>
          In the modern era of convenience, the authentic, powerful flavors of Indian spices have been diluted by mass-market blending. Single-origin sourcing—procuring spices from specific, historically potent geographic regions—is the only way to experience flavors as they were intended centuries ago.
        </p>
        <p>
          At Rathi Naturals, our 60-year Rajasthani heritage means we don't buy generic "turmeric" or "chilli." We buy from precise agricultural hubs renowned for perfection. 
        </p>
      </section>

      <section id="ramganj-mandi-coriander" className="scroll-mt-24 mb-12">
        <h2>Ramganj Mandi: India's Coriander Capital</h2>
        <p>
          Nestled in Rajasthan, Ramganj Mandi is globally recognized as the largest mandi (market) for coriander (Dhaniya). The specific soil composition and arid climate here yield coriander seeds with extraordinarily high volatile essential oils. 
        </p>
        <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-xl my-6">
          <h4 className="font-bold text-brand-dark mt-0">Quality Indicator:</h4>
          <p className="mb-0 text-sm">Authentic Ramganj Mandi coriander powder boasts a vibrant, citrusy-green aroma. If your coriander smells dusty or lacks a lemon-pine scent, it has likely lost its volatile oils or is highly diluted.</p>
        </div>
      </section>

      <section id="salem-turmeric" className="scroll-mt-24 mb-12">
        <h2>Salem Turmeric vs Regular Turmeric</h2>
        <p>
          Not all turmeric is created equal. Salem, a city in Tamil Nadu, produces turmeric with a curcumin content significantly higher than the national average. Curcumin is the active compound responsible for both the brilliant yellow color and the profound anti-inflammatory health benefits.
        </p>
        <p>
          When shopping, look for the deep, almost fluorescent orange-yellow hue characteristic of the Salem variety, rather than a dull, washed-out yellow.
        </p>
      </section>

      <section id="mathania-chilli" className="scroll-mt-24 mb-12">
        <h2>Mathania Chilli: The Premium Red Spice</h2>
        <p>
          Mathania, a small village near Jodhpur, is legendary for its red chillies. Known for delivering intense, vibrant red color to dishes like Laal Maas without overwhelming heat, it is the crown jewel of Rajasthani cuisine.
        </p>
      </section>

      <section id="stone-ground" className="scroll-mt-24 mb-12">
        <h2>The Cold-Ground Difference</h2>
        <p>
          Even the finest single-origin spices can be ruined by improper processing. The majority of commercial spices are "hot-ground" through high-speed steel blades that generate immense friction heat. This heat literally cooks the spices during grinding, evaporating the delicate volatile oils that provide aroma and flavor.
        </p>
        <p>
          Our precision cold-grinding moat ensures temperatures never spike, locking in the essential oils. It's a scientifically defensible method that guarantees every pinch of Rathi Naturals spice delivers maximum potency.
        </p>
      </section>

    </PillarPageLayout>
  );
};

export default IndianSpicesGuide;
