'use client'

import { Provider } from "react-redux"
import { store } from "../features/store"
import { ToastContainer } from "react-toastify"
import { Toaster } from "@/components/ui/sonner"
import InitCategories from '@/app/utils/useCategories'

const ClientProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <InitCategories />
      {children}
      <Toaster />
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="dark"
      />
    </Provider>
  )
}

export default ClientProviders
