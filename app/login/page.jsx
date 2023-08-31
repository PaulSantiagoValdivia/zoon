'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabaseClient'
import login from './login.module.css'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function Login(){
  const router = useRouter();
  const  [magicLink, setMagicLink] = useState(false);
  const [status, setStatus] = useState('pending');
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const handleBoolean = () => {
    setMagicLink(true);
  }

  const signInWithEmail = async () => {

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'https://www.zoonlabs.com/userId',
      },
    })
    if (error) {
      setStatus('error')
      return
    }

    setStatus('success')
  }
  return (
    <div className={login.container}>
      <div className={login.imgContainer}>
        <Image src="/images/raccoon.png"
          width={197}
          height={642}
          alt="image of the author"
        />
      </div>
      <div className={login.imgDesk}>
        <img src="/images/raaccondesk.png"
          alt="image of the author"
          className={login.raccoon}
        />
      </div>
      <div className={login.content}>
        <div onClick={() => router.push('/')} className={login.btnBack}> <span className={login.span}>Go back</span></div>
        <div className={login.wrapped}>

          {magicLink ? (
            <>
              <h1 className={login.title}>
                Create an account at _ZOON
              </h1>
              <p className={login.description}>
                This helps to avoid bots from minting
              </p>

              {status === 'pending' && (
                <label className={login.labelLogin}>
                  <input className={login.inputLogin} type="email" value={email} placeholder="insert e-mail" onChange={(e) => {
                    setEmail(e.target.value);
                    console.log(e.target.value);
                    setValidEmail(e.target.value.includes('@') && e.target.value.endsWith('gmail.com'));
                  }} />
                  <button className={` ${validEmail ? login.validButton : login.buttonLogin}`}
                    onClick={signInWithEmail}
                    disabled={!validEmail}
                  >Send magic link</button>
                </label>
              )}
              {status === 'success' && (
                <label className={login.labelLogin}>
                  <h2 className={login.textLogin}>We just sent you a link to your email</h2>
                  <button className={login.buttonLogin} onClick={() => setStatus('pending')}>Enter another account</button>
                </label>
              )}
              {status === 'error' && (
                <label className={login.labelLogin}>
                  <h2 className={login.textLogin}>There was an error entering</h2>
                  <button className={login.buttonLogin} onClick={() => setStatus('pending')}>Enter another account</button>
                </label>
              )}
            </>
          ) : (
            <>
              <h1 className={login.title}>
                Create an account at _zoon
              </h1>
              <p className={login.description}>
                This helps to avoid bots from minting
              </p>
              <div className={login.provaider}>
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    style: {
                      button: {
                        background: '#0000',
                        color: '#6E6E6E',
                        borderColor: '#19191D',
                        transition:
                        'background-color 0.3s, border-color 0.3s, color 0.3s',
                      },
                      container:{
                        margin: '0px',
                        width: '360px',
                      }
                    },
                  }}
                  providers={['google']}
                  onlyThirdPartyProviders={true}
                  redirectTo='https://www.zoonlabs.com/userId'
                />
              </div>
              <a className={login.magicLink} onClick={handleBoolean}>or use a magic link</a>
            </>
          )}
        </div>
      </div>
    </div >
  );
}