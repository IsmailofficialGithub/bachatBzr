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
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="colored"
      />
    </Provider>
  )
}

export default ClientProviders





// import "./global.css"; import { Jost } from 'next/font/google'; import "/public/assets/css/animate.css"; import "/public/assets/css/bootstrap.min.css"; import "/public/assets/css/fontawesome.min.css"; import "/public/assets/css/nice-select.css"; import "/public/assets/css/slick.css"; import "/public/assets/css/swiper-bundle.css"; import "/public/assets/css/magnific-popup.css"; import "/public/assets/css/meanmenu.css"; import "/public/assets/css/spacing.css"; import "/public/assets/css/main.css"; import ClientProviders from "./client-providers";  const jost = Jost({   weight: ['300', '400', '500', '600', '700'],   subsets: ['latin'],   variable: "--tp-ff-body", });  export const metadata = {   title: 'BachatBzr',   description: 'Affordable shopping for everyone',   icons: {     icon: '/favicon.ico',   }, };  export default function RootLayout({ children }) {   return (     <html lang="en">       <body className={`${jost.variable}`}>         <ClientProviders>             {children}         </ClientProviders>       </body>     </html>   ); }  'use client' import { Provider } from "react-redux" import { store } from "../features/store" import { ToastContainer } from "react-toastify" import { Toaster } from "@/components/ui/sonner" import InitCategories from '@/app/utils/useCategories'  const ClientProviders = ({ children }) => {   return (     <Provider store={store}>       <InitCategories />       {children}       <Toaster />       <ToastContainer         position="bottom-right"         autoClose={1500}         hideProgressBar={false}         newestOnTop={false}         closeOnClick         rtl={false}         draggable         pauseOnHover         theme="dark"       />     </Provider>   ) }  export default ClientProviders  this cannot work ToastContainer


