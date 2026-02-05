import React from 'react'
import { Link } from 'react-router-dom'; // Import Link for routing

const CTAsection = () => {
   const stats = [
    { label: 'Feedback Areas', value: '3', detail: 'Teacher, Hostel, Campus' },
    { label: 'Dashboards', value: '3', detail: 'Student, Teacher, Admin' },
    { label: 'Reports', value: 'PDF', detail: 'Teacher improvement reports' },
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
      title: 'Teacher Reports',
      description:
        'Generate improvement reports to share highlights and next steps.'
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
        'Understand sentiment, trends, and improvement areas to improve outcomes.',
      bullets: [
        'Sentiment distribution and monthly trends',
        'AI-generated summaries and improvement areas',
        'Downloadable improvement reports'
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
<div classname="min-h-screen bg-slate-950 text-white">

        <div className="bg-gray-50">
           <section className="text-center py-2 md:py-32 px-2 animate-fade-in mb- ">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            <span className="block">Welcome to </span>
            <span className="block text-blue-600 mt-2">EduFeed</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
            Real-time Insights for Educational Excellence. <br /> Empowering institutions with AI-ML driven feedback analysis.
          </p>
          {/* <div className="mt-8">
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-2 text-2xl font-large text-center text-blue-600 border border-black border-2 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
              Get Started
            </Link>
          </div> */}
        </section>

          </div>
          <div className="m-h-screen bg-slate-950 text-white">
                <section className="relative overflow-hidden">
                  <div className="absolute inset-0">
                    <div className="absolute -top-24 -right-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
                    <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
                  </div>
                  <div className="relative max-w-10xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
              <div className="grid items-start justify-items-start gap-12 lg:grid-cols-2">

                      <div>
                        <div className="mb-6 ml-44 flex  items-center flex-wrap gap-2 text-xs uppercase tracking-widest text-white/70">
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
                        <div className="mt-8 ml-48 flex flex-wrap gap-3">
                          <Link
                            to="/register"
                            className="rounded-full bg-white px-12 py-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                          >
                            Get Started
                          </Link>
                          <Link
                            to="/login"
                            className="rounded-full border border-white/30 px-12 py-6 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
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
        </div>
                      </div>
    )
}

export default CTAsection
