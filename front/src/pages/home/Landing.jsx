import { Link } from 'react-router';
import { ArrowRight, Check, XCircle } from 'lucide-react';
import Hero from './Hero';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Features from './features/features';

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        {/* Features Section */}
        <Features />
        {/* Pain Points Comparison */}
        <section className="py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">
                The Inbox Nightmare You Deserve to Escape
              </h2>
              <p className="text-xl text-muted-foreground">
                See the difference our AI-powered solution makes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Without Us */}
              <Card className="p-6 space-y-6 border-destructive/50 bg-destructive/5">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <XCircle className="text-destructive h-6 w-6" />
                    Without Us
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <XCircle className="text-destructive h-5 w-5 mt-0.5" />
                    <span>3+ hours/day lost to email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-destructive h-5 w-5 mt-0.5" />
                    <span>Missed deadlines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-destructive h-5 w-5 mt-0.5" />
                    <span>Forgotten replies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="text-destructive h-5 w-5 mt-0.5" />
                    <span>Inbox anxiety</span>
                  </li>
                </ul>
              </Card>

              {/* With Our App */}
              <Card className="p-6 space-y-6 border-primary/50 bg-primary/5">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Check className="text-primary h-6 w-6" />
                    With Our App
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5" />
                    <span>Smart sorting & priorities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5" />
                    <span>Fast, clear summaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5" />
                    <span>AI replies in 1 click</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary h-5 w-5 mt-0.5" />
                    <span>Peace of mind</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Supported Domains */}
        <section className="pb-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Currently Supporting Gmail Accounts
              </h2>
              <p className="text-xl text-muted-foreground">
                We&apos;re laser-focused on giving Gmail users the smoothest
                AI-powered inbox experience. Got @gmail.com? You&apos;re ready
                to roll.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-12">
          <div className="container space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">
                What Our Users Are Saying
              </h2>
              <p className="text-xl text-muted-foreground">
                Real feedback from people who&apos;ve transformed their email
                experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Testimonial 1 */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Alex G."
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Alex G.</h4>
                    <p className="text-sm text-muted-foreground">
                      Product Manager
                    </p>
                  </div>
                </div>
                <p className="italic">
                  &quot;I cut my daily email time from 2 hours to 15 minutes.
                  Game changer.&quot;
                </p>
              </Card>

              {/* Testimonial 2 */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Laila T."
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Laila T.</h4>
                    <p className="text-sm text-muted-foreground">
                      Marketing Director
                    </p>
                  </div>
                </div>
                <p className="italic">
                  &quot;The summaries are insanely accurate. I barely open full
                  emails now.&quot;
                </p>
              </Card>

              {/* Testimonial 3 */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Martin R."
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Martin R.</h4>
                    <p className="text-sm text-muted-foreground">
                      Entrepreneur
                    </p>
                  </div>
                </div>
                <p className="italic">
                  &quot;Reply suggestions save me from email fatigue. I feel way
                  more productive.&quot;
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Take Control of Your Inbox Today
              </h2>
              <p className="text-xl">
                Enough scrolling—time to take action. Sign in with your Gmail
                and let the AI do the work.
              </p>
              <Link to="/auth/sign-up">
                <Button size="lg" className="gap-2">
                  Try It Now — It&apos;s Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">InBoxAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered email management for the modern professional.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">InboxAI</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} EmailAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
