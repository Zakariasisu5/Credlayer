"use client";

import { Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Header } from "../components/layout/header";
import { Button } from "../components/ui/button";

const featuredPost = {
  title: "The Future of Web3 Reputation Systems",
  excerpt:
    "Exploring how verifiable reputation will reshape trust in decentralized ecosystems and enable new models of collaboration.",
  category: "Research",
  date: "2024-03-15",
  readTime: "8 min read",
  slug: "future-of-web3-reputation",
};

const posts = [
  {
    title: "How AI is Revolutionizing On-Chain Risk Assessment",
    excerpt:
      "Deep dive into machine learning models that analyze wallet behavior and predict risk factors in real-time.",
    category: "Technology",
    date: "2024-03-10",
    readTime: "6 min read",
    slug: "ai-onchain-risk-assessment",
  },
  {
    title: "Building Trust in Autonomous Agent Economies",
    excerpt:
      "Why reputation systems are critical for the emerging economy of AI agents and how CredLayer solves this challenge.",
    category: "Research",
    date: "2024-03-05",
    readTime: "7 min read",
    slug: "autonomous-agent-trust",
  },
  {
    title: "Case Study: How a DeFi Protocol Reduced Risk by 87%",
    excerpt:
      "Real-world implementation showing how CredLayer's risk intelligence prevented millions in losses.",
    category: "Case Study",
    date: "2024-02-28",
    readTime: "5 min read",
    slug: "defi-risk-reduction-case-study",
  },
  {
    title: "Understanding Know Your Transaction (KYT) for Web3",
    excerpt:
      "A comprehensive guide to transaction monitoring, compliance, and how KYT differs from traditional KYC.",
    category: "Education",
    date: "2024-02-20",
    readTime: "10 min read",
    slug: "understanding-kyt-web3",
  },
  {
    title: "The Role of On-Chain Data in Credit Scoring",
    excerpt:
      "How blockchain transparency enables new models of creditworthiness assessment without traditional financial data.",
    category: "Research",
    date: "2024-02-15",
    readTime: "6 min read",
    slug: "onchain-credit-scoring",
  },
  {
    title: "API Best Practices for Wallet Risk Integration",
    excerpt:
      "Technical guide for developers integrating CredLayer's API into their applications for real-time risk assessment.",
    category: "Developer",
    date: "2024-02-10",
    readTime: "9 min read",
    slug: "api-wallet-risk-integration",
  },
];

const categories = [
  "All Posts",
  "Research",
  "Technology",
  "Case Study",
  "Education",
  "Developer",
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-background min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-5 py-16 lg:px-10 lg:py-24">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Insights on Web3 Intelligence
            </h1>
            <p className="text-lg text-muted-foreground">
              Latest research, case studies, and technical insights from the CredLayer team
            </p>
          </div>

          {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              category === "All Posts"
                ? "bg-primary text-primary-foreground shadow-card"
                : "border border-border bg-card/80 backdrop-blur-sm text-muted-foreground hover:border-primary/40"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Post */}
      <div className="mb-12">
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="block rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition-all shadow-card"
        >
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full border border-primary/30">
                Featured
              </span>
              <span className="px-3 py-1 bg-card text-muted-foreground text-sm rounded-full border border-border">
                {featuredPost.category}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 hover:text-primary transition-colors text-foreground">
              {featuredPost.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">{featuredPost.excerpt}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition-all shadow-card group"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-card border border-border text-muted-foreground text-xs font-medium rounded-full">
                  {post.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors text-foreground">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 max-w-2xl mx-auto text-center shadow-card">
        <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3 text-foreground">Stay Updated</h2>
        <p className="text-muted-foreground mb-6">
          Get the latest insights on Web3 intelligence delivered to your inbox.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
          />
          <Button type="submit">
            Subscribe
          </Button>
        </form>
      </div>

      {/* Back Navigation */}
      <div className="mt-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  </main>
</>
  );
}
