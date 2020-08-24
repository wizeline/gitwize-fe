import React from 'react'
import SocialLogin from 'react-social-login'
 
function SocialButton(props) {

  const { children, triggerLogin } = props

  return (
      <button onClick={triggerLogin}>
        { children }
      </button>
  );
}
 
export default SocialLogin(SocialButton);