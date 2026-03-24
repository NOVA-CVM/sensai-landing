"use client"

import { CycleDiagram } from "./cycle-diagram"
import Link from "next/link"
import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle,
  Cog,
  Eye,
  GitBranch,
  Layers,
  Link2,
  MessageSquare,
  Radar,
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
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            <MessageSquare className="w-4 h-4" />
            Talk to Sensai
          </Link>
        </div>
      </nav>

      {/* Hero — Change 1: screenshots + Change 2: stack messaging + Change 4: credibility */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
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
            {/* Change 4: credibility line */}
            <p className="mt-3 text-sm text-muted-foreground/80">
              Built by a team with 17 years in iGaming CRM and player intelligence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
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
            {/* Change 2: plugs into your stack */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-muted/50 border border-border/50 rounded-full">
              <Link2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-xs text-muted-foreground">
                Plugs into your existing CRM, case management, and risk tools. Not a replacement — the brain behind them.
              </span>
            </div>
          </div>
          {/* Change 1: blurred product screenshots */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <img
                src="/screenshots/HomePage.png"
                alt="Sensai Dashboard"
                className="rounded-2xl shadow-2xl border border-border/30 w-full"
              />
              <img
                src="/screenshots/KPIs.png"
                alt="Sensai KPI Monitor"
                className="absolute -bottom-8 -left-8 w-[70%] rounded-2xl shadow-2xl border border-border/30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* The Gap — Change 6: tighter spacing */}
      <section className="py-14 md:py-20 px-6 md:px-10 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">
            The gap every operator feels
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-10 max-w-xl">
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


      {/* How Sensai Works — Change 6: tighter spacing */}
      <section className="py-14 md:py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">
            How Sensai works
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-10 max-w-xl">
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

      {/* What Your Team Gets — Change 6: tighter spacing */}
      <section className="py-14 md:py-20 px-6 md:px-10 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">
            What your team gets
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-10 max-w-xl">
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

      {/* Change 7: See It In Action — visual walkthrough */}
      <section className="py-14 md:py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">
            See it in action
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-10 max-w-xl">
            From signal to action in minutes.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <WalkthroughStep
              step="1"
              icon={<Radar className="w-6 h-6" />}
              title="Signal detected"
              description="Sensai flags unusual activity on a game — high volume from players with risk indicators."
            />
            <WalkthroughStep
              step="2"
              icon={<GitBranch className="w-6 h-6" />}
              title="Network mapped"
              description="Connects the dots between accounts and surfaces an organized network of abusers."
            />
            <WalkthroughStep
              step="3"
              icon={<CheckCircle className="w-6 h-6" />}
              title="Team reviews"
              description="Your fraud team reviews the case in Q Center, confirms the pattern, and approves the action."
            />
            <WalkthroughStep
              step="4"
              icon={<Brain className="w-6 h-6" />}
              title="System learns"
              description="Sensai adds the pattern to your risk systems and catches this type of abuse going forward. The system just got smarter."
            />
          </div>
          <p className="mt-8 text-center text-primary font-semibold text-lg">
            All within minutes. No SQL. No analyst ticket.
          </p>
        </div>
      </section>

      {/* Why Operators Choose Sensai — Change 4 + Change 8 */}
      <section className="py-14 md:py-20 px-6 md:px-10 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-3">
            Why operators choose Sensai
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-10 max-w-xl">
            Built for production. Built for you.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <WhyCard
              icon={<Eye className="w-5 h-5" />}
              title="Live in production."
              description="Not a concept. Processing millions of player data points daily in live production."
            />
            <WhyCard
              icon={<Rocket className="w-5 h-5" />}
              title="Connected in days, not months."
              description="Give us access to your raw tables — keep them in your cloud. We build the pipeline. Your team is using Sensai within two weeks."
            />
            <WhyCard
              icon={<Brain className="w-5 h-5" />}
              title="ROI from week one."
              description="Run a quick scan of your customer base to find bonus abuse rings and under-the-radar VIPs within 48 hours. Everything else is upside. Built on 17 years of customer analytics in iGaming and deep data science research."
            />
          </div>
        </div>
      </section>

      {/* Early Operator Program + CTA — Change 6: tighter spacing */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-4">
            Early Operator Program
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
            Unlock the full potential of your player data.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
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

function WalkthroughStep({
  step,
  icon,
  title,
  description,
}: {
  step: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
        {icon}
      </div>
      <div className="text-xs text-muted-foreground/50 font-medium mb-1">Step {step}</div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
