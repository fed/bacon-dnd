# bacon-dnd

![bacon-dnd](https://i.imgur.com/SbZhVzG.jpg)

In this example we are building a Kanban board with some cards and we wanna basically add some functionality so we can click on these cards, drag them around and when we let them go they will snap back to their original position or into a new column.

## Intro to Functional Reactive Programming

Turns out state is really really hard to get right. Every time you need to restart your computer or an app is probably because state went bad. You fix it by blowing away the old state and starting fresh. In fact state is so hard we had to build debuggers: that’s right, people had to build programs to help other programmers figure out the state in their programs.

> "I understand WHY it crashed. I just don’t understand how the user could have possibly gotten it in that state."
> -- Programmer adds another state check.
> http://www.sprynthesis.com/page2/#state

FRP can be described as a way to build reactive programs by modelling state as values which react to events over time.

Today in JavaScriptland there's an entire ecosystem of libraries built upon these ideas, and the community has mostly settled on a combination of React and Redux. Redux is a great library but lacks some of the powers of FRP libs like Reactive Extensions (RxJS) and BaconJS. So tonight I wanna give you a small taste of what those libraries are.

**In FRP we don't store our state in variables, rather in immutable containers called event streams.**

**Instead of describing execution steps that the computer must take, we describe the relationship between values, and the FP engine automatically derives execution from that. This is a huge win as thinking in terms of dependencies is much simpler than thinking in terms of sequences.**

> This example is based on Blake Haswell's talk on Functional Reactive Programming at SydJS back in March 2016.
