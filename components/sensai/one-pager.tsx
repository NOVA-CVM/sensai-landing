"use client"

import { CycleDiagram } from "./cycle-diagram"
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Cog,
  Eye,
  Layers,
  MessageSquare,
  Rocket,
  Shield,
  Target,
  TrendingUp,
  Zap,
  ArrowRight,
  Calendar,
} from "lucide-react"

const BOOKING_URL = "https://calendar.app.google/K15ZBdA3E6WBxbWXA"

function openBooking() {
  const w = 500
  const h = 650
  const left = (window.screen.width - w) / 2
  const top = (window.screen.height - h) / 2
  window.open(
    BOOKING_URL,
    "sensai-booking",
    `width=${w},height=${h},top=${top},left=${left},scrollbars=yes,resizable=yes`
  )
}

function Logo({ className = "", showMascot = false }: { className?: string; showMascot?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {showMascot && (
        <img src="/sensai-mascot.png" alt="Sensai" className="w-14 h-14 rounded-xl" />
      )}
      <span
        className={`tracking-[0.08em] lowercase ${className}`}
        style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 600 }}
      >
        sensai
      </span>
    </span>
  )
}

export function SensaiOnePager() {
  return (
    <div className="w-full">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-22">
          <Logo className="text-4xl font-semibold text-foreground" showMascot />
          <button
            onClick={openBooking}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Book a Demo
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-primary font-medium text-sm tracking-wider uppercase mb-4">
              Adaptive Intelligence for iGaming
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Your analysts shouldn&apos;t be the bottleneck.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Sensai is an adaptive intelligence engine for iGaming operators. It
              senses what&apos;s happening in your player base, puts it in your
              team&apos;s hands to act on, and learns from every decision they make.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={openBooking}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 text-base cursor-pointer"
              >
                Book a Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-sm text-muted-foreground self-center">
                Now onboarding select iGaming operators
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Gap */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">
            The gap every operator feels
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-12 max-w-xl">
            Data-rich. Insight-poor.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <GapCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Insights are trapped in your people."
              description="Your analysts can't keep up with the pace. The queue is piling up. Teams stopped asking because they know it'll take days. The knowledge your business needs is stuck — in backlogs, in heads, in spreadsheets no one reads."
            />
            <GapCard
              icon={<Cog className="w-5 h-5" />}
              title="Your CRM is acting on yesterday's logic."
              description="Customer behavior drifted. New abuse patterns emerged. VIP signals shifted. But your triggers and flows still run on rules written months ago. The system executes — just not on the right cases anymore."
            />
            <GapCard
              icon={<AlertTriangle className="w-5 h-5" />}
              title="By the time you see it, it's too late."
              description="A network of abusers has been exploiting a loophole — some have already cashed out. A high-value player already churned. The data had the answer — but it was buried in a queue, waiting for someone to look."
            />
          </div>
        </div>
      </section>

      {/* How Sensai Works */}
      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">
            How Sensai works
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-16 max-w-xl">
            Sense. Act. Learn. Repeat.
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="max-w-sm mx-auto lg:mx-0">
              <CycleDiagram />
            </div>
            <div className="space-y-6">
              <CycleStep
                step="01"
                label="SENSE"
                icon={<Eye className="w-5 h-5" />}
                description="Continuously analyzes your customer base and detects patterns — value shifts, abuse signals, churn risk. Always current, never stale."
              />
              <CycleStep
                step="02"
                label="ACT"
                icon={<Zap className="w-5 h-5" />}
                description="Proactively alerts and pushes intelligence to your CRM, case management, and risk systems. Your team acts with full context — no analyst in the loop."
              />
              <CycleStep
                step="03"
                label="LEARN"
                icon={<Brain className="w-5 h-5" />}
                description="Your team teaches Sensai in plain language. The system gets smarter with every decision they make."
              />
            </div>
          </div>
        </div>
      </section>

      {/* What Your Team Gets */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">
            What your team gets
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-12 max-w-xl">
            Intelligence that works for you.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Shield className="w-5 h-5" />}
              title="Risk Engine"
              description="Catch bonus abuse before it hits your P&L. Automated detection and flagging."
            />
            <FeatureCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="Value Engine"
              description="Find your hidden VIPs. Predict lifetime value. Know who to protect, who to grow."
            />
            <FeatureCard
              icon={<Layers className="w-5 h-5" />}
              title="Q Center"
              description="Your team's daily command center. Cases, context, and one-click actions in one place."
            />
            <FeatureCard
              icon={<Zap className="w-5 h-5" />}
              title="Smart Triggers"
              description="Big win. Big loss. Churn signal. Your team knows what changed and acts on it."
            />
            <FeatureCard
              icon={<MessageSquare className="w-5 h-5" />}
              title="Teach Sensai"
              description="Give feedback in plain language. 'This player is about to churn.' Sensai learns and adapts."
            />
            <FeatureCard
              icon={<Target className="w-5 h-5" />}
              title="Works With Your Stack"
              description="Pushes intelligence to your systems. Not a replacement — the brain behind them."
            />
          </div>
        </div>
      </section>

      {/* See It In Action */}
      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">
            See it in action
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-10 max-w-xl">
            From signal to action in minutes.
          </h2>
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm max-w-4xl">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Sensai identifies unusual activity on a game — high volume from
              players with risk indicators. It flags the accounts, maps the
              connections between them, and surfaces an organized network of
              abusers. Your fraud team reviews the case in Q Center, approves the
              pattern, and Sensai immediately adds it to your risk systems —
              excluding the accounts from promotions and flagging the loophole for
              future detection.
            </p>
            <p className="mt-6 text-primary font-semibold text-lg">
              All within minutes. No SQL. No analyst ticket.
            </p>
          </div>
        </div>
      </section>

      {/* Why Operators Choose Sensai */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">
            Why operators choose Sensai
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-12 max-w-xl">
            Built for production. Built for you.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <WhyCard
              icon={<Eye className="w-5 h-5" />}
              title="Live in production."
              description="Not a concept. An adaptive intelligence system already in live production."
            />
            <WhyCard
              icon={<Rocket className="w-5 h-5" />}
              title="Connected in days, not months."
              description="Give us access to your raw tables — keep them in your cloud. We build the pipeline. Your team is using Sensai within two weeks."
            />
            <WhyCard
              icon={<Brain className="w-5 h-5" />}
              title="ROI from week one."
              description="Bonus abuse detection alone pays for itself. Everything else is upside. Built on 17 years of customer analytics in iGaming and deep data science research."
            />
          </div>
        </div>
      </section>

      {/* Early Operator Program + CTA */}
      <section className="py-24 md:py-36 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-4">
            Early Operator Program
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
            Unlock the full potential of your player data.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto">
            We&apos;re onboarding a small number of operators who want to shape the
            product with us. Favorable terms, direct access to the founding team,
            and a system built around your workflow.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <button
            onClick={openBooking}
            className="block w-full bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group text-left cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">Book a Demo</p>
                <p className="text-sm text-muted-foreground">30-minute call with the founding team</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary ml-auto transition-colors" />
            </div>
          </button>
          <p className="mt-4 text-sm text-muted-foreground text-center">
            amit@novacvm.com
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo className="text-xl font-semibold text-foreground" showMascot />
          <p className="text-sm text-muted-foreground">
            Early Operator Program &middot; Limited spots
          </p>
        </div>
      </footer>
    </div>
  )
}

function GapCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-primary">{icon}</div>
        <h3 className="text-base font-semibold text-foreground leading-tight">
          {title}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function CycleStep({
  step,
  label,
  icon,
  description,
}: {
  step: string
  label: string
  icon: React.ReactNode
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
        <div className="w-px flex-1 bg-border mt-2" />
      </div>
      <div className="pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground/50 font-medium">{step}</span>
          <h3 className="text-base font-semibold text-foreground">{label}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="text-primary">{icon}</div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function WhyCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-primary">{icon}</div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
