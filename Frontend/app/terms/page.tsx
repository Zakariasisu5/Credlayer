import { Metadata } from "next";
import { FileText, AlertCircle, CheckCircle, XCircle, Mail } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - CredLayer",
  description: "Terms and conditions for using CredLayer services",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-lg mb-6">
              <FileText className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-cyan-400" />
                Agreement to Terms
              </h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using CredLayer's reputation and risk intelligence platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
              </p>
            </div>

            <div className="space-y-8">
              {/* Service Description */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">1. Service Description</h2>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  CredLayer provides AI-powered reputation and risk intelligence services for Web3, including:
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Wallet reputation scoring and risk assessment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>On-chain behavior analysis and pattern recognition</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Protocol intelligence and transaction monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>API access for developers and enterprises</span>
                  </li>
                </ul>
              </div>

              {/* Acceptable Use */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  2. Acceptable Use
                </h2>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Use the Service to violate any applicable laws or regulations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Attempt to interfere with or disrupt the Service or servers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Circumvent rate limits or access controls</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Reverse engineer or attempt to extract source code</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Use the Service to harass, defame, or harm others</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Share your API keys or account credentials with others</span>
                  </li>
                </ul>
              </div>

              {/* API Usage */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">3. API Usage and Rate Limits</h2>
                
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    API access is subject to rate limits based on your subscription tier. Excessive use may result in temporary throttling or suspension of service.
                  </p>
                  
                  <p className="leading-relaxed">
                    You are responsible for maintaining the confidentiality of your API keys. We are not liable for unauthorized use of your credentials.
                  </p>
                </div>
              </div>

              {/* Data and Privacy */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">4. Data and Privacy</h2>
                
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Our Service analyzes publicly available blockchain data. By using the Service, you acknowledge that:
                  </p>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                      <span>Blockchain data is inherently public and transparent</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                      <span>Reputation scores are generated from on-chain behavior</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                      <span>We collect and process data as described in our <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</Link></span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Disclaimers */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-yellow-400" />
                  5. Disclaimers and Limitations
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    <strong className="text-white">AS-IS SERVICE:</strong> The Service is provided "as is" without warranties of any kind, express or implied.
                  </p>
                  
                  <p className="leading-relaxed">
                    <strong className="text-white">NO FINANCIAL ADVICE:</strong> Our risk assessments and reputation scores are for informational purposes only and do not constitute financial, legal, or investment advice.
                  </p>
                  
                  <p className="leading-relaxed">
                    <strong className="text-white">ACCURACY:</strong> While we strive for accuracy, we do not guarantee that our analyses are error-free or complete. Always conduct your own due diligence.
                  </p>
                  
                  <p className="leading-relaxed">
                    <strong className="text-white">BETA STATUS:</strong> The Service is currently in active development (MVP stage). Features may change and interruptions may occur.
                  </p>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
                
                <p className="text-gray-300 leading-relaxed">
                  To the maximum extent permitted by law, CredLayer shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from your use of the Service.
                </p>
              </div>

              {/* Account Termination */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">7. Account Termination</h2>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  We reserve the right to suspend or terminate your access to the Service at any time for:
                </p>
                
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Violation of these Terms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Suspected fraudulent or abusive activity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Non-payment of fees (if applicable)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span>Any other reason at our sole discretion</span>
                  </li>
                </ul>
              </div>

              {/* Changes to Terms */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
                
                <p className="text-gray-300 leading-relaxed">
                  We may modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
                </p>
              </div>

              {/* Governing Law */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">9. Governing Law</h2>
                
                <p className="text-gray-300 leading-relaxed">
                  These Terms are governed by and construed in accordance with applicable laws. Any disputes shall be resolved in appropriate courts.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-cyan-400" />
                  10. Contact Information
                </h2>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  For questions about these Terms, please contact us:
                </p>
                
                <div className="space-y-2 text-gray-300">
                  <p>Email: <a href="mailto:Zakariasisu5@gmail.com" className="text-cyan-400 hover:text-cyan-300">Zakariasisu5@gmail.com</a></p>
                  <p>Website: <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">credlayer.xyz/contact</Link></p>
                </div>
              </div>

              {/* Acknowledgment */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <p className="text-sm text-gray-400 leading-relaxed">
                  By using CredLayer, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
