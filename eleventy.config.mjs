import i18next from "i18next";
import en from "./src/locales/en.json" with { type: "json" };
import ru from "./src/locales/ru.json" with { type: "json" };

await i18next.init({
  lng: "en",
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
});

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "content/articles": "content/articles" });

  eleventyConfig.addFilter("t", (key, lang, options = {}) =>
    i18next.t(key, { lng: lang, returnObjects: true, ...options }),
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "docs",
    },
  };
};
