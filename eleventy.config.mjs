/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "docs",
    },
  };
};
