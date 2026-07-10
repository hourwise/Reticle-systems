import * as functions from 'firebase-functions'
import axios from 'axios'
import * as cheerio from 'cheerio'

// ─── Types ───────────────────────────────────────────────────────

interface AuditFinding {
  category: 'security' | 'seo' | 'performance'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  title: string
  detail: string
  fix: string
}

interface UrlAuditResult {
  url: string
  scannedAt: string
  statusCode: number | null
  https: boolean
  findings: AuditFinding[]
  metadata: {
    title: string | null
    titleLength: number
    metaDescription: string | null
    metaDescriptionLength: number
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    twitterCard: string | null
    canonicalUrl: string | null
    headings: { h1: string[]; h2: string[] }
    hasRobotsTxt: boolean
    hasSitemap: boolean
    wordCount: number
  }
}

// ─── Helpers ─────────────────────────────────────────────────────

async function fetchPage(url: string): Promise<{ html: string; statusCode: number; finalUrl: string }> {
  const response = await axios.get(url, {
    timeout: 15000,
    maxRedirects: 5,
    headers: {
      'User-Agent':
        'O.D.I.N.-Audit/1.0 (Reticle Systems; +https://reticle.systems)',
      Accept: 'text/html,application/xhtml+xml',
    },
    validateStatus: () => true, // accept all status codes
  })

  return {
    html: typeof response.data === 'string' ? response.data : '',
    statusCode: response.status,
    finalUrl: response.request?.res?.responseUrl || url,
  }
}

async function checkRobotsTxt(baseUrl: string): Promise<boolean> {
  try {
    const robotsUrl = new URL('/robots.txt', baseUrl).href
    const res = await axios.get(robotsUrl, { timeout: 5000 })
    return res.status === 200
  } catch {
    return false
  }
}

async function checkSitemap(baseUrl: string): Promise<boolean> {
  try {
    const sitemapUrl = new URL('/sitemap.xml', baseUrl).href
    const res = await axios.get(sitemapUrl, { timeout: 5000 })
    return res.status === 200
  } catch {
    return false
  }
}

// ─── Audit Logic ─────────────────────────────────────────────────

