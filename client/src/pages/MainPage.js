import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import TabPanel from "@material-ui/lab/TabPanel";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import Results from "./Results";
import Challenge from "./Challenge"

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: "results"
        };
    }

    render() {
        return <>
            <div>
                <TabContext value={this.state.tabValue}>
                    <AppBar position="static">
                        <TabList onChange={(ev, val) => {this.setState(state => ({...state, tabValue: val}))}}>
                            <Tab label="Next champions" value="next" />
                            <Tab label="Results" value="results" />
                        </TabList>
                    </AppBar>
                    <TabPanel value="next"><Challenge user={this.props.user} /></TabPanel>
                    <TabPanel value="results"><Results user={this.props.user} /></TabPanel>
                </TabContext>
            </div>
        </>
    }
}

export default MainPage;