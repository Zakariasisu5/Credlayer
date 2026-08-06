"use client";

import { ConnectPrompt } from "@/components/app/ConnectPrompt";
import { useWalletSession } from "@/lib/wallet/session";
import { motion } from "motion/react";
import {
  Gauge,
  TrendingUp,
  Activity,
  BadgeCheck,
  Bot,
  Shield,
  ExternalLink,
  RefreshCcw,
} from "lucide-react";

export default function DashboardPage() {
  const session = useWalletSession();

  if (!session.authenticated) {
    return <ConnectPrompt />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connected: {session.displayAddress} • {session.networkLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="glass rounded-lg px-3 py-2 text-sm hover:bg-elevated transition-colors flex items-center gap-2">
            <RefreshCcw className="size-4" />
            Refresh Data
          </button>
          {session.explorerUrl && (
            <a
              href={session.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-lg px-3 py-2 text-sm hover:bg-elevated transition-colors flex items-center gap-2"
            >
              <ExternalLink className="size-4" />
              Explorer
            </a>
          )}
        </div>
      </motion.div>

      {/* Reputation Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-3xl p-6 sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Reputation Score</div>
            <div className="mt-2 text-5xl sm:text-6xl font-bold text-gold">748</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="glass rounded-full px-3 py-1 text-xs text-success">
                Good Standing
              </span>
              <span className="text-xs text-muted-foreground">Tier: Established</span>
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-4">
            <Gauge className="size-8 text-gold" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Risk Level</div>
            <div className="mt-1 text-lg font-semibold">Low</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Active Since</div>
            <div className="mt-1 text-lg font-semibold">2 years</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total TX</div>
            <div className="mt-1 text-lg font-semibold">1,247</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Protocols</div>
            <div className="mt-1 text-lg font-semibold">18</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div className="glass-strong rounded-xl p-2.5">
              <Activity className="size-5 text-azure" />
            </div>
            <TrendingUp className="size-4 text-success" />
          </div>
          <div className="mt-4">
            <div className="text-sm text-muted-foreground">On-Chain Activity</div>
            <div className="mt-1 text-2xl font-semibold">High</div>
            <div className="mt-1 text-xs text-muted-foreground">87th percentile</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-strong rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div className="glass-strong rounded-xl p-2.5">
              <BadgeCheck className="size-5 text-success" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-muted-foreground">Verified Credentials</div>
            <div className="mt-1 text-2xl font-semibold">3 Active</div>
            <div className="mt-1 text-xs text-muted-foreground">2 pending review</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div className="glass-strong rounded-xl p-2.5">
              <Shield className="size-5 text-gold" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-muted-foreground">Trust Score</div>
            <div className="mt-1 text-2xl font-semibold">92/100</div>
            <div className="mt-1 text-xs text-muted-foreground">Above average</div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-strong rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <button className="text-sm text-gold hover:underline">View All</button>
        </div>

        <div className="space-y-3">
          {[
            { type: "Transaction", desc: "Swap on Uniswap", time: "2 hours ago", icon: Activity },
            { type: "Credential", desc: "GitcoinPassport verified", time: "1 day ago", icon: BadgeCheck },
            { type: "Agent", desc: "AI agent authorization", time: "3 days ago", icon: Bot },
          ].map((activity, i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="glass-strong rounded-lg p-2">
                  <activity.icon className="size-4 text-gold" />
                </div>
                <div>
                  <div className="text-sm font-medium">{activity.type}</div>
                  <div className="text-xs text-muted-foreground">{activity.desc}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid sm:grid-cols-3 gap-4"
      >
        <button className="glass-strong rounded-2xl p-5 text-left hover:bg-elevated transition-colors">
          <BadgeCheck className="size-6 text-gold mb-3" />
          <div className="text-sm font-medium">Add Credential</div>
          <div className="text-xs text-muted-foreground mt-1">
            Verify your identity with attestations
          </div>
        </button>

        <button className="glass-strong rounded-2xl p-5 text-left hover:bg-elevated transition-colors">
          <Bot className="size-6 text-azure mb-3" />
          <div className="text-sm font-medium">Authorize AI Agent</div>
          <div className="text-xs text-muted-foreground mt-1">
            Grant permissions to autonomous agents
          </div>
        </button>

        <button className="glass-strong rounded-2xl p-5 text-left hover:bg-elevated transition-colors">
          <Shield className="size-6 text-success mb-3" />
          <div className="text-sm font-medium">Privacy Settings</div>
          <div className="text-xs text-muted-foreground mt-1">
            Control your data visibility
          </div>
        </button>
      </motion.div>
    </div>
  );
}
