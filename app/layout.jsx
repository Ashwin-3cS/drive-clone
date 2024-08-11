import "../styles/globals.css";
import Provider from '../components/Provider';
import { Toaster } from 'react-hot-toast'; // Import Toaster

export const metadata = {
  title: "Google-DriveClone",
  description: "Created by Ashwin",
};

const RootLayout = ({children}) => {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/assets/images/GooglDrive.png" /> 
      </head>
      <body>
        <Provider>
          <main className='gradient'>
            {children}
          </main>
          <Toaster /> 
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
