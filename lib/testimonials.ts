export interface Testimonial {
  name: string;
  initial: string;
  location: string;
  propertyType: string;
  rating: 5 | 4 | 3;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Chinmayi Mannem",
    initial: "C",
    location: "Whitefield, Bangalore",
    propertyType: "2BHK resale flat",
    rating: 5,
    text: "Professional service throughout. Loved the no-spam-call policy — they only reached out when there was something to act on. Very timely and punctual at every step.",
  },
  {
    name: "Anmol Srivastava",
    initial: "A",
    location: "HSR Layout, Bangalore",
    propertyType: "First home, resale flat",
    rating: 5,
    text: "Bought my first home through Jumbo SafeBuy. The legal diligence report gave me real confidence before I paid the token. The whole process was transparent.",
  },
  {
    name: "Manav Vadher",
    initial: "M",
    location: "Koramangala, Bangalore",
    propertyType: "3BHK resale apartment",
    rating: 5,
    text: "Multiple property visits handled smoothly. The team was genuinely helpful and transparent with all the information — no pressure, no hidden catches.",
  },
  {
    name: "Neeta Sirvi",
    initial: "N",
    location: "Whitefield, Bangalore",
    propertyType: "Resale apartment",
    rating: 5,
    text: "Had an excellent experience from start to finish. The khata transfer that I thought would take months was done in three weeks. Highly recommend.",
  },
  {
    name: "Juliana Silva",
    initial: "J",
    location: "Indiranagar, Bangalore",
    propertyType: "Resale independent house",
    rating: 5,
    text: "The Jumbo SafeBuy team made selling my property completely stress-free. The escrow arrangement meant I never worried about the money. Outstanding service.",
  },
  {
    name: "Harish Gowda",
    initial: "H",
    location: "Sarjapur, Bangalore",
    propertyType: "2BHK resale flat",
    rating: 5,
    text: "Legal diligence found a minor encumbrance that the seller hadn't disclosed. Jumbo SafeBuy flagged it, negotiated a price adjustment, and protected my investment.",
  },
];
