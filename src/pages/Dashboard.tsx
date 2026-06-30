export default function Dashboard() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold hal-text tracking-widest">
          YOUR PROJECTS
        </h1>

        <p className="text-muted-foreground">
          NO PROJECTS YET.
        </p>

        <div className="report-card">
          <p className="text-sm text-muted-foreground">
            Your project history will appear here after your first scan.
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">NEXT STEPS:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>▪ Return to home and start a guided check</li>
            <li>▪ Or upload your project repository</li>
            <li>▪ Reports will be stored securely</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

