import VerifyOtpClient from "./VerifyOtpClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyOtpPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = params.email || "";

  return <VerifyOtpClient email={email} />;
}
