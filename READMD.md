# 독거노인을 위한 인공지능 챗봇 + 스마트홈 시스템

---


## 제작 개요


아이고 내 손주는 요즘 사회적인 문제로 독거노인 문제가 크게 대두되고 있는데 이런 문제를 해결하기 위해 제작하게 되었습니다. 


web speech api안에 있는 stt,tts 와 openai api를 사용해서 챗봇을 구현하여 육성으로 대화할 수 있게 만들게 되었고 


상황에 맞는 대화를 하기위해 데이터셋을 만들고 fine-tuning하여 대화가 부드럽게 진행될 수 있게 만들었습니다. 


또한 스마트홈을 손 쉽게 제어하기 위해 stm32로 만들어져 있는 집에 구조물들을 node serialport를 통해 시리얼 통신하여 웹 페이지에서도 집을 제어할 수 있고  openweather api를 사용해서 날씨 정보를 불러와 오늘의 날씨,습도,미세먼지,주간날씨등을 볼 수 있습니다. 


독거노인분들은 노인분들이기에 약 먹는 시간도 잊어버리시는 것을 대비하여 약 타이머도 만들게 되었습니다