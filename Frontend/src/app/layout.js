import './styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';
export const metadata = {
  title: 'Smart Gaze',
  description: 'A CCTV Class Monitoring System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>

          {children}


        </ThemeProvider>
      </body>
    </html>

  )
}
