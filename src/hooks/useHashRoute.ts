import { useEffect, useState } from "react";

export type Route =
  | { name: "home" }
  | { name: "listing"; category: string; collection?: string }
  | { name: "product"; id: string }
  | { name: "cart" }
  | { name: "checkout" }
  | { name: "about" }
  | { name: "delivery" }
  | { name: "contact" };

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [path, queryString] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(queryString || "");

  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "shop") {
    return {
      name: "listing",
      category: parts[1] || "all",
      collection: params.get("collection") || undefined,
    };
  }
  if (parts[0] === "product" && parts[1]) return { name: "product", id: parts[1] };
  if (parts[0] === "cart") return { name: "cart" };
  if (parts[0] === "checkout") return { name: "checkout" };
  if (parts[0] === "about") return { name: "about" };
  if (parts[0] === "delivery" || parts[0] === "delivery-exchanges") return { name: "delivery" };
  if (parts[0] === "contact") return { name: "contact" };
  return { name: "home" };
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export function navigate(to: string) {
  window.location.hash = to;
}
