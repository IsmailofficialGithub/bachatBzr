import "./global.css";
import { Jost } from 'next/font/google';
import "/public/assets/css/animate.css";
import "/public/assets/css/bootstrap.min.css";
import "/public/assets/css/fontawesome.min.css";
import "/public/assets/css/nice-select.css";
import "/public/assets/css/slick.css";
import "/public/assets/css/swiper-bundle.css";
import "/public/assets/css/magnific-popup.css";
import "/public/assets/css/meanmenu.css";
import "/public/assets/css/spacing.css";
import "/public/assets/css/main.css";
import ClientProviders from "./client-providers";

const jost = Jost({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: "--tp-ff-body",
});

export const metadata = {
  title: 'BachatBzr',
  description: 'Affordable shopping for everyone',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jost.variable}`}>
        <ClientProviders>
            {children}
        </ClientProviders>
      </body>
    </html>
  );
}
