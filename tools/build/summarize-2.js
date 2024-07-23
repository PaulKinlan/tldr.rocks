import Anthropic from "@anthropic-ai/sdk";
import htmlclean from "htmlclean";
import jsdom from "jsdom";
import parseArgs from "minimist";
const PageParser = {
    jsdom: function (html) {
        const dom = new jsdom.JSDOM(htmlclean(html));
        const text = dom.window.document.body.textContent;
        const url = (dom.window.document.querySelector("span.titleline > a"))?.href;
        return { text, url };
    },
    getTextContent: function (html) {
        const dom = new jsdom.JSDOM(htmlclean(html));
        const text = dom.window.document.body.textContent;
        return { text };
    },
    getTitle: function (html) {
        const dom = new jsdom.JSDOM(html);
        return { title: dom.window.document.title };
    },
    join: function (html) {
        return { data: JSON.stringify(html) };
    },
};
const argv = parseArgs(process.argv.slice(2));
if (argv._.length !== 1) {
    console.error("Usage: summarize.ts <hn-post-id>");
    process.exit(1);
}
const hn_post = argv._[0];
const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});
const rawContent = await fetch(`https://news.ycombinator.com/item?id=${hn_post}`).then((res) => res.text());
const { text, url } = PageParser.jsdom(rawContent);
const { title } = PageParser.getTitle(rawContent);
const { text: content } = PageParser.getTextContent(rawContent);
if (url == undefined) {
    console.error("Could not find URL from the Hacker News post.");
    process.exit(1);
}
const hnSummary = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2048,
    messages: [
        {
            role: "user",
            content: `Summarize this Hacker News post. The output should be in Markdown and have three sections: Positive Sentiment; Negative Sentiment; Recommend actions to address the feedback. 
    
  Extract up to 5 of the most relevant links to external content that are in the text and add them to an "Interesting links" section. Do not include malformed URLs.
  
  ${content}
  
  ### Summary:
"`,
        },
    ],
});
const articleContent = await fetch(url).then((res) => res.text());
const articleSummary = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2048,
    messages: [
        {
            role: "user",
            content: `Create a summary of the following blog post, roughly a paragraph or two in length:
      
${articleContent}
      
## Summary:

`,
        },
    ],
});
console.log(`---
slug: hn-${hn_post}
date: '${new Date().toISOString()}'
title: "Report: ${title}"
about: ${url}
source: https://news.ycombinator.com/item?id=${hn_post}
generator: claude
tags:
- hackernews
- summary
- claude
---
### Article summary
${articleSummary.content[0].text}

### Comment summary
${hnSummary.content[0].text}
`);
