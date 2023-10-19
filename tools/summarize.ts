import '@anthropic-ai/sdk/shims/web'; // this is needed because Anthropic SDK makes some false assumptions about the environment
import { Board, InputValues, NodeValue } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import { Claude } from "@paulkinlan/claude-breadboard-kit";
import jsdom from "jsdom";
import path from "path";
import parseArgs from "minimist";

type JSDOMOutputValues = Promise<void | Partial<Record<string, NodeValue>>>;

const argv = parseArgs(process.argv.slice(2));

if (argv._.length !== 1) { 
  console.error("Usage: summarize.ts <hn-post-id>");
  process.exit(1);
}

const hn_post = argv._[0];

const kitBuilder = new KitBuilder({
  title: "jsdom",
  description: "Converts html in to a DOM that can be queried.",
  url: "npm:jsdom"
});

const kit = kitBuilder.build({
  "jsdom": {
    invoke: async function (inputs: InputValues): JSDOMOutputValues {
      const dom = new jsdom.JSDOM(<string>inputs.html);
      const text = dom.window.document.body.textContent;
      const url = (<HTMLAnchorElement> dom.window.document.querySelector("span.titleline > a"))?.href;
      return { text, url };
    }
  },
  "getTitle": {
    invoke: async function (inputs: InputValues): JSDOMOutputValues {
      const dom = new jsdom.JSDOM(<string>inputs.html);

      return { title: dom.window.document.title };
    }
  },
  "join": {
    invoke: async function (inputs: InputValues): JSDOMOutputValues {
      return { data: JSON.stringify(inputs) };
    }
  }
});

const board = await Board.load(
  path.join(process.cwd(), "tools", "graphs", "summarize.json"),
  {
    "kits": {
      "@paulkinlan/claude-breadboard-kit": Claude,
      "jsdom": kit
    }
  }
);

const result = await board.runOnce({
  "model": "claude-2",
  "input-hacker-news": hn_post
});

const data = JSON.parse(<string>result.data);

console.log(`---
slug: hn-${hn_post}
date: '${new Date().toISOString()}'
title: "Report: ${data.title}"
about: ${data.url}
source: https://news.ycombinator.com/item?id=${hn_post}
generator: claude
tags:
- hackernews
- summary
- claude
---
${data.text}
`)