// src/context/TransactionContext.tsx
import React, { createContext, useState, useCallback, useMemo, useContext, ReactNode } from 'react';
import { Transaction } from '@/src/models/Transaction'; // Importe seu modelo

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (title: string, value: number, date: Date) => void;
  removeTransaction: (id: string) => void;
  recentTransactions: Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Dados iniciais (os mesmos que estavam em HomeScreen)
    { id: 't0', title: 'Conta de Luz', value: 120.50, date: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { id: 't1', title: 'Supermercado', value: 350.75, date: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: 't2', title: 'Aluguel', value: 1200.00, date: new Date() },
  ]);

  const addTransaction = useCallback((title: string, value: number, date: Date) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(),
      title,
      value,
      date,
    };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions].sort((a,b) => b.date.getTime() - a.date.getTime()));
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setTransactions(prevTransactions =>
      prevTransactions.filter(tr => tr.id !== id)
    );
  }, []);

  const recentTransactions = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return transactions.filter(tr => tr.date >= sevenDaysAgo); // >= para incluir transações de 7 dias atrás
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, removeTransaction, recentTransactions }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};