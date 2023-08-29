import { CLIENT_ID, CLIENT_SECRET } from '../../../lib/envVariables';
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  if (code) {
    const API_ENDPOINT = 'https://discord.com/api/v10';
    const data = new URLSearchParams();
    data.append('client_id', CLIENT_ID);
    data.append('client_secret', CLIENT_SECRET);
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', 'https://www.zoonlabs.com/userId');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    };
    try{

      const response = await fetch(`${API_ENDPOINT}/oauth2/token`, requestOptions);
      console.log(response);
      const tokenData = await response.json();

      const responseBody = JSON.stringify({ tokenData });
      return new Response(responseBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(error);
      return new Response('Error occurred while fetching access token.', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  } 
}
