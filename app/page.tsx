'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')

  useEffect(() => {
    const stored = localStorage.getItem('expenses')
    if (stored) {
      setExpenses(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0]
    }

    setExpenses([newExpense, ...expenses])
    setDescription('')
    setAmount('')
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Expense Tracker</h1>
      </header>

      <div className={styles.summary}>
        <div className={styles.totalCard}>
          <div className={styles.totalLabel}>Total Expenses</div>
          <div className={styles.totalAmount}>${total.toFixed(2)}</div>
        </div>

        {Object.keys(categoryTotals).length > 0 && (
          <div className={styles.categoryCards}>
            {Object.entries(categoryTotals).map(([cat, amt]) => (
              <div key={cat} className={styles.categoryCard}>
                <div className={styles.categoryName}>{cat}</div>
                <div className={styles.categoryAmount}>${amt.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form className={styles.form} onSubmit={addExpense}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.input}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.input}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.select}
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Bills</option>
          <option>Other</option>
        </select>
        <button type="submit" className={styles.button}>Add Expense</button>
      </form>

      <div className={styles.expenses}>
        {expenses.map((expense) => (
          <div key={expense.id} className={styles.expense}>
            <div className={styles.expenseMain}>
              <div className={styles.expenseDesc}>{expense.description}</div>
              <div className={styles.expenseAmount}>${expense.amount.toFixed(2)}</div>
            </div>
            <div className={styles.expenseMeta}>
              <span className={styles.expenseCategory}>{expense.category}</span>
              <span className={styles.expenseDate}>{expense.date}</span>
              <button
                onClick={() => deleteExpense(expense.id)}
                className={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {expenses.length === 0 && (
          <div className={styles.empty}>No expenses yet. Add your first expense above!</div>
        )}
      </div>
    </div>
  )
}
