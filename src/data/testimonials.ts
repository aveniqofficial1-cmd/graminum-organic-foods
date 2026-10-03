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
    productName: 'Graminum Sprouted Multigrain Cere Mix',
    comment: 'The Sprouted Multigrain Cere mix has become an irreplaceable breakfast staple for my 4-year-old son and aging parents. You can immediately smell the authentic roasted aroma of native millets!',
    date: 'February 2026',
    verified: true,
  },
  {
    id: 'test-2',
    name: 'Dr. K. Srinivas Rao',
    location: 'Visakhapatnam, AP',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    productName: 'A2 Vedic Bilona Desi Cow Ghee',
    comment: 'As an Ayurvedic practitioner, I recommend Graminum Vedic Bilona Ghee to my patients for digestive fire restoration. The granular texture and natural golden shade is evidence of genuine indigenous Gir cow bilona churning.',
    date: 'January 2026',
    verified: true,
  },
  {
    id: 'test-3',
    name: 'Ananya Reddy',
    location: 'Bengaluru, Karnataka',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    productName: 'Graminum Herbal Bath Powder (Sunnipindi)',
    comment: 'The 24-herb Sunnipindi is heavenly! The lingering aroma of rose petals, wild turmeric, and vetiver roots brings back memories of my grandmother’s traditional bath preparation. My skin feels nourished without any dryness.',
    date: 'February 2026',
    verified: true,
  },
  {
    id: 'test-4',
    name: 'M. Venkatakrishna',
    location: 'Warangal, Telangana',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    productName: 'Single Polish BPT 5204 Sona Masoori Rice',
    comment: 'Finally found authentic single-polish rice that is not stripped of its bran. Cooked grains are light, fluffy, and gentle on the stomach. The quick 24-hour delivery in Telangana was exceptional.',
    date: 'January 2026',
    verified: true,
  }
];
