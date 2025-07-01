import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })
    const [error, setError] = useState('')
    const [previousAmount, setPreviousAmount] = useState(0)
    const {dispatch, state, availableBudget} = useBudget()

    useEffect(() => {
        if(state.editingid){
            const editingExpense = state.expenses.filter(currrentExpense => currrentExpense.id === state.editingid)[0]
            setExpense(editingExpense)
            setPreviousAmount(editingExpense.amount)
        }
    }, [state.editingid])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value } = e.target
        const isAmountField = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name] : isAmountField ? +value : value
        })
    }

    const handleChangeDate = (value : Value) =>  {
        setExpense({
            ...expense,
            date: value
        })
    }
    
    const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validar
        if(Object.values(expense).includes('')) {
            setError('Todos los campos son obligatorios.')
            return
        }

        // Validar que no me pase del presupuesto
        if((expense.amount - previousAmount) > availableBudget) {
            setError('Este gasto se sale del presupuesto.')
            return
        }

        // Agregar o actualizar un gasto
        if(state.editingid){    
            dispatch({type: 'update-expense', payload: {expense: {id: state.editingid, ...expense}}})
        } else {
            dispatch({type: 'add-expense', payload: {expense}})
        }

        // Reiniciar el State
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date()
        })

    }

  return (
    <form className="space-y-5" onSubmit={handelSubmit}>
        <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
            {state.editingid ? 'Editar Gasto' : 'Nuevo Gasto'}
        </legend>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="flex flex-col gap-2">
            <label
                htmlFor="expenseName"
                className="text-xl"
            >
                Nombre Gasto:
            </label>
            <input 
                type="text" 
                id="expenseName"
                placeholder="Ingresa el nombre del gasto"
                className="bg-slate-100 p-2"
                name="expenseName"
                value={expense.expenseName}
                onChange={handleChange}
            />
        </div>

        <div className="flex flex-col gap-2">
            <label
                htmlFor="amount"
                className="text-xl"
            >
                Cantidad:
            </label>
            <input 
                type="number" 
                id="amount"
                placeholder="Ingresa la cantidad del gasto (Ej. 300)"
                className="bg-slate-100 p-2"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
            />
        </div>

        <div className="flex flex-col gap-2">
            <label
                htmlFor="category"
                className="text-xl"
            >
                Categoria:
            </label>
            <select 
                id="category"
                className="bg-slate-100 p-2"
                name="category"
                value={expense.category}
                onChange={handleChange}
            >
                <option value="">-- Seleccione --</option>
                {categories.map(category => (
                    <option 
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>
        </div>

        <div className="flex flex-col gap-2">
            <label
                htmlFor="date"
                className="text-xl"
            >
                Fecha Gasto:
            </label>
            <DatePicker 
                className="bg-slate-100 p-2 border-0"
                value={expense.date}
                onChange={handleChangeDate}
            />
        </div>

        <input 
            type="submit"
            className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg" 
            value={state.editingid ? 'Guardar Cambios' : 'Registrar'}
        />
    </form>
  )
}
