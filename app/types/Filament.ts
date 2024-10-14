import { Color } from "./Color";

export type Filament = {
  readonly id: number;
  brand: string;
  material: string;
  color: Color;
  weight: number | null;
  location?: string;
  createdAt?: Date; //new fields
  updatedAt?: Date; //new fields
};
