import React, { useState } from 'react';
import { Plus } from 'lucide-react';

function AddItem({ onAdd }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            console.log("Sending to parent:", input);
            onAdd(input);
            setInput(''); // Clear the input after adding
        }
    };

    return (
        <form onSubmit={handleSubmit} className="input-area">
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add item (e.g. Oat Milk)..."
            />
            <button type="submit">
                <Plus size={20} />
            </button>
        </form>
    );
}

export default AddItem;