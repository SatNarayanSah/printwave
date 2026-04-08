export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  variants: {
    color: string;
    sizes: string[];
  }[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  readTime: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: 'tshirts',
    name: 'T-Shirts',
    image: '/images/category-tshirts.jpg',
    productCount: 45,
  },
  {
    id: 'mugs',
    name: 'Mugs',
    image: '/images/category-mugs.jpg',
    productCount: 32,
  },
  {
    id: 'hats',
    name: 'Hats & Caps',
    image: '/images/category-hats.jpg',
    productCount: 28,
  },
  {
    id: 'posters',
    name: 'Posters',
    image: '/images/category-posters.jpg',
    productCount: 38,
  },
  {
    id: 'hoodies',
    name: 'Hoodies',
    image: '/images/category-hoodies.jpg',
    productCount: 24,
  },
  {
    id: 'bags',
    name: 'Bags',
    image: '/images/category-bags.jpg',
    productCount: 20,
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Black T-Shirt',
    price: 19.99,
    originalPrice: 24.99,
    category: 'tshirts',
    image: '/images/product-1.jpg',
    description: 'Premium quality 100% cotton t-shirt perfect for printing custom designs.',
    rating: 4.8,
    reviews: 324,
    inStock: true,
    variants: [
      {
        color: 'Black',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        color: 'White',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
  },
  {
    id: '2',
    name: 'Premium Coffee Mug',
    price: 12.99,
    category: 'mugs',
    image: '/images/product-2.jpg',
    description: 'Ceramic coffee mug with glossy finish for vibrant full-color printing.',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    variants: [
      {
        color: 'White',
        sizes: ['11oz', '15oz'],
      },
    ],
  },
  {
    id: '3',
    name: 'Baseball Cap',
    price: 16.99,
    originalPrice: 21.99,
    category: 'hats',
    image: '/images/product-3.jpg',
    description: 'Classic baseball cap with embroidery options for your custom logo.',
    rating: 4.6,
    reviews: 98,
    inStock: true,
    variants: [
      {
        color: 'Navy',
        sizes: ['One Size', 'Adjustable'],
      },
      {
        color: 'Black',
        sizes: ['One Size', 'Adjustable'],
      },
    ],
  },
  {
    id: '4',
    name: 'Art Print Poster',
    price: 14.99,
    category: 'posters',
    image: '/images/product-4.jpg',
    description: '24x36 premium poster paper with matte finish. Perfect for home or office.',
    rating: 4.9,
    reviews: 234,
    inStock: true,
    variants: [
      {
        color: 'Matte',
        sizes: ['A4', 'A3', '24x36'],
      },
    ],
  },
  {
    id: '5',
    name: 'Zip-Up Hoodie',
    price: 34.99,
    originalPrice: 44.99,
    category: 'hoodies',
    image: '/images/product-5.jpg',
    description: '70% cotton, 30% polyester blend hoodie for maximum comfort and durability.',
    rating: 4.8,
    reviews: 412,
    inStock: true,
    variants: [
      {
        color: 'Charcoal',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        color: 'Navy',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        color: 'Gray',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
  },
  {
    id: '6',
    name: 'Cotton Tote Bag',
    price: 11.99,
    category: 'bags',
    image: '/images/product-6.jpg',
    description: 'Eco-friendly 100% cotton tote bag with sturdy handles. Great for shopping.',
    rating: 4.7,
    reviews: 187,
    inStock: true,
    variants: [
      {
        color: 'Natural',
        sizes: ['One Size'],
      },
      {
        color: 'Black',
        sizes: ['One Size'],
      },
    ],
  },
  {
    id: '7',
    name: 'Long Sleeve T-Shirt',
    price: 24.99,
    category: 'tshirts',
    image: '/images/product-7.jpg',
    description: 'Soft and comfortable long sleeve shirt ideal for layering and custom prints.',
    rating: 4.6,
    reviews: 145,
    inStock: true,
    variants: [
      {
        color: 'Black',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        color: 'Navy',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
  },
  {
    id: '8',
    name: 'Stainless Steel Tumbler',
    price: 18.99,
    originalPrice: 23.99,
    category: 'mugs',
    image: '/images/product-8.jpg',
    description: 'Vacuum insulated tumbler keeps drinks hot or cold. Perfect for travel.',
    rating: 4.8,
    reviews: 267,
    inStock: true,
    variants: [
      {
        color: 'Silver',
        sizes: ['16oz', '20oz'],
      },
      {
        color: 'Black',
        sizes: ['16oz', '20oz'],
      },
    ],
  },
  {
    id: '9',
    name: 'Snapback Hat',
    price: 14.99,
    category: 'hats',
    image: '/images/product-9.jpg',
    description: 'Classic snapback hat with adjustable closure. Great for any occasion.',
    rating: 4.5,
    reviews: 76,
    inStock: true,
    variants: [
      {
        color: 'Black',
        sizes: ['One Size'],
      },
      {
        color: 'White',
        sizes: ['One Size'],
      },
    ],
  },
  {
    id: '10',
    name: 'Canvas Wall Art',
    price: 29.99,
    originalPrice: 39.99,
    category: 'posters',
    image: '/images/product-10.jpg',
    description: '16x20 premium canvas print with gallery wrap. No frame needed.',
    rating: 4.9,
    reviews: 189,
    inStock: true,
    variants: [
      {
        color: 'Canvas',
        sizes: ['8x10', '11x14', '16x20', '20x24'],
      },
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Design the Perfect Print-On-Demand Product',
    excerpt: 'Learn the essential tips and tricks for creating stunning designs that will make your print-on-demand products stand out.',
    content:
      'Creating a successful print-on-demand product requires more than just a great idea. You need to understand color theory, typography, and printing techniques...',
    author: 'Sarah Design',
    date: '2024-03-15',
    image: '/images/blog-1.jpg',
    category: 'Design Tips',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'The Future of E-Commerce: Print-On-Demand Trends',
    excerpt: 'Discover the latest trends in print-on-demand technology and how they\'re reshaping the e-commerce landscape.',
    content:
      'The print-on-demand industry is evolving rapidly. From AI-assisted design tools to sustainable printing methods, businesses have more opportunities...',
    author: 'Mike Johnson',
    date: '2024-03-10',
    image: '/images/blog-2.jpg',
    category: 'Industry News',
    readTime: '7 min read',
  },
  {
    id: '3',
    title: 'Sustainable Printing: Making a Difference',
    excerpt: 'Explore eco-friendly printing practices and how you can build a sustainable business with print-on-demand.',
    content:
      'Sustainability is no longer just a buzzword. Many customers actively seek brands that share their environmental values...',
    author: 'Emma Green',
    date: '2024-03-05',
    image: '/images/blog-3.jpg',
    category: 'Sustainability',
    readTime: '6 min read',
  },
  {
    id: '4',
    title: 'Starting Your Print-On-Demand Business: A Beginner\'s Guide',
    excerpt: 'Everything you need to know to launch your first print-on-demand store and start making sales.',
    content:
      'Starting a print-on-demand business has never been easier. With low startup costs and minimal inventory management...',
    author: 'John Entrepreneur',
    date: '2024-02-28',
    image: '/images/blog-4.jpg',
    category: 'Getting Started',
    readTime: '8 min read',
  },
];
