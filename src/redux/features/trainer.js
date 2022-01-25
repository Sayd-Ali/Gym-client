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
    case 'trainers/post/rejected':
      return {
        ...state,
        error: action.payload
      }

    case "image/post/fulfilled": 
    return {
      ...state,
      trainers: [...state.trainers, action.payload],
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

export const addTrainers = (name, raiting, photo, info) => {

  return async (dispatch) => {
    dispatch({ type: "trainers/post/pending" })
    try {
      let options = {
        method: "POST",
        body: JSON.stringify({
          name: name,
          rating: raiting,
          description: info
        }),
        headers: { "Content-type": "application/json" },
      };

      const resTrainer = await fetch("http://localhost:5000/admin/trainers", options)
      const trainer = await resTrainer.json()
      console.log(trainer._id)

      const formData = new FormData();
      formData.append("img", photo);
      const resImage = await fetch(`http://localhost:5000/admin/trainers/image/${trainer._id}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await resImage.json();


      dispatch({ type: "trainers/post/fulfilled", payload: trainer })
      dispatch({ type: "image/post/fulfilled", payload: data })
    } catch (error) {
      dispatch({ type: "trainers/post/rejected", payload: error })
    }
  }
}

export const uploadAvatar = (file, id) => {
  return async (dispatch, getState) => {
    const state = getState();

    dispatch({ type: "carService/update/image/pending" });
    try {
      const formData = new FormData();
      formData.append("img", file);
      const res = await fetch(`http://localhost:4000/carservice/${id}/avatar`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${state.authentication.token}`,
        },
      });
      const data = await res.json();

      dispatch({ type: "carService/update/image/fulfilled", payload: data });
    } catch (error) {
      dispatch({ type: "carService/update/image/rejected", payload: error });
    }
  };
};