import { parseISO, format } from "date-fns";
import spanishLocale from "date-fns/locale/es";

export default function Date({ dateString }) {
  const date = parseISO(dateString);

  return (
    <time dateTime={dateString}>
      {format(date, "d 'de' LLLL 'de' yyyy", {
        locale: spanishLocale,
      })} {/* TODO: ver cómo hacer para que cambie de idioma según IP/país */}
    </time>
  );
}
