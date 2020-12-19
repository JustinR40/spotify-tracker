import React, { useEffect, useState } from "react";
import { Modal, Button, Image, Grid, Statistic } from "semantic-ui-react";
import { makeRequest } from "../request-utils";
import { from, forkJoin } from "rxjs";
import { distinct, toArray, flatMap, map } from "rxjs/operators";
import "./ArtistModal.css";
import { font } from "../config";

export default function ArtistModal(props) {
    const { open, setOpen, artistUri } = props;
    const [artistData, setArtistData] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (artistUri) {
            const artistData$ = from(makeRequest(artistUri, true).then((resp) => resp.json())).pipe(
                map((data) => ({
                    name: data.name,
                    photo: data.images[0].url,
                    followers: data.followers.total,
                }))
            );
            const albums$ = from(
                makeRequest(
                    artistUri + "/albums?include_groups=album&country=FR",
                    true
                ).then((resp) => resp.json())
            ).pipe(
                flatMap((data) => data.items),
                distinct((album) => album.name),
                toArray()
            );

            const topTracks$ = from(
                makeRequest(artistUri + "/top-tracks?country=FR", true).then((resp) => resp.json())
            ).pipe(map((data) => data.tracks));

            forkJoin({ bio: artistData$, albums: albums$, topTracks: topTracks$ }).subscribe(
                (data) => {
                    setArtistData(data);
                    setLoading(false);
                }
            );
        }
    }, [artistUri]);

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size="large"
            id="artist-modal"
        >
            {!loading && (
                <div id="modal-content">
                    <div id="modal-header">
                        <Image src={artistData.bio.photo} wrapped circular />
                        <h1 style={font}>{artistData.bio.name}</h1>
                        <Statistic inverted size="mini" id="followers">
                            <Statistic.Value>
                                {artistData.bio.followers.toLocaleString()}
                            </Statistic.Value>
                            <Statistic.Label>Followers</Statistic.Label>
                        </Statistic>
                    </div>
                    <div id="flex-container">
                        <div id="top-tracks">
                            <h3 style={font}>Popular songs</h3>
                            <dl>
                                {artistData.topTracks.map((track, idx) => (
                                    <dt key={idx}>
                                        <Image src={track.album.images.slice(-1)[0].url} avatar />
                                        <span>{track.name}</span>
                                        <Button icon="play" compact circular />
                                    </dt>
                                ))}
                            </dl>
                        </div>
                        <div id="discog">
                            <h3 style={font}>Discography</h3>
                            <Grid columns="3">
                                {artistData.albums.map((album, idx) => (
                                    <Grid.Column key={idx}>
                                        <Image
                                            wrapped
                                            size="small"
                                            src={album.images[0].url}
                                            rounded
                                        />
                                        <p>{album.name}</p>
                                        <small>{album.release_date}</small>
                                    </Grid.Column>
                                ))}
                            </Grid>
                        </div>
                    </div>
                </div>
            )}

            <Modal.Actions id="modal-actions">
                <Button onClick={() => setOpen(false)}>Close</Button>
            </Modal.Actions>
        </Modal>
    );
}
