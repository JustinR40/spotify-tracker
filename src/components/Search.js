import React from "react";
import { Sidebar, Menu, Icon, Form, Header, Image, List } from "semantic-ui-react";
import { makeRequest } from "../request-utils";
import "./Search.css";

export const Search = (props) => {
    const [visible, setVisible] = React.useState(false);
    const [results, setResults] = React.useState([]);
    const [searchLoading, setSearchLoading] = React.useState(false);

    const onSearchChange = (event: React.KeyboardEvent) => {
        const key = event.key;
        const value = event.target.value;
        if (key === "Enter") {
            setSearchLoading(true);
            makeRequest("/search?type=artist&limit=5&q=" + value)
                .then((data) => data.json())
                .then((res) => {
                    if (res.artists?.items?.length > 0) {
                        console.log("found");
                        setResults(res.artists.items);
                        setSearchLoading(false);
                    }
                });
        }
    };

    const onClickArtist = (href) => {
        props.setArtistModalState({
            open: true,
            artistUri: href,
        });
        setVisible(false);
    };
    return (
        <>
            <Icon
                name="search"
                id="icon-search"
                size="large"
                onClick={() => {
                    setVisible(true);
                    props.setSidebarVisible(true);
                }}
            ></Icon>
            <Sidebar
                as={Menu}
                animation="overlay"
                icon="labeled"
                inverted
                direction="right"
                onHide={() => {
                    setVisible(false);
                    props.setSidebarVisible(true);
                }}
                vertical
                visible={visible}
                width="wide"
                id="sidebar"
            >
                <Header as="h3" inverted textAlign="left">
                    Search Artist
                </Header>
                <Form.Input
                    type="text"
                    icon="search"
                    fluid
                    onKeyPress={(event) => onSearchChange(event)}
                    loading={searchLoading}
                ></Form.Input>

                <List
                    selection
                    divided
                    relaxed
                    verticalAlign="middle"
                    floated="left"
                    id="list-result"
                >
                    {results.map((artist, idx) => (
                        <List.Item key={idx} onClick={() => onClickArtist(artist.href)}>
                            <Image
                                src={
                                    artist.images.length > 0
                                        ? artist.images[0].url
                                        : "https://react.semantic-ui.com/images/wireframe/square-image.png"
                                }
                                avatar
                            />
                            <List.Content verticalAlign="middle">
                                <span>{artist.name}</span>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            </Sidebar>
        </>
    );
};
