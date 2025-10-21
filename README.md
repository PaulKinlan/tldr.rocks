# tldr.rocks

tldr.rocks is a tool that analyzes the sentiment of Hacker News posts.

## Usage

The tool now supports multiple AI providers including Claude (Anthropic), OpenAI, Google Gemini, and Groq.

### Basic usage with Claude (default):

```bash
CLAUDE_API_KEY="<YOUR_KEY>" node tools/build/summarize.js <HN_POST_ID>
```

### Specify a different provider:

```bash
# Using OpenAI
OPENAI_API_KEY="<YOUR_KEY>" node tools/build/summarize.js <HN_POST_ID> --model openai

# Using Google Gemini
GOOGLE_API_KEY="<YOUR_KEY>" node tools/build/summarize.js <HN_POST_ID> --model google

# Using Groq
GROQ_API_KEY="<YOUR_KEY>" node tools/build/summarize.js <HN_POST_ID> --model groq
```

### Specify a specific model:

```bash
# Using a specific Claude model
CLAUDE_API_KEY="<YOUR_KEY>" node tools/build/summarize.js <HN_POST_ID> --model claude:claude-sonnet-4-5

# Using a specific OpenAI model
OPENAI_API_KEY="<YOUR_KEY>" node tools/build/summarize.js <HN_POST_ID> --model openai:gpt-5

# Using a specific Gemini model
GOOGLE_API_KEY="<YOUR_KEY>" node tools/build/summarize.js <HN_POST_ID> --model google:gemini-2.5-pro

# Using a specific Groq model
GROQ_API_KEY="<YOUR_KEY>" node tools/build/summarize.js <HN_POST_ID> --model groq:openai/gpt-oss-120b
```

### Notes:

- You need to create an API key for your chosen provider and may need to purchase credits.
- `HN_POST_ID` is the unique post ID found in the Hacker News URL. Example: for https://tldr.rocks/hn-33287471/, `HN_POST_ID` is 33287471.
- Supported providers: `claude` (or `anthropic`), `openai`, `google` (or `gemini`), `groq`
- Default models:
  - Claude: `claude-sonnet-4-5`
  - OpenAI: `gpt-5`
  - Google: `gemini-2.5-pro`
  - Groq: `openai/gpt-oss-120b`
