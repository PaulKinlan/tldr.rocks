---
slug: hn-43532830
date: "2025-04-10T21:08:31.146Z"
title: "Report: The <select> element can now be customized with CSS | Hacker News"
about: https://developer.chrome.com/blog/a-customizable-select
source: https://news.ycombinator.com/item?id=43532830
generator: claude
tags:
  - hackernews
  - summary
  - claude
---

### Article summary

The blog post announces that starting from Chrome 135, web developers can now fully customize the HTML `<select>` element using CSS, addressing a long-standing limitation. The new feature uses `appearance: base-select` to unlock customization capabilities, allowing rich HTML content like images and SVG inside options. This implementation changes the browser's HTML parser and rendering behavior, exposing new internal parts and states for styling. The customized select renders with minimal default styling and displays options in the top layer like a popover. While these selects lose some native behaviors like rendering outside the browser pane or triggering mobile OS components, they maintain all JavaScript interfaces. The post highlights that this feature was developed collaboratively across browser vendors, with Chrome being the first to implement it. Resources include examples, documentation on MDN, and various community collections demonstrating the new customization possibilities.

### Comment summary

Here is a summary of the key points from the Hacker News discussion about customizable `<select>` elements in CSS:

### Positive Sentiment:

- Many developers are excited about this long-awaited feature, which has been desired for decades
- It will allow for more consistent styling of select elements without relying on JavaScript libraries
- Seen as a step forward for native web capabilities and reducing reliance on custom components

### Negative Sentiment:

- Concerns about losing native mobile OS styling and behaviors
- Worries it may lead to poorly implemented custom selects that are less accessible
- Some view it as further Chrome/Chromium dominance of web standards
- Skepticism about how long it will take other browsers to implement

### Recommended Actions:

- Use as progressive enhancement, don't rely on it exclusively yet
- Be careful not to break accessibility when customizing selects
- Consider user needs before heavily styling native controls
- Test implementations across browsers and devices

### Interesting Links:

1. https://caniuse.com/mdn-css_properties_appearance_base-select
2. https://open-ui.org/components/combobox.explainer/
3. https://open-ui.org/components/customizableselect/
4. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist
5. https://webkit.org/blog/16574/webkit-features-in-safari-18-4/
