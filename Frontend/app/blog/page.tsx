import { Metadata } from "next";
import { Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - CredLayer",
  description: "Latest insights on Web3 reputation, risk intelligence, and blockchain analytics",
};

export default function BlogPage() {
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

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Insights on{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Web3 Intelligence
              </span>
            </h1>
            <p className="text-lg text-gray-400">
              Latest research, case studies, and technical insights from the CredLayer team.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category === "All Posts"
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-900/50 border border-gray-800 text-gray-400 hover:border-cyan-500/50"
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
              className="block bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-colors"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full">
                    Featured
                  </span>
                  <span className="px-3 py-1 bg-gray-900/50 text-gray-400 text-sm rounded-full">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 hover:text-cyan-400 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-gray-400 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-colors group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-gray-900 text-gray-400 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
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
                    <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 max-w-2xl mx-auto text-center">
              <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-gray-400 mb-6">
                Get the latest insights on Web3 intelligence delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Back Navigation */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
