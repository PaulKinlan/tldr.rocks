import { Board } from "@google-labs/breadboard";

import '@anthropic-ai/sdk/shims/web'; // this is needed because Anthopic SDK makes some false assumptions about the environment
import { Claude } from "@paulkinlan/claude-breadboard-kit";

import path from "path";

const board = await Board.load(
  path.join(process.cwd(), "tools", "graphs", "summarize.json"),
  {
    "kits": {
      "@paulkinlan/claude-breadboard-kit": Claude
    }
  }
);

console.log("Running board");

const result = await board.runOnce({
  "model": "claude2",
  "input-hacker-news": "37917597"
});

console.log(result)