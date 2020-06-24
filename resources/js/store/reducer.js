const initialState = {
    loggedUser: ''
}

const reducer = (state = initialState, action) => {

    if (action.type === 'USER') {
        return {
            loggedUser: action.value
        }
    }

    return state
}

export default reducer