function auditHtml($: cheerio.CheerioAPI, url: string, statusCode: number): AuditFinding[] {
  const findings: AuditFinding[] = []
  const isHttps = url.startsWith('https://')

  // ── Security ──
  if (!isHttps) {
    findings.push({
      category: 'security',
      severity: 'critical',
      title: 'Website not served over HTTPS',
      detail: 'Your site uses HTTP instead of HTTPS. All data sent between the browser and your server is transmitted in plain text and can be intercepted.',
      fix: 'Enable HTTPS. Most hosting providers (Vercel, Netlify, Firebase Hosting) enable it automatically. If self-hosted, use Let\'s Encrypt for a free SSL certificate.',
    })
  }

  if (statusCode >= 400) {
    findings.push({
      category: 'security',
      severity: 'high',
      title: `Page returned error status ${statusCode}`,
      detail: `Your URL returned HTTP ${statusCode}. Users and search engines may not be able to access your page.`,
      fix: 'Check your hosting configuration. Ensure the page exists and the server is running. Verify DNS settings if you recently set up a custom domain.',
    })
  }

  if (statusCode >= 300 && statusCode < 400) {
    findings.push({
      category: 'seo',
      severity: 'low',
      title: `Page returned redirect status ${statusCode}`,
      detail: `Your URL is redirecting (HTTP ${statusCode}). While redirects are common, ensure this is intentional and not a broken redirect chain.`,
      fix: 'Verify the redirect target is correct. Avoid redirect chains. Use 301 for permanent redirects and 302 for temporary ones.',
    })
  }

  // ── SEO: Title ──
  const title = $('title').first().text().trim()
  if (!title) {
    findings.push({
      category: 'seo',
      severity: 'high',
      title: 'Missing page title',
      detail: 'Your page has no <title> tag. The title is critical for SEO and appears as the clickable headline in search results.',
      fix: 'Add a descriptive <title> tag in your <head>. Keep it under 60 characters. Include your primary keyword and brand name.',
    })
  } else if (title.length > 60) {
    findings.push({
      category: 'seo',
      severity: 'medium',
      title: `Page title too long (${title.length} characters)`,
      detail: 'Search engines typically display the first 50-60 characters of a title. Longer titles get truncated in results.',
      fix: `Shorten your title from "${title.substring(0, 40)}..." to 50-60 characters. Move the brand name to the end.`,
    })
  } else if (title.length < 15) {
    findings.push({
      category: 'seo',
      severity: 'low',
      title: `Page title too short (${title.length} characters)`,
      detail: 'Short titles miss the opportunity to include keywords that help search engines and users understand your page.',
      fix: 'Expand your title to 30-60 characters. Include your primary keyword and a brief description of the page.',
    })
  }

  // ── SEO: Meta Description ──
  const metaDesc =
    $('meta[name="description"]').attr('content')?.trim() || null
  if (!metaDesc) {
    findings.push({
      category: 'seo',
      severity: 'high',
      title: 'Missing meta description',
      detail: 'No <meta name="description"> tag found. The meta description appears under your title in search results and influences click-through rates.',
      fix: 'Add a meta description (120-155 characters) that summarises the page and includes a call to action. Every page should have a unique description.',
    })
  } else if (metaDesc.length > 160) {
    findings.push({
      category: 'seo',
      severity: 'medium',
      title: `Meta description too long (${metaDesc.length} characters)`,
      detail: 'Search engines truncate meta descriptions longer than ~155-160 characters.',
      fix: 'Trim your meta description to 120-155 characters. Put the most important information first.',
    })
  }

  // ── SEO: Open Graph ──
  const ogTitle = $('meta[property="og:title"]').attr('content')?.trim() || null
  const ogDesc = $('meta[property="og:description"]').attr('content')?.trim() || null
  const ogImage = $('meta[property="og:image"]').attr('content')?.trim() || null

  if (!ogTitle && !ogDesc && !ogImage) {
    findings.push({
      category: 'seo',
      severity: 'medium',
      title: 'Missing Open Graph tags',
      detail: 'No Open Graph (OG) tags found. Without OG tags, social media platforms cannot generate rich previews when your link is shared.',
      fix: 'Add og:title, og:description, og:image, and og:url meta tags. Use a tool like opengraph.xyz to preview how your link will appear on social media.',
    })
  } else {
    if (!ogTitle) {
      findings.push({
        category: 'seo',
        severity: 'low',
        title: 'Missing og:title tag',
        detail: 'The og:title tag controls the title shown when your page is shared on social media. Without it, platforms fall back to your page title.',
        fix: 'Add <meta property="og:title" content="Your Title"> to your <head>.',
      })
    }
    if (!ogImage) {
      findings.push({
        category: 'seo',
        severity: 'medium',
        title: 'Missing og:image tag',
        detail: 'Without an og:image, social media shares will appear without a preview image. This significantly reduces engagement.',
        fix: 'Add a 1200x630px image and reference it with <meta property="og:image" content="https://yoursite.com/image.jpg">.',
      })
    }
  }

  // ── SEO: Twitter Card ──
  const twitterCard = $('meta[name="twitter:card"]').attr('content')?.trim() || null
  if (!twitterCard) {
    findings.push({
      category: 'seo',
      severity: 'low',
      title: 'Missing Twitter Card tag',
      detail: 'Without a Twitter Card tag, links shared on Twitter/X will not display rich previews.',
      fix: 'Add <meta name="twitter:card" content="summary_large_image"> along with twitter:title, twitter:description, and twitter:image tags.',
    })
  }

  // ── SEO: Canonical URL ──
  const canonical = $('link[rel="canonical"]').attr('href')?.trim() || null
  if (!canonical) {
    findings.push({
      category: 'seo',
      severity: 'low',
      title: 'Missing canonical URL',
      detail: 'A canonical URL tells search engines which version of a page is the authoritative one. Without it, duplicate content issues may arise.',
      fix: 'Add <link rel="canonical" href="https://yoursite.com/page"> to your <head>. This is especially important if your site is accessible via multiple URLs.',
    })
  }

  // ── SEO: Headings ──
  const h1s = $('h1')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean)
  const h2s = $('h2')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean)

  if (h1s.length === 0) {
    findings.push({
      category: 'seo',
      severity: 'high',
      title: 'No H1 heading found',
      detail: 'Your page has no <h1> tag. The H1 is the main heading and one of the most important on-page SEO elements.',
      fix: 'Add a single <h1> that describes the page content. Include your primary keyword. Each page should have exactly one H1.',
    })
  } else if (h1s.length > 1) {
    findings.push({
      category: 'seo',
      severity: 'medium',
      title: `Multiple H1 headings found (${h1s.length})`,
      detail: 'Best practice is to have a single H1 per page. Multiple H1s can confuse search engines about the primary topic of the page.',
      fix: 'Use one H1 for the main page title. Convert other H1s to H2s or other heading levels.',
    })
  }

  if (h2s.length === 0) {
    findings.push({
      category: 'seo',
      severity: 'low',
      title: 'No H2 headings found',
      detail: 'H2 headings help structure your content and improve readability. Search engines use them to understand content hierarchy.',
      fix: 'Add H2 headings to break your content into clear sections. Use keywords naturally in your headings.',
    })
  }

  // ── Content ──
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim()
  const wordCount = bodyText.split(' ').filter((w) => w.length > 0).length

  if (wordCount < 100) {
    findings.push({
      category: 'seo',
      severity: 'medium',
      title: `Very low word count (${wordCount} words)`,
      detail: 'Pages with very little content are often considered "thin content" by search engines and may rank poorly.',
      fix: 'Add at least 300 words of relevant, high-quality content to your page. Focus on answering user questions about your topic.',
    })
  }

  return findings
}

