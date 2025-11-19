import * as solid from "@fortawesome/free-solid-svg-icons";

export function getFAIcon(iconString: string | undefined | null) {
  if (!iconString) return null;

  // "fa-solid fa-temperature-three-quarters" → lấy "fa-temperature-three-quarters"
  const raw = iconString.split(" ").find((c) => c.startsWith("fa-"));
  if (!raw) return null;

  // Bỏ "fa-" → "temperature-three-quarters"
  const parts = raw.replace("fa-", "").split("-");

  // Chuyển từng từ thành PascalCase
  const pascal = parts
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  // Ghép thành tên key FontAwesome: "faTemperatureThreeQuarters"
  const key = "fa" + pascal;

  return (solid as any)[key] ?? null;
}
