import React from 'react';
import loading from './loading.module.css';
export default function Loading() {
  return (
    <>
      <div className={loading.container}> 
        <img className={loading.img} src="/images/zoonlabs.png"
          alt="image of the author"
        />
F        <p className={loading.text}>Loading...</p>
      </div>

    </>
  );
}
