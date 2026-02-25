const EKGLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* EKG Line Animation */}
        <svg
          viewBox="0 0 400 100"
          className="w-72 h-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline
            points="0,50 40,50 60,50 80,50 100,50 115,50 120,20 125,80 130,10 135,90 140,50 155,50 170,50 200,50 240,50 260,50 280,50 300,50 315,50 320,20 325,80 330,10 335,90 340,50 355,50 370,50 400,50"
            fill="none"
            stroke="hsl(207 90% 54%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000,
              animation: 'ekg-line 2s linear infinite',
            }}
          />
          {/* Glow effect */}
          <polyline
            points="0,50 40,50 60,50 80,50 100,50 115,50 120,20 125,80 130,10 135,90 140,50 155,50 170,50 200,50 240,50 260,50 280,50 300,50 315,50 320,20 325,80 330,10 335,90 340,50 355,50 370,50 400,50"
            fill="none"
            stroke="hsl(207 90% 54%)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.2"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000,
              animation: 'ekg-line 2s linear infinite',
              filter: 'blur(4px)',
            }}
          />
        </svg>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold tracking-wide text-primary">
            MedCoreOps
          </h2>
          <p className="text-sm text-muted-foreground" style={{ animation: 'ekg-pulse 1.5s ease-in-out infinite' }}>
            Loading clinical data…
          </p>
        </div>
      </div>
    </div>
  );
};

export default EKGLoader;
