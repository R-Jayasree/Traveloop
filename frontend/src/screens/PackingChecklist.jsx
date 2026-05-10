import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, X, CheckSquare, Square } from 'lucide-react';

const PackingChecklist = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', category: '' });

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/packing/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error('Error loading packing items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePacked = async (item) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/packing/item/${item.id}`, {
        is_packed: !item.is_packed,
      }, { headers: { Authorization: `Bearer ${token}` } });
      fetchItems();
    } catch (err) {
      console.error('Error toggling packed', err);
    }
  };

  const addItem = async () => {
    if (!newItem.name) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/packing/${tripId}`, newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewItem({ name: '', category: '' });
      fetchItems();
    } catch (err) {
      console.error('Error adding packing item', err);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Remove this item?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/packing/item/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) {
      console.error('Error deleting packing item', err);
    }
  };

  if (loading) return <div className="container mt-1">Loading packing list…</div>;

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))];

  return (
    <div className="container mt-1">
      <header className="flex justify-between align-center mb-1">
        <button onClick={() => navigate(-1)} className="flex align-center gap-1 text-muted" style={{ background: 'none' }}>
          ← Back
        </button>
        <h2>Packing Checklist</h2>
      </header>
      <div className="card p-3 mb-3">
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="flex-1"
          />
          <input
            placeholder="Category (e.g., clothing)"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="flex-1"
          />
          <button onClick={addItem} className="btn btn-primary"><Plus size={16} /> Add</button>
        </div>
        {categories.map((cat) => (
          <div key={cat} className="mb-2">
            <h4 className="text-muted" style={{ textTransform: 'capitalize' }}>{cat}</h4>
            <ul className="list-none">
              {items.filter((i) => i.category === cat).map((item) => (
                <li key={item.id} className="flex justify-between align-center py-1 border-b">
                  <div className="flex items-center gap-2">
                    {item.is_packed ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} />}
                    <span onClick={() => togglePacked(item)} style={{ cursor: 'pointer' }}>{item.name}</span>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="action-btn delete"><Trash2 size={16} /></button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackingChecklist;
