import Image from "next/image";

export function SchoolLogo({
  className = "h-40 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt="Shaolin Temple Greece 希腊少林寺"
      width={557}
      height={842}
      className={className}
      priority={priority}
    />
  );
}
