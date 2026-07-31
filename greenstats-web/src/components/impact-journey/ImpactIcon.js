import {
  PawPrint,
  Recycle,
  Sprout,
  UsersRound,
} from "lucide-react";

export function ImpactIcon({ name, size = 20 }) {
  const props = {
    size,
    strokeWidth: 1.6,
    "aria-hidden": true,
  };

  switch (name) {
    case "tree":
      return <Sprout {...props} />;
    case "paw-print":
      return <PawPrint {...props} />;
    case "recycle":
      return <Recycle {...props} />;
    case "community":
      return <UsersRound {...props} />;
  }
}
