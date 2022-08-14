import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Entity, Of } from "entity-of";

@Entity
class Profile {
  @Of(() => String, { optional: true })
  foo?: string;

  @Of(() => Number, { optional: true })
  baz?: number;

  static of = Entity.of<Profile>();
}

@Entity
class User {
  @Of(() => String)
  name: string = "";

  @Of(() => [Number], { nullable: true })
  age: (number | null)[] | null = [null];

  @Of(() => Number, { nullable: true })
  friends: number | null = null;

  @Of(() => String, { optional: true })
  email?: string;

  @Of(() => String, { optional: true, nullable: true })
  foo?: string | null = undefined;

  @Of(() => Profile, { optional: true, nullable: true })
  profile?: Profile | null;

  @Of(() => [String], { optional: true })
  friendsIds?: string[] = [];

  @Of(() => [String], { nullable: true })
  enemyIds: string[] | null = [];

  static of = Entity.of<User>();
}

function App() {
  const user = User.of({
    profile: null,
  });

  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </header>
    </div>
  );
}

export default App;
