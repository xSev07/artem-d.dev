import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appsLocalesRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "apps",
);

/** Maps app folder names (URL-style) to i18n key segments under `apps`. */
const APP_FOLDER_KEYS = {
  "6-jars-finance": "sixJarsFinance",
};

const setDeep = (obj, keys, value) => {
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = current[key] ?? {};
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
};

const deepMerge = (target, source) => {
  const output = { ...target };

  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }

  return output;
};

const loadAppLocalesForLang = (lang) => {
  const result = {};

  if (!fs.existsSync(appsLocalesRoot)) {
    return result;
  }

  const appDirs = fs
    .readdirSync(appsLocalesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const appDir of appDirs) {
    const appKey = APP_FOLDER_KEYS[appDir.name];

    if (!appKey) {
      continue;
    }

    const appPath = path.join(appsLocalesRoot, appDir.name);
    const pageDirs = fs
      .readdirSync(appPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    for (const pageDir of pageDirs) {
      const localeFile = path.join(appPath, pageDir.name, `${lang}.json`);

      if (!fs.existsSync(localeFile)) {
        continue;
      }

      const content = JSON.parse(fs.readFileSync(localeFile, "utf8"));
      setDeep(result, ["apps", appKey, pageDir.name], content);
    }
  }

  return result;
};

export const withAppLocales = (locale, lang) =>
  deepMerge(locale, loadAppLocalesForLang(lang));
