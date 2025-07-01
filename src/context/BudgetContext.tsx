import { useReducer, createContext, type Dispatch, type ReactNode, useMemo} from "react"
import {  type BudgetState, type BudgetActions, budgetReducer, initialState } from "../reducers/budget-reducer"

type BudgetContextProps = {
    state: BudgetState
    dispatch: Dispatch<BudgetActions>
    totalExpense: number
    availableBudget: number
}

type BudgetProviderProps = {
    children: ReactNode
}

export const BudgetContext = createContext<BudgetContextProps>(null!)

export const BudgetProvider = ({children}: BudgetProviderProps) => {
    const [state, dispatch] = useReducer(budgetReducer, initialState)
    const totalExpense = useMemo(() => state.expenses.reduce((total, expense) => expense.amount + total, 0), [state.expenses])
    const availableBudget = state.budget - totalExpense
    
    return (
        <BudgetContext.Provider
            value={{
                state,
                dispatch,
                totalExpense,
                availableBudget
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}