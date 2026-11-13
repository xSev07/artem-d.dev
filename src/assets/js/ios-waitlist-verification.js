document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-ios-verification]");

  if (!root) {
    return;
  }

  const title = root.querySelector("[data-ios-verification-title]");
  const text = root.querySelector("[data-ios-verification-text]");
  const successIcon = root.querySelector("[data-ios-verification-icon-success]");
  const errorIcon = root.querySelector("[data-ios-verification-icon-error]");

  const getMessage = (key) => root.getAttribute(key) ?? "";

  const status = new URLSearchParams(window.location.search).get("status");
  const isSuccess = status === "success";

  const applyState = () => {
    if (title) {
      title.textContent = getMessage(
        isSuccess ? "data-msg-success-title" : "data-msg-error-title",
      );
    }

    if (text) {
      text.textContent = getMessage(
        isSuccess ? "data-msg-success-text" : "data-msg-error-text",
      );
    }

    if (successIcon) {
      if (isSuccess) {
        successIcon.removeAttribute("hidden");
      } else {
        successIcon.setAttribute("hidden", "");
      }
    }

    if (errorIcon) {
      if (isSuccess) {
        errorIcon.setAttribute("hidden", "");
      } else {
        errorIcon.removeAttribute("hidden");
      }
    }
  };

  applyState();
});
