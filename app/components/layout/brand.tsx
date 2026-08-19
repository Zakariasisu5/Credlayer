import Link from "next/link";
import Image from "next/image";
import logoImage from "../../assets/logo.jpeg";

export function Brand() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="CredLayer home"
    >
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-primary/40 bg-transparent shadow-[0_0_18px_rgba(32,214,208,0.2)]">
        <Image
          src={logoImage}
          alt="CredLayer shield logo"
          fill
          sizes="36px"
          className="object-contain transition duration-500 group-hover:scale-110"
        />
      </span>
      <span className="font-mono text-sm font-bold tracking-tight">
        CredLayer
      </span>
    </Link>
  );
}

export default Brand;
