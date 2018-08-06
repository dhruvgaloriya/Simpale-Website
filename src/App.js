import React,{Component} from 'react';
import ContestPreview from './ContestPreview';
import ContestList from './ContestList';
import Contest from './Contest';
import * as api from './api'


const pushState = (obj,url) => 
	window.history.pushState(obj,'',url);

const onPopState = handler => {
	window.onpopstate = handler;
}



const Header = (props) => {
	return(
		<h1 className = "Header text-center">
			{props.message}
		</h1>
	)
}

class App extends Component {

	state= {
		contests:this.props.initialData,
	}

	componentDidMount(){
		onPopState((event) => {
			this.setState({
				currentContestId:(event.state || {}).currentContestId 
			});
		})
	}

	componentWillUnmount(){
		onPopState(null);
	}

	fetchContest = (contestId) => {
		pushState(
			{currentContestId:contestId},
			`/contest/${contestId}`
		);

		api.fetchapi(contestId).then(contest => {
			this.setState({
				currentContestId:contest._id,
				contests:{
					...this.state.contests,
					[contest._id]:contest
				}
			});
		})
	}

	fetchContestList = () => {
		pushState(
			{currentContestId:null},
			'/'
		);

		api.fetchContestList().then(contests => {
			this.setState({
				currentContestId:null,
				contests
			});
		})
	}

	fetchNames = (nameIds) => {
		if (nameIds.length === 0) {
      return;
    }
    api.fetchNames(nameIds).then(names => {
      this.setState({
        names
      });
    });
	}


	current(){
		return this.state.contests[this.state.currentContestId]
	}

	pageHeader = () => {
		if(this.state.currentContestId){
			return this.current().contestName		
		}else{
			return 'Naming Contest';
		}
	}

	lookupName = (nameId) => {
    if (!this.state.names || !this.state.names[nameId]) {
      return {
        name: '...'
      };
    }
    return this.state.names[nameId];
  }

  addName = (newName,contestId) => {
  	api.addName(newName,contestId).then(resp => 
  		this.setState({
  			contests:{
  				...this.state.contests,
  				[resp.updatedContest._id]:resp.updatedContest
  			},
  			names:{
  				...this.state.names,
  				[resp.newName._id]:resp.newName
  			}
  		})
  	)
  	.catch(console.error);

  }

	currentContent = () => {
		if(this.state.currentContestId){
			return <Contest	addName = {this.addName}
											lookupName={this.lookupName}
											fetchNames = {this.fetchNames}
											contestLinkClick = {this.fetchContestList}
											{...this.current()} />;

		}else{
			return <ContestList onContestClick = {this.fetchContest}
													contests = {this.state.contests}/>
		}
	}


	render(){
		return(
			<div className ="App">
				<Header message = {this.pageHeader()}/>
				{this.currentContent()}
			</div>
		)
	}
}

export default App;