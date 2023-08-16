import ClientOnly from './components/ClientOnly'
import RegisterModal from './components/modals/RegisterModal'
import Navbar from './components/navbar/Navbar'
import './globals.css'
import { Nunito } from 'next/font/google'
import ToasterProvider from './providers/ToasterProvider'
import LoginModal from './components/modals/LoginModal'

import RentModal from './components/modals/RentModal'
import getCurrentUser from './actions/getCurrentUser'
import SearchModal from './components/modals/SearchModal'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata = {
  title: 'Hotel Bookings',
  description: 'Airbnb-clone',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser= await getCurrentUser();
  return (
    <html lang="en">
      <body className={nunito.className} >
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal/>
          <RentModal />
          <SearchModal />
          <Navbar currentUser={currentUser}/>
        </ClientOnly>
        <div className=''>
          {children}
        </div>
        </body>
    </html>
  )
}
