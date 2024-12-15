import { QRCodeSVG } from "qrcode.react";

interface FilamentQRCodeProps {
  id: number;
  brand: string;
  material: string;
  color: {
    name: string;
    hex: string;
  };
}

export default function FilamentQRCode({
  id,
  brand,
  material,
  color,
}: FilamentQRCodeProps) {
  const url = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/filament/${id}`;

  return (
    <div className="flex flex-col items-center">
      <QRCodeSVG value={url} size={256} />
      <p className="mt-4 text-lg font-semibold">Filament #{id}</p>
      <p>
        {brand} - {material} - {color.name}
      </p>
    </div>
  );
}
