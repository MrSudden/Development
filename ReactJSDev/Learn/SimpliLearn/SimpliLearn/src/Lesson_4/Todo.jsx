/* eslint-disable react-refresh/only-export-components */
import { PropTypes } from "prop-types";
import { memo } from "react";

const Todos = ({ todos, addTodo, buttonStyle, todoStyle }) => {
  console.count("Render Todos");
  return (
    <>
      {todoStyle && (
        <div className={todoStyle}>
          {todos.map((todo) => (
            <div key={todo.id}>
              {todo.title}
              {": "}
              {todo.id}
            </div>
          ))}
        </div>
      )}
      {addTodo && buttonStyle && (
        <button className={buttonStyle} onClick={addTodo}>
          Add Todo
        </button>
      )}
    </>
  );
};

Todos.propTypes = {
  todos: PropTypes.array.isRequired,
  addTodo: PropTypes.func,
  buttonStyle: PropTypes.string,
  todoStyle: PropTypes.string,
};

export default memo(Todos);
