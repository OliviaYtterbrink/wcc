import React from "react";

const ProgressBar = (props) => {
    const { bgcolor, completed, done, total } = props;

    const containerStyles = {
        height: 20,
        width: '95%',
        backgroundColor: "#e0e0de",
        borderRadius: 50,
        margin: 50
    }

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        textAlign: 'right'
    }

    const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold'
    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${completed}%`}</span>
            </div>
            <h4 style={{width: '100%', textAlign: 'right'}}>Played {done}/{total} champions</h4>
        </div>
    );
};

export default ProgressBar;
