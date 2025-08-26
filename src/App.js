
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Target, 
  Calendar, 
  PieChart, 
  BarChart3,
  Wallet,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Edit
} from 'lucide-react';

const API_BASE = 'https://finance-app-production-2458.up.railway.app/api';

const FinanceApp = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  });
  const [showAuth, setShowAuth] = useState(!token);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [budgetOverview, setBudgetOverview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auth form state
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Transaction form state
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    amount: '',
    description: '',
    type: 'expense',
    CategoryId: ''
  });

  // Budget form state
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    CategoryId: '',
    budgetAmount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch categories
      const categoriesRes = await fetch(`${API_BASE}/categories`, { headers });
      const categoriesData = await categoriesRes.json();
      if (categoriesData.success) {
        setCategories(categoriesData.categories);
      }

      // Fetch transactions
      const transactionsRes = await fetch(`${API_BASE}/transactions`, { headers });
      const transactionsData = await transactionsRes.json();
      if (transactionsData.success) {
        setTransactions(transactionsData.transactions);
      }

      // Fetch budget overview
      const budgetOverviewRes = await fetch(`${API_BASE}/budgets/overview`, { headers });
      const budgetOverviewData = await budgetOverviewRes.json();
      if (budgetOverviewData.success) {
        setBudgetOverview(budgetOverviewData.overview);
        setBudgets(budgetOverviewData.budgets || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const body = isLogin 
        ? { email: authForm.email, password: authForm.password }
        : authForm;

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        if (isLogin) {
          setToken(data.token);
          setUser(data.user);
          setShowAuth(false);
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('token', data.token);
          }
        } else {
          setIsLogin(true);
          setAuthForm({ username: '', email: '', password: '' });
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...transactionForm,
          amount: parseFloat(transactionForm.amount),
          CategoryId: transactionForm.CategoryId || null
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowTransactionForm(false);
        setTransactionForm({
          amount: '',
          description: '',
          type: 'expense',
          CategoryId: ''
        });
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Transaction error:', error);
      alert('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...budgetForm,
          budgetAmount: parseFloat(budgetForm.budgetAmount)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowBudgetForm(false);
        setBudgetForm({
          CategoryId: '',
          budgetAmount: '',
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        });
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Budget error:', error);
      alert('Failed to set budget');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRecentTransactions = () => {
    return transactions.slice(0, 5);
  };

  const getMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonth = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    const income = thisMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = thisMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expenses, net: income - expenses };
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Finance Tracker</h1>
            <p className="text-gray-600">Manage your money with ease</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const monthlyStats = getMonthlyStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                <Wallet className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Finance Tracker</h1>
                <p className="text-sm text-gray-500">Welcome back!</p>
              </div>
            </div>
            <button
              onClick={() => {
                setToken(null);
                setShowAuth(true);
                setUser(null);
                if (typeof window !== 'undefined' && window.localStorage) {
                  localStorage.removeItem('token');
                }
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'transactions', label: 'Transactions', icon: CreditCard },
              { id: 'budgets', label: 'Budgets', icon: Target },
              { id: 'analytics', label: 'Analytics', icon: PieChart }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(monthlyStats.income)}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <ArrowUpCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(monthlyStats.expenses)}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <ArrowDownCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Income</p>
                    <p className={`text-2xl font-bold ${monthlyStats.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(monthlyStats.net)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${monthlyStats.net >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <DollarSign className={`w-6 h-6 ${monthlyStats.net >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Overview */}
            {budgetOverview && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Budget</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(budgetOverview.totalBudget)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-xl font-bold text-red-600">{formatCurrency(budgetOverview.totalSpent)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(budgetOverview.remainingBudget)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Budget Used</p>
                    <p className="text-xl font-bold text-gray-900">{budgetOverview.budgetUsedPercentage}%</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${budgetOverview.budgetUsedPercentage > 100 ? 'bg-red-500' : budgetOverview.budgetUsedPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(budgetOverview.budgetUsedPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button
                  onClick={() => setShowTransactionForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Transaction</span>
                </button>
              </div>
              <div className="space-y-3">
                {getRecentTransactions().map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {transaction.type === 'income' ? 
                          <ArrowUpCircle className="w-4 h-4 text-green-600" /> : 
                          <ArrowDownCircle className="w-4 h-4 text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.Category?.name || 'No category'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No transactions yet. Add your first transaction!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
              <button
                onClick={() => setShowTransactionForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'income' ? 
                            <ArrowUpCircle className="w-5 h-5 text-green-600" /> : 
                            <ArrowDownCircle className="w-5 h-5 text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{transaction.Category?.name || 'No category'}</span>
                            <span>•</span>
                            <span>{formatDate(transaction.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center py-12">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No transactions yet</p>
                      <p className="text-sm text-gray-400">Add your first transaction to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Budgets</h2>
              <button
                onClick={() => setShowBudgetForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Set Budget</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => {
                const percentage = budget.budgetAmount > 0 ? (budget.spentAmount / budget.budgetAmount) * 100 : 0;
                const status = budget.status;
                
                return (
                  <div key={budget.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{budget.Category?.icon || '💰'}</span>
                        <h3 className="font-semibold text-gray-900">{budget.Category?.name}</h3>
                      </div>
                      <div className={`p-1 rounded-full ${
                        status === 'over' ? 'bg-red-100' : 
                        status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        {status === 'over' ? 
                          <AlertTriangle className="w-4 h-4 text-red-600" /> :
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        }
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Spent</span>
                        <span className="font-medium">{formatCurrency(budget.spentAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget</span>
                        <span className="font-medium">{formatCurrency(budget.budgetAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Remaining</span>
                        <span className={`font-medium ${budget.remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(budget.remainingAmount)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Math.round(percentage)}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            status === 'over' ? 'bg-red-500' : 
                            status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {budgets.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No budgets set yet</p>
                  <p className="text-sm text-gray-400">Create your first budget to track spending</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
                <div className="space-y-3">
                  {categories.filter(c => c.type === 'expense').map((category) => {
                    const categoryTransactions = transactions.filter(t => 
                      t.CategoryId === category.id && t.type === 'expense'
                    );
                    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                    const percentage = transactions.length > 0 ? 
                      (total / transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)) * 100 : 0;
                    
                    if (total === 0) return null;
                    
                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{category.icon || '💰'}</span>
                          <span className="text-gray-900">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(total)}</p>
                          <p className="text-sm text-gray-500">{Math.round(percentage)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ArrowUpCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800">Total Income</span>
                    </div>
                    <span className="font-semibold text-green-600">{formatCurrency(monthlyStats.income)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ArrowDownCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-800">Total Expenses</span>
                    </div>
                    <span className="font-semibold text-red-600">{formatCurrency(monthlyStats.expenses)}</span>
                  </div>

                  <div className={`flex justify-between items-center p-3 rounded-lg ${monthlyStats.net >= 0 ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                    <div className="flex items-center space-x-3">
                      <DollarSign className={`w-5 h-5 ${monthlyStats.net >= 0 ? 'text-blue-600' : 'text-yellow-600'}`} />
                      <span className={`${monthlyStats.net >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>Net Income</span>
                    </div>
                    <span className={`font-semibold ${monthlyStats.net >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {formatCurrency(monthlyStats.net)}
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Transaction Count</p>
                    <div className="flex justify-between text-sm">
                      <span>Income: {transactions.filter(t => t.type === 'income').length}</span>
                      <span>Expenses: {transactions.filter(t => t.type === 'expense').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget vs Actual */}
            {budgets.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Actual Spending</h3>
                <div className="space-y-4">
                  {budgets.map((budget) => (
                    <div key={budget.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{budget.Category?.name}</span>
                        <span className="text-sm text-gray-500">{budget.percentageUsed}% used</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Budgeted</p>
                          <p className="font-medium">{formatCurrency(budget.budgetAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Actual</p>
                          <p className={`font-medium ${budget.spentAmount > budget.budgetAmount ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(budget.spentAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${budget.status === 'over' ? 'bg-red-500' : budget.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Transaction</h3>
              <button
                onClick={() => setShowTransactionForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Transaction description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={transactionForm.type}
                  onChange={(e) => setTransactionForm({...transactionForm, type: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={transactionForm.CategoryId}
                  onChange={(e) => setTransactionForm({...transactionForm, CategoryId: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No category</option>
                  {categories
                    .filter(cat => cat.type === transactionForm.type)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTransactionForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Set Budget</h3>
              <button
                onClick={() => setShowBudgetForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSetBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={budgetForm.CategoryId}
                  onChange={(e) => setBudgetForm({...budgetForm, CategoryId: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories
                    .filter(cat => cat.type === 'expense')
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={budgetForm.budgetAmount}
                  onChange={(e) => setBudgetForm({...budgetForm, budgetAmount: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select
                    value={budgetForm.month}
                    onChange={(e) => setBudgetForm({...budgetForm, month: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={budgetForm.year}
                    onChange={(e) => setBudgetForm({...budgetForm, year: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({length: 3}, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>{year}</option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBudgetForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Setting...' : 'Set Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceApp; 
  return(
    <div>
        <h3> Summary </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                      <ArrowUpCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800">Total Income</span>
                    </div>
                    <span className="font-semibold text-green-600">{formatCurrency(monthlyStats.income)}</span>
                  </div>
                  </div>
    </div>
      
    
  )
              