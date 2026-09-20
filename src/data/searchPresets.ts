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
    id: 'gyms-fitness-srinagar-jammu',
    title: 'Gyms & Fitness Clubs in Srinagar & Jammu',
    query: 'Find 30 gyms, CrossFit boxes and fitness studios in Rajbagh Srinagar and Bahu Plaza Jammu with active Instagram and no booking portal',
    category: 'Gyms & Fitness Centers',
    location: 'Srinagar & Jammu, J&K',
    highlight: 'Membership Pass & Trial Booking Opportunity',
  },
  {
    id: 'bridal-jewellery-jammu-srinagar',
    title: 'Bridal Jewellery & Lounges in J&K',
    query: 'Find 35 bridal jewellery lounges, gold ateliers and wedding trousseau studios in Jammu and Polo View Srinagar with no digital catalog',
    category: 'Bridal Jewellery & Couture',
    location: 'Jammu & Srinagar, J&K',
    highlight: 'High-Ticket Wedding Sales & Digital Lookbook',
  },
  {
    id: 'cafes-srinagar-jammu',
    title: 'Cafes in Srinagar & Jammu',
    query: 'Find 25 boutique cafes and artisan bakeries in Rajbagh Srinagar and Gandhi Nagar Jammu with no online ordering',
    category: 'Cafes & Dining',
    location: 'Srinagar & Jammu, J&K',
    highlight: 'Active Social Presence, No Online Menu',
  },
  {
    id: 'contractors-home-services',
    title: 'Contractors & Trade Services in J&K',
    query: 'Find 25 building contractors, interior decorators and HVAC electrical services in Srinagar and Jammu with no project portfolio website',
    category: 'Contractors & Trade Services',
    location: 'Srinagar & Jammu, J&K',
    highlight: 'Commercial Inquiries & Project Estimates',
  },
  {
    id: 'bridal-fashion-srinagar',
    title: 'Bridal & Couture in Srinagar',
    query: 'Find 40 bridal and fashion boutiques in Srinagar with active Instagram and no website',
    category: 'Bridal & Fashion Couture',
    location: 'Srinagar, J&K',
    highlight: 'Pashmina, Tilla & Velvet Couturiers',
  },
  {
    id: 'handicrafts-downtown',
    title: 'Handicrafts in Downtown Srinagar',
    query: 'Find 30 walnut woodcraft, carpet and paper mache artisans in Downtown Srinagar with strong Instagram and no web store',
    category: 'Handicrafts & Heritage Arts',
    location: 'Downtown Srinagar, J&K',
    highlight: 'Master Artisans & Exporters',
  },
  {
    id: 'hospitality-gulmarg-pahalgam',
    title: 'Resorts & Stays in Gulmarg & Pahalgam',
    query: 'Find 25 boutique hotels, luxury resorts and houseboats in Gulmarg, Pahalgam and Dal Lake without direct booking websites',
    category: 'Hotels & Tourism',
    location: 'Gulmarg & Pahalgam, J&K',
    highlight: 'High-Ticket Hospitality Leads',
  },
  {
    id: 'saffron-dryfruits-pampore',
    title: 'Saffron & Dry Fruits in Pampore',
    query: 'Find 30 GI-tagged saffron, walnut and dry fruit traders in Pampore and Jammu with active Instagram and no ecommerce store',
    category: 'Dry Fruits & Saffron',
    location: 'Pampore & Jammu, J&K',
    highlight: 'Direct Valley Producers',
  },
];

