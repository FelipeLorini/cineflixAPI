// Estrelas de avaliação (nota TMDB 0-10 convertida para 5 estrelas).
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export function RatingStars({
  value,
  size = 14,
  showValue = true,
}: {
  value: number;
  size?: number;
  showValue?: boolean;
}) {
  const stars = value / 2;
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const diff = stars - i;
        const Icon = diff >= 0.75 ? FaStar : diff >= 0.25 ? FaStarHalfAlt : FaRegStar;
        return <Icon key={i} size={size} className="text-star" />;
      })}
      {showValue && (
        <span className="ml-1 text-xs font-semibold text-muted-foreground">
          {value ? value.toFixed(1) : "N/A"}
        </span>
      )}
    </span>
  );
}
