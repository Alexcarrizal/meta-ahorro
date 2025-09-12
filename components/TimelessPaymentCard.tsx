import React, { useState, useRef, useEffect } from 'react';
import { TimelessPayment } from '../types.ts';
import { TrendingUpIcon, DotsVerticalIcon, TrashIcon, CheckCircle2Icon } from './icons.tsx';

interface TimelessPaymentCardProps {
  payment: TimelessPayment;
  onEdit: (payment: TimelessPayment) => void;
  onDelete: (id: string) => void;
  onContribute: (payment: TimelessPayment) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

const getPaymentColorStyles = (color: string) => {
    const colorMap: { [key: string]: { [key: string]: string } } = {
        lime: {
            border: 'border-lime-200 dark:border-lime-800/40 hover:border-lime-400 dark:hover:border-lime-500/50',
            iconText: 'text-lime-600 dark:text-lime-400',
            progressBar: 'bg-lime-500',
            contributeButton: 'bg-lime-500 hover:bg-lime-400 text-black',
        },
        fuchsia: {
            border: 'border-fuchsia-200 dark:border-fuchsia-800/40 hover:border-fuchsia-400 dark:hover:border-fuchsia-500/50',
            iconText: 'text-fuchsia-600 dark:text-fuchsia-400',
            progressBar: 'bg-fuchsia-500',
            contributeButton: 'bg-fuchsia-500 hover:bg-fuchsia-400 text-white',
        },
        teal: {
            border: 'border-teal-200 dark:border-teal-800/40 hover:border-teal-400 dark:hover:border-teal-500/50',
            iconText: 'text-teal-600 dark:text-teal-400',
            progressBar: 'bg-teal-500',
            contributeButton: 'bg-teal-500 hover:bg-teal-400 text-white',
        },
        cyan: {
            border: 'border-cyan-200 dark:border-cyan-800/40 hover:border-cyan-400 dark:hover:border-cyan-500/50',
            iconText: 'text-cyan-600 dark:text-cyan-400',
            progressBar: 'bg-cyan-500',
            contributeButton: 'bg-cyan-500 hover:bg-cyan-400 text-black',
        },
        blue: {
            border: 'border-blue-200 dark:border-blue-800/40 hover:border-blue-400 dark:hover:border-blue-500/50',
            iconText: 'text-blue-600 dark:text-blue-400',
            progressBar: 'bg-blue-500',
            contributeButton: 'bg-blue-500 hover:bg-blue-400 text-white',
        },
        pink: {
            border: 'border-pink-200 dark:border-pink-800/40 hover:border-pink-400 dark:hover:border-pink-500/50',
            iconText: 'text-pink-600 dark:text-pink-400',
            progressBar: 'bg-pink-500',
            contributeButton: 'bg-pink-500 hover:bg-pink-400 text-white',
        },
    };
    return colorMap[color] || colorMap.cyan;
};

const TimelessPaymentCard = ({ payment, onEdit, onDelete, onContribute }: TimelessPaymentCardProps) => {
  const { id, name, totalAmount, paidAmount, isCompleted, color, createdAt } = payment;
  const progress = totalAmount > 0 ? Math.min((paidAmount / totalAmount) * 100, 100) : 0;
  const remainingAmount = Math.max(0, totalAmount - paidAmount);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const styles = getPaymentColorStyles(color);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const createdDate = new Date(createdAt).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={`bg-white dark:bg-gray-800/50 border rounded-xl p-6 flex flex-col justify-between transition-all duration-300 ${isCompleted ? 'border-gray-300 dark:border-gray-700 opacity-70' : styles.border}`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <TrendingUpIcon className={`w-6 h-6 ${isCompleted ? 'text-gray-500' : styles.iconText}`} />
            </div>
            <div>
              <h3 className={`text-xl font-bold text-gray-900 dark:text-white ${isCompleted ? 'line-through' : ''}`}>{name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!isMenuOpen)} className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white p-1 rounded-full transition-colors">
              <DotsVerticalIcon className="w-5 h-5" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                {!isCompleted && <button onClick={() => { onEdit(payment); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-t-md">Editar</button>}
                <button onClick={() => { onDelete(id); setMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer ${isCompleted ? 'rounded-md' : 'rounded-b-md'}`}>Eliminar</button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>{formatCurrency(paidAmount)}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`${isCompleted ? 'bg-green-500' : styles.progressBar} h-2.5 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
            Restante: {formatCurrency(remainingAmount)}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        {isCompleted ? (
          <div className="text-center py-2 px-6 rounded-lg text-sm bg-green-500/20 text-green-700 dark:bg-green-500/20 dark:text-green-300 font-semibold flex items-center justify-center gap-2">
            <CheckCircle2Icon className="w-5 h-5"/> ¡Liquidado!
          </div>
        ) : (
          <button onClick={() => onContribute(payment)} className={`w-full text-center font-bold py-2 px-4 rounded-lg transition-colors ${styles.contributeButton}`}>
            Abonar
          </button>
        )}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">Creado: {createdDate}</p>
      </div>
    </div>
  );
};

export default TimelessPaymentCard;
