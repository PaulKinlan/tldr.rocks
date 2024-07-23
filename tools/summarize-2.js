"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_1 = require("@anthropic-ai/sdk");
var htmlclean_1 = require("htmlclean");
var jsdom_1 = require("jsdom");
var minimist_1 = require("minimist");
var PageParser = {
    jsdom: function (html) {
        var _a;
        var dom = new jsdom_1.default.JSDOM((0, htmlclean_1.default)(html));
        var text = dom.window.document.body.textContent;
        var url = (_a = ((dom.window.document.querySelector("span.titleline > a")))) === null || _a === void 0 ? void 0 : _a.href;
        return { text: text, url: url };
    },
    getTextContent: function (html) {
        var dom = new jsdom_1.default.JSDOM((0, htmlclean_1.default)(html));
        var text = dom.window.document.body.textContent;
        return { text: text };
    },
    getTitle: function (html) {
        var dom = new jsdom_1.default.JSDOM(html);
        return { title: dom.window.document.title };
    },
    join: function (html) {
        return { data: JSON.stringify(html) };
    },
};
var argv = (0, minimist_1.default)(process.argv.slice(2));
if (argv._.length !== 1) {
    console.error("Usage: summarize.ts <hn-post-id>");
    process.exit(1);
}
var hn_post = argv._[0];
var anthropic = new sdk_1.default();
var rawContent = await fetch("https://news.ycombinator.com/item?id=".concat(hn_post)).then(function (res) { return res.text(); });
var _a = PageParser.jsdom(rawContent), text = _a.text, url = _a.url;
var title = PageParser.getTitle(rawContent).title;
var content = PageParser.getTextContent(rawContent).text;
if (url == undefined) {
    console.error("Could not find URL from the Hacker News post.");
    process.exit(1);
}
var hnSummary = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2048,
    messages: [
        {
            role: "user",
            content: "Summarize this Hacker News post. The output should be in Markdown and have three sections: Positive Sentiment; Negative Sentiment; Recommend actions to address the feedback. \n    \n  Extract up to 5 of the most relevant links to external content that are in the text and add them to an \"Interesting links\" section. Do not include malformed URLs.\n  \n  ".concat(content, "\n  \n  ### Summary:\n\""),
        },
    ],
});
var articleContent = await fetch(url).then(function (res) { return res.text(); });
var articleSummary = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2048,
    messages: [
        {
            role: "user",
            content: "Create a summary of the following blog post, roughly a paragraph or two in length:\n      \n".concat(articleContent, "\n      \n## Summary:\n\n"),
        },
    ],
});
console.log("---\nslug: hn-".concat(hn_post, "\ndate: '").concat(new Date().toISOString(), "'\ntitle: \"Report: ").concat(title, "\"\nabout: ").concat(url, "\nsource: https://news.ycombinator.com/item?id=").concat(hn_post, "\ngenerator: claude\ntags:\n- hackernews\n- summary\n- claude\n---\n### Article summary\n").concat(articleSummary, "\n\n### Comment summary\n").concat(hnSummary, "\n"));
