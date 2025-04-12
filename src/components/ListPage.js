import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ListContext } from "../context/ListContext";
import TaskList from "./TaskList";

const ListPage = () => {
  const { id } = useParams();
  const {
    fetchItems,
    items,
    addItemToList,
    toggleItemComplete,
    deleteItem,
    showCompleted,
    setShowCompleted,
    deleteList,
    lists,
  } = useContext(ListContext);

  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    fetchItems(id);
  }, [id]);

  const handleAddItem = () => {
    if (task.trim() !== "") {
      addItemToList(id, task, priority);
      setTask("");
    }
  };

  const currentList = lists.find(list => list.id === id);

  return (
    <div className="list-page">
      <h2>{currentList ? currentList.name : "List"}</h2>

      <button onClick={() => deleteList(id)} style={{ color: "red" }}>
        🗑 Delete This List
      </button>

      <div className="add-task-form">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button onClick={handleAddItem}>Add Task</button>
      </div>

      <button onClick={() => setShowCompleted(!showCompleted)}>
        {showCompleted ? "Hide Completed" : "Show Completed"}
      </button>

      <TaskList
        tasks={items.filter(task => showCompleted || !task.completed)}
        toggleComplete={(taskId) =>
          toggleItemComplete(id, taskId, items.find(i => i.id === taskId).completed)
        }
        deleteTask={(taskId) => deleteItem(id, taskId)}
      />
    </div>
  );
};

export default ListPage;
