import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale/es";

export default function Date({ dateString }: { dateString: string }) {
  const date = parseISO(dateString);

  return (
    <time dateTime={dateString}>
      {format(date, "d 'de' LLLL 'de' yyyy", {
        locale: es,
      })}{" "}
      {/* TODO: ver cómo hacer para que cambie de idioma según IP/país */}
    </time>
  );
}
