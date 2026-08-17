(() => {
  const navigate = (url) => {
    if (url) {
      window.location.href = url;
    }
  };

  const select = document.querySelector("[data-lang-switch-select]");

  if (select) {
    select.addEventListener("change", (event) => {
      navigate(event.target.value);
    });
  }

  document.querySelectorAll("[data-lang-switch-radio]").forEach((radio) => {
    radio.addEventListener("change", (event) => {
      navigate(event.target.value);
    });
  });

  const modal = document.querySelector("[data-lang-switch-modal]");
  const trigger = document.querySelector("[data-open-lang-switch-modal]");

  if (!modal || !trigger) {
    return;
  }

  let lastFocusedElement = null;

  const openModal = () => {
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    modal.hidden = true;

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  trigger.addEventListener("click", openModal);

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
})();
