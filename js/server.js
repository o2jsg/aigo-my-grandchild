import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { SerialPort } from "serialport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const apiPort = 3000;
const wsPort = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/openai", async (req, res) => {
  const { prompt, history } = req.body;

  const fullPrompt = `
    당신은 독거노인을 도와주는 손주입니다. 다음은 최근 대화 요약입니다:
    ${history.join("\n")}
    
    할아버지(또는 할머니)는 요즘 건강이 조금 좋지 않으시니, 부드럽고 친절한 어조로 대답해주세요. 

    다음 질문에 대해 대답해주세요: ${prompt}

    어린아이가 할아버지에게 이야기하듯, 유쾌하고 밝게 대답해주세요.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: fullPrompt }],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error during API call:", error);
    res
      .status(500)
      .json({ error: "Could not fetch response from OpenAI API." });
  }
});

app.listen(apiPort, () => {
  console.log(`Server is running on http://localhost:${apiPort}`);
});

// 시리얼 포트 설정 (포트 이름과 보드레이트를 실제 값으로 변경)
const portName = "COM5"; // 실제 사용 중인 포트 이름
const baudRate = 9600; // 보드레이트
const serialPort = new SerialPort({ path: portName, baudRate: baudRate });

// 시리얼 포트 에러 처리
serialPort.on("error", (err) => {
  console.error("시리얼 포트 에러", err.message);
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "..")));

// 클라이언트가 연결되었을 때
io.on("connection", (socket) => {
  console.log("유저와 연결되었습니다");

  socket.on("send-char", (char) => {
    console.log(`Sending character: ${char}`);
    serialPort.write(char, (err) => {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
      console.log("message written");
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// 서버 시작
server.listen(wsPort, () => {
  console.log(`WebSocket Server started on http://localhost:${wsPort}`);
});
