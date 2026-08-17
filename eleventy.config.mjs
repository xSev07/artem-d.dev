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
import sharedSite from "./src/locales/shared/site.json" with { type: "json" };
import { withAppLocales } from "./src/locales/merge-app-locales.mjs";

const withSharedLocale = (locale, lang) =>
  withAppLocales(
    {
      ...locale,
      common: {
        ...locale.common,
        langSwitch: {
          ...langSwitchCodes,
          ...locale.common?.langSwitch,
        },
      },
      site: {
        ...sharedSite,
        ...locale.site,
      },
    },
    lang,
  );

await i18next.init({
  lng: "en",
  resources: {
    en: { translation: withSharedLocale(en, "en") },
    ru: { translation: withSharedLocale(ru, "ru") },
    uk: { translation: withSharedLocale(uk, "uk") },
    pl: { translation: withSharedLocale(pl, "pl") },
    cs: { translation: withSharedLocale(cs, "cs") },
    de: { translation: withSharedLocale(de, "de") },
    nl: { translation: withSharedLocale(nl, "nl") },
    sv: { translation: withSharedLocale(sv, "sv") },
    fr: { translation: withSharedLocale(fr, "fr") },
    it: { translation: withSharedLocale(it, "it") },
    es: { translation: withSharedLocale(es, "es") },
    "pt-BR": { translation: withSharedLocale(ptBR, "pt-BR") },
    ro: { translation: withSharedLocale(ro, "ro") },
    tr: { translation: withSharedLocale(tr, "tr") },
    id: { translation: withSharedLocale(id, "id") },
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