// ─── Cloud Function ──────────────────────────────────────────────

export const runUrlAudit = functions
  .runWith({ timeoutSeconds: 60, memory: '256MB' })
  .https.onCall(async (data, context) => {
    // Auth check
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be signed in to run an audit.')
    }

    const url = data.url as string
    if (!url || typeof url !== 'string') {
      throw new functions.https.HttpsError('invalid-argument', 'A URL is required.')
    }

    // Normalise URL
    let normalised = url.trim()
    if (!/^https?:\/\//i.test(normalised)) {
      normalised = 'https://' + normalised
    }

    const isHttps = normalised.startsWith('https://')

    try {
      // Fetch page
      const { html, statusCode } = await fetchPage(normalised)

      // Parse HTML
      const $ = cheerio.load(html)

      // Run checks
      const findings = auditHtml($, normalised, statusCode || 0)

      // Check robots.txt and sitemap
      const hasRobotsTxt = await checkRobotsTxt(normalised)
      const hasSitemap = await checkSitemap(normalised)

      if (!hasRobotsTxt) {
        findings.push({
          category: 'seo',
          severity: 'medium',
          title: 'Missing robots.txt',
          detail: 'No robots.txt file found. This file tells search engines which pages to crawl and which to ignore.',
          fix: 'Create a robots.txt file at the root of your site. At minimum, include `User-agent: *` and `Allow: /`.',
        })
      }

      if (!hasSitemap) {
        findings.push({
          category: 'seo',
          severity: 'low',
          title: 'Missing sitemap.xml',
          detail: 'No sitemap.xml found. A sitemap helps search engines discover and index all your pages.',
          fix: 'Generate a sitemap.xml and place it at the root of your site. Submit it to Google Search Console.',
        })
      }

      // Extract metadata
      const title = $('title').first().text().trim() || null
      const metaDescription =
        $('meta[name="description"]').attr('content')?.trim() || null
      const ogTitle =
        $('meta[property="og:title"]').attr('content')?.trim() || null
      const ogDescription =
        $('meta[property="og:description"]').attr('content')?.trim() || null
      const ogImage =
        $('meta[property="og:image"]').attr('content')?.trim() || null
      const twitterCard =
        $('meta[name="twitter:card"]').attr('content')?.trim() || null
      const canonicalUrl =
        $('link[rel="canonical"]').attr('href')?.trim() || null

      const h1s = $('h1')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(Boolean)
      const h2s = $('h2')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(Boolean)

      const bodyText = $('body').text().replace(/\s+/g, ' ').trim()
      const wordCount = bodyText.split(' ').filter((w) => w.length > 0).length

      const result: UrlAuditResult = {
        url: normalised,
        scannedAt: new Date().toISOString(),
        statusCode: statusCode || null,
        https: isHttps,
        findings,
        metadata: {
          title,
          titleLength: title?.length || 0,
          metaDescription,
          metaDescriptionLength: metaDescription?.length || 0,
          ogTitle,
          ogDescription,
          ogImage,
          twitterCard,
          canonicalUrl,
          headings: { h1: h1s, h2: h2s },
          hasRobotsTxt,
          hasSitemap,
          wordCount,
        },
      }

      return result
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to scan URL'
      throw new functions.https.HttpsError('internal', message)
    }
  })
