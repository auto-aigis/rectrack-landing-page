"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle,
  ChevronRight,
  Dumbbell,
  LineChart,
  Menu,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge: string | null;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
      title: "Personal Stats Dashboard",
      description:
        "Log your game stats in seconds. Track batting averages, goals, assists, kills, aces — whatever matters for your sport.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      title: "Performance Trends",
      description:
        "See exactly how you are improving over weeks and months with beautiful charts. No more guessing if practice is paying off.",
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      title: "AI Coaching Tips",
      description:
        "Get personalized coaching insights based on YOUR data. Our AI analyzes your patterns and tells you exactly what to work on.",
    },
    {
      icon: <Target className="h-6 w-6 text-orange-600" />,
      title: "Pre-Game AI Prep",
      description:
        "Before Saturday's game, get a custom prep sheet based on your recent performance. Walk in confident and focused.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-pink-600" />,
      title: "Weekly Improvement Insights",
      description:
        "Every Monday, receive a digest of what improved, what slipped, and one specific drill to try this week.",
    },
    {
      icon: <Activity className="h-6 w-6 text-teal-600" />,
      title: "Multi-Sport Support",
      description:
        "Softball, soccer, basketball, volleyball, tennis, pickleball — track all your leagues in one place.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Log Your Stats",
      description:
        "After each game, spend 60 seconds logging your key stats. Our sport-specific forms make it fast and easy.",
      icon: <Dumbbell className="h-8 w-8 text-blue-600" />,
    },
    {
      number: "02",
      title: "Track Your Trends",
      description:
        "Watch your personal dashboard come alive with performance trends, streaks, and milestones over time.",
      icon: <LineChart className="h-8 w-8 text-green-600" />,
    },
    {
      number: "03",
      title: "Get AI Coaching",
      description:
        "Receive tailored coaching tips and pre-game prep based on your unique performance data and position.",
      icon: <Brain className="h-8 w-8 text-purple-600" />,
    },
  ];

  const pricing: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying it out with one sport",
      features: [
        "1 sport tracking",
        "Basic stats logging",
        "30-day performance history",
        "Weekly summary email",
      ],
      highlighted: false,
      badge: null,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For the dedicated weekend warrior",
      features: [
        "Unlimited sports",
        "Full performance history",
        "AI coaching tips",
        "Pre-game AI prep sheets",
        "Weekly improvement insights",
        "Advanced trend analytics",
        "Export your data",
      ],
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Team",
      price: "$7",
      period: "per player/month",
      description: "For rec league teams who want an edge",
      features: [
        "Everything in Pro",
        "Team dashboard",
        "Compare stats with teammates",
        "Team-level AI insights",
        "Bulk stat entry",
        "Priority support",
      ],
      highlighted: false,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Trophy className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">RecTrack</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600 hover:text-gray-900 py-2">
              Features
            </a>
            <a href="#how-it-works" className="block text-sm text-gray-600 hover:text-gray-900 py-2">
              How It Works
            </a>
            <a href="#pricing" className="block text-sm text-gray-600 hover:text-gray-900 py-2">
              Pricing
            </a>
            <a href="#faq" className="block text-sm text-gray-600 hover:text-gray-900 py-2">
              FAQ
            </a>
            <Separator />
            <div className="flex flex-col gap-2 pt-2">
              <a href="/login">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              Built for 38M+ adult rec league players
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Your Personal AI Sports Coach for{" "}
              <span className="text-blue-600">Rec League</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Stop guessing if {"you're"} improving. Log your game stats, see performance trends, and get AI coaching tips tailored to your sport — all in your browser, no downloads needed.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 py-6">
                  Get Started Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="text-base px-8 py-6">
                  See How It Works
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Free forever plan available. No credit card required.
            </p>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-8 sm:p-12 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">This Week</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">3/4</p>
                  <p className="text-sm text-gray-500 mt-1">Hits in softball</p>
                  <div className="mt-3 flex items-center gap-1 text-green-600 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span>+15% from last month</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">AI Tip</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {"\"Your batting average drops in late innings. Try this pre-at-bat routine to stay focused...\""}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Pre-Game Prep</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {"\"Saturday's focus: Work on opposite-field hitting. Your pull rate is 78% — pitchers will adjust.\""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">6+</p>
              <p className="text-sm text-gray-600 mt-1">Sports Supported</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">60s</p>
              <p className="text-sm text-gray-600 mt-1">To Log a Game</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">100%</p>
              <p className="text-sm text-gray-600 mt-1">Browser-Based</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">AI</p>
              <p className="text-sm text-gray-600 mt-1">Powered Insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to level up your game
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built specifically for adult recreational athletes who want to track, improve, and enjoy their sports more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gray-50 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Three steps to becoming a better player
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No complicated setup. No app downloads. Just open your browser and start improving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 border border-gray-200 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-bold text-blue-100">{step.number}</span>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Supported */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Multi-Sport</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Built for your sport
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Sport-specific stat forms and AI coaching for every popular rec league sport.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Softball", "Soccer", "Basketball", "Volleyball", "Tennis", "Pickleball", "Flag Football", "Kickball"].map(
              (sport) => (
                <Badge key={sport} variant="outline" className="px-4 py-2 text-sm font-medium">
                  {sport}
                </Badge>
              )
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Simple, honest pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Start free, upgrade when you want AI coaching and unlimited history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((tier, index) => (
              <Card
                key={index}
                className={`relative ${
                  tier.highlighted
                    ? "border-blue-600 border-2 shadow-lg scale-105"
                    : "border-gray-200"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-3">{tier.badge}</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-500 ml-1">/{tier.period}</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${
                        tier.highlighted
                          ? "bg-blue-600 hover:bg-blue-700"
                          : ""
                      }`}
                      variant={tier.highlighted ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Use Case */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0">
              <CardContent className="p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-6 w-6 text-blue-200" />
                  <span className="text-blue-200 font-medium">The Problem We Solve</span>
                </div>
                <p className="text-xl sm:text-2xl font-medium leading-relaxed mb-6">
                  {"\"I play in a Wednesday night softball league and a Saturday soccer league. Before RecTrack, I had zero idea if I was getting better or worse. Now I can see my trends, get actual coaching advice, and show up to games with a plan.\""}
                </p>
                <p className="text-blue-200">
                  — The experience {"we're"} building for every weekend warrior
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What sports does RecTrack support?</AccordionTrigger>
              <AccordionContent>
                We support softball, soccer, basketball, volleyball, tennis, pickleball, flag football, and kickball. Each sport has custom stat forms designed for that specific game. {"We're"} always adding more based on user requests.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Do I need to download an app?</AccordionTrigger>
              <AccordionContent>
                Nope! RecTrack is 100% browser-based. Open it on your phone, tablet, or computer — no downloads, no app store, no storage taken up on your device. It works like any website you already use.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How does the AI coaching work?</AccordionTrigger>
              <AccordionContent>
                Our AI analyzes your personal performance data — trends, patterns, strengths, and weaknesses — then generates specific, actionable coaching tips tailored to your sport and position. {"It's"} like having a coach who watches every game and knows your numbers inside and out.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How long does it take to log a game?</AccordionTrigger>
              <AccordionContent>
                About 60 seconds. Our sport-specific forms are designed to be fast. You just tap in your key stats right after the game — while {"you're"} still in the parking lot or at the bar with your team.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Is the free plan actually useful?</AccordionTrigger>
              <AccordionContent>
                Yes! The free plan lets you track one sport with basic stats and see 30 days of history. {"It's"} perfect for trying RecTrack out and seeing if stat tracking is something {"you'll"} stick with. Most players upgrade to Pro once they see their first month of trends.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>{"I'm"} not a serious athlete. Is this for me?</AccordionTrigger>
              <AccordionContent>
                Absolutely. RecTrack is built specifically for recreational players — weekend warriors, beer league legends, Tuesday night volleyball crews. You {"don't"} need to be competitive. You just need to be curious about whether {"you're"} improving and want a little help getting better.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to know if {"you're"} actually improving?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join RecTrack today. Start logging stats after your next game and get your first AI coaching tip within a week.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 py-6">
                Get Started Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required. Free plan available forever.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">RecTrack</span>
              </div>
              <p className="text-sm text-gray-600 max-w-sm">
                Your personal AI sports coach for amateur league players. Track stats, see trends, get better — all in your browser.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a></li>
                <li><a href="#faq" className="text-sm text-gray-600 hover:text-gray-900">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Account</h4>
              <ul className="space-y-2">
                <li><a href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign In</a></li>
                <li><a href="/register" className="text-sm text-gray-600 hover:text-gray-900">Get Started</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 RecTrack. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}