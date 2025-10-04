import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import baseUrl from '../constants/ServerConstant'
import axios from 'axios'
import AppRoutes from './routes/AppRoutes'

function App() {
  return <AppRoutes />
}

export default App;