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

Initialize the submodules:

```
git submodule init
git submodule update
```

Copy the `.env.example` file to `.env` and fill in the necessary values.

For the chatbot you will need to get Twitch access tokens. See [Chatbot](https://github.com/alveusgg/chatbot).

Run `docker compose up` to start up the environment.

## OBS

To test stuff in OBS you can run it on the host. For this, set up the scenes in 
OBS. You can import the Scene Collection in [obs/test-scene-collection/LiveCams.json](./obs/test-scene-collection/LiveCams.json) 
to get started. You will probably have "check for missing files" and select the same directory as the collection file.

Next enable the websocket server in OBS and configure the URL in `.env`:

```
OBS_WS=ws://host.docker.internal:4455
```

To get video from the MediaMTX proxy, you can use the following URL in the media sources (here for georgie):

```
rtsp://localhost:8554/georgie
```

### Mocked OBS Server (WIP)

If you do not want to use OBS on your host machine, you can use the mocked OBS server.

## Chatbot

TODO

## Clips service (WIP)

The clips service offers a very rudimentary API to retrieve clips.

The service is available at `http://localhost:12000` when started unless you 
changed the port in the `docker-compose.yaml` file.

Example to get a clip:

```
http://localhost:12000/get-clip/georgie/?start=2024-11-02T14:29:00.000Z&duration=30
```

This should give you an HTTP 200 response with the public URL to the clip.

```
/public/georgie-2024-10-2-14-29-0-0-30.mp4
```

You should be able to access the clip at `http://localhost:12000/public/georgie-2024-10-2-14-29-0-0-30.mp4`.

## MediaMTX Proxy (WIP)

TODO

## Simulated Cams (WIP)

To simulate the cameras, we use MediaMTX with a ffmpeg test source and a mocked Axis API server.

