import React from 'react'
import { GoogleLogin } from 'react-google-login';
import {AppIds} from '../../config'
 
function SocialLoginButton(props) {

  const {handleLoginSuccess, handleLoginFailure, style, disabled=false, customRender} = props

  return (
      <GoogleLogin
        clientId={AppIds.GOOGLE_ID}
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