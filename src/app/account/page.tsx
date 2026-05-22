export default function AccountPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10 justify-center items-center">
        <div className="max-w-md rounded-lg border bg-background p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Authentication is disabled in this local build, so profile controls are not shown.
          </p>
        </div>
      </main>
    </div>
  );
}
