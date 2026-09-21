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
    id: 'gyms-fitness-kashmir',
    title: 'Gyms & Fitness Studios in Kashmir',
    query: 'Find 30 gyms, CrossFit boxes and fitness studios across Srinagar (Rajbagh, Parraypora, Karan Nagar) with active Instagram and no booking portal',
    category: 'Gyms & Fitness Centers',
    location: 'Srinagar, Kashmir',
    highlight: 'Membership Pass & Trial Booking Opportunity',
  },
  {
    id: 'bridal-jewellery-kashmir',
    title: 'Bridal Jewellery & Gold in Kashmir',
    query: 'Find 35 bridal jewellery lounges, gold ateliers and wedding trousseau studios in Polo View and Goni Khan Srinagar with no digital catalog',
    category: 'Bridal Jewellery & Couture',
    location: 'Polo View & Goni Khan, Srinagar',
    highlight: 'High-Ticket Wedding Sales & Digital Lookbook',
  },
  {
    id: 'cafes-srinagar-kashmir',
    title: 'Boutique Cafes in Srinagar',
    query: 'Find 25 boutique cafes, artisan bakeries and lakeside dining spots in Rajbagh and Boulevard Srinagar with no online ordering',
    category: 'Cafes & Dining',
    location: 'Rajbagh & Boulevard, Srinagar',
    highlight: 'Active Social Presence, No Online Menu',
  },
  {
    id: 'contractors-kashmir',
    title: 'Contractors & Architects in Kashmir',
    query: 'Find 25 building contractors, interior decorators and architectural services in Srinagar, Budgam and Baramulla with no project portfolio website',
    category: 'Contractors & Trade Services',
    location: 'Srinagar & Kashmir Valley',
    highlight: 'Commercial Inquiries & Project Estimates',
  },
  {
    id: 'bridal-fashion-srinagar',
    title: 'Bridal & Couture in Srinagar',
    query: 'Find 40 bridal and fashion boutiques in Srinagar with active Instagram and no website',
    category: 'Bridal & Fashion Couture',
    location: 'Srinagar, Kashmir',
    highlight: 'Pashmina, Tilla & Velvet Couturiers',
  },
  {
    id: 'handicrafts-downtown',
    title: 'Handicrafts in Downtown Srinagar',
    query: 'Find 30 walnut woodcraft, carpet and paper mache artisans in Downtown Srinagar with strong Instagram and no web store',
    category: 'Handicrafts & Heritage Arts',
    location: 'Downtown Srinagar, Kashmir',
    highlight: 'Master Artisans & Exporters',
  },
  {
    id: 'hospitality-gulmarg-pahalgam',
    title: 'Resorts & Stays in Gulmarg & Pahalgam',
    query: 'Find 25 boutique hotels, luxury resorts and houseboats in Gulmarg, Pahalgam and Dal Lake without direct booking websites',
    category: 'Hotels & Tourism',
    location: 'Gulmarg & Pahalgam, Kashmir',
    highlight: 'High-Ticket Hospitality Leads',
  },
  {
    id: 'saffron-dryfruits-pampore',
    title: 'Saffron & Dry Fruits in Pampore',
    query: 'Find 30 GI-tagged saffron, walnut and dry fruit traders in Pampore and Pulwama with active Instagram and no ecommerce store',
    category: 'Dry Fruits & Saffron',
    location: 'Pampore & Pulwama, Kashmir',
    highlight: 'Direct Valley Producers',
  },
];

