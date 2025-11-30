import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

async function DashboardPage() {
  const session = await auth();

  if(!session?.user) {
    redirect("/auth/sigin");
  }

  return <div>DashboardPage</div>;

}

export default DashboardPage;
