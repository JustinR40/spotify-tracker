import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Button, Image, Icon, Dropdown } from "semantic-ui-react";
import "./Home.css";
import { AUTH_ENDPOINT, font } from "../config";

const Home = () => {
    let history = useHistory();
    const [userInfo, setUserInfo] = useState();

    const isAuthenticated = () => sessionStorage.getItem("token") !== null;
    const openAuthWindow = (redirectToDash) => {
        const strWindowFeatures =
            "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";
        window.open(AUTH_ENDPOINT, "auth", strWindowFeatures);
        window.addEventListener("message", (event) => handleMessage(event, redirectToDash));
    };
    const handleMessage = (event, redirectToDash) => {
        const urlParams = new URLSearchParams(event.data);
        const code = urlParams.get("access_token");
        console.log(event, code);
        if (code) {
            authenticate(code);
            if (redirectToDash) {
                history.push("/dash");
            }
        }
    };
    const authenticate = (token) => {
        if (token) {
            sessionStorage.setItem("token", token);
            fetchUser();
        } else {
            sessionStorage.removeItem("token");
            setUserInfo(null);
        }
    };
    const fetchUser = () => {
        if (isAuthenticated()) {
            fetch("https://api.spotify.com/v1/me", {
                headers: new Headers({
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                }),
            })
                .then((resp) => resp.json())
                .then((data) => {
                    console.log(data);
                    setUserInfo({ name: data.display_name, picture: data.images[0].url });
                })
                .catch((error) => {
                    console.log(error);
                    if (error.status === 401) {
                    }
                });
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);
    const trigger = () => (
        <span>
            <Image src={userInfo.picture} avatar /> &nbsp;{userInfo.name}
        </span>
    );
    return (
        <div className="App">
            <div className="Navbar">
                <Container id="navbar-inner">
                    <Image src="/Spotify_Icon_RGB_Green.png" size="mini" inline />
                    <span className="Title">
                        <strong className="Text-Primary">Spotify</strong> Tracker
                    </span>
                    {userInfo && (
                        <div id="account">
                            <Dropdown trigger={trigger()} direction="left">
                                <Dropdown.Menu>
                                    <Dropdown.Item text="Profile" />
                                    <Dropdown.Item
                                        text="Log Out"
                                        onClick={() => authenticate(null)}
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    )}
                    {!userInfo && (
                        <Button style={font} onClick={() => openAuthWindow(false)}>
                            Log In
                        </Button>
                    )}
                </Container>
            </div>
            <Container className="Main">
                <h1 className="Header" style={font}>
                    Spotify Tracker
                </h1>
                <p className="Description">
                    Track your Spotify most listened songs, albums and much more!
                </p>
                <Button
                    size="huge"
                    inverted
                    style={font}
                    id="action"
                    onClick={() => {
                        if (isAuthenticated()) history.push("/dash");
                        else {
                            openAuthWindow(true);
                        }
                    }}
                >
                    Start &nbsp;
                    <svg id="icon" width="20" height="20" viewBox="0 0 512 512" fill="white">
                        <path
                            d="M506.134,241.843c-0.006-0.006-0.011-0.013-0.018-0.019l-104.504-104c-7.829-7.791-20.492-7.762-28.285,0.068
			c-7.792,7.829-7.762,20.492,0.067,28.284L443.558,236H20c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20h423.557
			l-70.162,69.824c-7.829,7.792-7.859,20.455-0.067,28.284c7.793,7.831,20.457,7.858,28.285,0.068l104.504-104
			c0.006-0.006,0.011-0.013,0.018-0.019C513.968,262.339,513.943,249.635,506.134,241.843z"
                        />
                    </svg>
                </Button>
                <Image src="/illu.jpg" size="large" id="illustration" rounded />
            </Container>
        </div>
    );
};

export default Home;
