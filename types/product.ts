export interface WhiskeyProduct {
  id: string;
  name: string;
  brand: string;
  price: string;
  regularPrice: string | null;
  imageUrl: string | null;
  link: string | null;
  description?: string;
  highlights?: string;
  tastingNotes?: string;
  abv?: string;
  volume?: string;
  distillery?: string;
}

