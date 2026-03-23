"use client";

interface OAuthButtonsProps {
  isSignup?: boolean;
}

export const OAuthButtons = ({ isSignup = false }: OAuthButtonsProps) => {
  const handleOAuthClick = (provider: string) => {
    // TODO: Implement OAuth logic
    console.log(`OAuth login with ${provider}`);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => handleOAuthClick("google")}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-brand-dark rounded-xl font-bold text-brand-dark hover:bg-brand-50 transition-colors shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <div className="flex gap-3">
        <button
          onClick={() => handleOAuthClick("github")}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-brand-dark rounded-xl font-bold text-brand-dark hover:bg-brand-50 transition-colors shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </button>
        <button
          onClick={() => handleOAuthClick("apple")}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-brand-dark rounded-xl font-bold text-brand-dark hover:bg-brand-50 transition-colors shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 13.5c-.91 2.18-.43 3.72 1.1 6.08 1.25 1.98 2.2 3.12 3.66 5.09.5.61-.04 1.51-.8 1.51-.36 0-.72-.25-1.06-.72-1.61-2.16-2.67-3.55-3.54-5.29-.87 1.74-1.93 3.13-3.54 5.29-.3.42-.63.72-1.06.72-.77 0-1.3-.9-.8-1.51 1.46-1.97 2.41-3.11 3.66-5.09 1.54-2.36 2.01-3.9 1.1-6.08-.32-2.38-2.6-4.73-5.26-4.73-2.05 0-3.77 1.15-4.15 2.7-.26 1.05.67 1.68 1.45 1.68.89 0 1.79-.64 2.31-1.87.15-.37.53-.61 1.01-.61 1.37 0 2.27 1.43 1.88 2.74zm-8.04-7.66c3.26-1.43 7.05-.62 8.86 1.67 1.34 1.71 1.4 3.81.16 6.27-.91 1.94-1.1 2.9-.87 4.73.26 1.9 2.39 3.56 4.57 3.56 2.25 0 4.51-1.78 4.51-4.37 0-2.02-1.08-3.72-2.17-5.37-1.43-2.12-3.97-6.53-8.39-8.87C7.42.29 3.6 1.45 1.87 4.27.87 6.03-.09 8.06.01 10.47c.16 3.95 3.48 7.2 7.5 7.2 1.76 0 3.5-.58 4.84-1.58.56.56.88 1.31.88 2.16 0 1.99-1.61 3.61-3.61 3.61-1.44 0-2.77-.82-3.46-2.1-.54-1.01-1.57-1.63-2.72-1.63-1.65 0-3 1.35-3 3s1.35 3 3 3c1.72 0 3.24-.89 4.12-2.22 1.51 1.07 3.31 1.71 5.17 1.71 1.71 5.27 0 9.56-4.29 9.56-9.56 0-2.76-1.17-5.27-3.05-7.01-.29-.29-.57-.56-.86-.82.53-.67 1.08-1.31 1.65-1.96.43-.51.29-1.51-.32-1.87-.97-.57-2.34-.36-3.03.58-.37-.41-.76-.81-1.16-1.19-.35-.34-.86-.37-1.26-.09z" />
          </svg>
          Apple
        </button>
      </div>

      <div className="relative flex items-center gap-4">
        <div className="flex-1 h-px bg-brand-200"></div>
        <span className="text-sm font-medium text-brand-600">
          Or {isSignup ? "sign up" : "sign in"} with email
        </span>
        <div className="flex-1 h-px bg-brand-200"></div>
      </div>
    </div>
  );
};

export default OAuthButtons;
