import React from 'react'
import { GoogleLogin } from 'react-google-login';
 
function SocialLoginButton(props) {

  const {handleLoginSuccess, handleLoginFailure, style, disabled=false, customRender} = props

  return (
      <GoogleLogin
        clientId="391481526966-n0boprgjj46fj8nslcpbh3h05v3rqci7.apps.googleusercontent.com"
        buttonText="Login With Google"
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
        disabled={disabled}
        disabledStyle={style}
        render={customRender ? customRender : null}
      />
  );
}
 
export default SocialLoginButton;