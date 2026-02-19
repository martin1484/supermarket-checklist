import React from 'react';
import { Trash2, CheckCircle, Circle, PlusCircle, MinusCircle } from 'lucide-react';

function ListItem({ item, onToggle, onDelete, onUpdateQuantity }) {
  return (
    <li className={item.completed ? 'completed' : ''}>
      <div className="item-content">
        <div onClick={() => onToggle(item)} className="checkbox-area">
          {item.completed ? <CheckCircle size={20} color="#2ecc71" /> : <Circle size={20} color="#ddd" />}
        </div>
        
        <span className="item-name">{item.name}</span>
        
        <div className="quantity-controls">
          <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
            <MinusCircle size={18} />
          </button>
          <span className="qty-number">{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
            <PlusCircle size={18} />
          </button>
        </div>
      </div>
      
      <button onClick={() => onDelete(item.id)} className="delete-btn">
        <Trash2 size={18} />
      </button>
    </li>
  );
}

export default ListItem;