import Register from "@/components/supaauth/register";
import React, { Suspense } from "react";
function page() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
      <Suspense>
        <Register />
      </Suspense>
    </div>
  );
}
export default page;
