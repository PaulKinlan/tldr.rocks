---
slug: hn-photoshop-file
date: '2023-06-06T13:59:01'
title: "Report: How Photoshop Solved Working with Files Larger than Can Fit into Memory"
about: 
https://developer.chrome.com/blog/how-photoshop-solved-working-with-files-larger-than-can-fit-into-memory/
source: https://news.ycombinator.com/item?id=36200480
tags:
- hackernews
- summary
---
The discussion on Hacker News revolves around the implementation of memory management in Photoshop, especially when dealing with large files. The article in question is not accessible, but we can piece together some insights from the comments.

One contributor states that Adobe has been solving this problem for a long time by using the filesystem smartly. For web applications, Chrome provides a filesystem for them to use, allowing them to use the same essential solution that the native app would use​1​.

The implementation of such filesystems helps prevent web pages from crashing​1​. A bit of humor is interjected in the discussion, with a comment about creating a GUI using Visual Basic to track a problematic IP​1​.

The concept of application-based virtual memory has been around since the 1970s, with mainframes using the Customer Information Control System (CICS)​1​. A term that comes up in the discussion is "scratch files", files where data can be written to and read from as needed, which is crucial in Photoshop's memory management​1​. It's suggested that keeping these scratch files on a separate disk can enhance performance​1​.

In the past, some individuals used a ram disk as a scratch disk, using a portion of the computer's RAM to store temporary data quickly​1​. This practice was more common during the late 80s and early 90s, as it was one of the few ways to run large videos without stuttering due to slow hard drives​1​. At a time when the Operating System (OS) couldn't directly use all the RAM that hardware had, using a ram disk or a swap file was a common practice​1​. If the OS can't see the RAM, then the OS-provided ramdisk can't use it either​1​.

The lack of an mmap equivalent for Input/Output (I/O) operations in the browser is considered unfortunate, as it prevents demand paging or similar functionalities​1​.

The discussion also mentions Figma, an app similar to Photoshop, where memory management has surely changed over time​1​. It raises the question of why Figma limits files to 2GB, even for paid users​1​.

As an alternative to Photoshop, Photopea, a one-man show, is suggested. It's a free Photoshop alternative that receives praise from daily users, and the developer is appreciated for his past interactions with the community​1​.