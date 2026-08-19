"use client";

import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Header } from "../layout/header";
import { Footer } from "../landing/footer";
import { Button } from "../ui/button";

const CATEGORIES = [
  { id: "all", name: "All Posts", count: 12 },
  { id: "web3", name: "Web3", count: 5 },
  { id: "security", name: "Security", count: 4 },
  { id: "ai", name: "AI & ML", count: 3 }
];

const FEATURED_POST = {
  id: "ai-reputation-future",
  title: "The Future of AI-Powered Reputation Systems in Web3",
  excerpt: "Explore how artificial intelligence is revolutionizing trust and reputation scoring in decentralized ecosystems, and what it means for the future of blockchain adoption.",
  category: "AI & ML",
  date: "August 10, 2026",
  readTime: "8 min read",
  author: "Dr. Sarah Chen",
  image: "featured"
};

const BLOG_POSTS = [
  {
    id: "multi-chain-credentials",
    title: "Building Cross-Chain Credential Systems: A Technical Deep Dive",
    excerpt: "Learn how CredLayer enables seamless credential verification across multiple blockchain networks with our unified protocol.",
    category: "Web3",
    date: "August 5, 2026",
    readTime: "6 min read",
    author: "Marcus Rodriguez"
  },
  {
    id: "fraud-detection-ml",
    title: "Machine Learning for Real-Time Fraud Detection in DeFi",
    excerpt: "Discover the ML algorithms powering our fraud detection system that protects DeFi protocols from sophisticated attacks.",
    category: "Security",
    date: "July 28, 2026",
    readTime: "10 min read",
    author: "Alex Thompson"
  },
  {
    id: "dao-governance-trust",
    title: "Solving Sybil Attacks: How Reputation Systems Secure DAO Governance",
    excerpt: "Explore effective strategies for preventing Sybil attacks in DAO voting systems using on-chain reputation scoring.",
    category: "Web3",
    date: "July 20, 2026",
    readTime: "7 min read",
    author: "Jamie Park"
  },
  {
    id: "privacy-preserving-credentials",
    title: "Privacy-Preserving Verifiable Credentials: Best Practices",
    excerpt: "A comprehensive guide to implementing zero-knowledge proofs and selective disclosure in credential systems.",
    category: "Security",
    date: "July 12, 2026",
    readTime: "9 min read",
    author: "Dr. Sarah Chen"
  },
  {
    id: "nft-authenticity",
    title: "Verifying NFT Authenticity: Beyond the Blockchain",
    excerpt: "How to combine on-chain data with off-chain signals to build comprehensive NFT authenticity verification.",
    category: "Web3",
    date: "July 5, 2026",
    readTime: "5 min read",
    author: "Marcus Rodriguez"
  },
  {
    id: "reputation-scoring-algorithms",
    title: "Understanding Reputation Scoring Algorithms in Web3",
    excerpt: "A technical breakdown of the algorithms and data sources that power modern Web3 reputation systems.",
    category: "AI & ML",
    date: "June 28, 2026",
    readTime: "8 min read",
    author: "Alex Thompson"
  },
  {
    id: "gaming-bot-detection",
    title: "Bot Detection in Web3 Gaming: Maintaining Fair Play",
    excerpt: "Learn how behavioral analysis and ML models identify and prevent bot accounts in blockchain games.",
    category: "AI & ML",
    date: "June 20, 2026",
    readTime: "6 min read",
    author: "Jamie Park"
  },
  {
    id: "enterprise-web3-adoption",
    title: "Enterprise Web3 Adoption: The Trust Infrastructure Gap",
    excerpt: "Why traditional enterprises need robust trust infrastructure before adopting Web3 technologies at scale.",
    category: "Web3",
    date: "June 12, 2026",
    readTime: "7 min read",
    author: "Dr. Sarah Chen"
  },
  {
    id: "smart-contract-security",
    title: "Smart Contract Security: Integrating Reputation-Based Access Control",
    excerpt: "How to leverage reputation scores to add an additional security layer to smart contract interactions.",
    category: "Security",
    date: "June 5, 2026",
    readTime: "10 min read",
    author: "Marcus Rodriguez"
  }
];

export function BlogPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-[#030c18]">
        {/* Background */}
        <div className="fixed inset-0 -z-10 bg-[#030c18]">
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[150px] animate-pulse [animation-delay:3s]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              CredLayer Blog
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Insights on Web3 trust infrastructure, blockchain security, AI reputation systems, and the future of decentralized verification.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  category.id === "all"
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                    : "border-cyan-500/30 bg-cyan-500/5 text-gray-400 hover:border-cyan-500/50 hover:bg-cyan-500/10"
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-70">({category.count})</span>
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Featured Post
              </span>
            </div>
            
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm overflow-hidden hover:border-cyan-400/40 transition-colors">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image placeholder */}
                <div className="relative h-64 lg:h-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  <div className="text-cyan-400/40 text-6xl font-bold">AI</div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-medium text-cyan-400">
                      {FEATURED_POST.category}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {FEATURED_POST.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      {FEATURED_POST.readTime}
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    {FEATURED_POST.title}
                  </h2>

                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {FEATURED_POST.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">By {FEATURED_POST.author}</span>
                    <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {BLOG_POSTS.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm overflow-hidden hover:border-cyan-400/40 transition-colors group"
              >
                {/* Image placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center border-b border-cyan-500/20">
                  <Tag className="h-12 w-12 text-cyan-400/30" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-medium text-cyan-400">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-cyan-500/20">
                    <span className="text-xs text-gray-400">{post.author}</span>
                    <ArrowRight className="h-4 w-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
              Load More Posts
            </Button>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-20 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Get the latest insights on Web3 trust infrastructure delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-cyan-500/30 bg-[#0a1628]/60 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
              />
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
