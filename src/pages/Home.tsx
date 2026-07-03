import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function Home() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* HAL-inspired welcome screen */}
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold hal-text tracking-widest">
          GOOD EVENING.
        </h1>

        <p className="text-xl text-muted-foreground">
          I CAN ASSESS YOUR PROJECT.
        </p>

        <div className="space-y-4 text-lg">
          <p className="text-foreground">
            Build fast. Launch safely.
          </p>
          <p className="text-muted-foreground text-base">
            AI-built apps can hide serious problems. O.D.I.N. checks your project for security
            risks, launch blockers, SEO gaps, and growth weaknesses before they become expensive.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          {user ? (
            <>
              <Link to="/intake" className="hal-button">
                [ CHECK MY PROJECT ]
              </Link>
              <Link to="/dashboard" className="hal-button">
                [ DASHBOARD ]
              </Link>
            </>
          ) : (
            <Link to="/auth" className="hal-button">
              [ SIGN IN TO BEGIN ]
            </Link>
          )}
        </div>

        {/* Key benefits */}
        <div className="pt-12 border-t border-border space-y-4 text-sm text-muted-foreground">
          <p>FEATURES:</p>
          <ul className="space-y-2 text-left max-w-lg mx-auto">
            <li>▪ Find exposed keys and dangerous configuration mistakes.</li>
            <li>▪ Understand what your AI-built app actually does.</li>
            <li>▪ Get plain-English fixes and repair prompts.</li>
            <li>▪ Improve your landing page, SEO, and launch plan.</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="pt-8 text-xs text-muted-foreground border-t border-border">
          <p>
            Reticle Systems provides automated risk assessment and remediation guidance. It does not
            guarantee that your product is secure and is not a substitute for professional
            penetration testing, legal advice, or compliance review.
          </p>
        </div>
      </div>
    </div>
  )
}

