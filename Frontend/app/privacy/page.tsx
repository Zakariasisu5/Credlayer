import { Metadata } from "next";
import { Shield, Eye, Lock, Database, UserCheck, Mail } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - CredLayer",
  description: "How CredLayer collects, uses, and protects your data",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-lg mb-6">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-cyan-400" />
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed">
                CredLayer ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Web3 reputation and risk intelligence platform.
              </p>
            </div>

            <div className="space-y-8">
              {/* Information We Collect */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Database className="w-6 h-6 text-cyan-400" />
                  Information We Collect
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">On-Chain Data</h3>
                    <p className="leading-relaxed">
                      We analyze publicly available blockchain data including wallet addresses, transaction histories, smart contract interactions, and token holdings. This data is already public on the blockchain and is used to generate reputation scores and risk assessments.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Usage Information</h3>
                    <p className="leading-relaxed">
                      We collect information about how you interact with our service, including API requests, wallet queries, features used, and timestamps. This helps us improve our service and provide better analytics.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Account Information</h3>
                    <p className="leading-relaxed">
                      If you create an account, we may collect your email address, username, and authentication credentials. We do not require personal identification beyond what you choose to provide.
                    </p>
                  </div>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <UserCheck className="w-6 h-6 text-cyan-400" />
                  How We Use Your Information
                </h2>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Provide and maintain our reputation and risk intelligence services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Analyze on-chain behavior to generate reputation scores</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Improve and optimize our algorithms and machine learning models</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Communicate with you about service updates and features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Detect and prevent fraud, abuse, and security incidents</span>
                  </li>
                </ul>
              </div>

              {/* Data Security */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-cyan-400" />
                  Data Security
                </h2>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your information:
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Encryption of data in transit and at rest</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Regular security audits and vulnerability assessments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Access controls and authentication requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Secure API endpoints with rate limiting</span>
                  </li>
                </ul>
              </div>

              {/* Data Sharing */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Data Sharing and Disclosure</h2>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  We do not sell your personal information. We may share data in the following circumstances:
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span><strong className="text-white">Service Providers:</strong> With trusted third parties who help us operate our service</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span><strong className="text-white">Aggregated Data:</strong> Anonymous, aggregated data for research and analytics</span>
                  </li>
                </ul>
              </div>

              {/* Your Rights */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  You have the following rights regarding your information:
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Access and review the information we have about you</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Request correction of inaccurate information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Request deletion of your account and associated data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Opt-out of marketing communications</span>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-cyan-400" />
                  Contact Us
                </h2>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="space-y-2 text-gray-300">
                  <p>Email: <a href="mailto:Zakariasisu5@gmail.com" className="text-cyan-400 hover:text-cyan-300">Zakariasisu5@gmail.com</a></p>
                  <p>Website: <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">credlayer.xyz/contact</Link></p>
                </div>
              </div>

              {/* Updates */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <p className="text-sm text-gray-400">
                  We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of our service after changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>
          </div>

          {/* Back Link */}
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
