import React, { useState, useEffect } from "react";
import { PlusCircle, ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { toast } from "react-toastify";

export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        type: "income", // income or expense
        date: new Date().toISOString().split("T")[0], // default today
        category: "Other",
        payment: "UPI",
        description: "",
        amount: "",
    });

    const categories = [
        { label: "Food 🍔", value: "Food" },
        { label: "Social Life 🎉", value: "Social Life" },
        { label: "Pets 🐶", value: "Pets" },
        { label: "Transport 🚗", value: "Transport" },
        { label: "Culture 🎭", value: "Culture" },
        { label: "Household 🏠", value: "Household" },
        { label: "Apparel 👗", value: "Apparel" },
        { label: "Beauty & Health 💅🩺", value: "Beauty & Health" },
        { label: "Education 🎓", value: "Education" },
        { label: "Gift 🎁", value: "Gift" },
        { label: "Other 🛒", value: "Other" },
    ];

    const payments = ["UPI", "Card", "Cash", "Lend"];

    useEffect(() => {
        const saved = localStorage.getItem("transactions");
        if (saved) setTransactions(JSON.parse(saved));
    }, []);

    const handleAddTransaction = () => {
        if (!newTransaction.description || !newTransaction.amount) return;
        toast.success("Transaction added successfully")
        const updated = [
            { ...newTransaction, id: Date.now(), amount: parseFloat(newTransaction.amount) },
            ...transactions,
        ];
        setTransactions(updated);
        localStorage.setItem("transactions", JSON.stringify(updated));
        setNewTransaction({
            type: "income",
            date: new Date().toISOString().split("T")[0],
            category: "Other",
            payment: "UPI",
            description: "",
            amount: "",
        });
        setShowModal(false);
    };

    // Derived metrics from transactions (dynamic)
    const formatINR = (value) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
            isNaN(value) ? 0 : value
        );

    const parsedTransactions = transactions.map((t) => ({
        ...t,
        amount: typeof t.amount === "number" ? t.amount : parseFloat(t.amount) || 0,
    }));

    const now = new Date();
    const isSameMonth = (d1, d2) => d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    const incomeAllTime = parsedTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const expenseAllTime = parsedTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const thisMonth = parsedTransactions.filter((t) => {
        const d = new Date(t.date);
        return isSameMonth(d, now);
    });
    const incomeThisMonth = thisMonth.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expenseThisMonth = thisMonth.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

    const summary = [
        { title: "Income (This Month)", value: formatINR(incomeThisMonth) },
        { title: "Total Balance", value: formatINR(incomeAllTime - expenseAllTime) },
        { title: "Expenses (This Month)", value: formatINR(expenseThisMonth) },
        { title: "Budget Remaining", value: formatINR(incomeThisMonth - expenseThisMonth) },
    ];

    //expense breakdown  by category
    const expenseByCategoryMap = thisMonth
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});
    const expenseData = Object.keys(expenseByCategoryMap).length
        ? Object.entries(expenseByCategoryMap).map(([name, value]) => ({ name, value }))
        : [{ name: "No Data", value: 0 }];

    // Income vs Expense trend (graph
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const getMonthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;
    const lastSix = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });
    const groupedByMonth = parsedTransactions.reduce((acc, t) => {
        const d = new Date(t.date);
        const key = getMonthKey(new Date(d.getFullYear(), d.getMonth(), 1));
        if (!acc[key]) acc[key] = { income: 0, expense: 0, month: monthLabels[d.getMonth()] };
        acc[key][t.type] += t.amount;
        return acc;
    }, {});
    const trendData = lastSix.map((d) => {
        const key = getMonthKey(d);
        const entry = groupedByMonth[key] || { income: 0, expense: 0, month: monthLabels[d.getMonth()] };
        return { month: entry.month, income: entry.income, expense: entry.expense };
    });

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
    const cardGradients = [
        "from-indigo-500 to-sky-500",
        "from-emerald-500 to-lime-500",
        "from-rose-500 to-orange-500",
        "from-fuchsia-500 to-purple-500",
    ];

    return (
        <div className="w-full px-4 md:px-6 flex flex-col gap-6 min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">
            {/*  Add Transaction Button */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Header */}

                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500 text-sm">Track balance, spending, and trends at a glance.</p>
                </div>

                <div className="flex justify-end w-full md:w-auto">
                    <button
                        className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-indigo-600 active:scale-[0.98] transition"
                        onClick={() => setShowModal(true)}
                    >
                        <PlusCircle size={16} /> Add Transaction
                    </button>
                </div>



            </div>


            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {summary.map((item, index) => (
                    <div
                        key={index}
                        className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-xl bg-gradient-to-br ${cardGradients[index % cardGradients.length]}`}
                    >
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_0%,white,transparent_20%)]" />
                        <div className="relative z-10 flex flex-col">
                            <p className="text-white/80 text-xs mb-1">{item.title}</p>
                            <h2 className="text-2xl font-extrabold drop-shadow-sm">{item.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Transactions */}
            <div className="shadow-lg bg-white/80 backdrop-blur rounded-2xl p-5 border border-white/60 max-h-[60vh] md:max-h-[50vh] overflow-y-auto">
                <h2 className="text-base font-semibold mb-4 text-slate-800">Recent Transactions</h2>
                <div className="divide-y divide-slate-100">
                    {transactions.map((t) => (
                        <div
                            key={t.id}
                            className="flex items-center justify-between py-3 rounded-lg px-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-9 w-9 rounded-full flex items-center justify-center text-white shadow ${t.type === "income" ? "bg-emerald-500" : "bg-rose-500"
                                        }`}
                                >
                                    {t.type === "income" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">{t.description} ({t.category})</span>
                                    <span className="text-xs text-slate-500">
                                        {t.type === "income" ? "Incoming" : "Outgoing"} • {t.date} • {t.payment}
                                    </span>
                                </div>
                            </div>
                            <span
                                className={`${t.type === "income" ? "text-emerald-600" : "text-rose-600"
                                    } font-semibold`}
                            >
                                {t.type === "income" ? "+₹" + t.amount : "-₹" + t.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>



            {/* Charts Section */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Expense Breakdown */}
                <div className="w-full md:w-1/3 shadow-lg bg-white/80 backdrop-blur rounded-2xl p-5 border border-white/60">
                    <h2 className="text-base font-semibold mb-3 text-slate-800">Expense Breakdown</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <defs>
                                {COLORS.map((color, i) => (
                                    <linearGradient id={`pieGrad-${i}`} key={i} x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <Pie
                                data={expenseData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={55}
                                outerRadius={100}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {expenseData.map((_, index) => (
                                    <Cell key={index} fill={`url(#pieGrad-${index % COLORS.length})`} />
                                ))}
                            </Pie>
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                            <Tooltip contentStyle={{ fontSize: "12px" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>



                {/* Income vs Expense Chart */}
                <div className="w-full md:w-2/3 shadow-lg bg-white/80 backdrop-blur rounded-2xl p-5 border border-white/60">
                    <h2 className="text-base font-semibold mb-3 text-slate-800">Income vs Expense</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={trendData}>
                            <defs>
                                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.95} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                                </linearGradient>
                                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#fb7185" stopOpacity={0.95} />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                            <Tooltip contentStyle={{ fontSize: "12px" }} cursor={{ fill: "#f1f5f9" }} />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                            <Bar dataKey="income" fill="url(#incomeGrad)" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="expense" fill="url(#expenseGrad)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>


            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative">
                        <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
                        <div className="flex flex-col gap-3">
                            {/* Type Selector */}
                            <div className="flex gap-4 mb-2">
                                <button
                                    className={`flex-1 py-2 rounded-lg ${newTransaction.type === "income" ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                    onClick={() => setNewTransaction({ ...newTransaction, type: "income" })}
                                >
                                    Income
                                </button>
                                <button
                                    className={`flex-1 py-2 rounded-lg ${newTransaction.type === "expense" ? "bg-rose-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                    onClick={() => setNewTransaction({ ...newTransaction, type: "expense" })}
                                >
                                    Expense
                                </button>
                            </div>

                            {/* Date */}
                            <input
                                type="date"
                                value={newTransaction.date}
                                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                className="border rounded-md px-3 py-2"
                            />

                            {/* Category */}
                            <select
                                value={newTransaction.category}
                                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                className="border rounded-md px-3 py-2"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>

                            {/* Payment Method */}
                            <select
                                value={newTransaction.payment}
                                onChange={(e) => setNewTransaction({ ...newTransaction, payment: e.target.value })}
                                className="border rounded-md px-3 py-2"
                            >
                                {payments.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>

                            {/* Description */}
                            <input
                                type="text"
                                placeholder="Description"
                                value={newTransaction.description}
                                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                className="border rounded-md px-3 py-2"
                            />

                            {/* Amount */}
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newTransaction.amount}
                                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                className="border rounded-md px-3 py-2"
                            />

                            {/* Buttons */}
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
                                    onClick={handleAddTransaction}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
