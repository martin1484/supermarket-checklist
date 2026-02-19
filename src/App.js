import React, { useState, useEffect } from 'react';
import { db } from './firebase/firebaseConfig';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { ShoppingCart, Trash2, Plus } from 'lucide-react';
import './App.css';
import AddItem from './components/AddItem';
import ListItem from './components/ListItem';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsub();
  }, []);

  const addItem = async (itemName) => {

    console.log("Received from child:", itemName); // Check your console for this!

    if (!itemName) return;

    await addDoc(collection(db, 'items'), {
      name: itemName,
      completed: false,
      createdAt: serverTimestamp()
    });
    setInput('');
  };

  const toggleComplete = async (item) => {
    await updateDoc(doc(db, 'items', item.id), { completed: !item.completed });
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  const clearCompleted = async () => {
    const completedItems = items.filter(item => item.completed);

    // We loop through and delete each one
    const deletePromises = completedItems.map(item =>
      deleteDoc(doc(db, 'items', item.id))
    );

    await Promise.all(deletePromises);
  };

  return (
    <div className="app-container">
      <header>
        <h1><ShoppingCart /> MarketList</h1>
      </header>

      {items.some(item => item.completed) && (
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
      )}


      <AddItem onAdd={addItem} />

      <ul className="list">
        {items.map(item => (
          <ListItem
            key={item.id}
            item={item}
            onToggle={toggleComplete}
            onDelete={deleteItem}
          />
        ))}
      </ul>

    </div>
  );
}

export default App;