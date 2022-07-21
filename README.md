<p align="center">
  <img width="auto" height="64px" alt="logo" src="https://github.com/AlexandruCalinica/Entity.of/blob/main/logo.png?raw=true" />
</p>
<h1 align="center">Entity.of</h1>

<p align="center" style="margin-bottom: 32px; width: 100%;">
  <a href="https://github.com/AlexandruCalinica/Entity.of/actions/workflows/workflow.yaml">
    <img alt="ci" src="https://github.com/AlexandruCalinica/Entity.of/actions/workflows/workflow.yaml/badge.svg?branch=main">
  </a>
  <a href="http://commitizen.github.io/cz-cli/">
    <img alt="commitizen" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg">
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img alt="semantic-release" src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release">
  </a>
  <a href="https://www.npmjs.com/package/entity-of">
    <img alt="npm latest version" src="https://img.shields.io/npm/v/entity-of/latest.svg">
  </a>
  <A href="https://www.npmjs.com/package/entity-of">
    <img alt="" src="https://img.shields.io/npm/l/entity-of" />
  </a>
</p>

**Entity.of** ensures the data received over the wire matches your expectations. If it doesn't you'll know first.

- ### 🕸 Data inconsistency catcher
- ### 🦾 Declarative API contract enforcer
- ### 🛠 Standardized object constructor

# Motivation
**Entity.of** was born as a byproduct of first degree encounters with:
- broken APIs
- out-of-date REST api documentations
- unsynchronized graphql schemas + resolvers
- third party services releasing breaking changes
- and many more text-book or edge case situations causing bugs, unexplained behaviours, runtime errors and generally a bad user experience for end users of frontend web apps.

All backend services ideally implement some form of validation and sanitization for any incomming data.
Why should'nt we consider a similar approach for client applications?

# Mindset
Think about **Entity.of** as a sweet spot combination between **decorator pattern** and **type guard pattern**. The first one (decorator) is used to apply the second (type guard). There is also a third obvious component which without this library makes no sense - **ES6 Classes**.


https://user-images.githubusercontent.com/45464946/179451398-4b65c7b1-969f-4f77-a06f-d57acc7b53b4.mov



