const DEFAULT_API_BASE_URL = "https://api.artem-d.dev";

const normalizeBaseUrl = (value) => value.replace(/\/$/, "");

export default {
  url: "https://artem-d.dev",
  apiBaseUrl: normalizeBaseUrl(process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL),
};
