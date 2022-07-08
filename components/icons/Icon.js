export default function Icon({ height = 5, width = 5, icon }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-${height} w-${width}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      {icon}
    </svg>
  );
}
