import React, { useState, useEffect , useContext} from 'react'
import { useOktaAuth } from '@okta/okta-react'

import Chart from '../components/Chart'
import BranchFilter from '../components/BranchFilter'
import PageTitle from '../components/PageTitle'
import TableData from '../components/TableData'
import { ApiClient } from '../apis'
import { transformRepositoryStatsApiResponse } from '../utils/apiUtils'
import MainLayoutContex from '../contexts/MainLayoutContext'

const apiClient = new ApiClient()

function RepositoryStats(props) {
  const [repoData, setRepoData] = useState([]);
  const { authState } = useOktaAuth();
  const mainLayout = useContext(MainLayoutContex)
  const {id} = props.match.params;

  useEffect(() => {
    apiClient.setAccessToken(authState.accessToken)
    apiClient.stats.getRepoStats(1).then((data) => {
      setRepoData(transformRepositoryStatsApiResponse(data.metric))
    })
    mainLayout.handleDisplaySubMenu(true);
    mainLayout.handleChangeRepositoryId(id);
  }, [authState.accessToken, id, mainLayout])

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>Repository Request Stats</PageTitle>
      <BranchFilter />
      <TableData
        tableData={repoData}
        show={['Date', 'Commits', 'Additions', 'Deletions', 'Total lines of code', 'Change percent %']}
      />
      <Chart
        data={repoData}
        xAxis="Date"
        lines={['Commits', 'Additions']}
        bars={['Total lines of code', 'Deletions']}
      />
    </div>
  )
}

export default RepositoryStats
