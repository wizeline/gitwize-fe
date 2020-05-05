import React, { useState, useEffect } from 'react'
import { useOktaAuth } from '@okta/okta-react'
import {Table } from 'semantic-ui-react'

const Profile = () => {
  const { authState, authService } = useOktaAuth()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setUserInfo(null)
    } else {
      authService.getUser().then(info => {
        setUserInfo(info)
      })
    }
  }, [authState, authService])

  if (!userInfo) {
    return (
      <div>
        <p>Fetching user profile...</p>
      </div>
    )
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Claim</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(userInfo).map(claimEntry => {
          const claimName = claimEntry[0]
          const claimValue = claimEntry[1]
          const claimId = `claim-${claimName}`
          return (
            <tr key={claimName}>
              <td>{claimName}</td>
              <td id={claimId}>{claimValue}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default Profile
