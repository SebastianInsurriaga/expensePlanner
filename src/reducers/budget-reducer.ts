import type { Category, DraftExpense, Expense } from "../types";
import {v4 as uuidv4} from 'uuid' 

export type BudgetActions = 
    { type: 'add-budget'; payload: { budget: number } } |
    { type: 'show-modal' } |
    { type: 'close-modal' } |
    { type: 'add-expense', payload: {expense: DraftExpense}} |
    { type: 'remove-expense', payload: {id: Expense['id']}} |
    { type: 'get-expense-by-id', payload : {id: Expense['id']}} |
    { type: 'update-expense', payload : {expense: Expense}} |
    { type: 'reset-app'} |
    { type: 'filter-category', payload: {id: Category['id']}}

export type BudgetState = {
    budget: number;
    modal: boolean;
    expenses: Expense[];
    editingid: Expense['id'];
    currentCategory: Category['id'];
};

const initialBudget = () : number => {
    const localStorageBudget = localStorage.getItem('budget')
    return localStorageBudget ? +localStorageBudget : 0
}

const localStorageExpenses = () : Expense[] => {
    const localStorageExpenses = localStorage.getItem('expenses')
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : []
}

export const initialState: BudgetState = {
    budget: initialBudget(),
    modal: false,
    expenses: localStorageExpenses(),
    editingid: '',
    currentCategory: ''
};

const creatExpense = (draftExpense : DraftExpense) : Expense => {
     return {
        ...draftExpense,
        id: uuidv4() 
     }
}

export const budgetReducer = (
    state: BudgetState = initialState,
    action: BudgetActions
): BudgetState => {
    switch (action.type) {
        case 'add-budget':
            return {
                ...state,
                budget: action.payload.budget,
            };
        case 'show-modal':
            return {
                ...state,
                modal: true,
            };
        case 'close-modal':
            return {
                ...state,
                modal: false,
                editingid: ''
            };
        case 'add-expense':
            const expense = creatExpense(action.payload.expense)
            return {
                ...state,
                expenses: [...state.expenses, expense],
                modal: false
            };
        case 'remove-expense':
            return {
                ...state,
                expenses: state.expenses.filter(expense => expense.id !== action.payload.id),
            };
        case 'get-expense-by-id':
            return {
                ...state,
                editingid: action.payload.id,
                modal: true
            };
        case 'update-expense':
            return {
                ...state,
                expenses: state.expenses.map(expense => expense.id === action.payload.expense.id ? action.payload.expense : expense),
                modal: false,
                editingid: ''
            };
        case 'reset-app':
            return {
                budget: 0,
                modal: false,
                expenses: [ ],
                editingid: '',
                currentCategory: ''
            };
        case 'filter-category':
            return {
                ...state,
                currentCategory: action.payload.id
            };
        default:
            return state;
    }
};