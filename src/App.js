import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calendar, 
  Plus, 
  Eye, 
  EyeOff, 
  Settings, 
  LogOut, 
  User, 
  CreditCard, 
  Target,
  AlertCircle,
  CheckCircle,
  Trash2,
  Edit,
  Home,
  Receipt,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

// API Configuration - Replace with your Railway URL
const API_BASE = 'https://finance-app-production-2458.up.railway.app/api';

// API Helper Functions
const api = {
  post: async (endpoint, data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  get: async (endpoint, token = null) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE}${endpoint}`, { headers });
    return response.json();
  },
  
  delete: async (endpoint, token = null) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE}${endpoint}`, { 
      method: 'DELETE', 
      headers 
    });
    return response.json();
  }
};

// Login Component
function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const data = isLogin 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await api.post(endpoint, data);

      if (response.success) {
        if (isLogin) {
          onLogin(response.token, response.user);
        } else {
          setMessage('Account created! Please log in.');
          setIsLogin(true);
        }
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">FinanceFlow</h1>
          <p className="text-gray-600">Your personal finance companion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-4 border-0 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-gray-900 placeholder-gray-500"
                placeholder="Enter your username"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-4 border-0 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-gray-900 placeholder-gray-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-4 border-0 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-gray-900 placeholder-gray-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {message && (
            <div className={`p-4 rounded-2xl text-sm font-medium ${
              message.includes('success') || message.includes('created') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
            className="text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ totalIncome, totalExpenses, netIncome, transactions, budgetOverview, onAddTransaction }) {
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm opacity-90 font-medium">Income</p>
              <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm opacity-90 font-medium">Expenses</p>
              <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-3xl shadow-lg ${netIncome >= 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-orange-500 to-red-600'}`}>
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm opacity-90 font-medium">Net Income</p>
              <p className="text-2xl font-bold">${netIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm opacity-90 font-medium">Budget Used</p>
              <p className="text-2xl font-bold">{budgetOverview?.budgetUsedPercentage || 0}%</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={onAddTransaction}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-3xl font-semibold flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        <Plus className="w-5 h-5" />
        <span>Add Transaction</span>
      </button>

      {/* Recent Transactions */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          <Receipt className="w-6 h-6 text-gray-400" />
        </div>

        <div className="space-y-4">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No transactions yet</p>
              <p className="text-sm">Add your first transaction to get started</p>
            </div>
          ) : (
            recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-2xl ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? 
                      <TrendingUp className="w-5 h-5 text-green-600" /> :
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.Category?.name || 'No category'} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={`font-bold text-lg ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Budget Alerts */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Budget Status</h3>
        
        {budgetOverview?.overBudgetCount > 0 && (
          <div className="mb-3 p-4 bg-red-100 rounded-2xl border border-red-200">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-red-800">
                {budgetOverview.overBudgetCount} budget(s) exceeded
              </span>
            </div>
          </div>
        )}

        {budgetOverview?.closeToLimitCount > 0 && (
          <div className="mb-3 p-4 bg-yellow-100 rounded-2xl border border-yellow-200">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">
                {budgetOverview.closeToLimitCount} budget(s) near limit
              </span>
            </div>
          </div>
        )}

        {(!budgetOverview?.overBudgetCount && !budgetOverview?.closeToLimitCount) && (
          <div className="p-4 bg-green-100 rounded-2xl border border-green-200">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                All budgets on track
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Transactions Tab Component
function TransactionsTab({ transactions, categories, onAddTransaction, onDeleteTransaction, token }) {
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${transactionId}`, token);
        onDeleteTransaction();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
        <button
          onClick={onAddTransaction}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'income', label: 'Income' },
          { id: 'expense', label: 'Expenses' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
              filter === f.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500 mb-6">Start by adding your first transaction</p>
            <button
              onClick={onAddTransaction}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Add Your First Transaction
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map(transaction => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? 
                        <TrendingUp className="w-5 h-5 text-green-600" /> :
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      }
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{transaction.description}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                          {transaction.Category?.name || 'No category'}
                        </span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <p className={`text-xl font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Budgets Tab Component
function BudgetsTab({ budgets, categories, budgetOverview, onAddBudget, onDeleteBudget, token }) {
  const handleDelete = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const response = await api.delete(`/budgets/${budgetId}`, token);
        if (response.success || response.message === 'Budget deleted successfully') {
          onDeleteBudget();
        } else {
          console.error('Delete failed:', response.message);
        }
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Budgets</h2>
        <button
          onClick={onAddBudget}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      {/* Budget Overview */}
      {budgetOverview && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-3xl shadow-lg text-white">
            <p className="text-sm opacity-90 font-medium">Total Budget</p>
            <p className="text-2xl font-bold">${budgetOverview.totalBudget?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-3xl shadow-lg text-white">
            <p className="text-sm opacity-90 font-medium">Total Spent</p>
            <p className="text-2xl font-bold">${budgetOverview.totalSpent?.toFixed(2) || '0.00'}</p>
          </div>
          <div className={`p-6 rounded-3xl shadow-lg text-white ${(budgetOverview.remainingBudget || 0) >= 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-orange-500 to-red-600'}`}>
            <p className="text-sm opacity-90 font-medium">Remaining</p>
            <p className="text-2xl font-bold">${budgetOverview.remainingBudget?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-6 rounded-3xl shadow-lg text-white">
            <p className="text-sm opacity-90 font-medium">Usage</p>
            <p className="text-2xl font-bold">{budgetOverview.budgetUsedPercentage || 0}%</p>
          </div>
        </div>
      )}

      {/* Budget Categories */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {budgets.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No budgets set</h3>
            <p className="text-gray-500 mb-6">Create budgets to track your spending</p>
            <button
              onClick={onAddBudget}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {budgets.map(budget => {
              const percentageUsed = Math.round((budget.spentAmount / budget.budgetAmount) * 100);
              const remaining = budget.budgetAmount - budget.spentAmount;
              const status = budget.spentAmount > budget.budgetAmount ? 'over' : 
                           budget.spentAmount >= (budget.budgetAmount * 0.8) ? 'warning' : 'good';
              
              return (
                <div key={budget.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl bg-gray-100 p-3 rounded-2xl">
                        {budget.Category?.icon || '💰'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{budget.Category?.name}</h4>
                        <p className="text-sm text-gray-500">
                          ${budget.spentAmount?.toFixed(2) || '0.00'} of ${budget.budgetAmount?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`font-bold text-lg ${status === 'over' ? 'text-red-600' : status === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}>
                          ${remaining?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-sm text-gray-500">{percentageUsed}% used</p>
                      </div>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="p-3 text-gray-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        status === 'over' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                        status === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-600'
                      }`}
                      style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ transactions, categories, budgets }) {
  // Calculate expense breakdown by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const categoryName = t.Category?.name || 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + t.amount;
      return acc;
    }, {});

  const categoryData = Object.entries(expensesByCategory).map(([name, amount]) => ({
    name,
    amount: amount.toFixed(2)
  }));

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <BarChart3 className="w-6 h-6 text-gray-400" />
      </div>

      <div className="space-y-6">
        {/* Activity Summary */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Summary</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900">Total Income</span>
              </div>
              <span className="font-bold text-xl text-green-600">
                ${totalIncome.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-100">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-2xl">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <span className="font-semibold text-gray-900">Total Expenses</span>
              </div>
              <span className="font-bold text-xl text-red-600">
                ${totalExpenses.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-2xl">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900">Active Budgets</span>
              </div>
              <span className="font-bold text-xl text-blue-600">{budgets.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-2xl">
                  <Receipt className="w-6 h-6 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-900">Total Transactions</span>
              </div>
              <span className="font-bold text-xl text-purple-600">{transactions.length}</span>
            </div>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Spending by Category</h3>
          
          {categoryData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No expense data available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categoryData.map((category, index) => {
                const percentage = totalExpenses > 0 ? ((category.amount / totalExpenses) * 100).toFixed(1) : 0;
                return (
                  <div key={category.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: `hsl(${index * 137.508}deg, 70%, 60%)` }}
                      />
                      <div>
                        <span className="font-semibold text-gray-900">{category.name}</span>
                        <p className="text-sm text-gray-500">{percentage}% of total</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">${category.amount}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add Transaction Modal
function AddTransactionModal({ categories, token, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId || null
      }, token);

      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || 'Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Add Transaction</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 rounded-2xl hover:bg-gray-100 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-4 border-0 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-gray-900"
              placeholder="Enter description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full px-4 py-4 border-0 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-gray-900"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Type</label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'expense', categoryId: ''})}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all ${
                  formData.type === 'expense'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'income', categoryId: ''})}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all ${
                  formData.type === 'income'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="w-full px-4 py-4 border-0 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-gray-900"
            >
              <option value="">Select category (optional)</option>
              {categories
                .filter(c => c.type === formData.type)
                .map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-4 border-0 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-gray-900"
              required
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-100 text-red-800 border border-red-200 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 text-gray-700 bg-gray-100 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Budget Modal - Fixed version
function AddBudgetModal({ categories, token, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    categoryId: '',
    budgetAmount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter categories to only show expense categories for budgets
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.categoryId) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    if (!formData.budgetAmount || parseFloat(formData.budgetAmount) <= 0) {
      setError('Please enter a valid budget amount');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/budgets', {
        categoryId: parseInt(formData.categoryId),
        budgetAmount: parseFloat(formData.budgetAmount)
      }, token);

      console.log('Budget creation response:', response);

      if (response.success || response.budget) {
        onSuccess();
      } else {
        setError(response.message || 'Failed to create budget');
      }
    } catch (error) {
      console.error('Error adding budget:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Add Budget</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 rounded-2xl hover:bg-gray-100 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="w-full px-4 py-4 border-0 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-gray-900"
              required
            >
              <option value="">Select a category</option>
              {expenseCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {expenseCategories.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No expense categories available. Categories may need to be created first.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Budget Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.budgetAmount}
              onChange={(e) => setFormData({...formData, budgetAmount: e.target.value})}
              className="w-full px-4 py-4 border-0 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all text-gray-900"
              placeholder="0.00"
              required
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-100 text-red-800 border border-red-200 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 text-gray-700 bg-gray-100 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || expenseCategories.length === 0}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? 'Creating...' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Mobile Navigation Component
function MobileNav({ activeTab, setActiveTab, onLogout, user }) {
  const [showMenu, setShowMenu] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <>
      {/* Top Header */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FinanceFlow</h1>
                <p className="text-sm text-gray-500">Welcome, {user?.username}</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t z-50">
              <div className="py-4">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-r-4 border-purple-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
                <hr className="my-2" />
                <button
                  onClick={() => {
                    onLogout();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-6 py-4 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="grid grid-cols-4 py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-3 transition-all ${
                activeTab === tab.id
                  ? 'text-purple-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className={`w-6 h-6 mb-1 ${
                activeTab === tab.id ? 'scale-110' : ''
              } transition-transform`} />
              <span className={`text-xs font-medium ${
                activeTab === tab.id ? 'text-purple-600' : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// Dashboard Component
function Dashboard({ user, token, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [budgetOverview, setBudgetOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transRes, catRes, budgetRes, overviewRes] = await Promise.all([
        api.get('/transactions', token),
        api.get('/categories', token),
        api.get('/budgets', token),
        api.get('/budgets/overview', token)
      ]);

      console.log('API Responses:', { transRes, catRes, budgetRes, overviewRes });

      if (transRes.success) setTransactions(transRes.transactions || []);
      if (catRes.success) setCategories(catRes.categories || []);
      if (budgetRes.success) setBudgets(budgetRes.budgets || []);
      if (overviewRes.success) setBudgetOverview(overviewRes.overview);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pb-20">
      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
        user={user} 
      />

      <div className="px-4 py-6">
        {activeTab === 'overview' && (
          <OverviewTab 
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            netIncome={netIncome}
            transactions={transactions}
            budgetOverview={budgetOverview}
            onAddTransaction={() => setShowAddTransaction(true)}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsTab 
            transactions={transactions}
            categories={categories}
            onAddTransaction={() => setShowAddTransaction(true)}
            onDeleteTransaction={loadData}
            token={token}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetsTab 
            budgets={budgets}
            categories={categories}
            budgetOverview={budgetOverview}
            onAddBudget={() => setShowAddBudget(true)}
            onDeleteBudget={loadData}
            token={token}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab 
            transactions={transactions}
            categories={categories}
            budgets={budgets}
          />
        )}
      </div>

      {/* Modals */}
      {showAddTransaction && (
        <AddTransactionModal
          categories={categories}
          token={token}
          onClose={() => setShowAddTransaction(false)}
          onSuccess={() => {
            setShowAddTransaction(false);
            loadData();
          }}
        />
      )}

      {showAddBudget && (
        <AddBudgetModal
          categories={categories}
          token={token}
          onClose={() => setShowAddBudget(false)}
          onSuccess={() => {
            setShowAddBudget(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

// Main App Component
export default function PersonalFinanceApp() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  if (!user || !token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard user={user} token={token} onLogout={handleLogout} />;
}