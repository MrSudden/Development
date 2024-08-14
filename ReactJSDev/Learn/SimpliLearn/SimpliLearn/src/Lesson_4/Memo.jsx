/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useState } from "react";
import Todos from "./Todo";

function Memo() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);
  const [newTodos, setNewTodos] = useState([]);
  const [newNewTodos, setNewNewTodos] = useState([]);
  const memoizedValue = useMemo(() => expensiveCalc(count), [count]);

  const addTodo = () => {
    setTodos((t) => [
      ...t,
      { id: crypto.randomUUID(), title: `Todo ${count + 1}` },
    ]);
    setCount(count + 1);
  };

  const addNewTodo = () => {
    setNewTodos((t) => [
      ...t,
      { id: crypto.randomUUID(), title: `Todo ${count + 1}` },
    ]);
  };

  const addNewNewTodo = useCallback(() => {
    setNewNewTodos((t) => [
      ...t,
      { id: crypto.randomUUID(), title: `Todo ${count + 1}` },
    ]);
  }, [newNewTodos]);

  const buttonStyle = "text-white bg-cyan-600 w-50 my-2";
  const todoStyle =
    "flex flex-col place-items-center text-sm w-96 py-5 bg-slate-200";
  const childTodoStyle = "flex flex-col place-items-start";
  return (
    <>
      <h1>Memoization</h1>
      <div className="flex gap-3">
        <div className={todoStyle}>
          <div className="mb-2">React memo</div>
          <Todos todos={todos} todoStyle={childTodoStyle} />
          <button className={buttonStyle} onClick={addTodo}>
            Add Todo
          </button>
          <div>Count: {count}</div>
          <button className={buttonStyle} onClick={() => setCount(count + 1)}>
            +
          </button>
        </div>
        <div className={todoStyle}>
          <div className="mb-2">React Hooks useMemo</div>
          <Todos todos={newTodos} todoStyle={childTodoStyle} />
          <button className={buttonStyle} onClick={addNewTodo}>
            Add Todo
          </button>
          <div>Expensive calculation: {memoizedValue}</div>
        </div>
        <div className={todoStyle}>
          <div className="mb-2">React Hooks useCallback</div>
          <Todos
            todos={newNewTodos}
            addTodo={addNewNewTodo}
            buttonStyle={buttonStyle}
            todoStyle={childTodoStyle}
          />
        </div>
      </div>
    </>
  );
}

export default Memo;

const expensiveCalc = (num) => {
  console.log("Expensive calculation");
  for (let i = 0; i < 1000000; i++) {
    num += 1;
  }
  return num;
};
