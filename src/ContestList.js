import React from 'react';
import ContestPreview from './ContestPreview';
//import {Link} from 'react-router-dom';

const ContestList = ({contests,onContestClick}) => (
		<div className = "ContestList">
			{Object.keys(contests).map(contestId => 
				<ContestPreview onClick = {onContestClick}key={contestId}{...contests[contestId]}/>
			)}
		</div>	
)
export default ContestList;