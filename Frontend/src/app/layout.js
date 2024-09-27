import './styles/globals.css';
import { Providers } from './providers'
export const metadata = {
  title: 'Smart Gaze',
  description: 'A CCTV Class Monitoring System',
}

export default function RootLayout({ children }) {


  return (


    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-medium`}>
        <Providers>
          {children}
        </Providers>



      </body>
    </html>

  )
}
