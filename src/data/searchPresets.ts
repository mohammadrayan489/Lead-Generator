export interface SearchPreset {
  id: string;
  title: string;
  query: string;
  category: string;
  location: string;
  highlight: string;
}

export const SEARCH_PRESETS: SearchPreset[] = [
  {
    id: 'fashion-srinagar',
    title: 'Fashion in Srinagar',
    query: 'Find 50 fashion businesses in Srinagar with strong Instagram presence and no website',
    category: 'Fashion & Apparel',
    location: 'Srinagar, J&K',
    highlight: 'No Website + High Instagram Presence',
  },
  {
    id: 'cafes-mumbai',
    title: 'Boutique Cafes in Bandra',
    query: 'Find 30 boutique cafes in Bandra Mumbai with active Instagram and no online ordering',
    category: 'Food & Beverage',
    location: 'Bandra, Mumbai',
    highlight: 'No Online Menu / Store',
  },
  {
    id: 'studios-austin',
    title: 'Fitness Studios in Austin',
    query: 'Find 25 fitness studios in Austin with strong social media but no booking website',
    category: 'Health & Fitness',
    location: 'Austin, TX',
    highlight: 'Needs Booking Platform',
  },
  {
    id: 'designers-dubai',
    title: 'Interior Designers in Dubai',
    query: 'Find 40 interior designers in Dubai with active Instagram accounts and no website',
    category: 'Interior Design',
    location: 'Dubai, UAE',
    highlight: 'High Ticket Service',
  },
];
