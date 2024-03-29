<p align="center">
  <img width="auto" height="64px" alt="logo" src="https://github.com/AlexandruCalinica/Entity.of/blob/main/assets/logo.png?raw=true" />
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

<p align="center"><b>Entity.of</b> ensures the data received over the wire matches your expectations. If it doesn't you'll know first.</p>

- 🕸 Data inconsistency catcher
- 🦾 Declarative API contract enforcer
- 🛠 Standardized object constructor

# Table of contents
- [Table of contents](#table-of-contents)
- [Introduction](#introduction)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Setup tsconfig.json](#setup-tsconfigjson)
  - [Create your first entity](#create-your-first-entity)
- [API](#api)
  - [createEntityStore(options?: StoreOptions): void;](#createentitystoreoptions-storeoptions-void)
  - [@Entity](#entity)
  - [@Of(type?: () => any, options?: FieldOptions)](#oftype---any-options-fieldoptions)
    - [Advanced Custom Field Types](#advanced-custom-field-types)
  - [@Producer](#producer)
  - [mapObjectToEntity(data: Partial of T, Entity: Ctr of T): T](#mapobjecttoentitydata-partial-of-t-entity-ctr-of-t-t)
- [Trouble Shooting](#trouble-shooting)
  - [Caveats](#caveats)
    - [Self referencing entities](#self-referencing-entities)
- [Motivation](#motivation)
- [Simplified problem statement](#simplified-problem-statement)
- [Solution](#solution)

# Introduction

# Getting started
## Prerequisites
Entity.of is framework agnostic, meaning that it should work with any typescript project that has support for experimentalDecorators enabled.
- Typescript codebase
- experimentalDecorator support enabled for the typescript compiler

## Install
via `npm`
```sh
npm install entity-of
```
via `yarn`
```sh
yarn add entity-of
```
## Setup tsconfig.json
Open your project's `tsconfig.json` and add the following line in the `compiler` section:
```json
{
  "compiler": {
    "experimentalDecorators": true   
  }
}
```
You're all set.

## Create your first entity
```ts
import { Entity, Of, createEntityStore } from 'entity-of';

createEntityStore()

@Entity
class User {
  @Of(() => String)
  id = '';
  
  @Of(() => String)
  name = ''
  
  @Of(() => String)
  email = ''
  
  @Of(() => Number)
  age = 0
  
  @Of(() => Boolean)
  isMarried = false
  
  static of = Entity.of<User>();
}

User.of({});
// => { id: '', name: '', email: '', age: 0, isMarried: false }
```

# API
## createEntityStore(options?: StoreOptions): void;
This function must be called as early as possible in the codebase and only once. It's purpose is to instantiate a global object which acts as a state store for all the entities declared.

```ts
// ...all imports

createEntityStore();

// ...all entities should be used after
```
Store can be accessed at anytime in the browser console by typing `window.__ENTITY_OF__`.

At the moment, `StoreOptions` contains only one property named `enableWarnings`. `createEntityStore` can be initialized with this option in order to start logging warnings in the console about unknown properties or mistyped values.

```ts
createEntityStore({ enableWarnings: true });
```
This flag can also be used to enable console warnings only in development mode while keeping the production clear.
```ts
const enableWarnings = process.env.MODE === 'development';
createEntityStore({ enableWarnings });
```

## @Entity
In order to declare and register a new entity model, `@Entity` is used to decorate the class with a static producer method called `.of()` that will be used to construct entity objects.

```ts
@Entity
class User {
  /** class properties */
  
  static of = Entity.of<User>();
}
```
Although the `@Entity` decorator itself does the whole work of adding the static producer method on the class, it cannot change the initial class type signature, so in order to have correct typing on this method we must declare it manualy like so:
```ts
static of = Entity.of<User>();
```
`Entity.of` does not add any actual functionality to the class, it's just an empty placeholder function that does the correct typing, so it will have no effect if the class itself is not decorated in the first place.

## @Of(type?: () => any, options?: FieldOptions)
`@Of` is used to decorate entity class properties. It's purpose is to register a class property as an **entity field** and along with it to describe the returned **type**.
```ts
@Entity
class User {
  @Of(() => String)
  name = ''
  
  static of = Entity<User>();
}
```

First passed argument must be a function that returns the desired type in the form of:
```ts
// primitive constructors
() => String
() => Number
() => Boolean
() => [String] // describes an array of strings
() => [Number] // describes an array of numbers
() => [Boolean] // describes an array of booleans

// entity classes/constructors
() => User
() => [User] // describes an array of users

// advanced custom types

// below line describes an object with properties of type: string|number|boolean|User
() => ({ String, Number, Boolean, User }) 
// below line describes an object with properties of type: User|Profile|Address
() => ({ User, Profile, Address })
// below line describes an array of objects containing properties of type: User
() => [{ User }] // *this type only supports one entity for the moment

// NOT OK
() => null
() => undefined
() => ''
() => 0
() => false
() => {}
() => Object
() => []
() => [{ User, String, Boolean }]

// Not yet implemented but considered
() => [String, Number, Boolean, User] // describes an array containing any of the enumerated types
() => [{ String, Boolean, Number, User }] // describes an array of objects containing any of the enumerated types
```

The `@Of` decorator can also describe if the field is **nullable** or **optional**.
```ts
@Entity
class User {
  @Of(() => String, { nullable: true, optional: true })
  name?: string | null
  
  static of = Entity<User>();
}
```
Tip: If a field must receive as value an array containing some values but also `null`, then the `nullable: true` flag must be passed as option in the decorator:
```ts
@Entity
class User {
  @Of(() => String, { nullable: true })
  name?: (string | null)[] = []
  
  static of = Entity<User>();
}

User.of({ name: [null, 1, 2] }) // typing is ok now.
```

### Advanced Custom Field Types
Although Entity.of is intended to model entities that represent domain models (for ex: database schemas), there might be cases where a field must describe a much more advanced, dynamic or generic data structure. Think of objects where we do not know in advance the name and types of the properties.

Luckily, the `@Of` decorator supports those kinds of usecases.
```ts
@Entity
class DynamicEntity {
  @Of(() => ({ String, Boolean, Number }), { isCustom: true })
  dynamicField: Record<string, string | boolean | number> = {}

  static of = Entity.of<DynamicEntity>();
}

DynamicEntity.of({
  dynamicField: {
    foo: 'hello',
    baz: 123,
    bar: true
  }
})
```
This approach also supports other Entities in combination with Primitive constructors:
```ts
@Entity
class DynamicEntity {
  @Of(() => ({ String, Boolean, Number, User }), { 
    isCustom: true, 
    producerFields: {
      user: 'User'
    } 
  })
  dynamicField: Record<string, string | boolean | number | User> = {}

  static of = Entity.of<DynamicEntity>();
}

DynamicEntity.of({
  dynamicField: {
    foo: 'hello',
    baz: 123,
    bar: true,
    user: {
      ...
    }
  }
})
```
A dynamic field can also support objects with unknown properties all of a specific type
```ts
@Entity
class DynamicEntity {
  @Of(() => ({ User }))
  dynamicField: Record<string, User> = {}

  static of = Entity.of<DynamicEntity>();
}

DynamicEntity.of({
  dynamicField: {
    foo: { /* User props */ }
    bar: { /* User props */ }
    baz: { /* User props */ }
  }
})
```
And finally, a dynamic field can represent an array of objects with unknown keys but all values of a specific type:
```ts
@Entity
class DynamicEntity {
  @Of(() => [{ User }])
  dynamicField: Record<string, User>[] = []

  static of = Entity.of<DynamicEntity>();
}

DynamicEntity.of({
  dynamicField: [
    {
      foo: { /* User props */ }
      bar: { /* User props */ }
      baz: { /* User props */ }
    },
    {
      bac: { /* User props */ }
      fiz: { /* User props */ }
      bad: { /* User props */ }
    },
  ]
})
```

## @Producer
The scope of this decorator is to allow the consumers of this library to create their own custom static `.of()` method(we'll call this the `producer method`). There might be usecases where you need little bit more than what standard `Entity.of` method is offering, so here's a basic example where we implement an entity with a custom producer method:
```ts
class User {
  @Of(() => String)
  id = '';
  
  @Of(() => String)
  name = ''
  
  @Of(() => String)
  email = ''
  
  @Producer
  static of(data: Partial<User>): User {
    logEntity('User', data);
    
    return {
      id: data.id ?? '',
      name: data.name ?? '',
      email: data.email ?? ''
    }
  }
}
```
Warning: This approach bypasses entirely the tracking features Entity.of provides via the standard usage. In order to make the tracking work with a custom producer method, check the below `mapObjectToEntity` example.

## mapObjectToEntity(data: Partial of T, Entity: Ctr of T): T
This function is what the static producer method `.of()` uses internally.
```ts
static of = Entity.of<User>()
  
// is the same as

@Producer
static of(data: Partial<User>): User {
  // some custom logic here...
  return mapObjectToEntity(data, User); // keep the same return behaviour
}
```
This function is exported from the library also to be used with custom usecases and also provide all the tracking features.

# Trouble Shooting
The only known issue at the moment is about self referencing or cyclic entities that are causing stack overflows due to recurring `.of()` calls.

## Caveats
### Self referencing entities
- The self referencing property must be optional (and nullable if it’s the case) in order to not cause infinite recursion.
- The property initialiser should either be undefined or null but never it’s own static of method.
  
OK:
```js
@Entity
class A {
  @Of(() => A, { optional: true })
  a?: A;

  static of = Entity.of<A>();
}

// or with null initializer

@Entity
class A {
  @Of(() => A, { optional: true, nullable: true })
  a?: A | null = null

  static of = Entity.of<A>();
}
```
NOT OK:
```js
@Entity
class A {
  @Of(() => A)
  a: A = A.of({}) // initializer gets called and it's recursive

  static of = Entity.of<A>();
}
```

# Motivation
**Entity.of** was born as a byproduct of first degree encounters with:
- broken APIs
- out-of-date REST api documentations
- unsynchronized graphql schemas + resolvers
- third party services releasing breaking changes
- and many more text-book or edge case situations causing bugs, unexplained behaviours, runtime errors and generally a bad user experience for end users of frontend web apps.

All backend services ideally implement some form of validation and sanitization for any incomming data.
Why should'nt we consider a similar approach for client applications?

<img width="auto" height="auto" alt="diagram" src="https://github.com/AlexandruCalinica/Entity.of/blob/main/assets/entityOf-diagram.png?raw=true" />

# Simplified problem statement
The core idea behind this library is to create a layer inside your application code that handles data modeling, validation and construction.

Let's imagine the following usecase:
  1) Retrieve some data about a User from a web service.
  2) Parse, format and display the data on a webpage.
  3) Mutate the data and send it back to the web service.
  
Somewhere along this flow we'll need to know how the User data looks like. What's the shape of it, what properties does it have, etc. More precisely at step 2 and 3.

For step 2 we need to know the type of data structure we expect to get so we can parse it accordingly and we also need to know the names of properties this data structure holds so that we know what to display on the webpage.

For step 3 we need to know the exact same things as for the previous step otherwise we would'nt know what to modify or what to send back to the server.

Nothing too fancy. The basic approach would look like:
```ts
// STEP 1
fetch('/api/user')
  .then((res) => res.json())
  .then((userData) => {
    // STEP 2
    const { name, age, location } = userData;
    renderUser(name, age, location);
  })
  .catch((err) => console.error(err));
  
function renderUser(name: string, age: number, location: string) {
  /** do some DOM manipulation with the above parameters. */
}
```

Pretty clear so far. We've managed to make it work without the need of declaring somewhere how the `User` data looks like. Now let's look at the 3rd step:
```ts
// STEP 3
function updateUser(updatedName: string, updatedAge: number, updatedLocation: string) {
   const payload = {
      name: updatedName,
      age: updatedAge,
      location: updatedLocation
   };
   
   return fetch('/api/user', {
      method: 'PUT',
      body: JSON.stringify(payload)
   })
}
```

Looks ok-ish, we're still doing hardcore vanilla javascript(in typescript), but what if instead of just 3 properties, our User has 20+ properties? Having our `updateUser` function receive 20+ arguments is not somthing anybody will accept as a solution in a code review session, so ideally we would pass a single argument in the form of an object containing all these properties.

And here's the catch: **How do we type this argument considering the fact that we're in a typescript codebase and our linter rules out the use of explicit `any`?**

Yep, you got it, we create a type or an interface for it. (Thanks Captain Obvious)
```ts
type User = {
  name: string;
  age: number;
  location: string;
  /** + many more props... */
}

function updateUser(updatedUser: User) {   
   return fetch('/api/user', {
      method: 'PUT',
      body: JSON.stringify(updatedUser)
   })
}

updateUser({
  name: 'John Doe',
  age: 29,
  location: 'Romania'
})
```

All good now, but the above code begs the following question:
**If I want to create multiple User looking objects, how can I do that?**

A type or an interface only gives us one option:

```ts
const user: User = { name: 'Foo', age: 42, location: 'UK' };
/** Or */
const user = { name: 'Bar', age: 22, location: 'FR' } as User;
```

Somebody might suggest us: *Hey guys, just write a function that takes some object as argument and returns a new object that respects the `User` type declared above*.
```ts
function makeUser(data: Partial<User>): User {
  return {
    name: data.name ?? '',
    age: data.age ?? 0,
    location: data.location ?? ''
  }
}

makeUser({ name: 'Alex' });
// => { name: 'Alex', age: 0, location: '' }
```
Pretty cool, we can even use it in our initial fetch that retrieves the User data from the server.
```ts
// STEP 1
fetch('/api/user')
  .then((res) => res.json())
  .then((userData) => {
    // STEP 2
    const { name, age, location } = makeUser(userData);
    renderUser(name, age, location);
  })
  .catch((err) => console.error(err)); 
```
Now we can be sure that if for some reason the server does not respond with the same object structure that we expect, `makeUser()` will try to access the expected properties and if it does'nt find any, it will return some defaults not matter what.

We're going to stop here with the analogy, since we've just proven what a data modeling layer looks like, where it comes from and how it benefits us. If you think about constructor functions and ES6 classes, you're on the right mindset path, as these are javascripts core features intended for standardizing object modeling and creation.

# Solution
The purpose of this library is to help developers create and maintain this data modeling layer in a minimal, easy-to-use and easy-to-decouple fashion.
**Entity.of** uses **decorator pattern** and **type guard pattern**. The first one (decorator) is used to apply the second (type guard). There is also a third obvious ingredient of this recipe which without this library makes no sense - **ES6 Classes**.

```ts
@Entity
class User {
  @Of(() => Number)
  id: number = 0;
  
  @Of(() => String)
  name: string = '';
  
  @Of(() => Boolean)
  isSmart: boolean = true;
  
  static of = Entity.of<User>();
}
```
This `User` class (we call it entity) is a 3-in-1 solution:
  1) Can be used to type arguments, variables or object literals.
  2) Can be used to construct objects that implement the `User` class via the static method `.of()`.
  3) Can track/validate/warn if the `User` entity was initialized with unknown properties or values of unexpected types ***at runtime***

