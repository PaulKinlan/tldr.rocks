import { Board } from "@google-labs/breadboard";
import { Claude } from "@paulkinlan/claude-breadboard-kit";

import path from "path";

const board = await Board.load(
  path.join(process.cwd(), "tools", "graphs", "test.json")
);

board.addKit(Claude);

const result = await board.runOnce({
  model: "claude-2",
  text: "37917597",
});

console.log(result.text as string)