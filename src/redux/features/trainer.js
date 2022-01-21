const initialState = {
  trainers: [],
  loading: false,
  error: null,
}

export const trainerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'trainers/load/pending':
      return {
        ...state,
        loading: true,
      };
    case 'trainers/load/fullfilled':
      return {
        ...state,
        trainers: action.payload,
        loading: false,
      };
    case 'trainers/load/rejected':
      return {
        ...state,
        error: action.payload
      }
    case 'trainers/delete/pending':
      return {
        ...state,
        loading: true
      }
    case 'trainers/delete/fullfilled':
      return {
        ...state,
        trainers: state.trainers.filter((item) => {
          if (item._id !== action.payload) {
            return item
          }
          return state
        })
      }
    case 'trainers/delete/rejected':
      return {
        ...state,
        error: action.payload
      }
    case 'trainers/post/pending':
      return {
        ...state,
        loading: true
      }
    case 'trainers/post/fulfilled':
      return {
        ...state,
        trainers: [...state.trainers, action.payload],
        loading: false
      }
    case 'trainers/post/rejected':
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}

export const loadTrainers = () => {
  return async (dispatch) => {
    dispatch({ type: 'trainers/load/pending' });

    try {
      const res = await fetch('http://localhost:5000/users/trainers')
      const json = await res.json()

      dispatch({ type: 'trainers/load/fullfilled', payload: json })
    } catch (error) {
      dispatch({ type: 'trainers/load/rejected', payload: error })
    }
  }
}

export const deleteTrainers = (id) => {
  return async (dispatch) => {
    dispatch({ type: 'trainers/delete/pending' })

    try {
      await fetch(`http://localhost:5000/admin/trainers/${id}`, {
        method: "DELETE"
      })
      
      dispatch({ type: 'trainers/delete/fullfilled', payload: id })
    }
    catch (error) {
      dispatch({ type: 'trainers/delete/rejected', payload: error })
    }
  }
}

export const addTrainers = (text) => {
  return async (dispatch) => {
    dispatch({ type: "trainers/post/pending" })
    try {
      let options = {
        method: "POST",
        body: JSON.stringify(text),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      };
      let url = "http://localhost:5000/admin/trainers";
      await fetch (url, options)
      dispatch({ type: "trainers/post/fulfilled", payload: text })
    } catch (error) {
      dispatch({ type: "trainers/post/rejected", payload: error })
    }
  }
}