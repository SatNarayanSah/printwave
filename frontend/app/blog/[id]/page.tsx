import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/lib/mockData';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = blogPosts.find((p) => p.id === params.id);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
            <Link href="/blog">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8 space-y-4">
            <div className="inline-block">
              <span className="text-sm font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground">{post.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-12">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="space-y-6 text-foreground">
              <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Overview</h2>
              <p>{post.content}</p>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Key Takeaways</h2>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Understanding your audience and their needs is crucial for success in print-on-demand.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Quality materials and printing techniques directly impact customer satisfaction.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Sustainable practices are increasingly important to modern consumers.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Consistency in branding and messaging builds trust with your audience.</span>
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Getting Started</h2>
              <p>
                Whether you&apos;re just beginning your print-on-demand journey or looking to scale your business, the
                principles remain the same: focus on quality, understand your customers, and stay committed to
                continuous improvement. With the right approach and mindset, you can build a thriving business in this
                exciting industry.
              </p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="border-t border-border pt-8 mb-12">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-foreground">Share:</span>
              <div className="flex space-x-3">
                {['Facebook', 'Twitter', 'LinkedIn'].map((platform) => (
                  <button
                    key={platform}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="bg-muted rounded-lg p-6 mb-12">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{post.author}</h3>
                <p className="text-sm text-muted-foreground">
                  Expert writer and consultant in the print-on-demand industry with years of experience helping
                  businesses succeed.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 md:py-16 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-foreground mb-8">Related Articles</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="group">
                    <Link href={`/blog/${relatedPost.id}`} className="block">
                      <div className="relative h-56 rounded-lg overflow-hidden mb-4">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-primary-foreground bg-primary px-2 py-1 rounded">
                          {relatedPost.category}
                        </span>

                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>

                        <div className="text-xs text-muted-foreground pt-2">
                          {new Date(relatedPost.date).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Print-On-Demand Business?</h2>
            <p className="text-lg text-primary-foreground/90">
              Explore our products and create something amazing today.
            </p>
            <Link href="/shop">
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Shop Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
