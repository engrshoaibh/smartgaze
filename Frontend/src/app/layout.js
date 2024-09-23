import './styles/globals.css';

export const metadata = {
  title: 'Smart Gaze',
  description: 'A CCTV Class Monitoring System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
    
  )
}
