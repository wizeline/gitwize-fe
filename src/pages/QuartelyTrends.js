import React from 'react'
import PageTitle from '../components/PageTitle'

function QuartelyTrends(props) {
	const {information} = props;
  return (
    <div style={{ width: '100%' }}>
      <PageTitle information={information}>Quartely Trends</PageTitle>
    </div>
  )
}

export default QuartelyTrends
