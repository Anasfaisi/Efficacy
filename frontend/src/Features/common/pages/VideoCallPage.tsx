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
    const [callAccepted, setCallAccepted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoStopped, setIsVideoStopped] = useState(false);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<string>('Initializing...');

    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<Peer.Instance | null>(null);
    const socketRef = useRef<any>(null);

    useEffect(() => {
        // Initialize Socket
        socketRef.current = connectSocket();

        // Get Permissions
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
                
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
                console.log("User connected:", userId);
                setConnectionStatus('Connecting to student...');
                callUser(socketId);
            });
        }

        onSignal(({ signal, from }) => {
            answerCall(signal, from);
        });

        return () => {
            offVideoEvents();
            if(stream) {
               stream.getTracks().forEach(track => track.stop());
            }
            if(connectionRef.current) {
                connectionRef.current.destroy();
            }
        };
    }, [roomId]);

    // Mentor initiates the call
    const callUser = (userSocketId: string) => {
        if(!stream) return;
        
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on('signal', (data: any) => {
            signalPeer({
                to: userSocketId,
                signal: data,
                from: socketRef.current.id
            });
        });

        peer.on('stream', (currentRemoteStream: any) => {
            setRemoteStream(currentRemoteStream);
            if (userVideo.current) {
                userVideo.current.srcObject = currentRemoteStream;
            }
            setCallAccepted(true);
            setConnectionStatus('Connected');
        });

        peer.on('error', (err: any) => {
            console.error("Peer error:", err);
            setConnectionStatus('Connection Failed');
        });

        connectionRef.current = peer;
    };

    const answerCall = (signal: any, fromId: string) => {
        setCallAccepted(true);
        setConnectionStatus('Connecting...');

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream || undefined,
        });


        peer.on('signal', (data: any) => {
            signalPeer({ 
                to: fromId, 
                signal: data,
                from: socketRef.current.id 
            });
        });

        peer.on('stream', (currentRemoteStream: any) => {
            setRemoteStream(currentRemoteStream);
            if (userVideo.current) {
                userVideo.current.srcObject = currentRemoteStream;
            }
            setConnectionStatus('Connected');
            console.log(connectionStatus,"connection status from answer call in videocallpage ")
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
            <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
                
                {/* Remote Video (Full Screen) */}
                {callAccepted && remoteStream ? (
                     <video 
                        ref={userVideo} 
                        playsInline 
                        autoPlay 
                        className="w-full h-full object-cover"
                     />
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                            <Users className="text-white/40 w-10 h-10" />
                        </div>
                        <p className="text-white/40 font-medium">Waiting for participant...</p>
                    </div>
                )}

                {/* Local Video (Floating Picture-in-Picture) */}
                {stream && (
                    <div className="absolute bottom-24 right-6 w-48 sm:w-64 aspect-video bg-black/50 rounded-2xl overflow-hidden border border-white/20 shadow-2xl transition-all hover:scale-105 z-30 group">
                         <video 
                            ref={myVideo} 
                            playsInline 
                            autoPlay 
                            muted 
                            className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity ${isVideoStopped ? 'opacity-0' : 'opacity-100'}`}
                         />
                         {isVideoStopped && (
                             <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                     <VideoOff className="text-white/50 w-5 h-5" />
                                 </div>
                             </div>
                         )}
                         <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                             <p className="text-white text-[10px] font-medium tracking-wide">YOU</p>
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
