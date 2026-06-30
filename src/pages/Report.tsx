import { useParams } from 'react-router-dom'

export default function Report() {
  const { projectId } = useParams()

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold hal-text tracking-widest">
          ASSESSMENT REPORT
        </h1>

        <p className="text-muted-foreground">
          PROJECT ID: {projectId}
        </p>

        {/* Report structure placeholder */}
        <div className="space-y-6">
          {/* Scores */}
          <div className="report-card">
            <h2 className="report-section-title">SCORES</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">--</div>
                <div className="text-xs text-muted-foreground mt-1">SECURITY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">--</div>
                <div className="text-xs text-muted-foreground mt-1">LAUNCH</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">--</div>
                <div className="text-xs text-muted-foreground mt-1">SEO</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">--</div>
                <div className="text-xs text-muted-foreground mt-1">GROWTH</div>
              </div>
            </div>
          </div>

          {/* Critical Blockers */}
          <div className="report-card">
            <h2 className="report-section-title">CRITICAL BLOCKERS</h2>
            <p className="text-muted-foreground">No report generated yet.</p>
          </div>

          {/* Findings */}
          <div className="report-card">
            <h2 className="report-section-title">FINDINGS</h2>
            <p className="text-muted-foreground">Awaiting scan results...</p>
          </div>

          {/* Actions */}
          <div className="report-card">
            <h2 className="report-section-title">NEXT STEPS</h2>
            <div className="space-y-2">
              <button className="hal-button w-full">
                [ GENERATE REPAIR PROMPTS ]
              </button>
              <button className="hal-button w-full">
                [ CREATE GROWTH PLAN ]
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground border-t border-border pt-8">
          <p>
            BuildProof provides automated risk assessment and remediation guidance. It does not
            guarantee that your product is secure and is not a substitute for professional
            penetration testing, legal advice, or compliance review.
          </p>
        </div>
      </div>
    </div>
  )
}

