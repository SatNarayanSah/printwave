import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { blogPosts } from '@/lib/mockData';

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="bg-background/30">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">Blog</h1>
            <p className="text-muted-foreground mt-2">Tips, trends, and insights for print-on-demand.</p>
          </div>
        </div>

        {/* Featured */}
        <Card className="py-0 overflow-hidden mb-10">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-6 relative min-h-72">
                <Image src={featuredPost.image} alt={featuredPost.title} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/15 to-transparent" />
              </div>
              <div className="md:col-span-6 p-7 md:p-10 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-sm backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Featured
                </div>

                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{featuredPost.title}</h2>
                <p className="text-muted-foreground">{featuredPost.excerpt}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>

                <Link href={`/blog/${featuredPost.id}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Read article <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group">
              <Card className="py-0 overflow-hidden h-full">
                <CardContent className="p-0">
                  <div className="relative h-56">
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Card className="py-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-7 p-8 md:p-10">
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Start creating today</h3>
                  <p className="text-muted-foreground mt-2">Browse products and place your first order in minutes.</p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link href="/shop">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                        Shop now <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/account/designs">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Upload designs
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="md:col-span-5 relative min-h-44">
                  <Image src="/images/blog-3.jpg" alt="Persomith" fill className="object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-black/10 to-transparent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
