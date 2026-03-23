import OnboardingClient from "./OnboardingClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function OnboardingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = params.email || "";

  return <OnboardingClient email={email} />;
}
