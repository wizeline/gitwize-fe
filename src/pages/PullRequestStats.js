import React, { useState, useEffect} from 'react'
import { useOktaAuth } from '@okta/okta-react'

import Chart from '../components/Chart'
import BranchFilter from '../components/BranchFilter'
import PageTitle from '../components/PageTitle'
import TableData from '../components/TableData'
import { ApiClient } from '../apis' 
import { transformRepositoryStatsApiResponse } from '../utils/apiUtils'

const apiClient = new ApiClient() 

function PullRequestStats(props) {
  const [repoData, setRepoData] = useState([]);
  const { authState } = useOktaAuth();
  const {id} = props.match.params;

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    apiClient.stats.getRepoStats(id).then(data => {setRepoData(transformRepositoryStatsApiResponse(data.metric))})
  }, [authState.accessToken])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>Pull Request Stats</PageTitle>
      <BranchFilter />
      <TableData tableData={repoData} show={["Date", "Merged", "Rejected", "Created"]}/>
      <Chart
        data={repoData}
        xAxis="Date"
        bars={['Created', 'Rejected', 'Merged']}
      />
    </div>
  )
}

export default PullRequestStats
