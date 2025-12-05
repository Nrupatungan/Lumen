import React, { Suspense } from "react";
import VerifyEmail from "../_pages/VerifyEmail";
import Loading from "./loading";

async function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyEmail />
    </Suspense>
  );
}

export default VerifyEmailPage;
