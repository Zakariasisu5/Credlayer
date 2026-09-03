"use client";

import Image from "next/image";
import securityImage from "@/app/assets/security.jpeg";

export function SecurityVisualization() {
  return (
    <div className="relative w-full aspect-square max-w-[700px]">
      {/* Security Image */}
      <div className="relative w-full h-full">
        <Image
          src={securityImage}
          alt="CredLayer Security"
          fill
          className="object-contain rounded-lg"
          priority
        />
      </div>
    </div>
  );
}
