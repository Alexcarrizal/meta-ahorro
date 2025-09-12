import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { SavingsGoal, Payment, Priority, Frequency, WishlistItem, CreditCard, TimelessPayment, TimelessPaymentContribution } from './types.ts';
import { GoalModal, ProjectionModal, PaymentModal, ContributionModal, PaymentContributionModal, ConfirmationModal, SettingsModal, ChangePinModal, DayActionModal, WishlistModal, CreditCardModal, UpdateBalanceModal, PaymentCompletedModal, TimelessPaymentModal, TimelessPaymentContributionModal } from './components/modals.tsx';
import GoalCard from './components/GoalCard.tsx';
import PaymentCard from './components/PaymentCard.tsx';
import WishlistCard from './components/WishlistCard.tsx';
import CreditCardCard from './components/CreditCardCard.tsx';
import TimelessPaymentCard from './components/TimelessPaymentCard.tsx';
import CalendarView from './components/CalendarView.tsx';
import { LayoutDashboardIcon, LaptopIcon, WalletIcon, PlusIcon, CogIcon, CalendarIcon, ClipboardListIcon, AlertTriangleIcon, HistoryIcon, CheckCircle2Icon, ListTodoIcon, PiggyBankIcon, TrendingUpIcon, CreditCardIcon } from './components/icons.tsx';
import { AuthScreen } from './components/Auth.tsx';
import { DashboardPaymentItem } from './components/DashboardPaymentItem.tsx';

const GOAL_COLORS = ['rose', 'sky', 'amber', 'emerald', 'indigo', 'purple'];
const PAYMENT_COLORS = ['teal', 'cyan', 'blue', 'lime', 'fuchsia', 'pink'];
const CARD_COLORS = ['purple', 'teal', 'rose', 'fuchsia', 'indigo', 'sky'];
const TIMELESS_COLORS = ['cyan', 'lime', 'teal', 'blue', 'fuchsia', 'pink'];

const sampleGoals: SavingsGoal[] = [
    {
        id: 'sample-goal-1',
        name: 'Nueva Laptop Pro',
        targetAmount: 45000,
        savedAmount: 38000,
        category: 'Tecnología',
        priority: Priority.High,
        color: 'emerald',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    },
    {
        id: 'sample-goal-2',
        name: 'Vacaciones en la playa',
        targetAmount: 25000,
        savedAmount: 7500,
        category: 'Viajes',
        priority: Priority.Medium,
        color: 'sky',
        projection: {
            amount: 1500,
            frequency: Frequency.BiWeekly,
            targetDate: new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0], // 90 days from now
        },
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
    },
    {
        id: 'sample-goal-3',
        name: 'Renovar el celular',
        targetAmount: 18000,
        savedAmount: 18000,
        category: 'Tecnología',
        priority: Priority.Low,
        color: 'amber',
        createdAt: new Date(Date.now() - 86400000 * 60).toISOString(), // 60 days ago
    },
];

const samplePayments: Payment[] = [
    {
        id: 'sample-payment-1',
        name: 'Pago Tarjeta de Crédito',
        amount: 5200,
        paidAmount: 1000,
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 days from now
        category: 'Finanzas',
        frequency: Frequency.Monthly,
        color: 'fuchsia',
    },
    {
        id: 'sample-payment-2',
        name: 'Suscripción a Streaming',
        amount: 299,
        paidAmount: 0,
        dueDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago (overdue)
        category: 'Entretenimiento',
        frequency: Frequency.Monthly,
        color: 'teal',
    },
    {
        id: 'sample-payment-3',
        name: 'Plan de Celular',
        amount: 450,
        paidAmount: 450,
        dueDate: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0], // 15 days ago (paid)
        category: 'Servicios',
        frequency: Frequency.OneTime, // Marked as one time because it's paid
        color: 'pink',
    },
     {
        id: 'sample-payment-4',
        name: 'Didi Card',
        amount: 698.61,
        paidAmount: 0,
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        category: 'Transporte',
        frequency: Frequency.Monthly,
        color: 'lime',
    },
];

const sampleWishlist: WishlistItem[] = [
    {
        id: 'sample-wish-1',
        name: 'Silla de Oficina Ergonómica',
        category: 'Hogar',
        priority: Priority.Medium,
        estimatedAmount: 6000,
        url: 'https://www.hermanmiller.com/products/seating/office-chairs/aeron-chairs/',
        distributor: 'Herman Miller',
    },
    {
        id: 'sample-wish-2',
        name: 'Curso de Desarrollo Web',
        category: 'Educación',
        priority: Priority.High,
        estimatedAmount: 3500,
        distributor: 'Udemy',
    },
];

const sampleCreditCards: CreditCard[] = [
    {
        id: 'sample-card-1',
        name: 'BBVA Azul',
        creditLimit: 50000,
        currentBalance: 12500,
        cutOffDay: 25,
        paymentDueDateDay: 15,
        color: 'purple'
    },
    {
        id: 'sample-card-2',
        name: 'Santander Free',
        creditLimit: 25000,
        currentBalance: 2300,
        cutOffDay: 1,
        paymentDueDateDay: 21,
        color: 'rose'
    }
];

const sampleTimelessPayments: TimelessPayment[] = [
    {
        id: 'sample-timeless-1',
        name: 'Préstamo a Juan',
        totalAmount: 5000,
        paidAmount: 1500,
        isCompleted: false,
        color: 'cyan',
        createdAt: new Date().toISOString(),
        contributions: [
            { id: crypto.randomUUID(), amount: 1000, date: new Date(Date.now() - 86400000 * 10).toISOString() },
            { id: crypto.randomUUID(), amount: 500, date: new Date(Date.now() - 86400000 * 2).toISOString() }
        ]
    },
    {
        id: 'sample-timeless-2',
        name: 'Fondo de Ahorro Oficina',
        totalAmount: 2400,
        paidAmount: 2400,
        isCompleted: true,
        color: 'lime',
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        contributions: [
             { id: crypto.randomUUID(), amount: 2400, date: new Date(Date.now() - 86400000 * 5).toISOString() }
        ]
    }
];

function getInitialData<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if(stored) {
        return JSON.parse(stored);
    }
    // Only set fallback data if no key exists (first time use)
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return fallback;
  }
}

const getInitialTheme = (): 'light' | 'dark' => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialPin = (): string | null => {
    return localStorage.getItem('app_pin');
};

type ActiveTab = 'dashboard' | 'goals' | 'payments' | 'timeless' | 'cards' | 'wishlist' | 'calendar';
type ItemToDelete = { id: string; type: 'goal' | 'payment' | 'wishlist' | 'card' | 'timeless' } | null;
type PaymentFilter = 'all_unpaid' | 'urgent' | 'overdue' | 'paid';
type TimelessPaymentFilter = 'active' | 'completed';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

