import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center">
        <h1 className="text-4xl font-bold">Welcome to the App</h1>
        <p className="mt-4 text-lg">
          Please log in to continue.
        </p>
        <div className="mt-8">
          <Link href="/auth/login" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
              Login
          </Link>
        </div>
      </div>
    </main>
  );
}
