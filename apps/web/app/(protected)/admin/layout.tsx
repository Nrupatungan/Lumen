import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return (
        <>
            <h1>You are not authorized to use this page.</h1>
        </>
    )
  }

  return <>{children}</>;
}