const App = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [pin, setPin] = useState<string | null>(getInitialPin);
  const [isLocked, setLocked] = useState<boolean>(!!getInitialPin());
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [goals, setGoals] = useState<SavingsGoal[]>(() => getInitialData('goals_data', sampleGoals));
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => getInitialData('wishlist_data', sampleWishlist));
  const [creditCards, setCreditCards] = useState<CreditCard[]>(() => getInitialData('credit_cards_data', sampleCreditCards));
  const [timelessPayments, setTimelessPayments] = useState<TimelessPayment[]>(() => getInitialData('timeless_payments_data', sampleTimelessPayments));
  const [payments, setPayments] = useState<Payment[]>(() => {
    const initialData = getInitialData('payments_data', samplePayments) as any[];
    // Perform one-time migration for items in the old format
    return initialData.map(p => {
        if (p.isPaid !== undefined) { // Old format detected
            const { isPaid, ...rest } = p;
            return {
                ...rest,
                paidAmount: isPaid ? p.amount : (p.paidAmount || 0),
            };
        }
        if (p.paidAmount === undefined) {
          p.paidAmount = 0;
        }
        return p;
    });
  });
  
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all_unpaid');
  const [timelessFilter, setTimelessFilter] = useState<TimelessPaymentFilter>('active');

  const [isGoalModalOpen, setGoalModalOpen] = useState(false);
  const [isProjectionModalOpen, setProjectionModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isContributionModalOpen, setContributionModalOpen] = useState(false);
  const [isPaymentContributionModalOpen, setPaymentContributionModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isChangePinOpen, setChangePinOpen] = useState(false);
  const [isDayActionModalOpen, setDayActionModalOpen] = useState(false);
  const [isWishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [isCreditCardModalOpen, setCreditCardModalOpen] = useState(false);
  const [isUpdateBalanceModalOpen, setUpdateBalanceModalOpen] = useState(false);
  const [isPaymentCompletedModalOpen, setPaymentCompletedModalOpen] = useState(false);
  const [isTimelessPaymentModalOpen, setTimelessPaymentModalOpen] = useState(false);
  const [isTimelessContributionModalOpen, setTimelessContributionModalOpen] = useState(false);
  
  const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);
  const [goalToProject, setGoalToProject] = useState<SavingsGoal | null>(null);
  const [goalToContribute, setGoalToContribute] = useState<SavingsGoal | null>(null);
  const [paymentToEdit, setPaymentToEdit] = useState<Payment | null>(null);
  const [paymentToContribute, setPaymentToContribute] = useState<Payment | null>(null);
  const [wishlistItemToEdit, setWishlistItemToEdit] = useState<WishlistItem | null>(null);
  const [cardToEdit, setCardToEdit] = useState<CreditCard | null>(null);
  const [cardToUpdateBalance, setCardToUpdateBalance] = useState<CreditCard | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete>(null);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null);
  const [paymentJustCompleted, setPaymentJustCompleted] = useState<Payment | null>(null);
  const [timelessPaymentToEdit, setTimelessPaymentToEdit] = useState<TimelessPayment | null>(null);
  const [timelessPaymentToContribute, setTimelessPaymentToContribute] = useState<TimelessPayment | null>(null);


  useEffect(() => {
    // Data sanitization to fix potential duplicate IDs from older app versions.
    const sanitizeAndSetData = <T extends { id: string }>(
      data: T[],
      setData: React.Dispatch<React.SetStateAction<T[]>>,
      storageKey: string
    ) => {
      const idMap = new Map<string, boolean>();
      let needsUpdate = false;
      const sanitizedData = data.map(item => {
        if (!item.id || idMap.has(item.id)) {
          needsUpdate = true;
          return { ...item, id: crypto.randomUUID() };
        }
        idMap.set(item.id, true);
        return item;
      });

      if (needsUpdate) {
        setData(sanitizedData);
        localStorage.setItem(storageKey, JSON.stringify(sanitizedData));
      }
    };

    sanitizeAndSetData(goals, setGoals, 'goals_data');
    sanitizeAndSetData(payments, setPayments, 'payments_data');
    sanitizeAndSetData(wishlist, setWishlist, 'wishlist_data');
    sanitizeAndSetData(creditCards, setCreditCards, 'credit_cards_data');
    sanitizeAndSetData(timelessPayments, setTimelessPayments, 'timeless_payments_data');
  }, []); // Run only once on mount to clean up data.


  useEffect(() => {
    localStorage.setItem('goals_data', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('payments_data', JSON.stringify(payments));
  }, [payments]);
  
  useEffect(() => {
    localStorage.setItem('wishlist_data', JSON.stringify(wishlist));
  }, [wishlist]);
  
  useEffect(() => {
    localStorage.setItem('credit_cards_data', JSON.stringify(creditCards));
  }, [creditCards]);
  
  useEffect(() => {
    localStorage.setItem('timeless_payments_data', JSON.stringify(timelessPayments));
  }, [timelessPayments]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const formatDateToInput = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);
  
  // Automatic Credit Card Payment Generation
  useEffect(() => {
    if (isLocked) return;

    const today = new Date();
    const currentDay = today.getDate();
    const currentCycle = `${today.getFullYear()}-${today.getMonth()}`; // e.g., '2024-6' for July

    const cardsToProcess = creditCards.filter(card => 
        card.cutOffDay === currentDay &&
        card.lastCutOffProcessed !== currentCycle &&
        card.currentBalance > 0
    );

    if (cardsToProcess.length > 0) {
        const newPayments: Payment[] = [];
        const updatedCardIds = new Set<string>();

        cardsToProcess.forEach(card => {
            const cutOffDate = new Date(today.getFullYear(), today.getMonth(), card.cutOffDay);
            let paymentDueDate = new Date(cutOffDate);
            
            if (card.paymentDueDateDay >= card.cutOffDay) {
                paymentDueDate.setDate(card.paymentDueDateDay);
            } else {
                paymentDueDate.setMonth(paymentDueDate.getMonth() + 1);
                paymentDueDate.setDate(card.paymentDueDateDay);
            }
            
            const newPayment: Payment = {
                id: crypto.randomUUID(),
                name: `Pago Tarjeta ${card.name}`,
                amount: card.currentBalance,
                paidAmount: 0,
                dueDate: formatDateToInput(paymentDueDate),
                category: 'Tarjeta de Crédito',
                frequency: Frequency.Monthly,
                color: PAYMENT_COLORS[(payments.length + newPayments.length) % PAYMENT_COLORS.length],
                creditCardId: card.id,
            };
            newPayments.push(newPayment);
            updatedCardIds.add(card.id);
        });

        if (newPayments.length > 0) {
          setPayments(prev => [...prev, ...newPayments]);
          setCreditCards(prev => prev.map(card => 
              updatedCardIds.has(card.id) 
                  ? { ...card, lastCutOffProcessed: currentCycle }
                  : card
          ));
          window.alert(`Se ha(n) generado ${newPayments.length} nuevo(s) pago(s) de tarjeta de crédito basado en su fecha de corte.`);
        }
    }
}, [isLocked, creditCards, payments.length, formatDateToInput]);


  // Payment Reminder Notifications
  useEffect(() => {
    if (isLocked) {
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingPayments = payments.filter(p => {
        if ((p.amount - p.paidAmount) < 0.001) {
            return false; // Already paid
        }

        const dueDate = new Date(p.dueDate + 'T00:00:00');
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays >= 0 && diffDays <= 3;
    });

    upcomingPayments.forEach(p => {
        const notificationKey = `notified_${p.id}`;
        if (!sessionStorage.getItem(notificationKey)) {
            const dueDate = new Date(p.dueDate + 'T00:00:00');
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const remainingAmount = p.amount - p.paidAmount;

            let dueDateText = '';
            if (diffDays === 0) {
                dueDateText = 'hoy';
            } else if (diffDays === 1) {
                dueDateText = 'mañana';
            } else {
                dueDateText = `en ${diffDays} días`;
            }
            
            window.alert(
                `¡Recordatorio de Pago Urgente!\n\n` +
                `Tu pago para "${p.name}" vence ${dueDateText}.\n` +
                `Monto restante: ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(remainingAmount)}`
            );
            
            sessionStorage.setItem(notificationKey, 'true');
        }
    });
  }, [payments, isLocked]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSetPin = (newPin: string) => {
    setPin(newPin);
    localStorage.setItem('app_pin', newPin);
    setLocked(false);
  };
  
  const handleUnlockSuccess = () => {
    setLocked(false);
  };
  
  const handleLockApp = () => {
    setSettingsOpen(false);
    setLocked(true);
  };

  const handleChangePin = (newPin: string) => {
    setPin(newPin);
    localStorage.setItem('app_pin', newPin);
  };
  
  const sortedGoals = useMemo(() => {
    return [...goals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [goals]);
  
  const sortedCreditCards = useMemo(() => {
    const today = new Date();
    const todayDay = today.getDate();

    const getNextDueDate = (card: CreditCard) => {
        let paymentDueMonth = today.getMonth();
        let paymentDueYear = today.getFullYear();
        if (todayDay > card.paymentDueDateDay) {
            paymentDueMonth += 1;
            if (paymentDueMonth > 11) {
                paymentDueMonth = 0;
                paymentDueYear += 1;
            }
        }
        return new Date(paymentDueYear, paymentDueMonth, card.paymentDueDateDay);
    };

    const activeCards = creditCards.filter(c => c.currentBalance > 0);
    const paidCards = creditCards.filter(c => c.currentBalance === 0);

    activeCards.sort((a, b) => {
        const dateA = getNextDueDate(a);
        const dateB = getNextDueDate(b);
        return dateA.getTime() - dateB.getTime();
    });

    return [...activeCards, ...paidCards];
  }, [creditCards]);

  const dashboardData = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    startOfMonth.setHours(0, 0, 0, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const paymentsThisMonth = payments.filter(p => {
        const dueDate = new Date(p.dueDate + 'T00:00:00');
        return dueDate >= startOfMonth && dueDate <= endOfMonth;
    });

    // Unpaid real payments
    const unpaidRealPayments = payments.filter(p => (p.amount - p.paidAmount) > 0.001);
    
    // Virtual payments for credit cards with balances
    const existingUnpaidCardPaymentIds = new Set(unpaidRealPayments
        .filter(p => p.creditCardId)
        .map(p => p.creditCardId)
    );

    const virtualCardPayments: Payment[] = creditCards
        .filter(card => card.currentBalance > 0 && !existingUnpaidCardPaymentIds.has(card.id))
        .map(card => {
            const today = new Date();
            let paymentDueMonth = today.getMonth();
            if (today.getDate() > card.paymentDueDateDay) {
                paymentDueMonth += 1;
            }
            const dueDate = new Date(today.getFullYear(), paymentDueMonth, card.paymentDueDateDay);
            
            return {
                id: `card-${card.id}`, // Special ID to identify as virtual
                name: `Pago ${card.name}`,
                amount: card.currentBalance,
                paidAmount: 0,
                dueDate: formatDateToInput(dueDate),
                category: 'Tarjeta de Crédito',
                frequency: Frequency.Monthly,
                color: card.color,
                creditCardId: card.id,
            };
        });

    const allUpcomingItems = [...unpaidRealPayments, ...virtualCardPayments]
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());


    const totalPendingInMonth = paymentsThisMonth.reduce((sum, p) => sum + Math.max(0, p.amount - p.paidAmount), 0);
    const totalPaidInMonth = paymentsThisMonth.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalSavings = goals.reduce((sum, g) => sum + g.savedAmount, 0);

    const sortedGoalsByProgress = [...goals]
        .filter(g => g.targetAmount > 0 && g.savedAmount < g.targetAmount)
        .map(g => ({ ...g, progress: (g.savedAmount / g.targetAmount) * 100 }))
        .sort((a, b) => b.progress - a.progress);
    
    const topGoals = sortedGoalsByProgress.slice(0, 3);
    const upcomingPayments = allUpcomingItems.slice(0, 5);
    
    const categorySpending = paymentsThisMonth.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + p.amount;
        return acc;
    }, {} as Record<string, number>);

    const totalMonthSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
    
    const categorySpendingWithPercentage = Object.entries(categorySpending)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: totalMonthSpending > 0 ? (amount / totalMonthSpending) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount);

    return {
        totalPendingInMonth,
        totalPaidInMonth,
        totalSavings,
        topGoals,
        upcomingPayments,
        categorySpending: categorySpendingWithPercentage
    };
}, [payments, goals, creditCards, formatDateToInput]);

  const filteredPayments = useMemo(() => {
    const sorted = [...payments].sort((a, b) => {
      const isAPaid = (a.amount - a.paidAmount) < 0.001;
      const isBPaid = (b.amount - b.paidAmount) < 0.001;
      if (isAPaid && !isBPaid) return 1;
      if (!isAPaid && isBPaid) return -1;
      if(isAPaid && isBPaid) return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(); // Sort paid descending
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); // Sort unpaid ascending
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sorted.filter(p => {
        const isPaid = (p.amount - p.paidAmount) < 0.001;
        const dueDate = new Date(p.dueDate + 'T00:00:00');
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (paymentFilter) {
            case 'urgent':
                return !isPaid && diffDays >= 0 && diffDays <= 7;
            case 'overdue':
                return !isPaid && diffDays < 0;
            case 'paid':
                return isPaid;
            case 'all_unpaid':
            default:
                return !isPaid;
        }
    });
  }, [payments, paymentFilter]);


  const groupedAndSortedWishlist = useMemo(() => {
    const grouped: Record<string, WishlistItem[]> = wishlist.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, WishlistItem[]>);

    const priorityOrder = { [Priority.High]: 1, [Priority.Medium]: 2, [Priority.Low]: 3 };

    Object.values(grouped).forEach(items => {
      items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    });

    return Object.entries(grouped)
      .sort(([catA], [catB]) => catA.localeCompare(catB))
      .map(([category, items]) => ({ category, items }));
  }, [wishlist]);

  const groupedAndSortedPayments = useMemo(() => {
    if (filteredPayments.length === 0) return [];

    const grouped: Record<string, Payment[]> = filteredPayments.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, Payment[]>);

    return Object.entries(grouped)
      .sort(([catA], [catB]) => catA.localeCompare(catB))
      .map(([category, items]) => ({ category, items }));
  }, [filteredPayments]);
  
  const filteredTimelessPayments = useMemo(() => {
    return timelessPayments.filter(p => {
        if (timelessFilter === 'active') return !p.isCompleted;
        if (timelessFilter === 'completed') return p.isCompleted;
        return true;
    }).sort((a, b) => {
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    });
  }, [timelessPayments, timelessFilter]);

  const handleSaveGoal = useCallback((goalData: Omit<SavingsGoal, 'savedAmount' | 'createdAt' | 'projection' | 'color'> & { id?: string }) => {
    if (goalData.id) { // Editing
      setGoals(prev => prev.map(g => g.id === goalData.id ? { ...g, ...goalData } : g));
    } else { // Creating
      setGoals(prev => {
        const newGoal: SavingsGoal = {
          id: crypto.randomUUID(),
          savedAmount: 0,
          createdAt: new Date().toISOString(),
          color: GOAL_COLORS[prev.length % GOAL_COLORS.length],
          ...goalData,
        };
        return [newGoal, ...prev];
      });
    }
  }, []);

  const handleOpenEditGoal = useCallback((goal: SavingsGoal) => {
    setGoalToEdit(goal);
    setGoalModalOpen(true);
  }, []);

  const handleDeleteGoal = useCallback((goalId: string) => {
    setItemToDelete({ id: goalId, type: 'goal' });
    setConfirmModalOpen(true);
  }, []);
  
  const handleSaveProjection = useCallback((projectionData: { amount: number; frequency: Frequency, targetDate: string, goalId: string }) => {
    const { goalId, ...projection } = projectionData;
    setGoals(prevGoals => prevGoals.map(g => g.id === goalId ? { ...g, projection } : g));
  }, []);

  const openProjectionModal = useCallback((goal: SavingsGoal) => {
    setGoalToProject(goal);
    setProjectionModalOpen(true);
  }, []);

  const handleOpenContributionModal = useCallback((goal: SavingsGoal) => {
    setGoalToContribute(goal);
    setContributionModalOpen(true);
  }, []);

  const handleSaveContribution = useCallback((data: { amount: number, goalId: string }) => {
    const { amount: contributionAmount, goalId } = data;
    setGoals(currentGoals => {
        const goalIndex = currentGoals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) {
            return currentGoals;
        }

        const originalGoal = currentGoals[goalIndex];
        const newSavedAmount = originalGoal.savedAmount + contributionAmount;
        const finalSavedAmount = Math.min(originalGoal.targetAmount, newSavedAmount);

        const updatedGoal = {
            ...originalGoal,
            savedAmount: finalSavedAmount,
        };

        const newGoals = [...currentGoals];
        const isNowFullySaved = finalSavedAmount >= originalGoal.targetAmount;

        if (isNowFullySaved && originalGoal.projection && originalGoal.projection.frequency !== Frequency.OneTime && originalGoal.projection.targetDate) {
            
            const currentTargetDate = new Date(originalGoal.projection.targetDate + 'T00:00:00');
            let nextTargetDate = new Date(currentTargetDate);

            switch (originalGoal.projection.frequency) {
                case Frequency.Weekly:
                    nextTargetDate.setDate(nextTargetDate.getDate() + 7);
                    break;
                case Frequency.BiWeekly:
                    nextTargetDate.setDate(nextTargetDate.getDate() + 14);
                    break;
                case Frequency.Monthly:
                    nextTargetDate.setMonth(nextTargetDate.getMonth() + 1);
                    if (nextTargetDate.getDate() < currentTargetDate.getDate()) {
                        nextTargetDate.setDate(0);
                    }
                    break;
                case Frequency.BiMonthly:
                    nextTargetDate.setMonth(nextTargetDate.getMonth() + 2);
                    if (nextTargetDate.getDate() < currentTargetDate.getDate()) {
                        nextTargetDate.setDate(0);
                    }
                    break;
                case Frequency.Annual:
                    nextTargetDate.setFullYear(nextTargetDate.getFullYear() + 1);
                    break;
            }
            
            const newRecurringGoal: SavingsGoal = {
                ...originalGoal,
                id: crypto.randomUUID(),
                savedAmount: 0,
                createdAt: new Date().toISOString(),
                projection: {
                    ...originalGoal.projection,
                    targetDate: formatDateToInput(nextTargetDate),
                }
            };

            if (updatedGoal.projection) {
              updatedGoal.projection.frequency = Frequency.OneTime;
            }
            
            newGoals[goalIndex] = updatedGoal;
            newGoals.push(newRecurringGoal);
        } else {
            newGoals[goalIndex] = updatedGoal;
        }

        return newGoals;
    });
  }, [formatDateToInput]);
  
  const handleSavePayment = useCallback((paymentData: Omit<Payment, 'paidAmount' | 'color' | 'creditCardId'> & { id?: string }) => {
    if (paymentData.id) { // Editing
        setPayments(prevPayments => 
            prevPayments.map(payment => {
                if (payment.id === paymentData.id) {
                    return { ...payment, ...paymentData };
                }
                return payment;
            })
        );
    } else { // Creating
      setPayments(currentPayments => {
        const newPayment: Payment = {
          id: crypto.randomUUID(),
          paidAmount: 0,
          color: PAYMENT_COLORS[currentPayments.length % PAYMENT_COLORS.length],
          ...paymentData,
        };
        return [newPayment, ...currentPayments];
      });
    }
  }, []);

  const handleOpenEditPayment = useCallback((payment: Payment) => {
    setPaymentToEdit(payment);
    setPaymentModalOpen(true);
  }, []);

  const handleDeletePayment = useCallback((paymentId: string) => {
    setItemToDelete({ id: paymentId, type: 'payment' });
    setConfirmModalOpen(true);
  }, []);

  const handleOpenPaymentContributionModal = useCallback((payment: Payment) => {
    setPaymentToContribute(payment);
    setPaymentContributionModalOpen(true);
  }, []);

  const handleSavePaymentContribution = useCallback((data: { amount: number; paymentId: string; }) => {
    const { amount: contributionAmount, paymentId } = data;

    // Handle contributions to "virtual" credit card payments from dashboard
    if (String(paymentId).startsWith('card-')) {
        const cardId = paymentId.replace('card-', '');
        setCreditCards(currentCards =>
            currentCards.map(card => {
                if (card.id === cardId) {
                    const newBalance = Math.max(0, card.currentBalance - contributionAmount);
                    const roundedBalance = Math.round(newBalance * 100) / 100;
                    return { ...card, currentBalance: roundedBalance };
                }
                return card;
            })
        );
        return; // Early exit, as there's no "Payment" object to update
    }

    setPayments(currentPayments => {
        const paymentIndex = currentPayments.findIndex(p => p.id === paymentId);
        if (paymentIndex === -1) {
            return currentPayments;
        }

        const originalPayment = currentPayments[paymentIndex];

        if (originalPayment.creditCardId) {
            setCreditCards(currentCards =>
                currentCards.map(card => {
                    if (card.id === originalPayment.creditCardId) {
                        const newBalance = Math.max(0, card.currentBalance - contributionAmount);
                        const roundedBalance = Math.round(newBalance * 100) / 100;
                        return { ...card, currentBalance: roundedBalance };
                    }
                    return card;
                })
            );
        }

        const newPaidAmount = originalPayment.paidAmount + contributionAmount;
        const finalPaidAmount = Math.min(originalPayment.amount, newPaidAmount);
        const roundedPaidAmount = Math.round(finalPaidAmount * 100) / 100;

        let updatedPayment = {
            ...originalPayment,
            paidAmount: roundedPaidAmount,
        };

        const newPayments = [...currentPayments];
        const isNowFullyPaid = (originalPayment.amount - roundedPaidAmount) < 0.001;

        if (isNowFullyPaid && originalPayment.frequency !== Frequency.OneTime) {
            const currentDueDate = new Date(originalPayment.dueDate + 'T00:00:00');
            let nextDueDate = new Date(currentDueDate);

            switch (originalPayment.frequency) {
                case Frequency.Weekly:
                    nextDueDate.setDate(nextDueDate.getDate() + 7);
                    break;
                case Frequency.BiWeekly:
                    nextDueDate.setDate(nextDueDate.getDate() + 14);
                    break;
                case Frequency.Monthly:
                    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                    if (nextDueDate.getDate() < currentDueDate.getDate()) {
                        nextDueDate.setDate(0);
                    }
                    break;
                case Frequency.BiMonthly:
                    nextDueDate.setMonth(nextDueDate.getMonth() + 2);
                    if (nextDueDate.getDate() < currentDueDate.getDate()) {
                        nextDueDate.setDate(0);
                    }
                    break;
                case Frequency.Annual:
                    nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                    break;
                default:
                    newPayments[paymentIndex] = updatedPayment;
                    if (isNowFullyPaid) {
                        setPaymentJustCompleted(updatedPayment);
                    }
                    return newPayments;
            }

            const newRecurringPayment: Payment = {
                ...originalPayment,
                id: crypto.randomUUID(),
                dueDate: formatDateToInput(nextDueDate),
                paidAmount: 0,
            };

            updatedPayment.frequency = Frequency.OneTime;
            
            newPayments[paymentIndex] = updatedPayment;
            newPayments.push(newRecurringPayment);
        } else {
            newPayments[paymentIndex] = updatedPayment;
        }

        if (isNowFullyPaid) {
            setPaymentJustCompleted(updatedPayment);
        }

        return newPayments;
    });
  }, [formatDateToInput]);

  const handleSaveWishlistItem = useCallback((itemData: Omit<WishlistItem, 'id'> & { id?: string }) => {
    if (itemData.id) { // Editing
        setWishlist(prev => prev.map(item => item.id === itemData.id ? { ...item, ...itemData } : item));
    } else { // Creating
        setWishlist(prev => [{ id: crypto.randomUUID(), ...itemData }, ...prev]);
    }
  }, []);

  const handleOpenEditWishlistItem = useCallback((item: WishlistItem) => {
    setWishlistItemToEdit(item);
    setWishlistModalOpen(true);
  }, []);

  const handleDeleteWishlistItem = useCallback((itemId: string) => {
    setItemToDelete({ id: itemId, type: 'wishlist' });
    setConfirmModalOpen(true);
  }, []);
  
  const handleMoveToGoal = useCallback((item: WishlistItem) => {
      const newGoal: SavingsGoal = {
          id: crypto.randomUUID(),
          name: item.name,
          targetAmount: item.estimatedAmount || 0,
          savedAmount: 0,
          category: item.category,
          priority: item.priority,
          color: GOAL_COLORS[goals.length % GOAL_COLORS.length],
          createdAt: new Date().toISOString(),
      };
      setGoals(prev => [newGoal, ...prev]);
      setWishlist(prev => prev.filter(w => w.id !== item.id));
      setActiveTab('goals');
  }, [goals]);
  
  const handleSaveCreditCard = useCallback((cardData: Omit<CreditCard, 'id' | 'color' | 'lastCutOffProcessed'> & { id?: string }) => {
    if (cardData.id) { // Editing
      setCreditCards(prev => prev.map(c => c.id === cardData.id ? { ...c, ...cardData } : c));
    } else { // Creating
      setCreditCards(prev => {
        const newCard: CreditCard = {
          id: crypto.randomUUID(),
          color: CARD_COLORS[prev.length % CARD_COLORS.length],
          ...cardData,
        };
        return [newCard, ...prev];
      });
    }
  }, []);

  const handleOpenEditCard = useCallback((card: CreditCard) => {
    setCardToEdit(card);
    setCreditCardModalOpen(true);
  }, []);

  const handleDeleteCard = useCallback((cardId: string) => {
    setItemToDelete({ id: cardId, type: 'card' });
    setConfirmModalOpen(true);
  }, []);

  const handleOpenUpdateBalance = useCallback((card: CreditCard) => {
    setCardToUpdateBalance(card);
    setUpdateBalanceModalOpen(true);
  }, []);
  
  const handleUpdateBalance = useCallback((newBalance: number) => {
    if (!cardToUpdateBalance) return;
    const roundedBalance = Math.round(newBalance * 100) / 100;
    setCreditCards(prev => prev.map(c => 
      c.id === cardToUpdateBalance.id ? { ...c, currentBalance: roundedBalance } : c
    ));
  }, [cardToUpdateBalance]);

  const handleSaveTimelessPayment = useCallback((paymentData: Omit<TimelessPayment, 'id' | 'paidAmount' | 'isCompleted' | 'color' | 'createdAt' | 'contributions'> & { id?: string }) => {
    if (paymentData.id) { // Editing
      setTimelessPayments(prev => prev.map(p => p.id === paymentData.id ? { ...p, ...paymentData } : p));
    } else { // Creating
      setTimelessPayments(prev => {
        const newPayment: TimelessPayment = {
          id: crypto.randomUUID(),
          paidAmount: 0,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          contributions: [],
          color: TIMELESS_COLORS[prev.length % TIMELESS_COLORS.length],
          ...paymentData,
        };
        return [newPayment, ...prev];
      });
    }
  }, []);

  const handleOpenEditTimelessPayment = useCallback((payment: TimelessPayment) => {
    setTimelessPaymentToEdit(payment);
    setTimelessPaymentModalOpen(true);
  }, []);

  const handleDeleteTimelessPayment = useCallback((id: string) => {
    setItemToDelete({ id, type: 'timeless' });
    setConfirmModalOpen(true);
  }, []);

  const handleOpenTimelessContributionModal = useCallback((payment: TimelessPayment) => {
    setTimelessPaymentToContribute(payment);
    setTimelessContributionModalOpen(true);
  }, []);

  const handleSaveTimelessContribution = useCallback((data: { amount: number; paymentId: string; }) => {
    const { amount: contributionAmount, paymentId } = data;
    setTimelessPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        const newPaidAmount = p.paidAmount + contributionAmount;
        const roundedPaidAmount = Math.round(newPaidAmount * 100) / 100;
        const newContribution: TimelessPaymentContribution = {
          id: crypto.randomUUID(),
          amount: contributionAmount,
          date: new Date().toISOString(),
        };
        const isCompleted = roundedPaidAmount >= p.totalAmount;
        return {
          ...p,
          paidAmount: isCompleted ? p.totalAmount : roundedPaidAmount,
          isCompleted,
          contributions: [...p.contributions, newContribution]
        };
      }
      return p;
    }));
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'goal') {
      setGoals(prev => prev.filter(g => g.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'payment') {
      setPayments(prev => prev.filter(p => p.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'wishlist') {
      setWishlist(prev => prev.filter(w => w.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'card') {
      setCreditCards(prev => prev.filter(c => c.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'timeless') {
      setTimelessPayments(prev => prev.filter(p => p.id !== itemToDelete.id));
    }


    setConfirmModalOpen(false);
    setItemToDelete(null);
  }, [itemToDelete]);

  const handleCalendarDayClick = useCallback((date: Date) => {
      setSelectedDateForModal(date);
      setDayActionModalOpen(true);
  }, []);

  const handleDashboardItemClick = useCallback((item: Payment) => {
    handleOpenPaymentContributionModal(item);
  }, [handleOpenPaymentContributionModal]);
  
  const handleCloseGoalModal = useCallback(() => { setGoalModalOpen(false); setGoalToEdit(null); }, []);
  const handleCloseProjectionModal = useCallback(() => { setProjectionModalOpen(false); setGoalToProject(null); }, []);
  const handleCloseContributionModal = useCallback(() => { setContributionModalOpen(false); setGoalToContribute(null); }, []);
  const handleClosePaymentContributionModal = useCallback(() => { setPaymentContributionModalOpen(false); setPaymentToContribute(null); }, []);
  const handleClosePaymentModal = useCallback(() => { setPaymentModalOpen(false); setPaymentToEdit(null); setSelectedDateForModal(null) }, []);
  const handleCloseConfirmModal = useCallback(() => { setConfirmModalOpen(false); setItemToDelete(null); }, []);
  const handleCloseDayActionModal = useCallback(() => { setDayActionModalOpen(false); setSelectedDateForModal(null); }, []);
  const handleCloseWishlistModal = useCallback(() => { setWishlistModalOpen(false); setWishlistItemToEdit(null); }, []);
  const handleCloseCreditCardModal = useCallback(() => { setCreditCardModalOpen(false); setCardToEdit(null); }, []);
  const handleCloseUpdateBalanceModal = useCallback(() => { setUpdateBalanceModalOpen(false); setCardToUpdateBalance(null); }, []);
  const handleClosePaymentCompletedModal = useCallback(() => { setPaymentJustCompleted(null); }, []);
  const handleCloseTimelessPaymentModal = useCallback(() => { setTimelessPaymentModalOpen(false); setTimelessPaymentToEdit(null); }, []);
  const handleCloseTimelessContributionModal = useCallback(() => { setTimelessContributionModalOpen(false); setTimelessPaymentToContribute(null); }, []);


  if (isLocked || !pin) {
    return <AuthScreen hasPin={!!pin} onSetPin={handleSetPin} onUnlockSuccess={handleUnlockSuccess} storedPin={pin} />
  }

  const TabButton = ({ id, label, icon, active, colorClass }: { id: ActiveTab; label: string; icon: React.ReactNode; active: boolean, colorClass: string }) => {
    const baseClasses = 'flex items-center gap-2 px-4 md:px-6 py-3 font-semibold rounded-t-lg transition-all border-b-2';
    const activeClasses = `bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${colorClass}`;
    const inactiveClasses = 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-white border-transparent';
    
    return (
        <button onClick={() => setActiveTab(id)} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
            {icon} <span className="hidden md:inline">{label}</span>
        </button>
    );
  };
  
  const getHeaderInfo = () => {
    switch(activeTab) {
        case 'goals':
            return { title: 'Mis Metas de Compra', buttonText: 'Nueva Meta', buttonClass: 'bg-emerald-500 hover:bg-emerald-400', onClick: () => { setGoalToEdit(null); setGoalModalOpen(true); } };
        case 'payments':
            return { title: 'Mis Pagos Programados', buttonText: 'Nuevo Pago', buttonClass: 'bg-sky-500 hover:bg-sky-400', onClick: () => { setPaymentToEdit(null); setPaymentModalOpen(true); } };
        case 'timeless':
             return { title: 'Pagos sin Vencimiento', buttonText: 'Nuevo Pago', buttonClass: 'bg-cyan-500 hover:bg-cyan-400', onClick: () => { setTimelessPaymentToEdit(null); setTimelessPaymentModalOpen(true); } };
        case 'cards':
            return { title: 'Mis Tarjetas de Crédito', buttonText: 'Nueva Tarjeta', buttonClass: 'bg-purple-500 hover:bg-purple-600 text-white', onClick: () => { setCardToEdit(null); setCreditCardModalOpen(true); } };
        case 'wishlist':
            return { title: 'Mi Lista de Deseos', buttonText: 'Nuevo Deseo', buttonClass: 'bg-indigo-500 hover:bg-indigo-600 text-white', onClick: () => { setWishlistItemToEdit(null); setWishlistModalOpen(true); } };
        case 'dashboard':
        default:
            return null;
    }
  }
  
  const headerInfo = getHeaderInfo();
  
  const PaymentFilterControls = () => {
    const filters: { id: PaymentFilter, label: string, icon: React.ReactNode, color: string }[] = [
      { id: 'all_unpaid', label: 'Pendientes', icon: <ListTodoIcon className="w-5 h-5" />, color: 'text-sky-600 dark:text-sky-400' },
      { id: 'urgent', label: 'Urgentes', icon: <AlertTriangleIcon className="w-5 h-5" />, color: 'text-amber-600 dark:text-amber-400' },
      { id: 'overdue', label: 'Vencidos', icon: <HistoryIcon className="w-5 h-5" />, color: 'text-red-600 dark:text-red-400' },
      { id: 'paid', label: 'Pagados', icon: <CheckCircle2Icon className="w-5 h-5" />, color: 'text-green-600 dark:text-green-400' },
    ];
    
    return (
      <div className="mb-6 bg-gray-200/50 dark:bg-gray-800/50 p-2 rounded-lg flex flex-wrap justify-center items-center gap-2">
        {filters.map(filter => {
          const isActive = paymentFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setPaymentFilter(filter.id)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all duration-200 ${
                isActive
                  ? `bg-white dark:bg-gray-900 shadow ${filter.color}`
                  : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          )
        })}
      </div>
    );
  };

  const getEmptyStateConfig = () => {
    if (activeTab === 'payments') {
        switch (paymentFilter) {
            case 'all_unpaid': return { icon: <WalletIcon/>, title: "¡Todo al día!", message: "No tienes pagos pendientes. ¡Buen trabajo!" };
            case 'urgent': return { icon: <AlertTriangleIcon/>, title: "Sin pagos urgentes", message: "Ningún pago vence en los próximos 7 días." };
            case 'overdue': return { icon: <HistoryIcon/>, title: "Sin pagos vencidos", message: "No tienes deudas pasadas. ¡Excelente!" };
            case 'paid': return { icon: <CheckCircle2Icon/>, title: "Aún no has completado pagos", message: "Completa un pago para verlo en este historial." };
            default: return { icon: <WalletIcon/>, title: "No tienes pagos registrados", message: "Añade tus pagos para no olvidar ninguna fecha importante." };
        }
    }
    return null;
  }
  
  const StatCard = ({ icon, title, value, color }: { icon: React.ReactElement<{ className?: string }>, title: string, value: string, color: string }) => {
    const colorClasses: Record<string, { border: string, text: string }> = {
        red: { border: 'border-red-500', text: 'text-red-500 dark:text-red-400' },
        green: { border: 'border-green-500', text: 'text-green-500 dark:text-green-400' },
        blue: { border: 'border-sky-500', text: 'text-sky-500 dark:text-sky-400' },
    };
    const classes = colorClasses[color] || colorClasses.blue;
    return (
        <div className={`bg-white dark:bg-gray-800 p-5 rounded-2xl flex items-center gap-4 border-l-4 ${classes.border}`}>
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                {React.cloneElement(icon, { className: `w-7 h-7 ${classes.text}` })}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-sans">
      <header className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Meta Ahorro</h1>
        <button onClick={() => setSettingsOpen(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <CogIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"/>
        </button>
      </header>

      <main className="p-4 md:p-6 lg:p-8">
        <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          <TabButton id="dashboard" label="Dashboard" icon={<LayoutDashboardIcon className="w-5 h-5"/>} active={activeTab === 'dashboard'} colorClass="border-violet-500" />
          <TabButton id="payments" label="Pagos" icon={<WalletIcon className="w-5 h-5"/>} active={activeTab === 'payments'} colorClass="border-sky-500" />
          <TabButton id="timeless" label="Sin Vencimiento" icon={<TrendingUpIcon className="w-5 h-5"/>} active={activeTab === 'timeless'} colorClass="border-cyan-500" />
          <TabButton id="cards" label="Tarjetas" icon={<CreditCardIcon className="w-5 h-5"/>} active={activeTab === 'cards'} colorClass="border-purple-500" />
          <TabButton id="goals" label="Metas" icon={<LaptopIcon className="w-5 h-5"/>} active={activeTab === 'goals'} colorClass="border-emerald-500" />
          <TabButton id="wishlist" label="Deseos" icon={<ClipboardListIcon className="w-5 h-5"/>} active={activeTab === 'wishlist'} colorClass="border-indigo-500" />
          <TabButton id="calendar" label="Calendario" icon={<CalendarIcon className="w-5 h-5"/>} active={activeTab === 'calendar'} colorClass="border-rose-500" />
        </div>
        
        <div className={`pt-6 rounded-b-lg transition-colors duration-300`}>
          {headerInfo && <div className="flex justify-between items-center mb-6 px-6 py-4 bg-white dark:bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {headerInfo.title}
            </h2>
            <button
                onClick={headerInfo.onClick}
                className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${headerInfo.buttonClass} ${headerInfo.buttonClass.includes('text-white') ? '' : 'text-black'}`}
            >
                <PlusIcon className="w-5 h-5"/>
                {headerInfo.buttonText}
            </button>
          </div>}

          {activeTab === 'dashboard' && (
             <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Resumen del Mes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard icon={<WalletIcon />} title="Pendiente en Pagos" value={formatCurrency(dashboardData.totalPendingInMonth)} color="red" />
                        <StatCard icon={<CheckCircle2Icon />} title="Pagado este Mes" value={formatCurrency(dashboardData.totalPaidInMonth)} color="green" />
                        <StatCard icon={<PiggyBankIcon />} title="Ahorro Total en Metas" value={formatCurrency(dashboardData.totalSavings)} color="blue" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                            <h3 className="font-bold text-xl mb-4">Próximos Pagos</h3>
                            {dashboardData.upcomingPayments.length > 0 ? (
                                <ul className="space-y-2">
                                {dashboardData.upcomingPayments.map(p => (
                                    <DashboardPaymentItem 
                                        key={p.id} 
                                        payment={p} 
                                        onClick={() => handleDashboardItemClick(p)} 
                                    />
                                ))}
                                </ul>
                            ) : (
                                <p className="text-center py-8 text-gray-500 dark:text-gray-400">¡No hay pagos pendientes!</p>
                            )}
                             <button onClick={() => setActiveTab('payments')} className="w-full mt-4 text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                Ver todos los pagos
                            </button>
                        </div>

                         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                            <h3 className="font-bold text-xl mb-4">Gastos por Categoría (Este Mes)</h3>
                            {dashboardData.categorySpending.length > 0 ? (
                                <ul className="space-y-4">
                                    {dashboardData.categorySpending.map(({ category, amount, percentage }) => (
                                        <li key={category}>
                                            <div className="flex justify-between text-sm mb-1 font-medium text-gray-600 dark:text-gray-300">
                                                <span>{category}</span>
                                                <span>{formatCurrency(amount)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                                <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center py-8 text-gray-500 dark:text-gray-400">Sin gastos registrados este mes.</p>
                            )}
                        </div>

                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                        <h3 className="font-bold text-xl mb-4">Progreso de Metas</h3>
                        {dashboardData.topGoals.length > 0 ? (
                            <ul className="space-y-5">
                            {dashboardData.topGoals.map(g => (
                                <li key={g.id}>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{g.name}</p>
                                        <span className="text-sm font-bold text-emerald-500">{Math.floor(g.progress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${g.progress}%` }}></div>
                                    </div>
                                </li>
                            ))}
                            </ul>
                        ) : (
                             <p className="text-center py-8 text-gray-500 dark:text-gray-400">No hay metas activas.</p>
                        )}
                        <button onClick={() => setActiveTab('goals')} className="w-full mt-6 text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            Ver todas las metas
                        </button>
                    </div>
                </div>
             </div>
          )}
          
          {activeTab === 'payments' && <PaymentFilterControls />}
          
          {activeTab === 'timeless' && (
            <>
              <div className="mb-6 bg-gray-200/50 dark:bg-gray-800/50 p-2 rounded-lg flex flex-wrap justify-center items-center gap-2">
                {(['active', 'completed'] as TimelessPaymentFilter[]).map(filter => {
                  const isActive = timelessFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setTimelessFilter(filter)}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all duration-200 ${
                        isActive
                          ? 'bg-white dark:bg-gray-900 shadow text-cyan-600 dark:text-cyan-400'
                          : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      {filter === 'active' ? <ListTodoIcon className="w-5 h-5"/> : <CheckCircle2Icon className="w-5 h-5" />}
                      {filter === 'active' ? 'Activos' : 'Completados'}
                    </button>
                  )
                })}
              </div>
              {filteredTimelessPayments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTimelessPayments.map(payment => (
                        <TimelessPaymentCard key={payment.id} payment={payment} onEdit={handleOpenEditTimelessPayment} onDelete={handleDeleteTimelessPayment} onContribute={handleOpenTimelessContributionModal} />
                    ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <TrendingUpIcon className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4"/>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No tienes pagos de este tipo</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {timelessFilter === 'active' ? '¡Añade tu primer pago para empezar a registrar abonos!' : 'Aún no has liquidado ningún pago de este tipo.'}
                    </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'cards' && (
            sortedCreditCards.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sortedCreditCards.map(card => (
                        <CreditCardCard key={card.id} card={card} onEdit={handleOpenEditCard} onDelete={handleDeleteCard} onUpdateBalance={handleOpenUpdateBalance} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <CreditCardIcon className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4"/>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No tienes tarjetas registradas</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Añade tu primera tarjeta para empezar a monitorear tus gastos.</p>
                </div>
            )
          )}

          {activeTab === 'goals' && (
            sortedGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedGoals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} onConfigure={openProjectionModal} onEdit={handleOpenEditGoal} onDelete={handleDeleteGoal} onContribute={handleOpenContributionModal} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <LaptopIcon className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4"/>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No tienes metas de ahorro</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">¡Crea tu primera meta para empezar a ahorrar!</p>
                </div>
            )
          )}
          
          {activeTab === 'wishlist' && (
            groupedAndSortedWishlist.length > 0 ? (
                <div className="space-y-8">
                    {groupedAndSortedWishlist.map(({ category, items }) => (
                        <div key={category}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{category}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map(item => (
                                    <WishlistCard key={item.id} item={item} onEdit={handleOpenEditWishlistItem} onDelete={handleDeleteWishlistItem} onMoveToGoal={handleMoveToGoal} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <ClipboardListIcon className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4"/>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Tu lista de deseos está vacía</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">¡Añade algo que te gustaría comprar en el futuro!</p>
                </div>
            )
          )}

          {activeTab === 'payments' && (
             groupedAndSortedPayments.length > 0 ? (
                <div className="space-y-8">
                    {groupedAndSortedPayments.map(({ category, items }) => (
                        <div key={category}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-2 h-8 bg-sky-500 rounded-full"></span>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{category}</h3>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {items.map(payment => (
                                    <PaymentCard key={payment.id} payment={payment} onEdit={handleOpenEditPayment} onDelete={handleDeletePayment} onContribute={handleOpenPaymentContributionModal}/>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <div className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4">{getEmptyStateConfig()?.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{getEmptyStateConfig()?.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{getEmptyStateConfig()?.message}</p>
                </div>
            )
          )}

          {activeTab === 'calendar' && (
            <CalendarView 
              payments={payments} 
              goals={goals} 
              creditCards={creditCards}
              onDayClick={handleCalendarDayClick} 
            />
          )}
        </div>
      </main>

      <GoalModal isOpen={isGoalModalOpen} onClose={handleCloseGoalModal} onSave={handleSaveGoal} goalToEdit={goalToEdit} />
      <WishlistModal isOpen={isWishlistModalOpen} onClose={handleCloseWishlistModal} onSave={handleSaveWishlistItem} itemToEdit={wishlistItemToEdit} />
      <ProjectionModal isOpen={isProjectionModalOpen} onClose={handleCloseProjectionModal} onSave={handleSaveProjection} goal={goalToProject} />
      <ContributionModal isOpen={isContributionModalOpen} onClose={handleCloseContributionModal} onSave={handleSaveContribution} goal={goalToContribute}/>
      <PaymentContributionModal isOpen={isPaymentContributionModalOpen} onClose={handleClosePaymentContributionModal} onSave={handleSavePaymentContribution} payment={paymentToContribute} />
      <PaymentModal isOpen={isPaymentModalOpen} onClose={handleClosePaymentModal} onSave={handleSavePayment} paymentToEdit={paymentToEdit} defaultDate={selectedDateForModal}/>
      <CreditCardModal isOpen={isCreditCardModalOpen} onClose={handleCloseCreditCardModal} onSave={handleSaveCreditCard} cardToEdit={cardToEdit} />
      <UpdateBalanceModal isOpen={isUpdateBalanceModalOpen} onClose={handleCloseUpdateBalanceModal} onSave={handleUpdateBalance} card={cardToUpdateBalance} />
      <TimelessPaymentModal isOpen={isTimelessPaymentModalOpen} onClose={handleCloseTimelessPaymentModal} onSave={handleSaveTimelessPayment} itemToEdit={timelessPaymentToEdit} />
      <TimelessPaymentContributionModal isOpen={isTimelessContributionModalOpen} onClose={handleCloseTimelessContributionModal} onSave={handleSaveTimelessContribution} payment={timelessPaymentToContribute} />
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={handleCloseConfirmModal} onConfirm={handleConfirmDelete} title="Confirmar Eliminación" message="¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer." />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} onToggleTheme={handleToggleTheme} onChangePin={() => { setSettingsOpen(false); setChangePinOpen(true); }} onLock={handleLockApp} theme={theme}/>
      {pin && <ChangePinModal isOpen={isChangePinOpen} onClose={() => setChangePinOpen(false)} currentPin={pin} onPinChanged={handleChangePin}/>}
      <DayActionModal 
        isOpen={isDayActionModalOpen} 
        onClose={handleCloseDayActionModal}
        date={selectedDateForModal}
        onAddPayment={() => {
            handleCloseDayActionModal();
            setPaymentToEdit(null);
            setPaymentModalOpen(true);
        }}
        onAddGoal={() => {
            handleCloseDayActionModal();
            setGoalToEdit(null);
            setGoalModalOpen(true);
        }}
       />
       <PaymentCompletedModal isOpen={!!paymentJustCompleted} onClose={handleClosePaymentCompletedModal} payment={paymentJustCompleted} />
    </div>
  );
};

export default App;