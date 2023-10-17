import { Board } from "@google-labs/breadboard";
import { Claude } from "@paulkinlan/claude-breadboard-kit";

import path from "path";

const board = await Board.load(
  path.join(process.cwd(), "tools", "graphs", "summarize.json")
);

board.addKit(Claude);

const result = await board.runOnce({
  model: "claude-2",
  text: "How much wood can a woodchuck chuck?",
});

console.log(result.text as string)