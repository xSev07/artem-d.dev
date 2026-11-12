const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("app-store-modal");

  if (!modal) {
    return;
  }

  const openButtons = document.querySelectorAll("[data-open-app-store-modal]");
  const closeButtons = modal.querySelectorAll("[data-close-app-store-modal]");
  const waitlist = modal.querySelector("[data-ios-waitlist]");
  const formView = modal.querySelector("[data-ios-waitlist-form-view]");
  const form = modal.querySelector("[data-ios-waitlist-form]");
  const emailInput = modal.querySelector("[data-ios-waitlist-email]");
  const submitButton = modal.querySelector("[data-ios-waitlist-submit]");
  const errorMessage = modal.querySelector("[data-ios-waitlist-error]");
  const successBlock = modal.querySelector("[data-ios-waitlist-success]");

  const getWaitlistMessage = (key) => waitlist?.getAttribute(key) ?? "";
  const getWaitlistApiUrl = () => waitlist?.getAttribute("data-api-url") ?? "";

  const getSubmitButtonDefaultLabel = () =>
    submitButton?.getAttribute("data-label-default") ?? submitButton?.textContent ?? "";

  const clearFieldError = () => {
    if (emailInput instanceof HTMLInputElement) {
      emailInput.classList.remove("is-error");
    }

    errorMessage?.setAttribute("hidden", "");
    if (errorMessage) {
      errorMessage.textContent = "";
    }
  };

  const resetWaitlistState = () => {
    if (!waitlist) {
      return;
    }

    formView?.removeAttribute("hidden");
    successBlock?.setAttribute("hidden", "");
    form?.classList.remove("is-loading");

    clearFieldError();

    if (emailInput instanceof HTMLInputElement) {
      emailInput.value = "";
      emailInput.disabled = false;
    }

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = false;
      submitButton.textContent = getSubmitButtonDefaultLabel();
      submitButton.removeAttribute("aria-busy");
    }
  };

  const setWaitlistLoading = (isLoading) => {
    if (!form) {
      return;
    }

    form.classList.toggle("is-loading", isLoading);

    if (emailInput instanceof HTMLInputElement) {
      emailInput.disabled = isLoading;
    }

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = isLoading;

      if (isLoading) {
        submitButton.textContent = getWaitlistMessage("data-msg-sending");
        submitButton.setAttribute("aria-busy", "true");
      } else {
        submitButton.textContent = getSubmitButtonDefaultLabel();
        submitButton.removeAttribute("aria-busy");
      }
    }
  };

  const showWaitlistError = (text) => {
    if (emailInput instanceof HTMLInputElement) {
      emailInput.classList.add("is-error");
    }

    if (!errorMessage) {
      return;
    }

    errorMessage.textContent = text;
    errorMessage.removeAttribute("hidden");
  };

  const showWaitlistSuccess = () => {
    formView?.setAttribute("hidden", "");
    successBlock?.removeAttribute("hidden");

    const successDismiss = successBlock?.querySelector("[data-close-app-store-modal]");

    if (successDismiss instanceof HTMLElement) {
      successDismiss.focus();
    }
  };

  const focusModalTarget = () => {
    if (emailInput instanceof HTMLInputElement && !formView?.hasAttribute("hidden")) {
      emailInput.focus();
      return;
    }

    const closeButton = closeButtons[0];

    if (closeButton instanceof HTMLElement) {
      closeButton.focus();
    }
  };

  const openModal = () => {
    resetWaitlistState();
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    focusModalTarget();
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modal.hidden = true;
    resetWaitlistState();
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  emailInput?.addEventListener("input", () => {
    if (emailInput instanceof HTMLInputElement && emailInput.classList.contains("is-error")) {
      clearFieldError();
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!(emailInput instanceof HTMLInputElement)) {
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    clearFieldError();

    if (!EMAIL_PATTERN.test(email)) {
      showWaitlistError(getWaitlistMessage("data-msg-invalid"));
      emailInput.focus();
      return;
    }

    const waitlistApiUrl = getWaitlistApiUrl();

    if (!waitlistApiUrl) {
      showWaitlistError(getWaitlistMessage("data-msg-error"));
      return;
    }

    setWaitlistLoading(true);

    fetch(waitlistApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        source: null,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("waitlist request failed");
        }

        showWaitlistSuccess();
      })
      .catch(() => {
        showWaitlistError(getWaitlistMessage("data-msg-error"));
      })
      .finally(() => {
        setWaitlistLoading(false);
      });
  });
});
