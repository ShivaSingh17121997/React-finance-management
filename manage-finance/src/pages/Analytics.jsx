import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function Analytics() {
  const [filter, setFilter] = useState("Monthly");
  const [transactions, setTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) {
      const parsed = JSON.parse(saved).filter(
        (t) => t.amount && !isNaN(t.amount) && t.date
      );
      setTransactions(parsed);
    }
  }, []);

  // Group data for Bar chart
  const groupData = (transactions) => {
    const grouped = {};
    transactions.forEach((t) => {
      const amount = Number(t.amount);
      if (!amount || !t.date) return;

      const date = new Date(t.date);
      let key;
      switch (filter) {
        case "Daily":
          key = t.date;
          break;
        case "Weekly":
          key = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
          break;
        case "Monthly":
          key = date.toLocaleString("default", { month: "short" });
          break;
        case "Yearly":
          key = date.getFullYear();
          break;
        default:
          key = t.date;
      }

      if (!grouped[key]) grouped[key] = { income: 0, expense: 0 };
      if (t.type === "income") grouped[key].income += amount;
      else grouped[key].expense += amount;
    });

    return Object.entries(grouped).map(([key, val]) => ({
      name: key,
      income: val.income,
      expense: val.expense,
    }));
  };

  // Expense by category
  const categoryData = () => {
    const grouped = {};
    transactions.forEach((t) => {
      const amount = Number(t.amount);
      if (t.type === "expense" && amount) {
        if (!grouped[t.category]) grouped[t.category] = 0;
        grouped[t.category] += amount;
      }
    });

    const totalExpense = Object.values(grouped).reduce((a, b) => a + b, 0);
    if (!totalExpense) return [];

    return Object.entries(grouped).map(([key, val]) => ({
      name: key,
      value: val,
      percent: ((val / totalExpense) * 100).toFixed(1),
    }));
  };

  // Line chart for selected category
  const lineData = () => {
    if (!selectedCategory) return [];

    const filtered = transactions.filter((t) => {
      if (!t.amount || isNaN(t.amount) || !t.date) return false;
      if (t.category !== selectedCategory) return false;
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    if (!filtered.length) return [];

    const daily = {};
    filtered.forEach((t) => {
      const d = new Date(t.date);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const key = `${yyyy}-${mm}-${dd}`;
      if (!daily[key]) daily[key] = { income: 0, expense: 0 };
      const amount = Number(t.amount);
      if (t.type === "income") daily[key].income += amount;
      else if (t.type === "expense") daily[key].expense += amount;
    });

    return Object.entries(daily)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, vals]) => ({ date, income: vals.income, expense: vals.expense }));
  };

  const chartData = groupData(transactions);
  const expenseData = categoryData();
  const lineChartData = lineData();

  // Handle category click
  const handleCategoryClick = (cat) => {
    if (selectedCategory === cat) {
      setSelectedCategory(null);
      setIsModalOpen(false);
    } else {
      setSelectedCategory(cat);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="w-full p-6 min-h-screen bg-gray-50 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500 text-sm">
          View trends, income vs expenses, and category breakdowns.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4">
        {["Daily", "Weekly", "Monthly", "Yearly"].map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === f
                ? "bg-indigo-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Income vs Expense Chart */}
      {chartData.length > 0 && (
        <div className="shadow-md bg-white rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Income vs Expense ({filter})
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip contentStyle={{ fontSize: "12px" }} cursor={{ fill: "#f1f5f9" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="income" fill="#34d399" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Expense List */}
      {expenseData.length > 0 && (
        <div className="shadow-md bg-white rounded-2xl p-5 md:w-1/2">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Expense by Category</h2>
          <ul className="divide-y divide-gray-200">
            {expenseData.map((cat, idx) => (
              <li
                key={idx}
                className="flex justify-between py-2 px-3 cursor-pointer hover:bg-gray-100 rounded-md"
                onClick={() => handleCategoryClick(cat.name)}
              >
                <span>{cat.name}</span>
                <span>
                  ₹{cat.value} ({cat.percent}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal for Line Chart */}
      {isModalOpen && selectedCategory && lineChartData.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-5 w-11/12 md:w-2/3 relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              {selectedCategory} - Income & Expenses
            </h2>
            <div className="flex gap-3 mb-4 items-center">
              <label className="text-sm text-gray-600">Month</label>
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
              <label className="text-sm text-gray-600">Year</label>
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {Array.from(
                  new Set(
                    transactions
                      .map((t) => (t.date ? new Date(t.date).getFullYear() : null))
                      .filter((y) => y)
                  )
                )
                  .sort((a, b) => a - b)
                  .map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                {!transactions.length && (
                  <option value={selectedYear}>{selectedYear}</option>
                )}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip contentStyle={{ fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#34d399" strokeWidth={2} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
