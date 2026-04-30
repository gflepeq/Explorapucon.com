import { useEffect } from "react";
import { useMeta } from "../data/store";

/**
 * Updates <title> and <link rel="icon"> dynamically
 * based on SiteMeta stored in the CMS.
 */
export default function DynamicHead() {
  const meta = useMeta();

  useEffect(() => {
    // Update page title
    if (meta.siteName) {
      document.title = `${meta.siteName} | Tours y Aventuras en Pucón, Chile`;
    }

    // Update favicon
    if (meta.favicon) {
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = meta.favicon;
    }
  }, [meta.siteName, meta.favicon]);

  return null;
}
