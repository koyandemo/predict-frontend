interface MatchMetaItemProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

function MatchMetaItem({ icon, children }: MatchMetaItemProps) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{children}</span>
    </div>
  );
}

export default MatchMetaItem;
