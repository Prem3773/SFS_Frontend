import React from 'react'
import { Link } from 'react-router-dom'

const Aboutpage = () => {
  const stats = [
    { label: 'Feedback Areas', value: '3', detail: 'Teacher, Hostel, Campus' },
    { label: 'Dashboards', value: '3', detail: 'Student, Teacher, Admin' },
    { label: 'Learner Filters', value: '2', detail: 'Fast and Slow Learner' },
    { label: 'Insights', value: 'AI/ML', detail: 'Sentiment, trends, summaries' }
  ]

  const capabilities = [
    {
      title: 'Multi-Area Feedback',
      description:
        'Collect structured feedback across teacher, hostel, and campus experiences from one system.'
    },
    {
      title: 'Attendance-Aware Submissions',
      description:
        'Teacher feedback respects eligibility rules so submissions stay fair and accountable.'
    },
    {
      title: 'AI/ML Sentiment Signals',
      description:
        'Feedback is classified into positive, neutral, and negative sentiment for faster action.'
    },
    {
      title: 'Trend and Insight Dashboards',
      description:
        'Teachers see trends, improvement areas, and AI summaries to guide better outcomes.'
    },
    {
      title: 'Learner-Type Filters',
      description:
        'Compare feedback from Fast Learner and Slow Learner groups for more precise insights.'
    },
    {
      title: 'Admin Oversight',
      description:
        'Admins monitor totals, categories, and manage users with a dedicated dashboard.'
    }
  ]

  const steps = [
    {
      title: 'Students Submit Feedback',
      detail: 'Teacher, hostel, and campus feedback is captured in a structured format.'
    },
    {
      title: 'AI/ML Analyzes Signals',
      detail: 'Sentiment and themes are summarized to highlight what matters most.'
    },
    {
      title: 'Teachers Improve',
      detail: 'Dashboards reveal trends, areas for improvement, and actionable summaries.'
    },
    {
      title: 'Admins Monitor',
      detail: 'Institution-wide analytics and user management support accountability.'
    }
  ]

  const roles = [
    {
      title: 'Students',
      description:
        'Share experiences and track your feedback history across hostel, campus, and teaching quality.',
      bullets: [
        'Submit structured feedback across multiple areas',
        'Eligibility checks for teacher feedback',
        'View feedback history and status'
      ],
      accent: 'bg-blue-500'
    },
    {
      title: 'Teachers',
      description:
        'Understand sentiment, trends, and learning-type differences to improve outcomes.',
      bullets: [
        'Sentiment distribution and monthly trends',
        'AI-generated summaries and improvement areas',
        'Fast Learner and Slow Learner filters'
      ],
      accent: 'bg-emerald-500'
    },
    {
      title: 'Admins',
      description:
        'Oversee feedback volumes, category distribution, and user management in one place.',
      bullets: [
        'Category-level analytics',
        'User management controls',
        'System-wide visibility and oversight'
      ],
      accent: 'bg-amber-500'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 flex flex-wrap gap-2 text-xs uppercase tracking-widest text-white/70">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Student</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Teacher</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Admin</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                About EduFeed Feedback System
              </h1>
              <p className="mt-6 text-lg text-white/80">
                Built to capture meaningful feedback, analyze it with AI/ML, and deliver insights
                that help students, teachers, and administrators move faster together.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="text-3xl font-semibold">{stat.value}</div>
                  <div className="mt-2 text-sm uppercase tracking-widest text-white/60">
                    {stat.label}
                  </div>
                  <div className="mt-3 text-sm text-white/70">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold sm:text-4xl">What the system actually delivers</h2>
            <p className="mt-4 text-lg text-slate-600">
              Every part of the platform maps to real workflows already available in the system,
              from structured student submissions to AI/ML insights in teacher and admin views.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-16 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Feedback journey</h2>
            <p className="mt-4 text-lg text-slate-600">
              A clean, end-to-end flow that turns student input into real action.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                <p className="text-sm text-slate-600">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Designed for every role</h2>
            <p className="mt-4 text-lg text-slate-600">
              Each dashboard focuses on what matters most for that user group.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {roles.map((role) => (
              <div key={role.title} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className={`h-2 w-16 rounded-full ${role.accent}`} />
                <h3 className="mt-4 text-xl font-semibold">{role.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{role.description}</p>
                <div className="mt-5 space-y-3 text-sm text-slate-700">
                  {role.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-2">
                      <span className={`mt-2 h-2 w-2 rounded-full ${role.accent}`} />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to explore the system?</h2>
            <p className="mt-3 text-lg text-white/70">
              Create an account or sign in to see the dashboards and feedback flows in action.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Aboutpage
