import React from "react";

const Authentication = () => {
    const params = window.location.hash;
    if (window.opener) {
        // send them to the opening window
        window.opener.postMessage(params.replace("#", "?"));
        // close the popup
        window.close();
    }

    return <div></div>;
};

export default Authentication;
