export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold leading-tight text-gray-900 dark:text-white">
            Admin Area
          </h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
