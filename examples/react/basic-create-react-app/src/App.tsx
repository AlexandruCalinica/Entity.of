import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Entity, Of } from "entity-of";

@Entity
class User {
  @Of(() => String)
  name: string = "";

  @Of(() => Number)
  age: number = 0;

  static of = Entity.of<User>();
}

function App() {
  const user = User.of({});

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
