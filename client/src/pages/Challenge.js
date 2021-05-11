import React from 'react';
import "../styles/App.css";
import settings from '../config/settings';
import Pagination from "@material-ui/lab/Pagination";

const axios = require('axios').default;
const {apiBaseURL} = settings;

class Challenge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInProgress: false,
            games: [
                { number: 1, champion: '...' }
            ],
            page: 1,
            rowCount: 0,
            playedCount: 0
        };
        this.alert = React.createRef();
    }

    componentDidMount() {
        this.fetchResultsCount();
        this.fetchResults();
        this.fetchPlayedCount();
    }

    pageCount() {
        return Math.ceil(this.state.rowCount / 10);
    }

    skipCount() {
        return (this.state.page - 1) * 10;
    }

    limitCount() {
        return 10;
    }

    fetchResultsCount() {
        this.setState(state => ({...state, rowCount: 0}));

        axios.get(`${apiBaseURL}/challenge/Waterdance/nextCount`)
            .then(resp => this.setState(state => ({...state, rowCount: resp.data[0].count})))
            .catch(this.handleError.bind(this));
    }

    fetchPlayedCount() {
        this.setState(state => ({...state, rowCount: 0}));

        axios.get(`${apiBaseURL}/challenge/Waterdance/playedCount`)
            .then(resp => this.setState(state => ({...state, playedCount: resp.data[0].count})))
            .catch(this.handleError.bind(this));
    }

    fetchResults() {
        //axios.get(`${apiBaseURL}/challenge/${this.props.user}/next`)
        axios.get(`${apiBaseURL}/challenge/Waterdance/next`,
            {params: {skip: this.skipCount(), limit: this.limitCount()}})
            .then(resp => this.setState(state => ({...state, games: resp.data})))
            .catch(this.handleError.bind(this))
            .finally(() => this.setState(state => ({...state, searchInProgress: false})));
    }

    handleChangePage(event, newPage) {
        this.setState(
            state => ({...state, page: newPage}),
            () => {
                this.fetchResults();
            }
        );
    }

    handleError(err) {
        if (this.alert.current) {
            this.alert.current.handleError(err);
        } else {
            console.log(err);
        }
    }

    renderTableData() {
        return this.state.games.map((game, index) => {
            const { champion } = game //destructuring
            var total = (this.state.rowCount) + (this.state.playedCount)
            var number = (index+1)+10*(this.state.page-1)
            var x = (this.state.playedCount+number)/total
            console.log("total: " + total)
            console.log("number: " + number)
            console.log("x: " + x)
            return (
                <tr key={champion}>
                    <td>{number}</td>
                    <td>{champion}</td>
                    <td>{Math.round((x)*1000)/10}%</td>
                </tr>
           )
        })
     }

    render() {
        return <>
            <div>
                <h1>Waterdance Champion Challenge</h1>
                <table id='next_champions'>
                    <tbody>
                        <tr>
                            <th key='0'>NUMBER</th>
                            <th key='1'>CHAMPION</th>
                            <th key='2'>DONE</th>
                        </tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
            <div>
                <Pagination
                    color="primary"
                    count={this.pageCount()}
                    siblingCount={1}
                    page={this.state.page}
                    onChange={this.handleChangePage.bind(this)}
                />
            </div>
        </>
    }
}

export default Challenge;
