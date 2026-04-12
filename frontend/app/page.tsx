import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Leaf } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { categoriesApi, productsApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';

export default async function Home() {
  const [categoriesRes, productsRes] = await Promise.all([
    categoriesApi.list(),
    productsApi.list({ page: 1, limit: 6 }),
  ]);

  const categories = categoriesRes.data ?? [];
  const featuredProducts = productsRes.data ?? [];

  const categoryFallbackImage = (slug: string) => {
    const map: Record<string, string> = {
      tshirts: '/images/category-tshirts.jpg',
      mugs: '/images/category-mugs.jpg',
      hats: '/images/category-hats.jpg',
      posters: '/images/category-posters.jpg',
      hoodies: '/images/category-hoodies.jpg',
      bags: '/images/category-bags.jpg',
    };
    return map[slug] ?? '/placeholder.svg';
  };

  return (
    <div className="bg-background/30">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-banner.jpg"
            alt="Persomith"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Premium print-on-demand, made simple
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-balance">
                Design. Print. Ship. <span className="text-primary">Beautifully</span>.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Studio-quality products with fast turnaround and clean customization—built for brands, creators, and teams.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/shop">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                    Browse products <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/account/designs">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Upload designs
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Zap, title: 'Fast turnaround', desc: 'Reliable 3–5 day production.' },
                  { icon: Shield, title: 'Quality first', desc: 'Durable materials, sharp prints.' },
                  { icon: Leaf, title: 'Eco-aware', desc: 'Smarter processes, less waste.' },
                ].map((f) => (
                  <Card key={f.title} className="py-0">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-xl bg-primary/10 p-2">
                          <f.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{f.title}</p>
                          <p className="text-sm text-muted-foreground">{f.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <Card className="overflow-hidden py-0">
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-0.5 bg-border/60">
                    {['/images/product-1.jpg', '/images/product-2.jpg', '/images/product-5.jpg', '/images/product-8.jpg'].map((src) => (
                      <div key={src} className="relative aspect-square overflow-hidden bg-muted">
                        <Image src={src} alt="Product" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <p className="mt-3 text-xs text-muted-foreground">
                Tip: Login to keep your cart synced across devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight">Shop by category</h2>
              <p className="text-muted-foreground mt-2">Pick a base product, then customize the details.</p>
            </div>
            <Link href="/shop" className="hidden sm:inline-flex">
              <Button variant="outline">View all</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category) => {
              const img = category.imageUrl ?? categoryFallbackImage(category.slug);
              return (
                <Link key={category.id} href={`/shop?categories=${category.slug}`}>
                  <Card className="group overflow-hidden py-0">
                    <CardContent className="p-0">
                      <div className="relative h-56">
                        <Image src={img} alt={category.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex items-end p-5">
                          <div className="text-white">
                            <p className="text-lg font-bold">{category.name}</p>
                            <p className="text-sm text-white/80">{category.productCount} products</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight">Featured products</h2>
              <p className="text-muted-foreground mt-2">Popular picks from our catalog.</p>
            </div>
            <Link href="/shop" className="hidden sm:inline-flex">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Browse shop</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-2xl md:text-4xl font-black tracking-tight">How it works</h2>
              <p className="text-muted-foreground mt-2">
                A clean flow from idea to delivery—no complex setup.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { step: '01', title: 'Choose product', desc: 'Pick items your customers love.' },
                { step: '02', title: 'Upload design', desc: 'Add your artwork and notes.' },
                { step: '03', title: 'Place order', desc: 'Checkout securely with eSewa.' },
                { step: '04', title: 'We deliver', desc: 'Production + shipment updates.' },
              ].map((s) => (
                <Card key={s.step} className="py-0">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">{s.step}</p>
                        <p className="font-semibold">{s.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                      </div>
                      <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="py-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-7 p-8 md:p-10">
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                    Ready to launch your next drop?
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Upload your design, pick variants, and place orders in minutes.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link href="/shop">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                        Start shopping <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/blog">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Read the blog
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="md:col-span-5 relative min-h-52">
                  <Image src="/images/blog-2.jpg" alt="Persomith" fill className="object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
