export default async function LinksLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div className="w-full h-full flex">{children}</div>;
  }