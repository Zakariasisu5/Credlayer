import logo from "@/assets/icon.webp?url";

const fallbackLogo = "/favicon.png";

export function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <img
      src={logo ?? fallbackLogo}
      alt="CredLayer"
      className={`${className} block`}
      style={{ objectFit: "contain" }}
      onError={(event) => {
        const target = event.currentTarget as HTMLImageElement;
        if (target.src !== fallbackLogo) {
          target.src = fallbackLogo;
        }
      }}
    />
  );
}
