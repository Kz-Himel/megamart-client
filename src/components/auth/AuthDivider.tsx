export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center py-1">
      <div className="stitch-divider flex-1" />
      <span className="px-3 text-xs text-muted">{label}</span>
      <div className="stitch-divider flex-1" />
    </div>
  );
}