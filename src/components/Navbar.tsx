import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 px-8 border-b">
      <Link href="/" className="text-2xl font-bold">
        Soluna
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/chat" className="text-foreground/70 hover:text-foreground">Chat</Link>
        <Link href="/journal" className="text-foreground/70 hover:text-foreground">Journal</Link>
        <Link href="/meditation" className="text-foreground/70 hover:text-foreground">Meditation</Link>
        <Link href="/dashboard" className="text-foreground/70 hover:text-foreground">Dashboard</Link>
      </div>
    </nav>
  );
}