import React from 'react';
import { Helmet } from 'react-helmet-async';
import PillarPageLayout from '../../components/layouts/PillarPageLayout';

const PremiumNutsGuide = () => {
  const guideData = {
    title: "Premium Nuts Buying Guide: Quality, Storage & Health Benefits",
    description: "The ultimate guide to grading, sourcing, and storing premium Indian cashews, almonds, and pistachios for maximum nutritional and sensory yield.",
    author: {
      name: "Tattva Food Science Team",
      title: "Quality Assurance",
      url: "https://rathinaturals.com/about"
    },
    publishedDate: "2026-03-20",
    modifiedDate: "2026-03-20",
    tableOfContents: [
      { id: "grading-cashews", title: "How to Grade Cashew Quality (W-Series Explained)" },
      { id: "almonds", title: "Soaked vs. Roasted Almonds: The Nutritional Chemistry" },
      { id: "pistachios", title: "Iranian vs. California Pistachios: A Sensory Comparison" },
      { id: "storage", title: "The Indian Climate Protocol: Preventing Nut Rancidity" }
    ],
    faqs: [
      {
        question: "What does W320 mean when buying cashews?",
        answer: "W320 stands for 'White Whole 320'. It signifies that the cashews are globally recognized premium grade, whole and undamaged, with exactly 320 kernels per pound weight. Lower numbers (like W180) indicate larger, rarer cashews."
      },
      {
        question: "Why do nuts go rancid quickly in India?",
        answer: "The volatile unsaturated fats in premium nuts trigger extremely rapid oxidation when exposed to high heat and humidity levels typical in the Indian subcontinent. Airtight refrigeration is absolutely mandatory for preservation."
      },
      {
        question: "Are premium nuts worth the price difference?",
        answer: "Yes. Premium grading ensures higher omega-fatty acid retention, minimal moisture content (which prevents fungal aflatoxins), and guaranteed sensory profiles unmarked by the extreme bitterness often found in lower commercial grades."
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
        <section id="grading-cashews" className="mb-16">
          <h2 className="text-3xl font-serif text-cream mb-6">How to Grade Cashew Quality (W-Series Explained)</h2>
          <p className="text-mist text-lg font-light mb-6">
            Cashew grading is a meticulous, globally standardized process that measures the size, color, and absolute integrity of the kernel. When buying premium cashews, understanding the alphanumeric grading system (W-180, W-240, W-320) is essential to verifying your purchase.
          </p>
          <div className="bg-char p-8 border border-mist/20 rounded-md mb-8">
            <h3 className="text-saffron font-bold text-sm tracking-widest uppercase mb-4">The Universal Grading Index</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="font-bold text-cream w-16 shrink-0">W-180</span>
                <span className="text-dust text-sm">Known as the 'King of Cashews'. These are enormous, flawless kernels measuring roughly 180 pieces to the pound. They represent the top 1% of the harvest.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-cream w-16 shrink-0">W-240</span>
                <span className="text-dust text-sm">The 'Jumbo' grade. Highly sought after for premium gifting, offering substantial mechanical resistance and an incredible buttery bite.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-cream w-16 shrink-0">W-320</span>
                <span className="text-dust text-sm">The standard premium grade worldwide. Readily distributed and possessing the quintessential cashew profile and visual aesthetic.</span>
              </li>
            </ul>
          </div>
          <p className="text-mist text-sm font-light">
            *Note: The "W" stands for "White Whole", ensuring the nut has zero spotting, scorching, or fracturing resulting from the violent extraction process.
          </p>
        </section>

        <section id="almonds" className="mb-16">
          <h2 className="text-3xl font-serif text-cream mb-6">Soaked vs. Roasted Almonds: The Nutritional Chemistry</h2>
          <p className="text-mist text-lg font-light mb-6">
            The mechanism by which you prepare almonds dictates their absolute bioavailability inside the human body. The fundamental difference lies within the structural integrity of the brown skin.
          </p>
          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="border hover:border-saffron/50 transition-colors border-char p-6 bg-char/50">
              <h4 className="text-xl font-serif text-cream mb-3">Soaking Protocol</h4>
              <p className="text-dust text-sm">
                The brown dermis of raw almonds contains concentrated phytic acid—an evolutionary defense mechanism that aggressively binds with molecular zinc and iron in the human gut, preventing absorption. Soaking the almond forces the germination switch, neutralizing the phytic acid and dissolving enzyme inhibitors.
              </p>
            </div>
            <div className="border hover:border-saffron/50 transition-colors border-char p-6 bg-char/50">
              <h4 className="text-xl font-serif text-cream mb-3">Roasting Protocol</h4>
              <p className="text-dust text-sm">
                Dry roasting denatures proteins and forces the Maillard reaction, optimizing the nuts for complex culinary construction and extreme crispness. However, roasting beyond 130°C aggressively destroys the volatile polyunsaturated fat chains, converting healthy lipids into dangerous free radicals.
              </p>
            </div>
          </div>
        </section>

        <section id="pistachios" className="mb-16">
          <h2 className="text-3xl font-serif text-cream mb-6">Iranian vs. California Pistachios: A Sensory Comparison</h2>
          <p className="text-mist text-lg font-light mb-4">
            The global pistachio market is split by distinct geographical and climatic cultivars.
          </p>
          <p className="text-mist text-lg font-light mb-6">
             <strong className="text-cream font-medium">California cultivars</strong> are mechanically harvested, yielding bright green pigmentation and clean, uniform shapes. The flavor is strictly clean and linear. <br/><br/>
             <strong className="text-cream font-medium">Iranian (Persian) cultivars</strong> are hand-harvested from ancient arid soil, resulting in a slightly yellow hue. Crucially, the extreme drought conditions force the trees to flood the nuts with unsaturated oils to survive. The absolute oil ratio in Iranian pistachios is astronomically higher, giving them superior roasting tolerance and a massive, complex umami flavor profile unmatched by American hardware.
          </p>
        </section>

        <section id="storage" className="mb-16">
          <h2 className="text-3xl font-serif text-cream mb-6">The Indian Climate Protocol: Preventing Nut Rancidity</h2>
          <p className="text-mist text-lg font-light mb-6">
            The humid, high-thermal density environment of India accelerates lipid oxidation within nuts. Storing premium imports on a hot pantry shelf will guarantee catastrophic spoilage within 28 days.
          </p>
          <ul className="list-disc list-inside space-y-3 text-mist">
            <li><strong className="text-cream font-medium">The Glass Protocol:</strong> Ditch the original plastic packaging entirely. Transfer nuts into borosilicate glass containers. Glass provides absolute oxygen impermeability.</li>
            <li><strong className="text-cream font-medium">Thermal Isolation:</strong> Premium nuts must be refrigerated at exactly 3-4°C. The low temperature freezes the oxidation chain reaction.</li>
            <li><strong className="text-cream font-medium">Deep Stasis:</strong> For ultra-long term preservation (6+ months), move nuts into the deep freezer (-18°C). Because nuts lack high water content, their cellular walls will not burst during freezing.</li>
          </ul>
        </section>

      </PillarPageLayout>
    </>
  );
};

export default PremiumNutsGuide;
