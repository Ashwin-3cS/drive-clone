import "../styles/globals.css";
import Navbar from "../components/Login";
import Provider from '../components/Provider';



export const metadata = {
  title: "Google-DriveClone",
  description: "Created by Ashwin",
};


const RootLayout = ({children}) => {
  return (
    <html lang="en">
        <head>
            <meta name="description" content={metadata.description} />
            {/* <link rel="icon" href="/assets/images/sailor.svg" /> */}
        </head>
        <body>
          <Provider>
            <main className='gradient '>
              {children}
            </main>
          </Provider>
        </body>
    </html>
)
}

export default RootLayout