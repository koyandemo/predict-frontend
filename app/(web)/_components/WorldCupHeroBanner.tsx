import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Users } from "lucide-react";

const WorldCupHeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 p-8 md:p-12">
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <Trophy className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <Badge variant="secondary" className="mb-4">
          FIFA Tournament
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          FIFA World Cup 2026
        </h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
          The biggest football tournament in the world. Predict match outcomes
          and compete with fans worldwide.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4" />
            <span>42 Teams</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>June - July 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldCupHeroBanner;
