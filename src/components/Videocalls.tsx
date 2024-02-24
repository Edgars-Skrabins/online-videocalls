import { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';

const Videocalls = () => {
    const [peerId, setPeerId] = useState<string>('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>('');
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const currentUserVideoRef = useRef<HTMLVideoElement>(null);
    const peerInstance = useRef<Peer | null>(null);

    useEffect(() => {
        const peer = new Peer();

        peer.on('open', (id: string) => {
            setPeerId(id)
        });

        peer.on('call', (call: MediaConnection) => {
            const getUserMedia =
                //@ts-expect-error its never null
                navigator.getUserMedia //@ts-expect-error its never null
                || navigator.webkitGetUserMedia //@ts-expect-error its never null
                || navigator.mozGetUserMedia;

            getUserMedia?.({ video: true, audio: true }, (mediaStream: MediaStream) => {
                if (currentUserVideoRef.current) {
                    currentUserVideoRef.current.srcObject = mediaStream;
                    currentUserVideoRef.current.play();
                }
                call.answer(mediaStream)
                call.on('stream', function(remoteStream: MediaStream) {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                        remoteVideoRef.current.play();
                    }
                });
            });
        })
        peerInstance.current = peer;

        return () => {
            // Clean up peer instance on component unmount
            if (peerInstance.current) {
                peerInstance.current.destroy();
            }
        };
    }, [])

    const call = (remotePeerId: string) => {
        const getUserMedia =
            //@ts-expect-error its never null
            navigator.getUserMedia //@ts-expect-error its never null
            || navigator.webkitGetUserMedia //@ts-expect-error its never null
            || navigator.mozGetUserMedia;

        getUserMedia?.({ video: true, audio: true }, (mediaStream: MediaStream) => {
            if (currentUserVideoRef.current) {
                currentUserVideoRef.current.srcObject = mediaStream;
                currentUserVideoRef.current.play();
            }

            const call = peerInstance.current?.call(remotePeerId, mediaStream)

            call?.on('stream', (remoteStream: MediaStream) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream;
                    remoteVideoRef.current.play();
                }
            });
        });
    }

    return (
        <div className="App">
            <h1> {peerId} </h1>
            <div className="column">
                <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
                <button onClick={() => call(remotePeerIdValue)}>Call</button>
            </div>
            <div>
                <video ref={currentUserVideoRef} />
            </div>
            <div>
                <video ref={remoteVideoRef} />
            </div>
        </div>
    );
};

export default Videocalls;
