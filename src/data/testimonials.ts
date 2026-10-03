export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  productName: string;
  comment: string;
  date: string;
  verified: boolean;
}

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sravani Varma',
    location: 'Hyderabad, Telangana',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    productName: 'Multigrain Diet Mix (14 Grains)',
    comment: 'The 14 Grains Multigrain Cere mix has become an irreplaceable breakfast staple for my 4-year-old son and aging parents. You can immediately smell the authentic roasted aroma of native millets!',
    date: 'February 2026',
    verified: true,
  },
  {
    id: 'test-2',
    name: 'Dr. K. Srinivas Rao',
    location: 'Visakhapatnam, AP',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    productName: 'Orthocare Plus Oil',
    comment: 'As an Ayurvedic practitioner, I recommend Graminum Orthocare Plus Oil and Kalachakra Thailam to my patients for knee and joint pain relief. The herbal formulation penetrates deep without synthetic burning.',
    date: 'January 2026',
    verified: true,
  },
  {
    id: 'test-3',
    name: 'Ananya Reddy',
    location: 'Bengaluru, Karnataka',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    productName: 'Sunnipendi / Herbal Bath Powder',
    comment: 'The 25-herb Sunnipendi is heavenly! The lingering aroma of rose petals, wild turmeric, and vetiver roots brings back memories of my grandmother’s traditional bath preparation. My skin feels silky and glowing.',
    date: 'February 2026',
    verified: true,
  },
  {
    id: 'test-4',
    name: 'M. Venkatakrishna',
    location: 'Warangal, Telangana',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    productName: 'Pure Natural Honey',
    comment: 'Finally found authentic raw forest honey that is completely pure and unheated. Perfect natural sweetness for morning warm water and herbal tea. The 24-hour delivery in Telangana was prompt.',
    date: 'January 2026',
    verified: true,
  },
];
