import { SignupForm } from "@/components/signup-form"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const code = typeof params.aff === 'string' ? params.aff : '';

  return (
    <div className="w-full min-h-[calc(100vh-134px)] bg-slate-50 flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignupForm code={code} />
      </div>
    </div>
  )
}