import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import htmlclean from "htmlclean";
import jsdom from "jsdom";
import path from "path";
import parseArgs from "minimist";

const PageParser = {
  jsdom: function (html: string): {
    text: string | null | undefined;
    url?: string;
  } {
    const dom = new jsdom.JSDOM(htmlclean(html));
    const text = dom.window.document.body.textContent;
    const url = (<HTMLAnchorElement>(
      dom.window.document.querySelector("span.titleline > a")
    ))?.href;
    return { text, url };
  },
  getTextContent: function (html: string): { text: string | null | undefined } {
    const dom = new jsdom.JSDOM(htmlclean(html));
    const text = dom.window.document.body.textContent;
    return { text };
  },
  getTitle: function (html: string): { title: string | null | undefined } {
    const dom = new jsdom.JSDOM(html);
    return { title: dom.window.document.title };
  },
  join: function (html: string): { data: string | null | undefined } {
    return { data: JSON.stringify(html) };
  },
};

const argv = parseArgs(process.argv.slice(2), {
  string: ["model"],
  default: {
    model: "claude",
  },
});

if (argv._.length !== 1) {
  console.error("Usage: summarize.ts <hn-post-id> [--model <provider:model>]");
  console.error("\nExamples:");
  console.error("  node tools/build/summarize-2.js 33287471 --model claude:claude-3-5-sonnet-20240620");
  console.error("  node tools/build/summarize-2.js 33287471 --model openai:gpt-4o");
  console.error("  node tools/build/summarize-2.js 33287471 --model google:gemini-1.5-pro");
  console.error("  node tools/build/summarize-2.js 33287471 --model groq:llama-3.1-70b-versatile");
  process.exit(1);
}

const hn_post = argv._[0];

// Parse model specification (provider:model or just provider)
const modelSpec = argv.model;
let provider: string;
let modelName: string;

if (modelSpec.includes(":")) {
  [provider, modelName] = modelSpec.split(":", 2);
} else {
  provider = modelSpec;
  // Set default models for each provider
  switch (provider.toLowerCase()) {
    case "claude":
    case "anthropic":
      modelName = "claude-3-5-sonnet-20240620";
      break;
    case "openai":
      modelName = "gpt-4o";
      break;
    case "google":
    case "gemini":
      modelName = "gemini-1.5-pro";
      break;
    case "groq":
      modelName = "llama-3.1-70b-versatile";
      break;
    default:
      console.error(`Unknown provider: ${provider}`);
      console.error("Supported providers: claude, openai, google, groq");
      process.exit(1);
  }
}

// Get the model instance based on provider
let model;
switch (provider.toLowerCase()) {
  case "claude":
  case "anthropic":
    const anthropic = createAnthropic({
      apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
    });
    model = anthropic(modelName);
    break;
  case "openai":
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    model = openai(modelName);
    break;
  case "google":
  case "gemini":
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
    });
    model = google(modelName);
    break;
  case "groq":
    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });
    model = groq(modelName);
    break;
  default:
    console.error(`Unknown provider: ${provider}`);
    process.exit(1);
}

const rawContent = await fetch(
  `https://news.ycombinator.com/item?id=${hn_post}`
).then((res) => res.text());

const { text, url } = PageParser.jsdom(rawContent);
const { title } = PageParser.getTitle(rawContent);
const { text: content } = PageParser.getTextContent(rawContent);

if (url == undefined) {
  console.error("Could not find URL from the Hacker News post.");
  process.exit(1);
}

const hnSummary = await generateText({
  model,
  maxOutputTokens: 2048,
  prompt: `Summarize this Hacker News post. The output should be in Markdown and have three sections: Positive Sentiment; Negative Sentiment; Recommend actions to address the feedback. 
    
  Extract up to 5 of the most relevant links to external content that are in the text and add them to an "Interesting links" section. Do not include malformed URLs.
  
  ${content}
  
  ### Summary:
`,
});

const articleContent = await fetch(url).then((res) => res.text());

const articleSummary = await generateText({
  model,
  maxOutputTokens: 2048,
  prompt: `Create a summary of the following blog post, roughly a paragraph or two in length:
      
${articleContent}
      
## Summary:

`,
});

console.log(`---
slug: hn-${hn_post}
date: '${new Date().toISOString()}'
title: "Report: ${title}"
about: ${url}
source: https://news.ycombinator.com/item?id=${hn_post}
generator: ${provider}
tags:
- hackernews
- summary
- ${provider}
---
### Article summary

${articleSummary.text}

### Hacker News Comment summary

${hnSummary.text}
`);
