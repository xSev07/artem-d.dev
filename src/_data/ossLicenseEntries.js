import ossLicenses from "../../data/oss-licenses.json" with { type: "json" };

export default Object.entries(ossLicenses).sort(([a], [b]) =>
  a.localeCompare(b, "en"),
);
