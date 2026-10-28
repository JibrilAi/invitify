'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-serif text-amber-200">Something went wrong</h2>
          <p className="text-neutral-400 text-sm">
            {error?.message || "An unexpected error occurred while loading the invitation."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-sm font-medium transition-colors shadow-lg shadow-amber-600/30"
          >
            Reload Invitation
          </button>
        </div>
      </body>
    </html>
  );
}
