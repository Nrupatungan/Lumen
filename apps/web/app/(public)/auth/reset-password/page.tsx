import React, { Suspense } from "react";
import ResetPassword from "../_pages/ResetPassword";
import Loading from "./loading";

async function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPassword />;
    </Suspense>
  );
}

export default ResetPasswordPage;
