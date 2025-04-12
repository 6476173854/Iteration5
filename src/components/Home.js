import React, { useState, useContext } from "react";
import { ListContext } from "../context/ListContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { lists, addList, deleteList } = useContext(ListContext);
  const [listName, setListName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listName.trim()) {
      addList(listName.trim());
      setListName("");
    }
  };

  return (
    <div className="home">
      <h2>Your Lists</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="New list name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          required
        />
        <button type="submit">Add List</button>
      </form>

      {lists.length === 0 ? (
        <p>No lists yet. Add one above!</p>
      ) : (
        <ul>
          {lists.map((list) => (
            <li key={list.id}>
              <Link to={`/list/${list.id}`}>{list.name}</Link>
              <button onClick={() => deleteList(list.id)} style={{ marginLeft: "10px" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
