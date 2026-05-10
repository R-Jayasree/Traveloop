import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, Edit2, Save, FileText } from 'lucide-react';

const TripNotes = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/notes/${tripId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(res.data);
        } catch (err) {
            console.error('Error fetching notes', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tripId]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/notes/${tripId}`, { content: newNote }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewNote('');
            fetchNotes();
        } catch (err) {
            console.error('Error adding note', err);
        }
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotes();
        } catch (err) {
            console.error('Error deleting note', err);
        }
    };

    const startEditing = (note) => {
        setEditingNoteId(note.id);
        setEditContent(note.content);
    };

    const saveEdit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/notes/${id}`, { content: editContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingNoteId(null);
            fetchNotes();
        } catch (err) {
            console.error('Error updating note', err);
        }
    };

    if (loading) return <div className="container mt-1">Loading notes...</div>;

    return (
        <div className="container mt-1">
            <header className="flex justify-between align-center mb-2">
                <button onClick={() => navigate(-1)} className="btn btn-sm" style={{ background: 'none' }}>
                    ← Back
                </button>
                <h1 className="text-2xl font-bold flex align-center gap-1"><FileText size={24} /> Trip Notes</h1>
            </header>

            <div className="card p-4 mb-2">
                <form onSubmit={handleAddNote} className="flex flex-col gap-1">
                    <textarea
                        placeholder="Jot down a quick note, reminder, or journal entry..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="input w-full"
                        style={{ resize: 'vertical', minHeight: '80px', padding: '0.8rem' }}
                    />
                    <div className="flex justify-end mt-1">
                        <button type="submit" className="btn btn-primary flex align-center gap-1">
                            <Plus size={16} /> Add Note
                        </button>
                    </div>
                </form>
            </div>

            <div className="notes-list flex flex-col gap-2">
                {notes.length === 0 ? (
                    <p className="text-muted" style={{ textAlign: 'center', marginTop: '2rem' }}>No notes yet. Add one above!</p>
                ) : (
                    notes.map(note => (
                        <div key={note.id} className="card p-3" style={{ position: 'relative' }}>
                            <div className="flex justify-between align-center mb-1">
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                    {new Date(note.created_at).toLocaleString()}
                                </span>
                                <div className="flex gap-1">
                                    {editingNoteId !== note.id && (
                                        <button onClick={() => startEditing(note)} className="action-btn text-muted">
                                            <Edit2 size={14} />
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteNote(note.id)} className="action-btn delete">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            
                            {editingNoteId === note.id ? (
                                <div className="flex flex-col gap-1 mt-1">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="input w-full"
                                        style={{ resize: 'vertical', minHeight: '60px' }}
                                    />
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => setEditingNoteId(null)} className="btn btn-sm">Cancel</button>
                                        <button onClick={() => saveEdit(note.id)} className="btn btn-primary btn-sm flex align-center gap-1">
                                            <Save size={14} /> Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{note.content}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TripNotes;
