import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { blogPosts } from '@/lib/mockData';

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = blogPosts.find((p) => p.id === params.id);
  const relatedPosts = blogPosts.filter((p) => p.id !== params.id).slice(0, 3);

  if (!post) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg py-0">
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Article not found</h1>
            <Link href="/blog">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background/30">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <Link href="/blog" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to blog
        </Link>

        <header className="mb-6 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-sm">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {post.category}
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">{post.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <span>{post.readTime}</span>
          </div>
        </header>

        <Card className="py-0 overflow-hidden mb-8">
          <CardContent className="p-0">
            <div className="relative h-80 md:h-[520px]">
              <Image src={post.image} alt={post.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardContent className="p-6 md:p-8">
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            <div className="mt-6 space-y-5 text-foreground leading-relaxed">
              <p>{post.content}</p>
              <h2 className="text-xl font-black tracking-tight">Key takeaways</h2>
              <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                <li>Understand your audience and what they value.</li>
                <li>Quality materials and printing impact retention.</li>
                <li>Sustainable practices are increasingly important.</li>
                <li>Consistency in branding builds trust.</li>
              </ul>
              <h2 className="text-xl font-black tracking-tight">Getting started</h2>
              <p className="text-muted-foreground">
                Focus on a small collection, validate designs quickly, then expand based on feedback.
              </p>
            </div>
          </CardContent>
        </Card>
      </article>

      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-6">Related articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((p) => (
              <Link key={p.id} href={`/blog/${p.id}`} className="group">
                <Card className="py-0 overflow-hidden h-full">
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-xs font-semibold text-primary-foreground bg-primary px-2 py-1 rounded-full">
                        {p.category}
                      </span>
                      <h3 className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

