function InfoPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-card/50 px-2 py-1">
      {icon}
      <span>{text}</span>
    </div>
  );
}

export default InfoPill;