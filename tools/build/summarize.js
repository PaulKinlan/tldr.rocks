/// <reference path="./types.d.ts" />
import { Board } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import '@anthropic-ai/sdk/shims/web'; // this is needed because Anthopic SDK makes some false assumptions about the environment
import { Claude } from "@paulkinlan/claude-breadboard-kit";
import jsdom from "jsdom";
import path from "path";
const kitBuilder = new KitBuilder({
    title: "jsdom",
    description: "Converts html in to a DOM that can be queried.",
    url: "npm:jsdom"
});
const kit = kitBuilder.build({
    "jsdom": {
        invoke: async function (inputs) {
            const dom = new jsdom.JSDOM(inputs.html);
            return { text: dom.window.document.body.textContent };
        }
    }
});
const board = await Board.load(path.join(process.cwd(), "tools", "graphs", "summarize.json"), {
    "kits": {
        "@paulkinlan/claude-breadboard-kit": Claude,
        "jsdom": kit
    }
});
const hn_post = "37917597";
const result = await board.runOnce({
    "model": "claude-2",
    "input-hacker-news": hn_post
});
console.log(`---
slug: hn-${hn_post}
date: '${new Date().toISOString()}'
title: "Report: ADD A TITLE"
about: https://developer.chrome.com/blog/how-photoshop-solved-working-with-files-larger-than-can-fit-into-memory/
source: https://news.ycombinator.com/item?id=${hn_post}
generator: claude
tags:
- hackernews
- summary
- claude
---
${result.text}
`);
