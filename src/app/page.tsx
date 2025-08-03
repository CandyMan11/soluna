import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center">
      <header className="mb-12">
        <h1 className="text-5xl font-bold mb-2">Welcome to Soluna</h1>
        <p className="text-lg text-foreground/80">Discover what floats your boat.</p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How are you feeling today?</h2>
        <div className="flex justify-center gap-4">
          {['😊', '😐', '😔', '😠', '😢'].map((emoji) => (
            <button key={emoji} className="text-4xl p-2 rounded-full hover:bg-foreground/10 transition-colors">
              {emoji}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
        <FeatureCard
          href="/chat"
          title="AI Chat"
          description="Talk through your thoughts with a CBT-style AI chatbot."
        />
        <FeatureCard
          href="/journal"
          title="Encrypted Journal"
          description="A safe and private space for your thoughts."
        />
        <FeatureCard
          href="/meditation"
          title="Well-being Activities"
          description="Guided meditations, affirmations, and more."
        />
        <FeatureCard
          href="/dashboard"
          title="Your Dashboard"
          description="Track your activity and progress over time."
        />
      </section>
    </div>
  );
}

function FeatureCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="block p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-foreground/5 transition-colors">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-foreground/70">{description}</p>
    </Link>
  );
}
