import { useState, useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { getStorageAdapter } from '@/lib/storage'
import type {
  StoredGrowthPlan,
  StoredGrowthRecommendation,
  LaunchCalendarItem,
  GrowthCategory,
} from '@/lib/storage'
import type { StoredProject } from '@/lib/storage'

// ─── Types ───────────────────────────────────────────────────────

interface UseGrowthPlanReturn {
  plan: StoredGrowthPlan | null
  recommendations: StoredGrowthRecommendation[]
  calendarItems: LaunchCalendarItem[]
  loading: boolean
  error: string | null
  generate: (project: StoredProject) => Promise<void>
  load: (projectId: string) => Promise<void>
  toggleRecommendation: (id: string) => Promise<void>
  toggleCalendarItem: (id: string) => Promise<void>
}

// ─── Heuristic generators ────────────────────────────────────────

interface RecInput {
  planId: string
  projectId: string
  userId: string
  category: GrowthCategory
  priority: number
  title: string
  description: string
  actionItems: string[]
  estimatedImpact: 'low' | 'medium' | 'high'
}

function makeRec(input: RecInput): StoredGrowthRecommendation {
  return {
    id: crypto.randomUUID(),
    planId: input.planId,
    projectId: input.projectId,
    userId: input.userId,
    category: input.category,
    priority: input.priority,
    title: input.title,
    description: input.description,
    actionItems: input.actionItems,
    estimatedImpact: input.estimatedImpact,
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
  }
}

function generateSEORecommendations(
  planId: string, projectId: string, userId: string, project: StoredProject,
): StoredGrowthRecommendation[] {
  const recs: StoredGrowthRecommendation[] = []

  if (!project.websiteUrl) {
    recs.push(makeRec({
      planId, projectId, userId, category: 'seo', priority: 1, estimatedImpact: 'high',
      title: 'Get your project live with a proper domain',
      description: 'Without a live URL, search engines cannot index your project. Deploy to Vercel, Netlify, or a similar platform. A custom domain builds credibility.',
      actionItems: ['Deploy to Vercel or Netlify (free tier)', 'Purchase a custom domain (£10-15/year)', 'Set up HTTPS (automatic on most platforms)'],
    }))
  } else {
    recs.push(makeRec({
      planId, projectId, userId, category: 'seo', priority: 1, estimatedImpact: 'high',
      title: 'Optimise your page title and meta description',
      description: 'Search engines use your title tag and meta description to understand and display your page. Every page needs a unique, descriptive title (50-60 chars) and a compelling meta description (150-160 chars).',
      actionItems: ['Write a page title that includes your main keyword', 'Write a meta description that explains what your product does', 'Add Open Graph tags for social sharing (og:title, og:description, og:image)'],
    }))

    recs.push(makeRec({
      planId, projectId, userId, category: 'seo', priority: 2, estimatedImpact: 'medium',
      title: 'Add structured heading hierarchy',
      description: 'Proper heading structure (H1 → H2 → H3) helps both search engines and screen readers understand your content. Every page should have exactly one H1.',
      actionItems: ['Ensure every page has a single H1 tag', 'Use H2s for main sections, H3s for subsections', 'Include keywords naturally in headings'],
    }))

    recs.push(makeRec({
      planId, projectId, userId, category: 'seo', priority: 3, estimatedImpact: 'medium',
      title: 'Create a sitemap and robots.txt',
      description: 'A sitemap helps search engines discover all your pages. robots.txt tells crawlers which pages to skip. Both are essential for proper indexing.',
      actionItems: ['Generate a sitemap.xml (most frameworks have plugins)', 'Create a robots.txt allowing all crawlers', 'Submit your sitemap to Google Search Console'],
    }))
  }

  if (project.builderUsed === 'Lovable' || project.builderUsed === 'Bolt') {
    recs.push(makeRec({
      planId, projectId, userId, category: 'seo', priority: 5, estimatedImpact: 'low',
      title: `${project.builderUsed}-specific: export and self-host for better SEO`,
      description: `Projects hosted on ${project.builderUsed}'s default domain have limited SEO control. Exporting your code and deploying independently gives you full control over meta tags, URLs, and performance.`,
      actionItems: ['Export your code from the builder platform', 'Set up a GitHub repository', 'Deploy to Vercel with your own domain'],
    }))
  }

  return recs
}

function generateConversionRecommendations(
  planId: string, projectId: string, userId: string, project: StoredProject,
): StoredGrowthRecommendation[] {
  const recs: StoredGrowthRecommendation[] = []

  if (project.targetAudience) {
    recs.push(makeRec({
      planId, projectId, userId, category: 'conversion', priority: 1, estimatedImpact: 'high',
      title: `Targeted landing page for ${project.targetAudience}`,
      description: `Your target audience is "${project.targetAudience}". Your landing page should speak directly to their problem and show how your product solves it within 5 seconds.`,
      actionItems: [
        'Write a headline that names your target audience and their problem',
        'Add 3 benefit bullets (not feature bullets)',
        'Include a single, clear call-to-action button',
        'Add social proof: testimonials, user counts, or logos',
      ],
    }))
  } else {
    recs.push(makeRec({
      planId, projectId, userId, category: 'conversion', priority: 1, estimatedImpact: 'high',
      title: 'Define your target audience before optimising for conversion',
      description: 'Conversion optimisation without a clear audience is guesswork. Define who you are building for — their job, their problem, where they spend time online.',
      actionItems: ['Write 1-3 user personas (who, problem, motivation)', 'Identify where these people hang out online', 'Return to the intake to update your target audience'],
    }))
  }

  recs.push(makeRec({
    planId, projectId, userId, category: 'conversion', priority: 2, estimatedImpact: 'medium',
    title: 'Add a clear primary call-to-action',
    description: 'Every landing page needs one primary action you want visitors to take. Multiple competing CTAs reduce conversion. Make yours prominent and unambiguous.',
    actionItems: ['Identify your primary conversion goal (sign up, buy, try demo)', 'Place a single CTA button above the fold', 'Use action-oriented button text: "Start free trial" not "Submit"'],
  }))

  if (project.acceptsPayments && project.acceptsPayments !== 'none' && project.acceptsPayments !== 'unsure') {
    recs.push(makeRec({
      planId, projectId, userId, category: 'conversion', priority: 3, estimatedImpact: 'medium',
      title: 'Optimise your checkout and payment flow',
      description: 'Every extra step in your payment flow loses customers. Streamline checkout, show pricing clearly, and reduce friction.',
      actionItems: ['Show pricing before requiring sign-up', 'Reduce checkout to minimum fields', 'Add trust signals near the payment button (SSL, money-back guarantee)'],
    }))
  }

  return recs
}

function generatePositioningRecommendations(
  planId: string, projectId: string, userId: string, project: StoredProject,
): StoredGrowthRecommendation[] {
  const recs: StoredGrowthRecommendation[] = []

  recs.push(makeRec({
    planId, projectId, userId, category: 'positioning', priority: 1, estimatedImpact: 'high',
    title: 'Craft a one-sentence value proposition',
    description: 'Can you explain what your product does and why it matters in one sentence? If a visitor cannot understand your product in 5 seconds, they will leave.',
    actionItems: [
      `Template: "${project.name} helps [target audience] [solve problem] by [unique approach]."`,
      'Test your sentence on 5 people who have never heard of your product',
      'Refine until no one asks "what does it do?"',
    ],
  }))

  recs.push(makeRec({
    planId, projectId, userId, category: 'positioning', priority: 2, estimatedImpact: 'medium',
    title: 'Identify and document your competitors',
    description: 'Knowing your competitors helps you position your product distinctly. You do not need to be better at everything — just better at the one thing your audience cares about most.',
    actionItems: ['List 3-5 direct competitors', 'For each, note: their main promise, their weakness, your advantage', 'Write a positioning statement: "Unlike [competitor], we [key difference]."'],
  }))

  return recs
}

function generateContentRecommendations(
  planId: string, projectId: string, userId: string, project: StoredProject,
): StoredGrowthRecommendation[] {
  const recs: StoredGrowthRecommendation[] = []

  recs.push(makeRec({
    planId, projectId, userId, category: 'content', priority: 3, estimatedImpact: 'medium',
    title: 'Build a simple content engine',
    description: 'Content marketing drives long-term organic traffic. Start small: one high-quality blog post per week that answers a real question your audience is asking.',
    actionItems: [
      'List 10 questions your target audience asks (use Reddit, Google "People also ask", forums)',
      'Write a 1000-word post answering the most common question',
      'Share it in communities where your audience hangs out',
    ],
  }))

  return recs
}

function generateSocialRecommendations(
  planId: string, projectId: string, userId: string, project: StoredProject,
): StoredGrowthRecommendation[] {
  const recs: StoredGrowthRecommendation[] = []

  recs.push(makeRec({
    planId, projectId, userId, category: 'social', priority: 2, estimatedImpact: 'medium',
    title: 'Prepare a Reddit-friendly launch announcement',
    description: 'Reddit communities can drive significant early traffic — but only if you contribute value first. Never lead with self-promotion.',
    actionItems: [
      'Find 3-5 relevant subreddits where your audience hangs out',
      'Spend 2 weeks commenting helpfully before posting about your product',
      'Write a genuine "I built X to solve Y" post, not an ad',
      'Include a specific ask: "I would love feedback on..."',
    ],
  }))

  recs.push(makeRec({
    planId, projectId, userId, category: 'social', priority: 4, estimatedImpact: 'low',
    title: 'Set up a Product Hunt launch',
    description: 'Product Hunt is a launch platform for tech products. A well-prepared launch can bring thousands of early users and valuable feedback.',
    actionItems: [
      'Create a Product Hunt account and explore similar products',
      'Prepare screenshots, a 1-line tagline, and a maker comment',
      'Schedule launch for a Tuesday-Thursday',
      'Engage with every comment on launch day',
    ],
  }))

  return recs
}

function generateEmailRecommendations(
  planId: string, projectId: string, userId: string, project: StoredProject,
): StoredGrowthRecommendation[] {
  const recs: StoredGrowthRecommendation[] = []

  recs.push(makeRec({
    planId, projectId, userId, category: 'email', priority: 3, estimatedImpact: 'medium',
    title: 'Set up an email capture and welcome sequence',
    description: 'Email is the highest-ROI marketing channel. Start collecting emails before launch with a simple "get notified when we launch" form.',
    actionItems: [
      'Set up a free Mailchimp, ConvertKit, or Loops account',
      'Add an email signup form to your landing page',
      'Write a 3-email welcome sequence: (1) thanks + what to expect, (2) your story, (3) launch announcement',
    ],
  }))

  return recs
}

function generateAnalyticsRecommendations(
  planId: string, projectId: string, userId: string, project: StoredProject,
): StoredGrowthRecommendation[] {
  const recs: StoredGrowthRecommendation[] = []

  recs.push(makeRec({
    planId, projectId, userId, category: 'analytics', priority: 4, estimatedImpact: 'medium',
    title: 'Install analytics to understand your traffic',
    description: 'You cannot improve what you do not measure. Install a lightweight analytics tool to track visitors, page views, and conversion rates.',
    actionItems: [
      'Install Plausible, Umami, or PostHog (privacy-friendly, free tiers)',
      'Set up conversion goal tracking (signups, purchases)',
      'Review analytics weekly — look for traffic sources and drop-off pages',
    ],
  }))

  return recs
}

function generateLaunchCalendar(
  planId: string, projectId: string, userId: string, project: StoredProject,
): LaunchCalendarItem[] {
  const now = new Date()
  const items: LaunchCalendarItem[] = []
  let weekStart = new Date(now)

  const addWeek = (week: number, tasks: { title: string; desc: string; category: LaunchCalendarItem['category'] }[]) => {
    for (const t of tasks) {
      const due = new Date(weekStart)
      due.setDate(due.getDate() + (week - 1) * 7)
      items.push({
        id: crypto.randomUUID(),
        planId, projectId, userId,
        weekNumber: week,
        taskTitle: t.title,
        taskDescription: t.desc,
        category: t.category,
        completed: false,
        completedAt: null,
        dueDate: due.toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      })
    }
  }

  // Week 1-2: Foundation
  addWeek(1, [
    { title: 'Define value proposition', desc: 'Write and test your one-sentence value proposition with 5 people.', category: 'content' },
    { title: 'Set up analytics', desc: 'Install Plausible or PostHog on your website.', category: 'technical' },
    { title: 'Create email capture', desc: 'Set up Mailchimp/Loops and add a signup form to your landing page.', category: 'technical' },
  ])

  addWeek(2, [
    { title: 'Write landing page copy', desc: `Draft headline, benefits, and CTA aimed at ${project.targetAudience || 'your target audience'}.`, category: 'content' },
    { title: 'List competitor weaknesses', desc: 'Document 3-5 competitors and identify where you differentiate.', category: 'content' },
  ])

  // Week 3-4: Content building
  addWeek(3, [
    { title: 'Write first blog post', desc: 'Publish a 1000-word post answering your audience\'s top question.', category: 'content' },
    { title: 'Prepare social presence', desc: 'Create/update Twitter/X and LinkedIn profiles with your product info.', category: 'social' },
  ])

  addWeek(4, [
    { title: 'Write second blog post', desc: 'Publish another post — case study, tutorial, or opinion piece.', category: 'content' },
    { title: 'Begin Reddit engagement', desc: 'Start commenting helpfully in 3-5 relevant subreddits. Do not promote yet.', category: 'social' },
  ])

  // Week 5-6: Outreach prep
  addWeek(5, [
    { title: 'Write email welcome sequence', desc: 'Draft 3 welcome emails for new subscribers.', category: 'content' },
    { title: 'Prepare Product Hunt assets', desc: 'Create screenshots, tagline, and description for PH launch.', category: 'launch' },
  ])

  addWeek(6, [
    { title: 'Reach out to 5 beta testers', desc: 'Find 5 people in your target audience to try the product and give feedback.', category: 'outreach' },
    { title: 'Incorporate feedback', desc: 'Fix the top 3 issues beta testers found.', category: 'technical' },
  ])

  // Week 7-8: Pre-launch
  addWeek(7, [
    { title: 'Write launch announcement', desc: 'Draft a Reddit "I built X" post and a Twitter launch thread.', category: 'content' },
    { title: 'Set up SEO basics', desc: 'Verify title tags, meta descriptions, sitemap, and robots.txt.', category: 'technical' },
  ])

  addWeek(8, [
    { title: 'Soft launch to friends', desc: 'Share with 10-20 friends and collect initial feedback.', category: 'launch' },
    { title: 'Create referral incentive', desc: 'Design a simple referral program (e.g. "share with 3 friends for a free month").', category: 'launch' },
  ])

  // Week 9-10: Launch
  addWeek(9, [
    { title: 'Launch on Reddit', desc: 'Post your "I built X" story in your primary subreddit.', category: 'launch' },
    { title: 'Launch on Product Hunt', desc: 'Go live on PH. Engage with every comment within 1 hour.', category: 'launch' },
  ])

  addWeek(10, [
    { title: 'Post-launch outreach', desc: 'Email your list announcing the launch. Share in niche communities.', category: 'outreach' },
    { title: 'Analyse launch data', desc: 'Review analytics: which channels drove the most signups? Double down on winners.', category: 'review' },
  ])

  // Week 11-12: Growth
  if (project.targetAudience) {
    addWeek(11, [
      { title: `Guest post for ${project.targetAudience} audience`, desc: 'Find a blog or newsletter your audience reads. Pitch a guest article.', category: 'outreach' },
    ])
  } else {
    addWeek(11, [
      { title: 'Find guest posting opportunities', desc: 'Identify 5 blogs/newsletters in your space that accept guest posts.', category: 'outreach' },
    ])
  }

  addWeek(12, [
    { title: 'Month 1 retrospective', desc: 'Review: what worked? What did not? Adjust the next 4-week plan accordingly.', category: 'review' },
    { title: 'Set up monitoring', desc: 'Configure weekly SEO checks and uptime monitoring for your site.', category: 'technical' },
  ])

  return items
}

function computeGrowthScores(project: StoredProject): { seo: number; conversion: number; positioning: number } {
  let seo = 20
  let conversion = 20
  let positioning = 20

  if (project.websiteUrl) seo += 40
  if (project.targetAudience) { conversion += 20; positioning += 30 }
  if (project.status === 'launched') { seo += 10; conversion += 10 }
  if (project.status === 'pre_launch') conversion += 5

  return { seo, conversion, positioning }
}

// ─── Hook ────────────────────────────────────────────────────────

export function useGrowthPlan(): UseGrowthPlanReturn {
  const { user } = useAuthStore()
  const adapter = getStorageAdapter()

  const [plan, setPlan] = useState<StoredGrowthPlan | null>(null)
  const [recommendations, setRecommendations] = useState<StoredGrowthRecommendation[]>([])
  const [calendarItems, setCalendarItems] = useState<LaunchCalendarItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (project: StoredProject) => {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      const planId = crypto.randomUUID()
      const scores = computeGrowthScores(project)

      // Build the plan
      const newPlan: StoredGrowthPlan = {
        id: planId,
        projectId: project.id,
        userId: user.id,
        seoScore: scores.seo,
        conversionScore: scores.conversion,
        positioningScore: scores.positioning,
        summary: project.targetAudience
          ? `Growth plan for ${project.name}, targeting ${project.targetAudience}. ${project.websiteUrl ? 'Live site audit included.' : 'Deploy your site to unlock full SEO recommendations.'}`
          : `Growth plan for ${project.name}. Define your target audience for personalised recommendations.`,
        status: 'active',
        generatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }

      await adapter.saveGrowthPlan(newPlan)
      setPlan(newPlan)

      // Generate all recommendation categories
      const allRecs = [
        ...generateSEORecommendations(planId, project.id, user.id, project),
        ...generateConversionRecommendations(planId, project.id, user.id, project),
        ...generatePositioningRecommendations(planId, project.id, user.id, project),
        ...generateContentRecommendations(planId, project.id, user.id, project),
        ...generateSocialRecommendations(planId, project.id, user.id, project),
        ...generateEmailRecommendations(planId, project.id, user.id, project),
        ...generateAnalyticsRecommendations(planId, project.id, user.id, project),
      ]

      await adapter.saveRecommendations(allRecs)
      setRecommendations(allRecs)

      // Generate launch calendar
      const calendar = generateLaunchCalendar(planId, project.id, user.id, project)
      await adapter.saveCalendarItems(calendar)
      setCalendarItems(calendar)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate growth plan')
    } finally {
      setLoading(false)
    }
  }, [user, adapter])

  const load = useCallback(async (projectId: string) => {
    setLoading(true)
    setError(null)
    try {
      const existingPlan = await adapter.getGrowthPlan(projectId)
      if (existingPlan) {
        setPlan(existingPlan)
        const [recs, cal] = await Promise.all([
          adapter.getRecommendations(existingPlan.id),
          adapter.getCalendarItems(existingPlan.id),
        ])
        setRecommendations(recs)
        setCalendarItems(cal)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load growth plan')
    } finally {
      setLoading(false)
    }
  }, [adapter])

  const toggleRecommendation = useCallback(async (id: string) => {
    const rec = recommendations.find((r) => r.id === id)
    if (!rec) return
    const newCompleted = !rec.completed
    await adapter.updateRecommendation(id, newCompleted)
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: newCompleted, completedAt: newCompleted ? new Date().toISOString() : null } : r)),
    )
  }, [adapter, recommendations])

  const toggleCalendarItem = useCallback(async (id: string) => {
    const item = calendarItems.find((i) => i.id === id)
    if (!item) return
    const newCompleted = !item.completed
    await adapter.updateCalendarItem(id, newCompleted)
    setCalendarItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, completed: newCompleted, completedAt: newCompleted ? new Date().toISOString() : null } : i)),
    )
  }, [adapter, calendarItems])

  return {
    plan, recommendations, calendarItems, loading, error,
    generate, load, toggleRecommendation, toggleCalendarItem,
  }
}
