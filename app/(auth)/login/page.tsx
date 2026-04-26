import LoginClient from "./login-client";

type Props = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { registered } = await searchParams;

  return <LoginClient registered={registered} />;
}
