export type Filament = {
  readonly id: number;
  brand: string;
  material: string;
  color: {
    name: string;
    hex: string;
  };
  weight: number | null;
};
