(() => {
  const article = document.querySelector(".article-container");
  const tocList = document.querySelector(".article-toc__list");
  const tocAside = document.querySelector(".article-toc");

  if (!article || !tocList || !tocAside) {
    return;
  }

  const headings = article.querySelectorAll("h2");

  if (headings.length === 0) {
    tocAside.hidden = true;
    return;
  }

  const usedIds = new Set();
  const linksById = new Map();
  const headingList = [...headings];
  const scrollOffset = 120;

  const createId = (text, index) => {
    let id = text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (!id) {
      id = `section-${index + 1}`;
    }

    let uniqueId = id;
    let counter = 2;

    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter += 1;
    }

    usedIds.add(uniqueId);
    return uniqueId;
  };

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = createId(heading.textContent || "", index);
    } else {
      usedIds.add(heading.id);
    }

    const listItem = document.createElement("li");
    const link = document.createElement("a");

    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    link.className = "article-toc__link";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${heading.id}`);
      setActiveHeading(heading.id);
    });

    linksById.set(heading.id, link);
    listItem.appendChild(link);
    tocList.appendChild(listItem);
  });

  const setActiveHeading = (id) => {
    linksById.forEach((link, linkId) => {
      const isActive = linkId === id;

      link.classList.toggle("article-toc__link--active", isActive);
      link.toggleAttribute("aria-current", isActive);
    });
  };

  const getActiveHeading = () => {
    let activeHeading = headingList[0];

    headingList.forEach((heading) => {
      if (heading.getBoundingClientRect().top <= scrollOffset) {
        activeHeading = heading;
      }
    });

    return activeHeading;
  };

  const onScroll = () => {
    setActiveHeading(getActiveHeading().id);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
