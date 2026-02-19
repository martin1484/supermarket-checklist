import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const CATEGORIES = ['🛒 General','🥦 Verduras','🍎 Frutas','🥛 Lácteos','🥩 Carnes','❄️ Congelados','🍞 Panadería','🧼 Limpieza','🥤 Bebidas'];


function AddItem({ onAdd }) {
    const [input, setInput] = useState('');
    const [category, setCategory] = useState('🛒 General');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            console.log("Sending to parent:", input);
            onAdd(input, category);
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-item-form">
        <div className="input-group">
            <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Nombre del artículo..." 
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
            </select>
        </div>
        <button type="submit"><Plus size={20} /></button>
        </form>
    );

    /*return (
        <form onSubmit={handleSubmit} className="input-area">
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Agregar un item (ej. Cereal, Leche)..."
            />
            <button type="submit">
                <Plus size={20} />
            </button>
        </form>
    );*/
}

export default AddItem;