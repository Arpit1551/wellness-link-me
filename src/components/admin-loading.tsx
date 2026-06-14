export function AdminLoading() {
  return (
    <div className="grid min-h-64 place-items-center" role="status" aria-label="Loading portal data">
      <div className="text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-sm text-muted-foreground">Loading clinic data…</p>
      </div>
    </div>
  );
}
