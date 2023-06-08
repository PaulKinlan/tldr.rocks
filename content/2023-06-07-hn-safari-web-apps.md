---
slug: hn-safari-web-apps
date: '2023-06-06T13:59:01'
title: "Report: Web Apps on macOS Sonoma 14 Beta on HackerNews"
about: https://blog.tomayac.com/2023/06/07/web-apps-on-macos-sonoma-14-beta/
source: https://news.ycombinator.com/item?id=36237332
tags:
- hackernews
- summary
---

The comments on the Hacker News post about web apps on macOS Sonoma 14 Beta are generally mixed. Some users express excitement about the development, while others voice concerns about potential abuse and the nature of web notifications.

## Positive Sentiment
One user named "jessmartin" expressed great excitement about Safari Progressive Web Apps (PWAs) on macOS, calling it "a very good start." They appreciated the fact that credentials in cookies are copied over, links are handled in-app or in the default browser based on their origin, and that web apps run independently of Safari. However, they also mentioned that the FileSystem API is not supported yet, nor are drag-and-drop or LaunchHandler. They believe these features could greatly improve local-first apps​1​.

A user named "kitsunesoba" also showed enthusiasm for the separation of Safari and Web App processes, stating that it's "irritating for Chrome itself to fire up when I launch an installed PWA." They were glad that Apple chose to take a different approach with this​1​.

## Negative Sentiment and Concerns
On the other hand, a user named "jmull" strongly disagreed with the idea of letting web apps programmatically trigger the Add to Dock flow. They argued that this would create new ways for websites to annoy users. They did, however, acknowledge that the rest of the article was filled with good ideas​1​.

This sentiment was echoed by "kemayo" who expressed dissatisfaction with "let me send you desktop notifications!" pop-ups​1​.

"BackBlast" suggested that Safari should offer a "don't badger me" option to shut down all page-based prompts and requests. They argued that the feature in question isn't widely abused and that it provides a better user experience than having to navigate obscure menu methods​1​.

A few users discussed how to turn off notification pop-ups in Safari, but also noted that many websites send a JavaScript-based notification which can't be blocked before prompting you for the system one​1​.

"dev_tty01" and "kitsunesoba" criticized websites for attempting to send notifications the first time a user visits. They believe this practice is annoying and likely designed to exploit users who quickly click through prompts​1​.

"etchalon" was against web push notifications as a feature because they believed it would lead to countless push notification pop-ups on the web. They criticized developers who don't consider that features they wouldn't abuse could be misused by others​1​.

"jonhohle" expressed a hope that certain features, such as FileSystem API and LaunchHandler, would not be supported as they fear this would lead to developers building inferior web apps instead of native ones. They argue that these features should be for process isolation for tools that are open all the time and do not have native alternatives​1​.

## Summary
Overall, the discussion on the post was nuanced, with users expressing both excitement and concern about the new developments in web apps on macOS Sonoma 14 Beta. The main points of contention revolved around the potential for abuse of new features, the intrusive nature of web notifications, and the trade-off between the convenience of web apps and the quality of native apps.