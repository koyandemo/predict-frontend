import React from "react";

const MatchListFilterCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-card/50 rounded-2xl p-4 border border-border">
      <h2 className="text-sm font-medium text-muted-foreground mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default MatchListFilterCard;
