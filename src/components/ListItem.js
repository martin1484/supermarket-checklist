import React from 'react';
import { Trash2, CheckCircle, Circle } from 'lucide-react';

function ListItem({ item, onToggle, onDelete }) {
    return (
        <li className={item.completed ? 'completed' : ''}>
            <div className="item-content" onClick={() => onToggle(item)}>
                {item.completed ? (
                    <CheckCircle size={20} color="#2ecc71" />
                ) : (
                    <Circle size={20} color="#ddd" />
                )}
                <span>{item.name}</span>
            </div>
            <button onClick={() => onDelete(item.id)} className="delete-btn">
                <Trash2 size={18} />
            </button>
        </li>
    );
}

export default ListItem;