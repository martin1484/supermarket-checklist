import React, { useState, useEffect } from 'react';
import { db } from './firebase/firebaseConfig';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, where } from 'firebase/firestore';
import { ShoppingCart, Share2, LogOut, Trash2 } from 'lucide-react';
import './App.css';
import AddItem from './components/AddItem';
import ListItem from './components/ListItem';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInAnonymously } from "firebase/auth";

function App() {
  const [items, setItems] = useState([]);
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [listCode, setListCode] = useState(localStorage.getItem('currentList') || null);

  // 1. Escuchar si el usuario inicia sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // La consulta ahora filtra por listCode en lugar de userId
  useEffect(() => {
    if (!user || !listCode) return;

    const q = query(
      collection(db, 'items'),
      where('listCode', '==', listCode),
      orderBy('category', 'asc'),
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, [user, listCode]);

  const addItem = async (itemName, itemCategory) => {

    if (!itemName) return;

    await addDoc(collection(db, 'items'), {
      name: itemName,
      category: itemCategory,
      completed: false,
      quantity: 1,
      listCode: listCode,
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

  const joinList = (e) => {
    e.preventDefault();
    const code = e.target.code.value.trim().toLowerCase();
    if (code) {
      setListCode(code);
      localStorage.setItem('currentList', code);
    }
  };

  const generateNewList = () => {
    // Genera un número entre 10000 y 99999
    const newCode = Math.floor(10000 + Math.random() * 90000).toString();
    setListCode(newCode);
    localStorage.setItem('currentList', newCode);
  };

  const leaveList = () => {
    if (window.confirm("¿Quieres salir de esta lista? Podrás volver a entrar si tienes el código.")) {
      setListCode(null);
      setItems([]); // Limpiamos los items actuales
      localStorage.removeItem('currentList');
    }
  };

  if (user && !listCode) {
    return (
      <div className="app-container">
        <div className="login-container">
          <h2>🛍️ Tus Listas</h2>
          <p>Crea una lista nueva o únete a una compartida introduciendo su código de 5 dígitos.</p>
          
          {/* Opción A: Crear nueva */}
          <button onClick={generateNewList} className="login-btn" style={{width: '100%', marginBottom: '15px'}}>
            ✨ Crear nueva lista
          </button>

          <div className="divider">o únete a una existente</div>

          {/* Opción B: Unirse */}
          <form onSubmit={joinList} className="add-item-form" style={{background: 'none', padding: 0}}>
            <div className="input-group">
              <input 
                name="code" 
                type="number" 
                placeholder="Ej: 54321" 
                max="99999"
                required 
                style={{textAlign: 'center', fontSize: '1.5rem', letterSpacing: '5px'}}
              />
            </div>
            <button type="submit" className="add-submit-btn" style={{width: '100%', marginTop: '10px'}}>
              Unirme
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-container">
        <div className="login-container">
          <h1><ShoppingCart size={40} color="#2ecc71" /> Lista de Compras</h1>
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
          <div className="title-section">
            <h1><ShoppingCart size={24} /> Lista de Compras</h1>
              {listCode && (
                <div className="list-controls">
                  <span className="list-code-badge" onClick={() => {
                    navigator.clipboard.writeText(listCode);
                    alert("¡Código copiado!");
                  }}>
                    Código: {listCode} 📋
                  </span>
                  <button onClick={leaveList} className="leave-btn" title="Salir de la lista">
                    <LogOut size={14} /> Salir
                  </button>
                </div>
              )}
          </div>
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
        {items
          .slice() // Creamos una copia para no afectar el estado original
          .sort((a, b) => {
            // Si 'a' está completado y 'b' no, 'a' va al final (retorna 1)
              if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
              }
              // Si ambos tienen el mismo estado, mantenemos el orden por categoría/nombre
              return 0; 
          }).map(item => (
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

      {items.some(item => item.completed) && (
        <button onClick={clearCompleted} className="clear-btn">
          <Trash2 size={16} /> Limpiar artículos comprados
        </button>
      )}

    </div>
  );
}

export default App;