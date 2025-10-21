import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import htmlclean from "htmlclean";
import jsdom from "jsdom";
import parseArgs from "minimist";
import { parseHTML } from "linkedom";
import TurndownService from "turndown";

const PageParser = {
  jsdom: function (html) {
    const dom = new jsdom.JSDOM(htmlclean(html));
    const text = dom.window.document.body.textContent;
    const url = dom.window.document.querySelector("span.titleline > a")?.href;
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

const argv = parseArgs(process.argv.slice(2), {
  string: ["model"],
  default: {
    model: "claude",
  },
});

if (argv._.length !== 1) {
  console.error("Usage: summarize.js <hn-post-id> [--model <provider:model>]");
  console.error("\nExamples:");
  console.error(
    "  node tools/build/summarize.js 33287471 --model claude:claude-sonnet-4-5"
  );
  console.error(
    "  node tools/build/summarize.js 33287471 --model openai:gpt-5"
  );
  console.error(
    "  node tools/build/summarize.js 33287471 --model google:gemini-2.5-pro"
  );
  console.error(
    "  node tools/build/summarize.js 33287471 --model groq:openai/gpt-oss-120b"
  );
  process.exit(1);
}

const hn_post = argv._[0];
// Parse model specification (provider:model or just provider)
const modelSpec = argv.model;
let provider;
let modelName;
if (modelSpec.includes(":")) {
  [provider, modelName] = modelSpec.split(":", 2);
} else {
  provider = modelSpec;
  // Set default models for each provider
  switch (provider.toLowerCase()) {
    case "claude":
    case "anthropic":
      modelName = "claude-sonnet-4-5";
      break;
    case "openai":
      modelName = "gpt-5";
      break;
    case "google":
    case "gemini":
      modelName = "gemini-2.5-pro";
      break;
    case "groq":
      modelName = "openai/gpt-oss-120b";
      break;
    default:
      console.error(`Unknown provider: ${provider}`);
      console.error("Supported providers: claude, openai, google, groq");
      process.exit(1);
  }
}
// Get the model instance based on provider
let model;
let apiKey;

switch (provider.toLowerCase()) {
  case "claude":
  case "anthropic":
    apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error(
        "Error: No API key found for Claude/Anthropic. Please set CLAUDE_API_KEY or ANTHROPIC_API_KEY environment variable."
      );
      process.exit(1);
    }
    const anthropic = createAnthropic({
      apiKey: apiKey,
    });
    model = anthropic(modelName);
    break;
  case "openai":
    apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error(
        "Error: No API key found for OpenAI. Please set OPENAI_API_KEY environment variable."
      );
      process.exit(1);
    }
    const openai = createOpenAI({
      apiKey: apiKey,
    });
    model = openai(modelName);
    break;
  case "google":
  case "gemini":
    apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error(
        "Error: No API key found for Google/Gemini. Please set GOOGLE_API_KEY or GEMINI_API_KEY environment variable."
      );
      process.exit(1);
    }
    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });
    model = google(modelName);
    break;
  case "groq":
    apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error(
        "Error: No API key found for Groq. Please set GROQ_API_KEY environment variable."
      );
      process.exit(1);
    }
    const groq = createGroq({
      apiKey: apiKey,
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

const articleContentHTML = await fetch(url).then((res) => res.text());

// Setup Turndown to convert HTML to Markdown
const turndownService = new TurndownService();

turndownService.addRule("no-style", {
  filter: ["style", "script", "footer", "iframe", "head", "img", "input"],
  replacement: function (content) {
    return "";
  },
});

turndownService.addRule("no-link", {
  filter: ["a"],
  replacement: function (content) {
    return content;
  },
});

// Parse HTML and convert to markdown
const { document } = parseHTML(articleContentHTML);
const articleContent = turndownService.turndown(document.body.innerHTML || articleContentHTML);

const articleSummary = await generateText({
  model,
  maxOutputTokens: 2048,
  prompt: `Create a summary of the following blog post, roughly a paragraph or two in length:

\`\`\`
${articleContent}
\`\`\`
      
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
