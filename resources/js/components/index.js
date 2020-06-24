import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
<<<<<<< HEAD
=======
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import reducer from '../store/reducer'

const store = createStore(reducer)
>>>>>>> redux

if (document.getElementById('root')) {
    ReactDOM.render(<Provider store={store} ><App /></Provider>, document.getElementById('root'))
}
