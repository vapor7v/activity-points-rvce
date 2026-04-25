import React, { Suspense } from "react";
import Signin from "@/components/supaauth/signin";
const page = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
      <Suspense>
        <Signin />
      </Suspense>
    </div>
  );
};
export default page;
