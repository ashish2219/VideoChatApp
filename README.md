
# Video Chat App

A simple video-calling web application built using HTML, CSS, JavaScript, and WebRTC. This app allows two users to connect to a video chat room by entering the same room number. The connection is powered by WebRTC and Agora for real-time messaging.


## Installation
To run this app locally, follow the steps below:

Clone this repository:

```bash
  git clone https://github.com/ashish2219/VideoChatApp.git

```
Navigate to the project directory:
```bash
  cd VideoChatApp

```
Open the lobby.html file in your browser:
```bash
  open lobby.html

```
    
## Features

- Real-time Video Chat: Users can join the same room and communicate via video and audio.
- Toggle Camera and Microphone: Users can turn their camera and microphone on or off during the call.
- Simple Room System: Users enter the room by inputting a room number.
- Dynamic UI: Automatically adjusts the user interface as participants join or leave the room.


## Tech Stack

**HTML/CSS:** For structure and styling.

**JavaScript:** For the application logic.

**WebRTC:** To enable peer-to-peer video and audio communication.

**Agora RTM:** For real-time messaging between peers.


## How to Use

1. Open the application link: https://ashish2219.github.io/VideoChatApp/lobby.html
2. Enter a room number: On the lobby page, enter a room number and join.
3. Share the room number: The second user enters the same room number to join the video chat.
4. Start chatting: The connection will be established, and both users can video chat.
5. Toggle camera/microphone: Use the camera and mic buttons to control the video/audio streams.
## Dependencies

1. Agora RTM SDK: Used for real-time messaging and signaling.
2. WebRTC: For establishing peer-to-peer connections.
3. STUN Servers: To facilitate NAT traversal for WebRTC.
## Known Issues

1. Delayed Camera & Microphone Activation: The camera and microphone do not activate until the second user joins the room.
2. Microphone Not Working: Occasionally, the microphone may not function even after the second user joins.
## Contributing

Contributions are always welcome!

Please fork this repository, make your changes, and submit a pull request.

