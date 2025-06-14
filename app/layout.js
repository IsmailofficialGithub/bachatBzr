'use client'
import "./global.css";
import { store } from '../features/store';
import { Jost } from 'next/font/google'
import { Provider } from "react-redux"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify"
import "/public/assets/css/animate.css"
import "/public/assets/css/bootstrap.min.css"
import "/public/assets/css/fontawesome.min.css"
import "/public/assets/css/nice-select.css"
import "/public/assets/css/slick.css"
import "/public/assets/css/swiper-bundle.css"
import "/public/assets/css/magnific-popup.css"
import "/public/assets/css/meanmenu.css"
import "/public/assets/css/spacing.css"
import "/public/assets/css/main.css"
import { Toaster } from "@/components/ui/sonner"
import InitCategories from '@/app/utils/useCategories'

const jost = Jost({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: "--tp-ff-body",
})

export default function RootLayout({ children }) {
   
 
    return (
        <html lang="en">
            <body className={`${jost.variable}`}>
                <Provider store={store}>
                     <InitCategories />
                    {children}
                    <Toaster/>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={1000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        // pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                </Provider>
            </body>
        </html>
    )
}
