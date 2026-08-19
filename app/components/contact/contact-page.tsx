"use client";

import { Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react";
import { Header } from "../layout/header";
import { Footer } from "../landing/footer";
import { Button } from "../ui/button";

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: "Email",
    description: "Send us an email anytime",
    contact: "hello@credlayer.com",
    href: "mailto:hello@credlayer.com"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our team",
    contact: "Available 24/7",
    href: "#"
  },
  {
    icon: Phone,
    title: "Phone",
    description: "Call us during business hours",
    contact: "+1 (555) 123-4567",
    href: "tel:+15551234567"
  }
];

const OFFICES = [
  {
    city: "San Francisco",
    address: "123 Market Street, Suite 400",
    region: "California, USA 94105",
    email: "sf@credlayer.com"
  },
  {
    city: "New York",
    address: "456 Broadway, Floor 12",
    region: "New York, USA 10013",
    email: "ny@credlayer.com"
  },
  {
    city: "Singapore",
    address: "789 Marina Bay Ave, Level 20",
    region: "Singapore 018956",
    email: "sg@credlayer.com"
  }
];

const SOCIAL_LINKS = [
  { icon: Mail, label: "Twitter", href: "https://twitter.com/credlayer" },
  { icon: MapPin, label: "GitHub", href: "https://github.com/credlayer" },
  { icon: MessageSquare, label: "LinkedIn", href: "https://linkedin.com/company/credlayer" }
];

export function ContactPage() {
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
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Have questions about CredLayer? Our team is here to help. Reach out and we'll get back to you as soon as possible.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {CONTACT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <a
                  key={method.title}
                  href={method.href}
                  className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-6 hover:border-cyan-400/40 transition-colors group"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{method.description}</p>
                  <p className="text-cyan-400 font-medium">{method.contact}</p>
                </a>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Contact Form */}
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-[#0a1628]/60 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-[#0a1628]/60 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-[#0a1628]/60 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-400 mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-[#0a1628]/60 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-[#0a1628]/60 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="">Select a topic</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="general">General Question</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-[#0a1628]/60 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Offices */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Our Offices</h2>
              <div className="space-y-6 mb-8">
                {OFFICES.map((office) => (
                  <div
                    key={office.city}
                    className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex-shrink-0">
                        <MapPin className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{office.city}</h3>
                        <p className="text-sm text-gray-400 mb-1">{office.address}</p>
                        <p className="text-sm text-gray-400 mb-3">{office.region}</p>
                        <a href={`mailto:${office.email}`} className="text-sm text-cyan-400 hover:text-cyan-300">
                          {office.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {SOCIAL_LINKS.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center h-12 w-12 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-colors group"
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ CTA */}
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Looking for Quick Answers?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Check out our documentation and developer resources for technical guidance and API references.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/developers" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                View Documentation
              </Button>
              <Button href="/demo" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
