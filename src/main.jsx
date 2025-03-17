import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { StrictMode } from 'react'
import App from './App'
import { store } from './features/store'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
) 