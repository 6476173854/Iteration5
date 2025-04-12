import React, { createContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export const ListContext = createContext();

export const ListProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [items, setItems] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [activeListId, setActiveListId] = useState(null);

  // Fetch all lists
  const fetchLists = async () => {
    try {
      const q = query(collection(db, "lists"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLists(data);
    } catch (err) {
      console.error("Error fetching lists:", err);
    }
  };

  // Add a new list
  const addList = async (name) => {
    try {
      const docRef = await addDoc(collection(db, "lists"), {
        name,
        createdAt: new Date(),
      });
      fetchLists();
      return docRef.id;
    } catch (err) {
      console.error("Error adding list:", err);
    }
  };

  // Delete a list
  const deleteList = async (id) => {
    try {
      await deleteDoc(doc(db, "lists", id));
      fetchLists();
    } catch (err) {
      console.error("Error deleting list:", err);
    }
  };

  // Fetch items for a specific list
  const fetchItems = async (listId) => {
    try {
      setActiveListId(listId);
      const q = query(
        collection(db, `lists/${listId}/items`),
        orderBy("priority", "asc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        listId, // store the list ID for task handling
      }));
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  // Add a task to a list
  const addItemToList = async (listId, task, priority) => {
    try {
      await addDoc(collection(db, `lists/${listId}/items`), {
        task,
        priority,
        completed: false,
        createdAt: new Date(),
        listId,
      });
      fetchItems(listId);
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // Toggle task completion
  const toggleItemComplete = async (listId, itemId, currentStatus) => {
    try {
      const itemRef = doc(db, `lists/${listId}/items`, itemId);
      await updateDoc(itemRef, { completed: !currentStatus });
      fetchItems(listId);
    } catch (err) {
      console.error("Error toggling item:", err);
    }
  };

  // Delete task
  const deleteItem = async (listId, itemId) => {
    try {
      await deleteDoc(doc(db, `lists/${listId}/items`, itemId));
      fetchItems(listId);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <ListContext.Provider
      value={{
        lists,
        items,
        activeListId,
        showCompleted,
        setShowCompleted,
        fetchItems,
        addList,
        deleteList,
        addItemToList,
        toggleItemComplete,
        deleteItem,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
