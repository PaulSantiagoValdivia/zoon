export const metadata = {

  title: 'ZOON Labs NFT',
  openGraph: {
    title: 'ZOON Labs NFT',
    description: 'We all should make it, not just founders. The first NFT project that you actually own. #WAGMI',
  },
}
export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;900&family=Outfit:wght@400;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, backgroundColor: '#030303' }}>
        {children}
      </body>
    </html>
  );
}
