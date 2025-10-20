# tldr.rocks

tldr.rocks is a tool that analyzes the sentiment of Hacker News posts.

Usage in macOS terminal:

```bash
CLAUDE_API_KEY="YOUR_KEY" node tools/build/summarize-2.js <HN_POST_ID>
```

- You need to create a `CLAUDE_API_KEY` and may need to purchase credits.
- `HN_POST_ID` is the unique post ID found in the Hacker News URL. Example: for https://tldr.rocks/hn-33287471/, `HN_POST_ID` is 33287471.
