import { WebSocketServer, WebSocket } from "ws";
import { WebSocketOpCode } from "obs-websocket-js";

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 12345;

const wss = new WebSocketServer({ port });

console.log(`Server started on port ${port}`);

function msg(op: number, d: unknown = {}) {
  return JSON.stringify({ op, d });
}

function err(label: string = "message") {
  return (e?: Error) => {
    if (e) {
      console.error(`Error ${label}`, e);
    } else {
      console.info(`Succcess ${label}`);
    }
  };
}

function snd(ws: WebSocket, label: string, op: number, d: unknown = {}) {
  ws.send(msg(op, d), err(`sending ${label}`));
}

function rsp(ws: WebSocket, label: string, d: unknown = {}) {
  ws.send(
    msg(WebSocketOpCode.RequestResponse, d),
    err(`responding to ${label}`),
  );
}

type ReqData = {
  requestId: number;
  requestType: string;
};

function rspGood({ requestId, requestType }: ReqData, responseData: unknown) {
  return {
    requestId,
    requestType,
    requestStatus: {
      result: true,
      comment: "",
      code: 0,
    },
    responseData,
  };
}

function GetCurrentProgramScene(d: ReqData) {
  return rspGood(d, { currentProgramSceneName: "customcams" });
}

function GetStudioModeEnabled(d: ReqData) {
  return rspGood(d, { studioModeEnabled: true });
}

function GetSceneItemList(d: ReqData) {
  return rspGood(d, {
    sceneItems: [
      {
        inputKind: null,
        isGroup: false,
        sceneItemBlendMode: "OBS_BLEND_NORMAL",
        sceneItemEnabled: true,
        sceneItemId: 1,
        sceneItemIndex: 0,
        sceneItemLocked: false,
        sceneItemTransform: [],
        sourceName: "Georgie",
        sourceType: "OBS_SOURCE_TYPE_SCENE",
      },
    ],
  });
}

function GetStreamStatus(d: ReqData) {
  return rspGood(d, {
    isStreaming: true,
  });
}

const requestHandlers = {
  GetCurrentProgramScene,
  GetStudioModeEnabled,
  GetSceneItemList,
  GetStreamStatus,
} as const;

function handleRequest(ws: WebSocket, d: ReqData) {
  if (requestHandlers[d.requestType]) {
    rsp(ws, d.requestType, requestHandlers[d.requestType](d));
  } else {
    console.log("Unknown request", d.requestType);
  }
}

wss.on("connection", function connection(ws) {
  console.log("connected");

  snd(ws, "Hello", WebSocketOpCode.Hello);

  ws.on("close", () => {
    console.log("disconnected");
  });

  ws.on("error", console.error);

  ws.on("message", (data) => {
    const messageString = data.toString();
    console.log("received: %s", messageString);

    try {
      const { op, d } = JSON.parse(messageString);

      switch (op) {
        case WebSocketOpCode.Identify:
          snd(ws, "Identified", WebSocketOpCode.Identified);
          break;

        case WebSocketOpCode.Request:
          handleRequest(ws, d);
          break;

        default:
          console.log("Unknown op", op);
      }
    } catch (e) {
      console.error("Error parsing message", e);
    }
  });
  ws.on("pong", () => {
    console.log("pong");
  });
  ws.on("ping", () => {
    console.log("ping");
  });
});
