import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';
import { User } from './services/user';
import { Todo } from './services/todo';
import { useState } from 'react';

export const App = () => {
  const users: User[] = [...usersFromServer];
  const [todos, setTodos] = useState<Todo[]>(() => [...todosFromServer]);

  const [title, setTitle] = useState('');
  const [selectUser, setSelectUser] = useState('0');

  const [hasTitleError, setHasTitleError] = useState(false);
  const [hasSelectError, setHasSelectError] = useState(false);

  const titleInvalid = !title;
  const userInvalid = selectUser === '0';

  const getNextId = (arr: Todo[]) => {
    if (arr.length === 0) {
      return 1;
    }

    return Math.max(...arr.map(t => t.id)) + 1;
  };

  const selectedUser = users.find(u => u.id === Number(selectUser));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setHasTitleError(titleInvalid);
    setHasSelectError(userInvalid);

    if (titleInvalid || userInvalid) {
      return;
    }

    const newTodo: Todo = {
      id: getNextId(todos) + 1,
      title: title,
      completed: false,
      userId: selectedUser!.id,
    };

    setTodos(prev => [...prev, newTodo]);
    setTitle('');
    setSelectUser('0');
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={event => {
              setTitle(event.target.value);
              setHasTitleError(false);
            }}
          />

          {hasTitleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={selectUser}
            onChange={event => {
              setSelectUser(event.target.value);
              setHasSelectError(false);
            }}
          >
            <option value="0" disabled>
              Choose a user
            </option>

            {users.map(user => (
              <option value={user.id} key={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {hasSelectError && (
            <span className="error">Please choose a user</span>
          )}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList users={users} todos={todos} />

      {/* <section className="TodoList">
        <article data-id="1" className="TodoInfo TodoInfo--completed">
          <h2 className="TodoInfo__title">delectus aut autem</h2>

          <a className="UserInfo" href="mailto:Sincere@april.biz">
            Leanne Graham
          </a>
        </article>

        <article data-id="15" className="TodoInfo TodoInfo--completed">
          <h2 className="TodoInfo__title">delectus aut autem</h2>

          <a className="UserInfo" href="mailto:Sincere@april.biz">
            Leanne Graham
          </a>
        </article>

        <article data-id="2" className="TodoInfo">
          <h2 className="TodoInfo__title">
            quis ut nam facilis et officia qui
          </h2>

          <a className="UserInfo" href="mailto:Julianne.OConner@kory.org">
            Patricia Lebsack
          </a>
        </article>
      </section> */}
    </div>
  );
};
