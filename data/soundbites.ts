export type PEACESet = {
  id: string;
  label: string;
  problem: string;
  empathy: string;
  answer: string;
  change: string;
  result: string;
};

export const PEACE_SOUNDBITES: PEACESet[] = [
  {
    id: 'quality',
    label: 'Quality',
    problem: 'Most spices on the shelf are dead—flavorless dust that ruins your hard work.',
    empathy: "We know how frustrating it is to cook a meal that tastes 'just okay'.",
    answer: 'Tattva Co. sources spices within weeks of harvest, sealing in the volatile oils.',
    change: 'From Bland & Boring...',
    result: '...To dishes that taste alive and vibrate with flavor.',
  },
  {
    id: 'trust',
    label: 'Trust',
    problem: "You never really know what's in that packet. Adulteration is invisible.",
    empathy: "It's scary to feed your family when you can't trust the source.",
    answer: 'Every batch is lab-tested for purity and potency. No fillers, ever.',
    change: 'From Anxious Guessing...',
    result: "...To feeling 100% confident about what you're cooking with.",
  },
  {
    id: 'experience',
    label: 'Experience',
    problem: "Cooking feels like a chore when the ingredients don't inspire you.",
    empathy: 'You deserve to feel like an artist in your own kitchen.',
    answer: "We share the farmer's story with every pack, connecting you to the source.",
    change: 'From Mundane Routine...',
    result: '...To a culinary adventure that starts the moment you open the jar.',
  },
];
