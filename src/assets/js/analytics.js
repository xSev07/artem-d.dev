document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (typeof window.gtag !== "function") {
    return;
  }

  const storeTarget = event.target.closest("[data-analytics-store]");

  if (storeTarget) {
    window.gtag("event", "store_click", {
      store: storeTarget.getAttribute("data-analytics-store"),
      placement:
        storeTarget.getAttribute("data-analytics-placement") || "unknown",
    });

    return;
  }

  const downloadLinkTarget = event.target.closest(
    "[data-analytics-link='download']"
  );

  if (downloadLinkTarget) {
    window.gtag("event", "download_link_click", {
      placement:
        downloadLinkTarget.getAttribute("data-analytics-placement") ||
        "unknown",
    });
  }
});