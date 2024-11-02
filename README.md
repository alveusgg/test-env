# Alveus Sanctuary Test Environment

This repository contains a simulated test environment for a lot of the services 
that are run at Alveus. This includes the following services:

  - [Controller Chatbot](https://github.com/alveusgg/chatbot)
  - Clips Service (WIP)
  - MediaMTX Proxy for Camera Feeds (WIP)
  - Simulated Cams using MediaMTX (ffmpeg) and a mocked Axis API server (WIP)
  - Mocked OBS Server (WIP)

## Requirements

Docker and Docker Compose are required to run this environment.

For development, you will also need Node.js and npm.

## Getting Started

Copy the `.env.example` file to `.env` and fill in the necessary values.

For the chatbot you will need to get Twitch access tokens. See [Chatbot](https://github.com/alveusgg/chatbot).

Run `docker compose up` to start up the environment.

## Connect with actual OBS on host machine

To test stuff in OBS you can run it on the host. For this, set up the scenes in 
OBS, enable the websocket server in OBS and configure the URL in `.env`.

```
OBS_WS=ws://host.docker.internal:4455
```

## Clips service

The clips service offers a very rudimentary API to retrieve clips.

The service is available at `http://localhost:12000` when started unless you 
changed the port in the `docker-compose.yaml` file.

Example to get a clip:

```
http://127.0.0.1:12000/get-clip/georgie/?start=2024-11-02T14:29:00.000Z&duration=30
```

This should give you an HTTP 200 response with the public URL to the clip.

```
/public/georgie-2024-10-2-14-29-0-0-30.mp4
```

You should be able to access the clip at `http://localhost:12000/public/georgie-2024-10-2-14-29-0-0-30.mp4`.
