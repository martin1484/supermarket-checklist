import React, { useState, useEffect } from 'react';
import { db } from './firebase/firebaseConfig';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, where } from 'firebase/firestore';
import { ShoppingCart, Share2, LogOut } from 'lucide-react';
import './App.css';
import AddItem from './components/AddItem';
import ListItem from './components/ListItem';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInAnonymously } from "firebase/auth";

function App() {
  const [items, setItems] = useState([]);
  const auth = getAuth();
  const [user, setUser] = useState(null);

  // 1. Escuchar si el usuario inicia sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    
    if (!user) return;

    const q = query(
        collection(db, 'items'),
        where('userId', '==', user.uid), 
        orderBy('category', 'asc'),
        orderBy('name', 'asc')
      );
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsub();
  }, [user]);

  const addItem = async (itemName, itemCategory) => {

    if (!itemName) return;

    await addDoc(collection(db, 'items'), {
      name: itemName,
      category: itemCategory,
      completed: false,
      quantity: 1,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  };

  const shareList = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied! Send this URL to your partner to shop together.");
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

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return; // Prevent negative groceries!
    const itemRef = doc(db, 'items', id);
    await updateDoc(itemRef, { quantity: newQty });
  };

  const totalItems = items.length;
  const completedItemsCount = items.filter(item => item.completed).length;
  const remainingItems = totalItems - completedItemsCount;

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  const guestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Error al entrar como invitado:", error);
    }
  };

  if (!user) {
    return (
      <div className="app-container">
        <div className="login-container">
          <h1><ShoppingCart size={40} color="#2ecc71" /> MarketList</h1>
          <p>Tu lista de compras inteligente y privada.</p>
          
          <button onClick={login} className="login-btn">
            Iniciar sesión con Google
          </button>

          <div className="divider">o</div>

          <button onClick={guestLogin} className="guest-btn">
            Continuar como invitado
          </button>
          
          <p className="note">
            Nota: Si usas el modo invitado, tu lista se perderá si borras los datos del navegador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <div className="header-main">
          <h1><ShoppingCart /> Lista de Compras</h1>
          <div className="header-actions">

            <button onClick={logout} className="icon-btn" title="Cerrar sesión">
              <LogOut size={20} /> 
            </button>

            <button onClick={shareList} className="icon-btn">
              <Share2 size={20} />
            </button>
            {totalItems > 0 && (
              <div className="stats-badge">
                {completedItemsCount} / {totalItems}
              </div>
            )}
          </div>
        </div>
        
        {totalItems > 0 && (
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${(completedItemsCount / totalItems) * 100}%` }}
            ></div>
          </div>
        )}
        
        {remainingItems === 0 && totalItems > 0 ? (
          <p className="status-msg success">Compras completas! 🎉</p>
        ) : totalItems > 0 ? (
          <p className="status-msg">Faltan {remainingItems} items</p>
        ) : null}
      </header>

      <AddItem onAdd={addItem} />

      <ul className="list">
        {items.map(item => (
          <ListItem
            key={item.id}
            item={item}
            onToggle={toggleComplete}
            onDelete={deleteItem}
            onUpdateQuantity={updateQuantity}
          />
        ))}
      </ul>

      {items.some(item => item.completed) && (
        <button className="clear-btn" onClick={clearCompleted}>
          Limpiar Completados
        </button>
      )}

    </div>
  );
}

export default App;