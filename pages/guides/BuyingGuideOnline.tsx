import React from 'react';
import { Helmet } from 'react-helmet-async';
import PillarPageLayout from '../../components/layouts/PillarPageLayout';

const BuyingGuideOnline = () => {
  const guideData = {
    title: "How to Buy Authentic Indian Spices & Premium Nuts Online",
    description: "The definitive defense protocol for navigating the digital marketplace. Learn how to identify single-origin authenticity, avoid adulterated powders, and verify supply chains.",
    author: {
      name: "Tattva Supply Chain Experts",
      title: "Procurement Verification",
      url: "https://rathinaturals.com/about"
    },
    publishedDate: "2026-03-21",
    modifiedDate: "2026-03-21",
    tableOfContents: [
      { id: "red-flags", title: "Digital Red Flags: Diagnosing Fake Listings" },
      { id: "packaging", title: "The Packaging Intelligence Protocol" },
      { id: "supply-chain", title: "Farm-Direct vs. Mega-Marketplace Models" },
      { id: "gifting", title: "Strategic Combinations for Gifting" }
    ],
    faqs: [
      {
        question: "How can I tell if spices ordered online are adulterated?",
        answer: "Authentic cold-ground spices will not dissolve perfectly in room temperature water. Test turmeric by stirring a teaspoon into a glass of water; artificial dyes will instantly streak yellow downward, whereas pure turmeric simply floats on top for a few minutes. Pure spices also retain a complex, pungent scent, never stinging or chemically harsh."
      },
      {
        question: "Why should I buy direct-to-consumer instead of Amazon/Meesho?",
        answer: "While we operate highly-controlled listings on marketplaces, buying direct entirely removes warehouse thermal-cycling risks. Third-party logistics centers often lack climate control, accelerating essential oil evaporation and lipid oxidation before the product even ships to you."
      },
      {
        question: "What is the true shelf life of premium spices purchased online?",
        answer: "When sealed in triple-layer laminated pouches (with zero oxygen-permeability barriers), whole spices last 2-3 years, while cold-ground powders remain violently aromatic for 6-9 months minimum. Shelf life drastically decreases if the brand uses low-micron, cheap BOPP plastics."
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{guideData.title} | The Rathi Spice Co.</title>
        <meta name="description" content={guideData.description} />
      </Helmet>

      <PillarPageLayout
        title={guideData.title}
        description={guideData.description}
        author={guideData.author}
        publishedDate={guideData.publishedDate}
        modifiedDate={guideData.modifiedDate}
        tableOfContents={guideData.tableOfContents}
        faqs={guideData.faqs}
      >
        <section id="red-flags" className="mb-16">
          <h2 className="text-3xl font-serif text-cream mb-6">Digital Red Flags: Diagnosing Fake Listings</h2>
          <p className="text-mist text-lg font-light mb-6">
            The digital spice market is violently saturated with adulterated compounds masked by heavy branding. When buying high-leverage ingredients like Asafoetida (Hing), Saffron, or Turmeric, you must actively scan digital product pages for critical omissions.
          </p>
          <ul className="list-none space-y-4">
            <li className="flex flex-col md:flex-row gap-4 bg-char p-4 rounded border border-mist/20">
              <span className="text-rouge font-bold tracking-widest uppercase text-sm w-32 shrink-0">Missing Meta</span>
              <span className="text-dust text-sm">If the brand refuses to state the exact district or region of harvest (e.g., merely stating "India"), they are aggregating mass market run-off. Expect zero unified sensory profile.</span>
            </li>
            <li className="flex flex-col md:flex-row gap-4 bg-char p-4 rounded border border-mist/20">
              <span className="text-rouge font-bold tracking-widest uppercase text-sm w-32 shrink-0">Color Clipping</span>
              <span className="text-dust text-sm">Beware of impossibly saturated listing images. Raw, organic Salem Turmeric has a deep, almost fluorescent yellow-orange profile, but it has natural grit. If the texture looks perfectly matte and neon, the product image is heavily doctored.</span>
            </li>
            <li className="flex flex-col md:flex-row gap-4 bg-char p-4 rounded border border-mist/20">
              <span className="text-rouge font-bold tracking-widest uppercase text-sm w-32 shrink-0">Stock Copy</span>
              <span className="text-dust text-sm">A genuine procurer will speak about grinding temperatures, essential oil ratios, and harvest dates. Scammers rely on generic adjectives like "healthy" or "flavorful," avoiding structural processing metrics.</span>
            </li>
          </ul>
        </section>

        <section id="packaging" className="mb-16">
          <h2 className="text-3xl font-serif text-cream mb-6">The Packaging Intelligence Protocol</h2>
          <p className="text-mist text-lg font-light mb-6">
            High-grade spices act chemically like volatile solvents—they actively want to degrade. Your online purchase dictates whether you are buying flavor, or simply colored dust.
          </p>
          <p className="text-mist text-lg font-light mb-4">
            Look explicitly for the term <strong className="text-cream">"Triple-Layer Barrier"</strong> or <strong className="text-cream">"METPET construction"</strong> on the brand's specifications. Cheap plastic pouches allow massive oxygen transfer algorithms, accelerating oxidation exponentially. Only metallized layers combined with UV-blocking opaque polymers guarantee that the powder survives transit heat without thermal breakdown.
          </p>
        </section>

        <section id="supply-chain" className="mb-16">
          <h2 className="text-3xl font-serif text-cream mb-6">Farm-Direct vs. Mega-Marketplace Models</h2>
          <p className="text-mist text-lg font-light mb-6">
            There exists a fundamental divergence between supply chains. Mega-marketplaces optimize for infinite scale; the farm-direct model optimizes for absolute purity.
          </p>
          <div className="bg-ink border border-mist/30 p-6 md:p-8 rounded-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 rounded-bl-full"></div>
             <p className="text-mist mb-4 relative z-10"><strong className="text-saffron block mb-2 font-serif text-xl">The Marketplace Path:</strong> 
               Farm → Local Agent → Regional Aggregator → Processing Factory → Wholesale Distribution → Marketplace Fulfillment Center → Multiple varying climates → Kitchen. <br/><span className="text-xs mt-2 block opacity-70">Result: Minimum 11-18 months of oxidative stress before use.</span>
             </p>
             <div className="w-full h-[1px] bg-char my-6"></div>
             <p className="text-mist relative z-10"><strong className="text-saffron block mb-2 font-serif text-xl">The Tattva Path:</strong> 
               Partner Farm → Cold-Grind Facility (Ramganj Mandi) → Sealed Composite Pouch → Kitchen. <br/><span className="text-xs mt-2 block opacity-70">Result: Essential oils locked within 14 days of harvest.</span>
             </p>
          </div>
        </section>

        <section id="gifting" className="mb-16">
          <h2 className="text-3xl font-serif text-cream mb-6">Strategic Combinations for Gifting</h2>
          <p className="text-mist text-lg font-light mb-6">
            When constructing digital gift hampers for diplomatic or corporate occasions, do not optimize for quantity. Optimize for extreme sensory contrast.
          </p>
          <p className="text-mist text-lg font-light mb-6">
            The ideal high-impact gift architecture pairs a <strong className="text-cream">Core Stabilizer</strong> (W240 Cashews or Californian Almonds) with an <strong className="text-cream">Aggressive Enhancer</strong> (Iranian Pistachios or Mathania Chilli). This creates immediate experiential depth when unboxed, demonstrating high culinary intelligence rather than just generic luxury.
          </p>
        </section>

      </PillarPageLayout>
    </>
  );
};

export default BuyingGuideOnline;
