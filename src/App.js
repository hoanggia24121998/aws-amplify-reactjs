import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify, API, Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

Amplify.configure(
  {
    aws_cognito_region: 'ap-southeast-1',
    aws_project_region: 'ap-southeast-1',
    aws_user_pools_id: 'ap-southeast-1_dI7483Ck3', // (optional) -  Amazon Cognito User Pool ID
    aws_user_pools_web_client_id: '3a52bqplhfldtpgt1i6lni15in', // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
    aws_mandatory_sign_in: 'enable',
    aws_cloud_logic_custom: [
      {
        name: 'api-gw-sls',
        endpoint: 'https://3zpkuahlz7.execute-api.ap-southeast-1.amazonaws.com/dev',
        region: 'ap-southeast-1' // (required) - API Gateway region
      }]
  }
);

function App() {
  const getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const idToken = user.signInUserSession.idToken.jwtToken
    console.log(idToken)
    console.log(user)
    const myInit = {
      headers: {
        Authorization: `Bearer ${idToken}`
      },
      body: {
        email: user.attributes.email,
        date: new Date().toISOString
      }
    };

    const data = await API.post('api-gw-sls', '/hello', myInit)
    console.log(data)

  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <button onClick={getUserData}>Call API</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
