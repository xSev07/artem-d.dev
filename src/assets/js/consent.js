const CONSENT_STORAGE_KEY = "privacy-consent";

const getConsent = () => {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (value === "all" || value === "necessary") {
      return value;
    }
  } catch {
    // localStorage may be unavailable
  }

  return null;
};

const updateGtagConsent = (granted) => {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
};

const showBanner = () => {
  const banner = document.querySelector("[data-consent-banner]");

  if (!banner) {
    return;
  }

  banner.hidden = false;
  banner.setAttribute("aria-hidden", "false");
};

const hideBanner = () => {
  const banner = document.querySelector("[data-consent-banner]");

  if (!banner) {
    return;
  }

  banner.hidden = true;
  banner.setAttribute("aria-hidden", "true");
};

const setConsent = (value) => {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // localStorage may be unavailable
  }

  updateGtagConsent(value === "all");
  hideBanner();
};

const resetConsent = () => {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // localStorage may be unavailable
  }

  window.location.reload();
};

document.addEventListener("DOMContentLoaded", () => {
  const consent = getConsent();

  if (consent === null) {
    showBanner();
  } else {
    hideBanner();
  }

  document
    .querySelector("[data-consent-accept-all]")
    ?.addEventListener("click", () => {
      setConsent("all");
    });

  document
    .querySelector("[data-consent-necessary-only]")
    ?.addEventListener("click", () => {
      setConsent("necessary");
    });

  document
    .querySelector("[data-reset-privacy-consent]")
    ?.addEventListener("click", () => {
      resetConsent();
    });
});
