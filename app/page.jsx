'use client'
import React, { useState } from 'react';
import Image from 'next/image'
import dashboard from './dashboard.module.css'
import { useRouter } from 'next/navigation';
import { FaDiscord } from 'react-icons/fa';
import Zoon from './Zoon';

export default function Dashboard() {
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();
  const handleTitleClick = () => {
    setClickCount(clickCount + 1)
  }
  const color1 = '#00FFC2';
  const color2 = '#FF5A21';

  const titleColor = clickCount % 2 === 0 ? color1 : color2;

  return (
    <div className={dashboard.container}>
      <div className={dashboard.imgContent}>
        <Image src="/images/raccoon.png"
          width={197}
          height={642}
          alt="image of the author"
        />
      </div>
      <div className={dashboard.imgDeskContent}>
        <img src="/images/raaccondesk.png"
          alt="image of the author"
          className={dashboard.raccoon}
        />
      </div>
      <div className={dashboard.infoWrapped}>
        <div className={dashboard.wrapped}>
          <div
            onClick={handleTitleClick}
            style={{ fill: titleColor }}
            className={dashboard.title}
          >
            <Zoon fill={titleColor} />
          </div>
          <div className={dashboard.buttons}>
            <button
              onClick={() => window.open('https://discord.com/invite/wMmXRXaS', '_blank')}
              className={dashboard.btnDiscord}
              style={{ color: '#000', background: titleColor }}
            >
              <div className={dashboard.span}>
                <FaDiscord className={dashboard.icon} />
                JOIN DISCORD
              </div>
            </button>
            <button
              onClick={() => window.open('https://twitter.com/zoonlabs', '_blank')}

              className={dashboard.btnTwitter}
              style={{ color: titleColor, border: `1px solid ${titleColor}` }}
            >
              <div className={dashboard.span}>

                WHAT’S ZOON?
              </ div>
            </button>
          </div>
          <p className={dashboard.description}>
            We all should make it,
            not just founders.<span style={{ color: titleColor }}> #WAGMI</span>
          </p>
        </div>
        <div className={dashboard.btnLogin} style={{ color: titleColor }}> <div onClick={() => router.push('/login')} className={dashboard.span}>login</div></ div>
      </div>
    </div>
  )
}
