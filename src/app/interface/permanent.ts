export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  isActive: boolean;
}

export interface Color {
  id: number;
  name: string;
}

export interface Discount {
  id: number;
  isPercent: number;
  startDay: string; 
  endDay: string; 
  comment: string;
  isActive: boolean;
}

export interface Brand {
  id: number;
  name: string;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
}
