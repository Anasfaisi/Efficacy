import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Peer from 'simple-peer';
import { 
    Mic, MicOff, Video, VideoOff, PhoneOff, 
    Monitor, Settings, Users
} from 'lucide-react';
import { 
    joinVideoRoom, 
    onUserConnected, 
    onSignal, 
    signalPeer, 
    offVideoEvents, 
    connectSocket
} from '@/Services/socket/socketService';
import { useAppSelector } from '@/redux/hooks';

const VideoCallPage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAppSelector((state) => state.auth);
    
    // Distinguish identity
    const isMentor = currentUser?.role === 'mentor'; 
    const currentUserId = currentUser?.id;

    const [stream, setStream] = useState<MediaStream | null>(null);
    const streamRef = useRef<MediaStream | null>(null); 
    const [callAccepted, setCallAccepted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoStopped, setIsVideoStopped] = useState(false);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<string>('Initializing...');

    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<Peer.Instance | null>(null);
    const socketRef = useRef<any>(null);

    // Sync streams to video elements
    useEffect(() => {
        if (remoteStream && userVideo.current) {
            console.log("LOG: [Common] Syncing remoteStream to userVideo element.");
            userVideo.current.srcObject = remoteStream;
        }
    }, [remoteStream, callAccepted]);

    useEffect(() => {
        if (stream && myVideo.current) {
            console.log("LOG: [Common] Syncing local stream to myVideo element.");
            myVideo.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        // Initialize Socket
        socketRef.current = connectSocket();

        // Get Permissions
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                streamRef.current = currentStream;
                
                // Join Room ONLY after stream is ready
                if (roomId && currentUserId) {
                   setConnectionStatus('Waiting for other participant...');
                   joinVideoRoom(roomId, currentUserId, isMentor ? 'mentor' : 'user');
                }
            })
            .catch((err) => {
                console.error("Failed to get media:", err);
                setConnectionStatus('Camera/Microphone permission denied.');
            });

        // Socket Listeners
        if(isMentor) {
            onUserConnected(({ userId, socketId }) => {
                console.log("LOG: [Mentor] 'user-connected' received from:", userId, socketId);
                
                // Avoid double-calling the same socket if already connected
                if (connectionRef.current && !connectionRef.current.destroyed && connectionRef.current.connected) {
                    console.log("LOG: [Mentor] Already connected to a peer. Skipping redundant call.");
                    return;
                }

                setConnectionStatus('Connecting to student...');
                callUser(socketId);
            });
        }

        onSignal(({ signal, from }) => {
            console.log("LOG: [Common] 'signal' received. Type:", signal.type || 'candidate/other');
            
            // If we receive a new OFFER, it means the Mentor restarted the call.
            // We MUST destroy the old peer and create a new one to accept the new offer.
            if (signal.type === 'offer') {
                 if (connectionRef.current) {
                    console.log("LOG: [User] Received NEW Offer. Destroying old peer to restart.");
                    connectionRef.current.destroy();
                    connectionRef.current = null;
                 }
                 answerCall(signal, from);
                 return;
            }

            if (connectionRef.current && !connectionRef.current.destroyed) {
                console.log("LOG: [Common] Already have peer, signaling it.");
                try {
                    connectionRef.current.signal(signal);
                } catch (err) {
                    console.error("Error signaling peer:", err);
                }
            } else if (!isMentor) {
                 // Users answer calls, Mentors initiate them.
                 // If a Mentor receives a signal but has no peer, something is wrong, 
                 // but if a User receives a signal (offer), they should answer.
                 console.log("LOG: [User] No peer yet, calling answerCall.");
                 answerCall(signal, from);
            }
        });

        return () => {
            offVideoEvents();
            if(streamRef.current) {
               streamRef.current.getTracks().forEach(track => track.stop());
            }
            if(connectionRef.current) {
                connectionRef.current.destroy();
                connectionRef.current = null;
            }
        };
    }, [roomId]);

    // Mentor initiates the call
    const callUser = (userSocketId: string) => {
        console.log("LOG: [Mentor] callUser() called. checking streamRef...", streamRef.current);
        if(!streamRef.current) {
             console.error("LOG: [Mentor] ABORTING callUser because stream is null!");
             return;
        }

        if (connectionRef.current) {
            console.log("LOG: [Mentor] Found existing peer. Destroying before new call.");
            connectionRef.current.destroy();
            connectionRef.current = null;
        }
        
        console.log("LOG: [Mentor] Creating new Peer (initiator=true)...");
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: streamRef.current,
        });

        peer.on('signal', (data: any) => {
            console.log("LOG: [Mentor] Peer generated 'signal' (Offer). Sending to User:", userSocketId);
            signalPeer({
                to: userSocketId,
                signal: data,
                from: socketRef.current.id
            });
        });

        peer.on('stream', (currentRemoteStream: any) => {
            console.log("LOG: [Mentor] Received remote stream!");
            setRemoteStream(currentRemoteStream);
            setCallAccepted(true);
            setConnectionStatus('Connected');
        });

        peer.on('error', (err: any) => {
            console.error("Peer error:", err);
            setConnectionStatus('Connection Failed');
        });

        peer.on('close', () => {
            console.log("Peer connection closed");
            setCallAccepted(false);
        });

        connectionRef.current = peer;
    };

    const answerCall = (signal: any, fromId: string) => {
        console.log("LOG: [User] answerCall() called. checking streamRef...", streamRef.current);
        setCallAccepted(true);
        setConnectionStatus('Connecting...');

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: streamRef.current || undefined,
        });


        peer.on('signal', (data: any) => {
            signalPeer({ 
                to: fromId, 
                signal: data,
                from: socketRef.current.id 
            });
        });

        peer.on('stream', (currentRemoteStream: any) => {
            console.log("LOG: [User] Received remote stream!");
            setRemoteStream(currentRemoteStream);
            setConnectionStatus('Connected');
        });

        peer.signal(signal);
        
        connectionRef.current = peer;
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
            setIsAudioMuted(!isAudioMuted);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
            setIsVideoStopped(!isVideoStopped);
        }
    };

    const leaveCall = () => {
        if(connectionRef.current) {
            connectionRef.current.destroy();
        }
        navigate(-1);
    };

    return (
        <div className="h-screen w-full bg-gray-900 flex flex-col overflow-hidden relative">
            
            {/* Header / Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                        <Monitor className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg tracking-wide">Mentorship Session</h1>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${callAccepted ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                            <p className="text-white/60 text-xs font-medium">{connectionStatus}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Video Area */}
            <div className="flex-1 relative bg-[#0a0a0c] flex items-center justify-center p-6 sm:p-12">
                
                {/* Remote Participant Card */}
                <div className="w-full max-w-5xl aspect-video bg-gray-900 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative group">
                    {callAccepted && remoteStream ? (
                         <video 
                            ref={userVideo} 
                            playsInline 
                            autoPlay 
                            className="w-full h-full object-cover"
                         />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-gradient-to-br from-gray-900 to-black">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#7F00FF] blur-3xl opacity-20 animate-pulse" />
                                <div className="relative w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Users className="text-white/20 w-12 h-12" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-white/60 font-bold tracking-[0.2em] uppercase text-xs mb-1">Session Protocol</p>
                                <p className="text-white/30 text-sm">{connectionStatus}</p>
                            </div>
                        </div>
                    )}

                    {/* Participant Label */}
                    {callAccepted && (
                        <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                            <p className="text-white text-xs font-bold tracking-widest uppercase">Remote Participant</p>
                        </div>
                    )}
                </div>

                {/* Local Video - PiP Card */}
                {stream && (
                    <div className="absolute bottom-10 right-10 w-48 sm:w-72 aspect-video bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl transition-all hover:scale-105 z-40 ring-1 ring-white/10 group">
                         <video 
                            ref={myVideo} 
                            playsInline 
                            autoPlay 
                            muted 
                            className={`w-full h-full object-cover transform scale-x-[-1] transition-all duration-500 ${isVideoStopped ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                         />
                         {isVideoStopped && (
                             <div className="absolute inset-0 flex items-center justify-center bg-[#1a1b1e]">
                                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                     <VideoOff className="text-white/20 w-6 h-6" />
                                 </div>
                             </div>
                         )}
                         <div className="absolute top-4 right-4 h-2 w-2">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                         </div>
                         <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                             <p className="text-white text-[10px] font-black tracking-widest uppercase">Self View</p>
                         </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex justify-center">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                    
                    <button 
                        onClick={toggleMute}
                        className={`p-4 rounded-full transition-all duration-300 ${isAudioMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <button 
                        onClick={toggleVideo}
                        className={`p-4 rounded-full transition-all duration-300 ${isVideoStopped ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isVideoStopped ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>

                    <button 
                        onClick={leaveCall}
                        className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-red-600/30"
                    >
                        <PhoneOff size={24} />
                    </button>

                    <div className="w-px h-8 bg-white/10 mx-2" />

                    <button className="p-3 rounded-full bg-white/5 text-white/70 hover:bg-white/10 transition-all">
                        <Settings size={20} />
                    </button>
                    
                </div>
            </div>
        </div>
    );
};

export default VideoCallPage;
