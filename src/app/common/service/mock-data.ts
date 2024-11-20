import { Brand, Category, Color, Discount } from "../../interface/permanent";

// Categories Data
export const categories: Category[] = [
//   { id: 1, name: 'All', parentId: null, isActive: true },
//   { id: 2, name: 'Men', parentId: null, isActive: true },
//   { id: 3, name: 'Women', parentId: null, isActive: true },
  { id: 4, name: 'Running', parentId: 1, isActive: true },
  { id: 5, name: 'Basketball', parentId: 1, isActive: true },
  { id: 6, name: 'Training', parentId: 1, isActive: true },
  { id: 7, name: 'Lifestyle', parentId: 1, isActive: true },
  { id: 8, name: 'Soccer', parentId: 2, isActive: true },
  { id: 9, name: 'Tennis', parentId: 2, isActive: true },
  { id: 10, name: 'Walking', parentId: 3, isActive: true },
  { id: 11, name: 'Dance', parentId: 3, isActive: true },
];

// Colors Data
export const colors: Color[] = [
  { id: 1, name: 'Black' },
  { id: 2, name: 'White' },
  { id: 3, name: 'Grey' },
  { id: 4, name: 'Navy' },
  { id: 5, name: 'Red' },
  { id: 6, name: 'Blue' },
  { id: 7, name: 'Green' },
  { id: 8, name: 'Yellow' },
  { id: 9, name: 'Orange' },
  { id: 10, name: 'Purple' },
  { id: 11, name: 'Pink' },
  { id: 12, name: 'Brown' },
];

// Discounts Data
export const discounts: Discount[] = [
  {
    id: 1,
    isPercent: 10,
    startDay: '2024-10-01T00:00:00.000Z',
    endDay: '2024-12-31T00:00:00.000Z',
    comment: '10% Off Fall Season',
    isActive: true,
  },
  {
    id: 2,
    isPercent: 20,
    startDay: '2024-11-01T00:00:00.000Z',
    endDay: '2024-12-31T00:00:00.000Z',
    comment: 'Holiday Special 20%',
    isActive: true,
  },
  {
    id: 3,
    isPercent: 30,
    startDay: '2024-11-25T00:00:00.000Z',
    endDay: '2024-11-30T00:00:00.000Z',
    comment: 'Black Friday 30%',
    isActive: true,
  },
  {
    id: 4,
    isPercent: 15,
    startDay: '2024-12-01T00:00:00.000Z',
    endDay: '2024-12-25T00:00:00.000Z',
    comment: 'Christmas Sale 15%',
    isActive: true,
  },
  {
    id: 5,
    isPercent: 25,
    startDay: '2024-12-26T00:00:00.000Z',
    endDay: '2024-12-31T00:00:00.000Z',
    comment: 'Year End Sale 25%',
    isActive: true,
  },
];

// Brands Data
export const brands: Brand[] = [
  {
    id: 1,
    name: 'Nike',
    description: 'Global sports and lifestyle brand',
    logoUrl: 'https://nike.com',
    isActive: true,
  },
  {
    id: 2,
    name: 'Adidas',
    description: 'Performance sportswear brand',
    logoUrl: 'https://adidas.com',
    isActive: true,
  },
  {
    id: 3,
    name: 'Puma',
    description: 'Sports and casual footwear brand',
    logoUrl: 'https://puma.com',
    isActive: true,
  },
  {
    id: 4,
    name: 'New Balance',
    description: 'Athletic footwear specialist',
    logoUrl: 'https://newbalance.com',
    isActive: true,
  },
  {
    id: 5,
    name: 'Under Armour',
    description: 'Performance athletic brand',
    logoUrl: 'https://underarmour.com',
    isActive: true,
  },
  {
    id: 6,
    name: 'Reebok',
    description: 'Fitness and lifestyle brand',
    logoUrl: 'https://reebok.com',
    isActive: true,
  },
];
