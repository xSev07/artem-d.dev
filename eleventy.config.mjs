import fs from "node:fs";
import path from "node:path";
import i18next from "i18next";
import en from "./src/locales/en.json" with { type: "json" };
import ru from "./src/locales/ru.json" with { type: "json" };
import uk from "./src/locales/uk.json" with { type: "json" };
import pl from "./src/locales/pl.json" with { type: "json" };
import cs from "./src/locales/cs.json" with { type: "json" };
import de from "./src/locales/de.json" with { type: "json" };
import nl from "./src/locales/nl.json" with { type: "json" };
import sv from "./src/locales/sv.json" with { type: "json" };
import fr from "./src/locales/fr.json" with { type: "json" };
import it from "./src/locales/it.json" with { type: "json" };
import es from "./src/locales/es.json" with { type: "json" };
import ptBR from "./src/locales/pt-BR.json" with { type: "json" };
import ro from "./src/locales/ro.json" with { type: "json" };
import tr from "./src/locales/tr.json" with { type: "json" };
import id from "./src/locales/id.json" with { type: "json" };
import langSwitchCodes from "./src/locales/shared/langSwitch.codes.json" with { type: "json" };

const withLangSwitch = (locale) => ({
  ...locale,
  common: {
    ...locale.common,
    langSwitch: {
      ...langSwitchCodes,
      ...locale.common?.langSwitch,
    },
  },
});

await i18next.init({
  lng: "en",
  resources: {
    en: { translation: withLangSwitch(en) },
    ru: { translation: withLangSwitch(ru) },
    uk: { translation: withLangSwitch(uk) },
    pl: { translation: withLangSwitch(pl) },
    cs: { translation: withLangSwitch(cs) },
    de: { translation: withLangSwitch(de) },
    nl: { translation: withLangSwitch(nl) },
    sv: { translation: withLangSwitch(sv) },
    fr: { translation: withLangSwitch(fr) },
    it: { translation: withLangSwitch(it) },
    es: { translation: withLangSwitch(es) },
    "pt-BR": { translation: withLangSwitch(ptBR) },
    ro: { translation: withLangSwitch(ro) },
    tr: { translation: withLangSwitch(tr) },
    id: { translation: withLangSwitch(id) },
  },
});

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "static/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "static/health.txt": "health.txt" });
  eleventyConfig.addPassthroughCopy("content/articles", {
    filter: (path) => !path.endsWith(".md"),
  });

  eleventyConfig.addFilter("t", (key, lang, options = {}) =>
    i18next.t(key, { lng: lang, returnObjects: true, ...options }),
  );

  eleventyConfig.addFilter(
    "localizedScreenshot",
    (lang, contentPath, filename, fallbackLang = "en") => {
      const contentRoot = "content";
      const localizedPath = path.join(contentRoot, contentPath, lang, filename);

      if (fs.existsSync(localizedPath)) {
        return `/${contentRoot}/${contentPath}/${lang}/${filename}`;
      }

      return `/${contentRoot}/${contentPath}/${fallbackLang}/${filename}`;
    },
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "docs",
    },
  };
};
