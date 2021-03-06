import React from 'react';
import settings from '../config/settings';
import ProgressBar from '../elements/ProgressBar';

const axios = require('axios').default;
const {apiBaseURL} = settings;

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInProgress: false,
            remainCount: 0,
            playedCount: 0,
            champCount: 0,
            completed: 0,
            stats : [
                { position: 'Top', count: 0 },
                { position: 'Jungle', count: 0 },
                { position: 'Mid', count: 0 },
                { position: 'Bot', count: 0 },
                { position: 'Support', count: 0 },
            ],
        };
        this.alert = React.createRef();
    }

    fetchStats() {
        axios.get(`${apiBaseURL}/challenge/Waterdance/positionsPlayed`)
            .then(resp => this.setState(state => ({...state, stats: resp.data})))
            .catch(this.handleError.bind(this))
            .finally(() => this.setState(state => ({...state, searchInProgress: false})));
    }

    fetchCounts() {
        this.setState(state => ({...state, remainCount: 0, playedCount: 0}));
        axios.get(`${apiBaseURL}/challenge/Waterdance/nextCount`)
    }

    fetchRemainingCount() {
        this.setState(state => ({...state, remainCount: 0}));
        axios.get(`${apiBaseURL}/challenge/Waterdance/nextCount`)
            .then(resp => this.setState(state => ({...state, remainCount: resp.data})))
            .catch(this.handleError.bind(this));
    }

    fetchPlayedCount() {
        this.setState(state => ({...state, playedCount: 0}));
        axios.get(`${apiBaseURL}/challenge/Waterdance/playedCount`)
            .then(resp => this.setState(state => ({...state, playedCount: resp.data})))
            .catch(this.handleError.bind(this));
    }

    handleError(err) {
        if (this.alert.current) {
            this.alert.current.handleError(err);
        } else {
            console.log(err);
        }
    }

    componentDidMount() {
        axios.get(`${apiBaseURL}/challenge/Waterdance/nextCount`)
            .then(resp => {
                this.setState(state => ({...state, remainCount: resp.data[0].count}));
                return axios.get(`${apiBaseURL}/challenge/Waterdance/playedCount`);
            }).then(resp => {
                this.setState(state => ({...state, playedCount: resp.data[0].count}));
                let remain = parseInt(this.state.remainCount);
                let played = parseInt(this.state.playedCount);
                let total = remain + played;
                let completed = Math.round((played/total)*1000)/10;
                this.setState(state => ({...state, completed: completed, champCount: total}));
            }).catch(this.handleError.bind(this));
        this.fetchStats();
    }

    renderTableData() {
        return this.state.stats.map((stat, index) => {
           const { position, count } = stat //destructuring
           return (
              <tr key={position}>
                 <td style={{paddingRight: 50}}>{position}</td>
                 <td style={{textAlign: 'center'}}>{count}</td>
              </tr>
           )
        })
     }

    render() {
        return <>
            <div>
                <h2>Waterdance is doing her own personal challenge of playing every League of Legends Champion at least once with no repeats and in alphabetical order! Started 1/27/2021!</h2>
                <ProgressBar key='progress' bgcolor="#6a1b9a" completed={this.state.completed} done={this.state.playedCount} total={this.state.champCount} />
                <h3>Unless advice is asked for, please keep your thoughts on builds to yourself. This challenge is not concerned with playing every champion perfectly.</h3>
            </div>
            <div>
                <h4>Postions played count</h4>
                <table id='positions'>
                    <tbody>
                        <tr>
                        </tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        </>
    }
}
// <h3>Unless advice is asked for, please keep your thoughts on builds to yourself.<br/> This challenge is not concerned with playing every champion perfectly.</h3>
export default About;