<div style="text-align: center; width: 100%;">
  <img width="auto" height="64px" alt="logo" src="https://github.com/AlexandruCalinica/Entity.of/blob/main/logo.png?raw=true" />
</div>
<h1 style="text-align: center;">Entity.of</h1>

<div style="text-align:center; margin-bottom: 32px;">
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
</div>

**Entity.of** ensures the data received over the wire matches your expectations. If it doesn't you'll know first.

- ### 🕸 Data inconsistency catcher
- ### 🦾 Declarative API contract enforcer
- ### 🛠 Standardized object constructor

The motivation behind **Entity.of** comes from first degree encounters with broken APIs, out-of-date REST api documentations, unsynchronized graphql schemas + resolvers, third party services releasing breaking changes, and many more text-book or edge case situations causing bugs, unexplained behaviours, runtime errors and generally a bad user experience for end users.

# Mindset
Think about **Entity.of** as a sweet spot combination between **decorator pattern** and **type guard pattern**. The first one (decorator) is used to apply the second (type guard). There is also a third obvious component which without this library makes no sense - **ES6 Classes**.
