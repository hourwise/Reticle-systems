export default function Intake() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold hal-text tracking-widest">
          GUIDED INTAKE FLOW
        </h1>

        <p className="text-muted-foreground">
          WHAT WOULD YOU LIKE TO CHECK?
        </p>

        <div className="response-grid">
          <button className="hal-button">
            [ LAUNCH READINESS ]
          </button>
          <button className="hal-button">
            [ SECURITY RISKS ]
          </button>
          <button className="hal-button">
            [ SEO VISIBILITY ]
          </button>
          <button className="hal-button">
            [ GROWTH PLAN ]
          </button>
          <button className="hal-button col-span-full">
            [ FULL REPORT ]
          </button>
        </div>

        <div className="text-xs text-muted-foreground border-t border-border pt-8">
          <p>Intake flow will collect:</p>
          <ul className="space-y-1 text-left mt-2">
            <li>▪ Project name and URL</li>
            <li>▪ Builder used (Lovable, Bolt, etc.)</li>
            <li>▪ Features (auth, data storage, payments)</li>
            <li>▪ Launch status</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

