---
slug: hn-get-started-with-webgpu
date: '2023-07-13T10:58:01'
title: "Report: Get Started with Web GPU on Hackernews"
about: https://developer.chrome.com/articles/gpu-compute/
source: https://news.ycombinator.com/item?id=32150387
generator: claude
tags:
- hackernews
- summary
- claude
---

Here is a summary of the key points from the Hacker News post:

#### Positive Sentiment

- WebGPU provides a common API for accessing GPU capabilities across browsers and platforms. This makes it easier for developers to leverage GPU power in web apps.

- WebGPU is based on existing native APIs like Vulkan, Metal, and DirectX 12. This means it can provide low overhead access to GPU features.

- WebGPU works well for graphics workloads like games. It has the potential to enable more immersive web experiences.

- Tools like WebDNN could allow running neural net inference on WebGPU. This expands the capabilities of web apps.

#### Negative Sentiment 

- WebGPU is still evolving and has rough edges. The API syntax is not yet finalized.

- Lack of GPU sandboxing in WebGPU is a security concern. It could allow spying on GPU data from other processes.

- WebGPU on MacOS is currently buggy and unstable. This hurts adoption.

- It's unclear if WebGPU will work well for training machine learning models. The focus seems to be on inference.

#### Recommendations

- Prioritize finalizing the API and settling on a stable syntax. This will reassure developers.

- Add proper GPU sandboxing to prevent spying on cross-process data. This is critical for security. 

- Fix stability issues on MacOS. Focus on delivering a robust implementation there.

- Expand WebGPU to better support emerging use cases like ML training. This will boost adoption.

- Learn from past technologies like Java applets. Apply security best practices to avoid similar pitfalls.