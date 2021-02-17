import React from 'react';
import settings from '../config/settings';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Pagination from "@material-ui/lab/Pagination";

const axios = require('axios').default;

const {apiBaseURL} = settings;

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInProgress: false,
            games: [
                { champion: 'Aatrox', date: '2021/01/27 12:45', win: false, position: 'Mid' },
                { champion: 'Akali', date: '2021/01/27 13:21', win: true, position: 'Mid' },
                { champion: 'Ahri', date: '2021/01/27 14:05', win: false, position: 'Mid' },
                { champion: 'Alistar', date: '2021/01/27 14:34', win: false, position: 'Support' },
                { champion: 'Amumu', date: '2021/01/29 16:03', win: true, position: 'Jungle' }
            ],
            page: 1,
            rowCount: 0,
            resultPerPage: 20
        };
        this.alert = React.createRef();
    }

    componentDidMount() {
        this.fetchResultsCount();
        this.fetchResults();
    }

    pageCount() {
        return Math.ceil(this.state.rowCount / this.state.resultPerPage);
    }

    skipCount() {
        return (this.state.page - 1) * this.state.resultPerPage;
    }

    limitCount() {
        return this.state.resultPerPage;
    }

    fetchResultsCount() {
        this.setState(state => ({...state, rowCount: 0}));

        axios.get(`${apiBaseURL}/challenge/Waterdance/playedCount`)
            .then(resp => this.setState(state => ({...state, rowCount: resp.data[0].count})))
            .catch(this.handleError.bind(this));
    }

    fetchResults() {
        axios.get(`${apiBaseURL}/challenge/Waterdance/results`,
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

    renderTableHeader() {
        let header = Object.keys(this.state.games[0])
        return header.map((key, index) => {
           return <th key={index}>{key.toUpperCase()}</th>
        })
     }

     renderWin(win) {
        let icon;
        if (win) {
            icon = <CheckCircleIcon style={{ color: 'green' }} fontSize="inherit"/>
        } else {
            icon = <CancelIcon style={{ color: 'red' }} fontSize="inherit"/>
        }
        return icon;
     }

    renderTableData() {
        return this.state.games.map((game, index) => {
           const { champion, date, win, position } = game //destructuring
           return (
              <tr key={champion}>
                 <td>{champion}</td>
                 <td>{date}</td>
                 <td>{this.renderWin(win)}</td>
                 <td>{position}</td>
              </tr>
           )
        })
     }

    render() {
        return <>
            <div>
                <h1>Waterdance Champion Challenge</h1>
                <table id='students'>
                    <tbody>
                        <tr>
                            <th key='0'>CHAMPION</th>
                            <th key='1'>DATE</th>
                            <th key='2'>WIN</th>
                            <th key='3'>POSITION</th>
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

export default Results;
