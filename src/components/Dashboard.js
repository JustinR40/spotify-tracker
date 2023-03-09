import React, { useState, useEffect } from "react";
import { Button, Table, Image, Dropdown, Icon, Sidebar } from "semantic-ui-react";
import "./Dashboard.css";
import ArtistModal from "./ArtistModal";
import { Search } from "./Search";
import { makeRequest } from "../request-utils";
import { font } from "../config";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
    let history = useHistory();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [topArtists, setTopArtists] = useState({});
    const [topTracks, setTopTracks] = useState({});
    const [deviceId, setDeviceId] = useState(null);
    const [currentlyListening, setCurrentlyListening] = useState(null);
    const [artistModalState, setArtistModalState] = useState({ open: false, artistUri: "" });
    const setArtistModalOpen = (state) => setArtistModalState({ ...artistModalState, open: state });

    const timeRanges = [
        {
            key: "short_term",
            value: "short_term",
            text: "Last month",
            content: "Last month",
        },
        {
            key: "medium_term",
            value: "medium_term",
            text: "Last 6 months",
            content: "Last 6 months",
        },
        {
            key: "long_term",
            value: "long_term",
            text: "All time",
            content: "All time",
        },
    ];

    const fetchArtists = (time_range = "medium_term") => {
        makeRequest("/me/top/artists?time_range=" + time_range)
            .then((resp) => resp.json())
            .then(setTopArtists);
    };
    const fetchTracks = (time_range = "medium_term") => {
        makeRequest("/me/top/tracks?time_range=" + time_range)
            .then((resp) => resp.json())
            .then(setTopTracks);
    };

    const fetchCurrentListen = () => {
        makeRequest("/me/player")
            .then((resp) => resp.json())
            .then((data) => {
                if (data.is_playing) {
                    setCurrentlyListening(data.item);
                } else {
                    setCurrentlyListening(null);
                }
            })
            .catch(console.log);
    };
    useEffect(() => {
        fetchArtists();
        fetchTracks();
        makeRequest("/me/player/devices")
            .then((resp) => resp.json())
            .then((data) => {
                if (data?.devices) {
                    setDeviceId(data.devices[0].id);
                }
            });

        const it = setInterval(fetchCurrentListen, 1000 * 10);
        fetchCurrentListen();
        return () => {
            clearInterval(it);
        };
    }, []);

    return (
        <Sidebar.Pushable dimmed={sidebarVisible}>
            <Search
                setSidebarVisible={() => setSidebarVisible()}
                setArtistModalState={(state) => setArtistModalState(state)}
            ></Search>

            <Sidebar.Pusher dimmed={sidebarVisible}>
                <div id="dashboard" className="text-white">
                    <ArtistModal
                        open={artistModalState.open}
                        setOpen={setArtistModalOpen}
                        artistUri={artistModalState.artistUri}
                    />
                    <div id="currently-listening">
                        <Icon name="music" />
                        &nbsp;
                        {currentlyListening &&
                            currentlyListening.name + " - " + currentlyListening.artists[0].name}
                        {!currentlyListening && "Currently not playing any song"}
                    </div>
                    <div id="artists-container">
                        <h2 style={font}>Top Artists</h2>
                        <span>From: </span>
                        <Dropdown
                            inline
                            options={timeRanges}
                            defaultValue="medium_term"
                            onChange={(event, data) => {
                                fetchArtists(data.value);
                            }}
                        />
                        <Table basic celled collapsing inverted compact selectable padded>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell textAlign="center">N°</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {topArtists.items &&
                                    topArtists.items.map((item, idx) => (
                                        <Table.Row key={item.id}>
                                            <Table.Cell textAlign="center">{idx + 1}</Table.Cell>
                                            <Table.Cell
                                                className="artist-name"
                                                onClick={() =>
                                                    setArtistModalState({
                                                        open: true,
                                                        artistUri: item.href,
                                                    })
                                                }
                                            >
                                                <Image src={item.images[0]?.url} avatar />
                                                &nbsp;
                                                <span>{item.name}</span>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table>
                    </div>
                    <div id="tracks-container">
                        <h2 style={font}>Top Tracks</h2>
                        <span>From: </span>
                        <Dropdown
                            inline
                            options={timeRanges}
                            defaultValue="medium_term"
                            onChange={(event, data) => {
                                fetchTracks(data.value);
                            }}
                        />
                        <Table basic selectable celled inverted>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell textAlign="center">N°</Table.HeaderCell>
                                    <Table.HeaderCell>Track</Table.HeaderCell>
                                    <Table.HeaderCell>Artist</Table.HeaderCell>
                                    <Table.HeaderCell>Album</Table.HeaderCell>
                                    <Table.HeaderCell>Play</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {topTracks.items &&
                                    topTracks.items.map((item, idx) => (
                                        <Table.Row key={item.id}>
                                            <Table.Cell textAlign="center">{idx + 1}</Table.Cell>
                                            <Table.Cell className="Text-Primary">
                                                <strong>{item.name}</strong>
                                            </Table.Cell>
                                            <Table.Cell>{item.artists[0].name}</Table.Cell>
                                            <Table.Cell>{item.album.name}</Table.Cell>
                                            <Table.Cell>
                                                <Button.Group>
                                                    <Button
                                                        icon="play"
                                                        onClick={() =>
                                                            makeRequest(
                                                                "/me/player/play?device_id=" +
                                                                    deviceId,
                                                                false,
                                                                "PUT",
                                                                {
                                                                    uris: [item.uri],
                                                                }
                                                            ).then(fetchCurrentListen)
                                                        }
                                                    ></Button>
                                                    <Button
                                                        icon="stop"
                                                        onClick={() =>
                                                            makeRequest(
                                                                "/me/player/pause?device_id=" +
                                                                    deviceId,
                                                                false,
                                                                "PUT"
                                                            ).then(fetchCurrentListen)
                                                        }
                                                    />
                                                </Button.Group>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
};

export default Dashboard;
