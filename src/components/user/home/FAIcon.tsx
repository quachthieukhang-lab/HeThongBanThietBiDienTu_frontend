"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFAIcon } from "@/lib/getFAIcon";

export default function FAIcon({
  icon,
  className = "",
}: {
  icon?: string | null;
  className?: string;
}) {
  const IconDef = getFAIcon(icon);

  if (!IconDef) {
    return <span className="text-gray-300">?</span>;
  }

  return <FontAwesomeIcon icon={IconDef} className={className} />;
}
