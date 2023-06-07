import React from 'react';


const { useReducer, useContext } = React;

const init = {
  data: {}
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'ADD':
      return {
        ...state,
        data: {
          ...state.data,
          [new Date().getTime()]: {
            value: action.payload,
            checked: false
          }
        }
      };
    case 'EDIT':
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.id]: {
            ...state.data[action.payload.id],
            value: action.payload.value,
            checked: action.payload.checked
          }
        }
      };
    case 'DELETE':
      const mutable = state.data;
      delete mutable[action.payload];
      return {
        ...state,
        data: mutable
      }
    default:
      return state;
  }
}

export const ToDoContext = React.createContext();
export const useToDoContext = () => React.useContext(ToDoContext);

const ToDoController = ({ children }) => {

  const [data, dispatch] = useReducer(reducer, init);

  const addItem = (value) => dispatch({
    type: 'ADD',
    payload: value
  })

  const editItem = ({ id, value, checked}) => dispatch({
    type: 'EDIT',
    payload: {
      id,
      value,
      checked
    }
  })

  const removeItem = (id) => dispatch({
    type: 'DELETE',
    payload: id
  })

  return (
    <ToDoContext.Provider value={{
      addItem,
      editItem,
      removeItem,
      data
    }}>{children}</ToDoContext.Provider>
  )
}

export default ToDoController;