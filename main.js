let App_id = "f9fab22e384e457a86fb840d6ac08dae";

let token = null;
let uid = String(Math.floor(Math.random() * 10000));

let client;
let channel;

let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get("room");

if (!roomId) {
    window.location = "lobby.html";
}

let localStream;
let remoteStream;
let peerConnection;

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
}

let constraints = {
    video: true,
    //when i apply the below code(videos dimension setting) the camera and mic stops working till the 2nd user is joined. Even when the 2nd user 
    //is joined, only the camera starts working but mic doesn't.

    // video: {
    //     width: {ideal: 1920},
    //     height: {ideal: 1080},
    // },
    audio: true
}

let init = async () => {
    client = await AgoraRTM.createInstance(App_id);
    await client.login({uid, token});

    channel = client.createChannel(roomId);
    await channel.join();

    channel.on("MemberJoined", handleUserJoined);
    channel.on("MemberLeft", handleUserLeft);
    client.on("MessageFromPeer", handleMessageFromPeer);

    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById("user-1").srcObject = localStream;
}

let handleUserJoined = async (MemberId) => {
    console.log("New user joined: ", MemberId);
    createOffer(MemberId);
}

let handleUserLeft = (MemberId) => {
    document.getElementById("user-2").style.display = "none";

    document.getElementById("user-1").classList.remove("smallFrame");
}

let handleMessageFromPeer = async (message, MemberId) => {
    message = JSON.parse(message.text);

    if (message.type === "offer") {
        createAnswer(MemberId, message.offer);
    }

    if (message.type === "answer") {
        addAnswer(message.answer);
    }

    if (message.type === "candidate") {
        if(peerConnection) {
            peerConnection.addIceCandidate(message.candidate);
        }
    }
}

let createPeerConnection = async (MemberId) => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById("user-2").srcObject = remoteStream;
    document.getElementById("user-2").style.display = "block";

    document.getElementById("user-1").classList.add("smallFrame");

    if (!localStream) {
        localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        document.getElementById("user-1").srcObject = localStream;
    }

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        })
    }

    peerConnection.onicecandidate = async (event) => {
        if(event.candidate) {
            client.sendMessageToPeer({text: JSON.stringify({"type": "candidate", "candidate": event.candidate})}, MemberId);
        }
    }
}

let createOffer = async(MemberId) => {
    await createPeerConnection(MemberId);

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    client.sendMessageToPeer({text: JSON.stringify({"type": "offer", "offer": offer})}, MemberId);
}

let createAnswer = async (MemberId, offer) => {
    await createPeerConnection(MemberId);

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    client.sendMessageToPeer({text: JSON.stringify({"type": "answer", "answer": answer})}, MemberId);
}

let addAnswer = async(answer) => {
    if(!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer);
    }
}

let leaveChannel = async () => {
    await channel.leave();
    await client.logout();
}

let toggleCamera = async () => {
    let videoTrack = localStream.getTracks().find(track => track.kind === "video");

    if (videoTrack.enabled) {
        videoTrack.enabled = false;
        document.getElementById("camera-btn").style.backgroundColor = "rgb(255, 80, 80)";
    } else {
        videoTrack.enabled = true;
        document.getElementById("camera-btn").style.backgroundColor = "rgb(172, 102, 249, .9)";
    }
}

let toggleMic = async () => {
    let audioTrack = localStream.getTracks().find(track => track.kind === "audio");

    if (audioTrack.enabled) {
        audioTrack.enabled = false;
        document.getElementById("mic-btn").style.backgroundColor = "rgb(255, 80, 80)";
    } else {
        audioTrack.enabled = true;
        document.getElementById("mic-btn").style.backgroundColor = "rgb(172, 102, 249, .9)";
    }
}


window.addEventListener("beforeunload", leaveChannel);

document.getElementById("camera-btn").addEventListener("click", toggleCamera);
document.getElementById("mic-btn").addEventListener("click", toggleMic);

init();