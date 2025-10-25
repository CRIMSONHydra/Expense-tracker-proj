import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function Dashboard() {
  const { logout } = useAuth();
  const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 });
  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState('$');
  
  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('expense');

  // --- Data Fetching ---
  const fetchData = async () => {
    try {
      const [summaryRes, transactionsRes] = await Promise.all([
        axiosClient.get('/transactions/summary'),
        axiosClient.get('/transactions')
      ]);
      setSummary(summaryRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
      if (error.response?.status === 401) logout(); // Log out if token is bad
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Event Handlers ---
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    try {
      const numericAmount = category === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
      await axiosClient.post('/transactions', {
        title,
        amount: numericAmount,
        category,
      });
      // Reset form and refetch data
      setTitle('');
      setAmount('');
      setCategory('expense');
      fetchData(); 
    } catch (error) {
      console.error('Failed to create transaction', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        await axiosClient.delete(`/transactions/${id}`);
        fetchData(); // Refetch data
      } catch (error) {
        console.error('Failed to delete transaction', error);
      }
    }
  };

  // --- Dynamic Styling for Form ---
  const isExpense = category === 'expense';
  const buttonColor = isExpense ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const ringColor = isExpense ? 'focus:ring-red-500' : 'focus:ring-green-500';

  return (
    <div className="container p-4 mx-auto max-w-4xl">
      <header className="flex flex-wrap items-center justify-between py-4 gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">My Wallet</h1>
          {/* --- Currency Picker --- */}
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 border rounded-md bg-white shadow-sm"
          >
            <option value="$">$ (USD)</option>
            <option value="€">€ (EUR)</option>
            <option value="£">£ (GBP)</option>
            <option value="₹">₹ (INR)</option>
            <option value="¥">¥ (JPY)</option>
          </select>
        </div>
        <button onClick={logout} className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
          Logout
        </button>
      </header>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard title="Balance" amount={summary.balance} currency={currency} />
        <SummaryCard title="Income" amount={summary.income} currency={currency} color="text-green-600" />
        <SummaryCard title="Expenses" amount={summary.expenses} currency={currency} color="text-red-600" />
      </div>

      <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-5">
        {/* --- New Transaction Form --- */}
        <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Add Transaction</h3>
          <form onSubmit={handleCreateTransaction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${ringColor}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 mt-1 border rounded-md ${isExpense ? 'text-red-600' : 'text-green-600'}`}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button type="submit" className={`w-full py-2 text-white rounded-md transition-colors ${buttonColor}`}>
              Add {isExpense ? 'Expense' : 'Income'}
            </button>
          </form>
        </div>

        {/* --- Transaction List --- */}
        <div className="p-6 bg-white rounded-lg shadow-md md:col-span-3">
          <h3 className="text-xl font-semibold mb-4">History</h3>
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.length === 0 && (
              <p className="text-gray-500">No transactions yet.</p>
            )}
            {transactions.map(t => (
              <li key={t.id} className="flex items-center justify-between p-3 border rounded-md">
                <span className="font-medium">{t.title}</span>
                <div className="flex items-center space-x-3">
                  <span className={`font-semibold ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {t.amount > 0 ? '+' : '-'}{currency}{Math.abs(t.amount).toLocaleString()}
                  </span>
                  <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-600 font-bold">
                    &times;
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Summary Card Component ---
const SummaryCard = ({ title, amount, currency, color = 'text-gray-900' }) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <h4 className="text-sm font-medium text-gray-500 uppercase">{title}</h4>
    <p className={`text-3xl font-bold ${color}`}>
      {amount < 0 && '-'}{currency}{Math.abs(parseFloat(amount)).toLocaleString()}
    </p>
  </div>
);