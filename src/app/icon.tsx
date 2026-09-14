import { school } from "@/lib/school";

export default function Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#2b0f0c" />
      <circle cx="16" cy="16" r="11" stroke="#d4b36a" strokeWidth="1.2" />
      <text
        x="16"
        y="20"
        textAnchor="middle"
        fill="#d4b36a"
        fontSize="9"
        fontFamily="serif"
      >
        少林
      </text>
      <title>{school.name}</title>
    </svg>
  );
}
