import VerifyOtpClient from "./VerifyOtpClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ email?: string; flow?: string }>;
}

export default async function VerifyOtpPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = params.email || "";
  const flow = params.flow || "";

  return <VerifyOtpClient email={email} flow={flow} />;
}
