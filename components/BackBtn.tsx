"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackBtn = () => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="my-3 cursor-pointer" onClick={handleBack}>
      <ArrowLeft />
    </div>
  );
};

export default BackBtn;