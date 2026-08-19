"use client";

import { useState } from "react";
import { Calendar, Clock, Users, CheckCircle2, ArrowRight, Mail, Building2, Globe, Phone } from "lucide-react";
import { Header } from "../layout/header";
import { Footer } from "../landing/footer";
import { Button } from "../ui/button";

const DEMO_TYPES = [
  {
    id: "enterprise",
    title: "Enterprise Demo",
    duration: "45 mins",
    icon: Building2,
    description: "Deep dive into enterprise features, custom integrations, and compliance requirements.",
    features: [
      "Custom reputation scoring models",
      "Enterprise API access",
      "Dedicated support & SLA",
      "Advanced security features",
      "Multi-chain integration"
    ]
  },
  {
    id: "developer",
    title: "Developer Demo",
    duration: "30 mins",
    icon: Globe,
    description: "Technical walkthrough of APIs, SDKs, and integration best practices.",
    features: [
      "API & SDK overview",
      "Integration examples",
      "Developer tools demo",
      "Documentation review",
      "Q&A session"
    ]
  },
  {
    id: "product",
    title: "Product Tour",
    duration: "20 mins",
    icon: Users,
    description: "Quick overview of CredLayer's core features and use cases.",
    features: [
      "Platform overview",
      "Key features demo",
      "Use case examples",
      "Pricing discussion",
      "Next steps"
    ]
  }
];

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

export function DemoBookingPage() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    date: "",
    time: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
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

          <div className="relative mx-auto max-w-4xl px-4 py-32 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                <CheckCircle2 className="h-10 w-10 text-cyan-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Demo Request Confirmed!
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                Thank you for your interest in CredLayer. We&apos;ve received your demo request and will send you a calendar invite shortly.
              </p>
              
              <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-8 mb-8 text-left">
                <h3 className="text-lg font-semibold text-white mb-4">What&apos;s Next?</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>You&apos;ll receive a calendar invite at <strong className="text-white">{formData.email}</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Our team will send you preparation materials 24 hours before the demo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Feel free to bring any questions about your specific use case</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  Back to Home
                </Button>
                <Button href="/developers" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                  Explore Documentation
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Book Your Demo
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              See how CredLayer can transform your Web3 trust infrastructure. Choose a demo type and schedule a time that works for you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Demo Types */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Choose Your Demo Type</h2>
              <div className="space-y-4">
                {DEMO_TYPES.map((demo) => {
                  const Icon = demo.icon;
                  const isSelected = selectedDemo === demo.id;
                  
                  return (
                    <button
                      key={demo.id}
                      onClick={() => setSelectedDemo(demo.id)}
                      className={`w-full text-left rounded-xl border transition-all duration-300 p-6 ${
                        isSelected
                          ? "border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                          : "border-cyan-500/20 bg-[#0a1628]/60 hover:border-cyan-400/40"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 rounded-lg p-3 ${
                          isSelected ? "bg-cyan-500/20" : "bg-cyan-500/10"
                        }`}>
                          <Icon className={`h-6 w-6 ${isSelected ? "text-cyan-400" : "text-cyan-500"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">{demo.title}</h3>
                            <span className="flex items-center gap-1 text-sm text-gray-400">
                              <Clock className="h-4 w-4" />
                              {demo.duration}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{demo.description}</p>
                          <ul className="space-y-1.5">
                            {demo.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Why CredLayer */}
              <div className="mt-8 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Why Choose CredLayer?</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">AI-Powered Analysis</strong> - Advanced reputation scoring using machine learning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Enterprise Ready</strong> - SOC 2 compliant with 99.9% uptime SLA</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Multi-Chain Support</strong> - Solana, Ethereum, and more</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Developer First</strong> - Comprehensive APIs and SDKs</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Booking Form */}
            <div>
              <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1628]/60 backdrop-blur-sm p-6 sm:p-8 sticky top-8">
                <h2 className="text-xl font-semibold text-white mb-6">Your Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-cyan-500/20 bg-[#061426] px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-cyan-500/20 bg-[#061426] pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  {/* Company & Role */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-cyan-500/20 bg-[#061426] px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                        placeholder="Acme Inc"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                        Role *
                      </label>
                      <select
                        id="role"
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-cyan-500/20 bg-[#061426] px-4 py-3 text-white focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                      >
                        <option value="">Select role</option>
                        <option value="founder">Founder/CEO</option>
                        <option value="cto">CTO/Engineering</option>
                        <option value="product">Product Manager</option>
                        <option value="developer">Developer</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-cyan-500/20 bg-[#061426] pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                        <input
                          type="date"
                          id="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full rounded-lg border border-cyan-500/20 bg-[#061426] pl-11 pr-4 py-3 text-white focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        id="time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-cyan-500/20 bg-[#061426] px-4 py-3 text-white focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                      >
                        <option value="">Select time</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>{slot} EST</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Anything specific you&apos;d like to discuss? (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full rounded-lg border border-cyan-500/20 bg-[#061426] px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-colors resize-none"
                      placeholder="Tell us about your use case or any specific questions..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedDemo}
                    className="w-full rounded-lg bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3.5 px-6 transition-colors duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Schedule Demo
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  {!selectedDemo && (
                    <p className="text-xs text-center text-gray-500">
                      Please select a demo type above to continue
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
