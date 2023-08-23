'use client'
import React, { useState, useEffect } from 'react';
import Loading from '../loading';

export default function LoginLayout({ children }) {
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChildren(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    
      <main >
        {showChildren?
          <>
        {children}
        
        </>
         : 
        <Loading >
      
        </Loading>
        }
      </main>
  );
}
