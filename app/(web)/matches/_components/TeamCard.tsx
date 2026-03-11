import Image from "next/image";

interface TeamCardProps {
  name: string;
  logo?: string;
  label: "Home" | "Away";
}

export function TeamCard({ name, logo, label }: TeamCardProps) {
  return (
    <div className="text-center">
      <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-3">
        <Image
          src={logo || "/football-field.png"}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <h2 className="text-base md:text-xl font-bold text-foreground">{name}</h2>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
