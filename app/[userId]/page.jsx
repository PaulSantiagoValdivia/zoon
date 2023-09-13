'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import user from './user.module.css'
import fetch from 'node-fetch';
import { FaDiscord } from 'react-icons/fa';
import UserLayout from './layout';


export default function Account({ params }) {
  const router = useRouter();
  const [isInputFilled, setIsInputFilled] = useState(false);
  const [username, setUsername] = useState('');
  const [userDiscord, setUserDiscord] = useState('');
  const [userId, setUserId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const discordAuthLink = 'https://discord.com/api/oauth2/authorize?client_id=1133514369951608883&redirect_uri=https%3A%2F%2Fwww.zoonlabs.com%2FuserId&response_type=code&scope=identify';
  const API_ENDPOINT = 'https://discord.com/api/v10';
  const [code, setCode] = useState('');


  const discordLogin = () => {
    router.push(discordAuthLink)
  };
  const disconnectDiscord = async () => {
    try {
      localStorage.removeItem('isConnected');
      setIsConnected(false);
      console.log('Disconnected from Discord and updated state');
    } catch (error) {
      console.error('Error disconnecting from Discord:', error.message);
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      setCode(code);
    }
  }, []);

  useEffect(() => {
    if (code) {
      exchangeCodeForToken();
    }
  }, [code]);
  const exchangeCodeForToken = async () => {
    try {
      const response = await fetch(`https://www.zoonlabs.com/api/discord?code=${code}`, {
        method: 'GET',
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      setIsConnected(true)
      localStorage.setItem('isConnected', 'true');
      const data = await response.json();
      getUserData(data.tokenData.access_token);

    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const getUserData = async (token) => {
    try {
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(`${API_ENDPOINT}/users/@me`, requestOptions);
      const userData = await response.json();
      const userAlreadyLinked = await checkIfUserAlreadyLinked(userId);

      if (response.ok) {
        const { data: existingUser } = await supabase
          .from('discord')
          .select('*')
          .eq('id', userData.id)
          .single();
        if (!existingUser) {
          const { data: newDiscordUser, error: insertError } = await supabase
            .from('discord')
            .insert([
              {
                id: userData.id,
                discord_username: userData.username,
                user_id: userId,
              }
            ])
            .single();

          if (insertError) {
            console.error('Error inserting Discord user data:', insertError);
          } else {
            console.log('Discord user data inserted successfully:', newDiscordUser);

          }
        } else {
          if (existingUser.discord_username !== userData.username) {
            const { data: updatedUser, error: updateError } = await supabase
              .from('discord')
              .update({
                discord_username: userData.username,
              })
              .eq('id', userData.id)
              .single();

            if (updateError) {
              console.error('Error updating Discord user data:', updateError);
            } else {
              console.log('Discord username updated in the database:', updatedUser);
            }
          } else {
            console.log('Discord user already exists in the database:', existingUser);
          }
        }

      } else {
        console.error('Error fetching user data:', response.statusText);
      }

    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const checkIfUserAlreadyLinked = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('discord')
        .select('id')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error checking if user is already linked to Discord:', error.message);
      } else {
        // Si data contiene alguna fila, significa que el usuario ya está vinculado a Discord.
        if (data.length > 0) {
          console.log('El usuario ya está vinculado a Discord.');
          return true;
        } else {
          console.log('El usuario no está vinculado a Discord.');
          return false;
        }
      }
    } catch (error) {
      console.error('Error checking if user is already linked to Discord:', error.message);
      return false;
    }
  };
  
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    router.push(`/login`)
    localStorage.removeItem('isConnected');
    setIsConnected(false);
  }
  useEffect(() => {
    const storedIsConnected = localStorage.getItem('isConnected');
    if (storedIsConnected === 'true') {
      setIsConnected(true);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const auth = await supabase.auth.getSession()
      setUserId(auth.data.session?.user.id)

      if (auth.data.session?.user.aud === "authenticated") {
        try {
          // Check if the user already exists in the database
          const { data: existingUser, error: existingUserError } = await supabase
            .from('users')
            .select()
            .eq('id', auth.data.session?.user.id)
            .single()

          if (existingUser) {
            // User already exists, redirect to the user's page            
            router.push(existingUser.username);
          } else {
            // User doesn't exist, insert them into the "users" table
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert([{ id: auth.data.session?.user.id, username: auth.data.session?.user.user_metadata.sub }])
              .single()
            if (insertError) {
              // Handle the error if the insert operation fails
              console.error(insertError);
            } else {
              // User inserted successfully, redirect to the user's page
              router.push(`/${auth.data.session?.user.user_metadata.sub}`);
            }
          }
        } catch (error) {
          // Handle any other errors that might occur
          console.error(error);
        }
      } else {
        router.push('/login')
      }
    };

    checkUser();
  }, []);

  if (isConnected) {
    const getDiscordUsername = async () => {
      try {
        const { data, error } = await supabase
          .from('discord')
          .select('discord_username')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error fetching Discord username:', window.console.error);
          return null;
        }

        setUserDiscord(data ? data.discord_username : null);
      } catch (error) {
        console.error('Error fetching Discord username:', error.message);
        return null;
      }
    };

    getDiscordUsername();
  }



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if the new username already exists in the database
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username);

      if (fetchError) {
        console.error('Error fetching existing users:', fetchError.message);
        return;
      }
      if (existingUsers.length > 0) {
        const errorElement = document.getElementById('username-error');
        if (errorElement) {
          errorElement.textContent = 'This username is already taken';
        }
        return;
      }

      // Perform the username update in the database
      const { data, error } = await supabase
        .from('users')
        .update({ username: username })
        .eq('id', userId);
      if (error) {

        console.error('Error updating the username:', error.message);
      } else {
        console.log('Username updated successfully:', data);
        // Redirect to the new username's page
        router.push(`/${username}`);
      }
    } catch (error) {
      console.error('Error updating the username:', error.message);
    }
    setIsInputFilled(false);
  };



  return (
    <UserLayout>

      <div className={user.container}>
        <div className={user.imgDesk}>
          <img src="/images/raaccondesk.png"
            alt="image of the author"
          />
        </div>
          <div className={user.info}>
            <div className={user.presentation}>
              <h1 className={user.title}>Welcome {params.userId}</h1>
              <p className={user.description}>
                You are early.
              </p>
            </div>
            <div className={user.content}>
              <h2 className={user.subTitle}>Verify your discord </h2>
              <p className={user.description}>This will allow to mint before it goes public.</p>
              <button onClick={isConnected ? disconnectDiscord : discordLogin} className={isConnected ? user.disconnected : user.primaryButton}>
                {isConnected ? (
                  <>
                    <FaDiscord className={user.icon} /> Disconnect Discord <span>{userDiscord}</span>
                  </>
                ) : (
                  <>
                    <FaDiscord className={user.icon} /> Connect Discord
                  </>
                )}
              </button>
            </div>
            <div className={user.update}>
              <h1 className={user.subTitle}>Username</h1>
              <p className={user.description}>Choose a username for your _zoon account</p>
              <form onSubmit={handleSubmit} className={user.form}>
                <input
                  type='text'
                  name='name'
                  placeholder='Choose a username'
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setIsInputFilled(e.target.value !== '');
                  }}
                  className={user.input}
                />
                <button className={`${user.btn} ${isInputFilled ? user.btnFilled : ''}`}
                  disabled={!isInputFilled}
                >Update</button>
              </form>
              <p id="username-error" className={user.error}></p>
            </div>
          <button onClick={signOut} className={user.btnLogout}>Logout</button>
          </div>
        </div>
    </UserLayout>
  );
}