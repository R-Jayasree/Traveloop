import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { ArrowLeft, DollarSign, Save } from 'lucide-react';
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BudgetBreakdown = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    transport: 0, stay: 0, meals: 0, activities: 0, misc: 0
  });

  const fetchBudget = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudget(res.data);
      if (res.data.breakdown) {
        setFormData({
          transport: res.data.breakdown.transport || 0,
          stay: res.data.breakdown.stay || 0,
          meals: res.data.breakdown.meals || 0,
          activities: res.data.breakdown.activities || 0,
          misc: res.data.breakdown.misc || 0
        });
      }
    } catch (err) {
      console.error('Budget fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [id]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/budgets/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      fetchBudget();
    } catch (err) {
      console.error('Error saving budget', err);
      alert('Failed to save budget.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  if (loading) return <div className="container mt-1">Loading budget...</div>;
  if (!budget) return <div className="container mt-1">No budget data.</div>;

  const { totalBudget, breakdown } = budget;

  const transport = Number(breakdown.transport || 0);
  const stay = Number(breakdown.stay || 0);
  const meals = Number(breakdown.meals || 0);
  const activities = Number(breakdown.activities || 0);
  const misc = Number(breakdown.misc || 0);
  const totalBreakdown = transport + stay + meals + activities + misc;

  const pieData = {
    labels: totalBreakdown === 0 ? ['No Expenses Yet'] : ['Transport', 'Stay', 'Meals', 'Activities', 'Misc'],
    datasets: [
      {
        data: totalBreakdown === 0 ? [1] : [transport, stay, meals, activities, misc],
        backgroundColor: totalBreakdown === 0 ? ['#e0e0e0'] : ['#0F7173', '#F4A261', '#c0e0e0', '#b0c4de', '#f2d0a4'],
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: ['Transport', 'Stay', 'Meals', 'Activities', 'Misc'],
    datasets: [
      {
        label: 'Cost ($)',
        data: [transport, stay, meals, activities, misc],
        backgroundColor: '#0F7173',
      },
    ],
  };

  return (
    <div className="container mt-1">
      <header className="flex justify-between align-center mb-2">
        <button onClick={() => navigate(-1)} className="flex align-center gap-1 btn btn-sm" style={{ background: 'none' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold">Budget Overview</h1>
        <div className="flex align-center gap-1 btn btn-primary">
          <DollarSign size={18} /> Total ${totalBudget}
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-4 mb-2">
        <div className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">Cost Breakdown (Pie)</h2>
          <div style={{ height: '300px', position: 'relative' }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
        <div className="card p-4">
          <h2 className="mb-2 text-lg font-semibold">Cost Breakdown (Bar)</h2>
          <div style={{ height: '300px', position: 'relative' }}>
            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </section>

      <section className="card p-4 mt-2 mb-4">
        <div className="flex justify-between align-center mb-2">
          <h2 className="text-lg font-semibold">Manage Budget Allocation</h2>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="btn btn-sm" style={{ background: '#f0f0f0', color: '#333' }}>
              Edit Costs
            </button>
          )}
        </div>
        
        {editMode ? (
          <form onSubmit={handleSaveBudget} className="flex flex-col gap-1">
            <div className="grid md:grid-cols-3 gap-2">
              <div className="form-group">
                <label>Transport ($)</label>
                <input type="number" name="transport" value={formData.transport} onChange={handleChange} className="input" min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Stay ($)</label>
                <input type="number" name="stay" value={formData.stay} onChange={handleChange} className="input" min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Meals ($)</label>
                <input type="number" name="meals" value={formData.meals} onChange={handleChange} className="input" min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Activities ($)</label>
                <input type="number" name="activities" value={formData.activities} onChange={handleChange} className="input" min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Misc ($)</label>
                <input type="number" name="misc" value={formData.misc} onChange={handleChange} className="input" min="0" step="0.01" />
              </div>
            </div>
            <div className="flex gap-1 justify-end mt-1">
              <button type="button" onClick={() => setEditMode(false)} className="btn btn-sm" style={{ background: 'none' }}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm flex align-center gap-1">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          <p className="text-muted text-center" style={{ padding: '1rem' }}>
            {totalBreakdown === 0 ? 'You have not allocated any costs yet. Click "Edit Costs" to add your budget breakdown.' : `You have successfully allocated $${totalBreakdown} so far.`}
          </p>
        )}
      </section>
    </div>
  );
};

export default BudgetBreakdown;
