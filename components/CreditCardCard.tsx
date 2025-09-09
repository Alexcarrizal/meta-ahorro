import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CreditCard } from '../types.ts';
import { DotsVerticalIcon, TrashIcon, CreditCardIcon, RefreshCwIcon } from './icons.tsx';

interface CreditCardCardProps {
    card: CreditCard;
    onEdit: (card: CreditCard) => void;
    onDelete: (id: string) => void;
    onUpdateBalance: (card: CreditCard) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(amount);
};

const getCardColorStyles = (color: string) => {
    const colorMap: { [key: string]: { [key: string]: string } } = {
        purple: { bg: 'bg-purple-600', text: 'text-purple-300', progress: 'bg-purple-400', button: 'bg-purple-500 hover:bg-purple-600 text-white' },
        teal: { bg: 'bg-teal-600', text: 'text-teal-300', progress: 'bg-teal-400', button: 'bg-teal-500 hover:bg-teal-600 text-white' },
        rose: { bg: 'bg-rose-600', text: 'text-rose-300', progress: 'bg-rose-400', button: 'bg-rose-500 hover:bg-rose-600 text-white' },
        fuchsia: { bg: 'bg-fuchsia-600', text: 'text-fuchsia-300', progress: 'bg-fuchsia-400', button: 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white' },
        indigo: { bg: 'bg-indigo-600', text: 'text-indigo-300', progress: 'bg-indigo-400', button: 'bg-indigo-500 hover:bg-indigo-600 text-white' },
        sky: { bg: 'bg-sky-600', text: 'text-sky-300', progress: 'bg-sky-400', button: 'bg-sky-500 hover:bg-sky-600 text-white' },
    };
    return colorMap[color] || colorMap.purple;
};

const CreditCardCard = ({ card, onEdit, onDelete, onUpdateBalance }: CreditCardCardProps) => {
    const { id, name, creditLimit, currentBalance, cutOffDay, paymentDueDateDay, color } = card;
    const availableCredit = creditLimit - currentBalance;
    const usagePercentage = creditLimit > 0 ? (currentBalance / creditLimit) * 100 : 0;
    
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const styles = getCardColorStyles(color);
    const isPaid = currentBalance === 0;

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
    
    const { nextCutOffDate, nextPaymentDueDate } = useMemo(() => {
        const today = new Date();
        const currentDay = today.getDate();
        
        // Next Cut-off Date
        let cutOffMonth = today.getMonth();
        if (currentDay > cutOffDay) {
            cutOffMonth += 1;
        }
        const nextCutOff = new Date(today.getFullYear(), cutOffMonth, cutOffDay);

        // Next Payment Due Date
        let paymentDueMonth = today.getMonth();
        if (currentDay > paymentDueDateDay) {
            paymentDueMonth += 1;
        }
        const nextPaymentDue = new Date(today.getFullYear(), paymentDueMonth, paymentDueDateDay);

        const formatDate = (date: Date) => date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });

        return { nextCutOffDate: formatDate(nextCutOff), nextPaymentDueDate: formatDate(nextPaymentDue) };
    }, [cutOffDay, paymentDueDateDay]);


    return (
        <div className={`rounded-xl p-6 flex flex-col justify-between transition-all duration-300 text-white shadow-lg ${styles.bg} bg-gradient-to-br from-gray-900 to-gray-800 ${isPaid ? 'opacity-50 grayscale-[50%]' : ''}`}>
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <CreditCardIcon className="w-8 h-8"/>
                        <h3 className="text-xl font-bold">{name}</h3>
                    </div>
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white p-1 rounded-full transition-colors">
                            <DotsVerticalIcon className="w-5 h-5" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                                <button onClick={() => { onEdit(card); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer rounded-t-md">Editar Tarjeta</button>
                                <button onClick={() => { onDelete(id); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 cursor-pointer rounded-b-md">Eliminar Tarjeta</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="my-6">
                    <p className="text-sm text-gray-400">Crédito Disponible</p>
                    <p className="text-4xl font-bold tracking-tight">{formatCurrency(availableCredit)}</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Saldo: {formatCurrency(currentBalance)} de {formatCurrency(creditLimit)}
                    </p>
                </div>

                <div className="mb-6">
                    <div className="w-full bg-black/30 rounded-full h-2">
                        <div className={`${styles.progress} h-2 rounded-full`} style={{ width: `${usagePercentage}%` }}></div>
                    </div>
                     <p className="text-right text-xs text-gray-300 mt-1">{usagePercentage.toFixed(1)}% Usado</p>
                </div>
                
                 <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div className="bg-white/10 p-3 rounded-lg">
                        <p className="font-bold text-gray-300">Próximo Corte</p>
                        <p className="font-semibold text-white">{nextCutOffDate}</p>
                    </div>
                     <div className="bg-white/10 p-3 rounded-lg">
                        <p className="font-bold text-gray-300">Límite de Pago</p>
                        <p className="font-semibold text-white">{nextPaymentDueDate}</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <button onClick={() => onUpdateBalance(card)} className={`w-full flex items-center justify-center gap-2 text-center font-bold py-3 px-4 rounded-lg transition-colors ${styles.button}`}>
                    <RefreshCwIcon className="w-5 h-5"/>
                    Actualizar Saldo
                </button>
            </div>
        </div>
    );
};

export default CreditCardCard;