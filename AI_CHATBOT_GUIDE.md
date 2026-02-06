# Руководство по созданию ИИ-агента для чат-бота

## Архитектура чат-бота с ИИ-агентом

### Компоненты системы:

```
┌─────────────┐
│   Пользователь   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Frontend (Web)  │ ← React/Vue/HTML
└──────┬──────────┘
       │ HTTP/WebSocket
       ▼
┌─────────────────┐
│  Backend API     │ ← Node.js/Python (FastAPI/Express)
└──────┬──────────┘
       │
       ├──► ┌──────────────┐
       │    │  LangChain   │ ← Оркестрация агента
       │    └──────┬───────┘
       │           │
       │           ├──► ┌──────────────┐
       │           │    │     LLM      │ ← Модель (бесплатная)
       │           │    └──────────────┘
       │           │
       │           ├──► ┌──────────────┐
       │           │    │   Memory     │ ← История диалога
       │           │    └──────────────┘
       │           │
       │           └──► ┌──────────────┐
       │                │    Tools      │ ← Функции (поиск, БД)
       │                └──────────────┘
       │
       └──► ┌──────────────┐
            │   Database   │ ← PostgreSQL/MongoDB
            └──────────────┘
```

## Бесплатные LLM для чат-бота (аудитория ~1000 человек)

### 1. Google Gemini API (РЕКОМЕНДУЕТСЯ)

**Бесплатный лимит:**
- **1500 запросов в сутки** (достаточно для ~1000 пользователей)
- Gemini 1.5 Flash, 2.0 Flash
- Контекст: до 32,768 токенов (~25,000 слов)
- Поддержка: текст, изображения, аудио

**Оценка для 1000 пользователей:**
- Средний пользователь: 3-5 сообщений в день
- Всего сообщений: ~3000-5000/день
- **Проблема:** Лимит 1500 запросов может быть недостаточен
- **Решение:** Комбинировать с другими API или использовать платный тариф ($0.075/1M токенов)

**Как использовать:**
```python
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key="YOUR_API_KEY",
    temperature=0.7
)
```

### 2. OpenAI API (Бесплатный кредит)

**Бесплатный лимит:**
- **$100 кредит** при регистрации (достаточно на ~2-3 месяца)
- GPT-3.5-turbo: 3 запроса/минуту, 40,000 токенов/минуту
- После исчерпания: от $0.50/1M токенов (GPT-3.5-turbo)

**Оценка для 1000 пользователей:**
- При 3000 сообщений/день: ~$15-30/месяц (после бесплатного кредита)
- **Плюс:** Высокое качество ответов
- **Минус:** Ограниченный бесплатный период

### 3. Hugging Face Inference API (БЕСПЛАТНО)

**Бесплатный лимит:**
- **30,000 запросов/месяц** бесплатно
- Доступ к моделям: Llama 2, Mistral, Zephyr и др.
- После лимита: от $0.03/1K токенов

**Оценка для 1000 пользователей:**
- 3000 сообщений/день × 30 дней = 90,000/месяц
- **Проблема:** Превышает бесплатный лимит
- **Решение:** Использовать для части запросов или локально

**Как использовать:**
```python
from langchain_huggingface import HuggingFacePipeline

llm = HuggingFacePipeline.from_model_id(
    model_id="mistralai/Mistral-7B-Instruct-v0.2",
    task="text-generation",
    model_kwargs={"temperature": 0.7}
)
```

### 4. Ollama (Локальное развертывание) - САМОЕ ЭКОНОМНОЕ

**Стоимость:**
- **Полностью бесплатно** (только стоимость сервера)
- Работает на вашем сервере
- Неограниченное количество запросов
- Приватность данных

**Требования к серверу:**
- Минимум: 8GB RAM (для Mistral 7B)
- Рекомендуется: 16GB RAM + GPU (для скорости)
- Стоимость VPS: от $10-20/месяц (Hetzner, DigitalOcean)

**Модели:**
- `llama3.2` (3B) - быстрая, легкая
- `mistral` (7B) - хорошее качество
- `llama3.1` (8B) - баланс качества/скорости

**Оценка для 1000 пользователей:**
- Сервер: $15-30/месяц
- Электричество: включено в VPS
- **Итого: ~$20-30/месяц** (вместо $100-500 за API)

**Как использовать:**
```python
from langchain_community.llms import Ollama

llm = Ollama(
    model="mistral",
    base_url="http://localhost:11434",
    temperature=0.7
)
```

### 5. Groq API (ОЧЕНЬ БЫСТРЫЙ И ДЕШЕВЫЙ)

**Бесплатный лимит:**
- **14,400 запросов/день** бесплатно
- Очень быстрая обработка (до 500 токенов/сек)
- Модели: Llama 3, Mixtral, Gemma

**Оценка для 1000 пользователей:**
- Лимит покрывает ~3000-5000 сообщений/день
- После лимита: от $0.10/1M токенов (очень дешево)

**Как использовать:**
```python
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.1-70b-versatile",
    groq_api_key="YOUR_API_KEY",
    temperature=0.7
)
```

## Рекомендуемая стратегия для 1000 пользователей

### Вариант 1: Гибридный подход (оптимальный)

```
1. Ollama (локально) - 70% запросов
   ├─ Стоимость: $20/месяц (VPS)
   ├─ Приватность данных
   └─ Неограниченные запросы

2. Gemini API - 20% запросов (сложные вопросы)
   ├─ Бесплатно: 1500 запросов/день
   └─ Качественные ответы

3. Groq API - 10% запросов (резерв)
   ├─ Бесплатно: 14,400 запросов/день
   └─ Очень быстрая обработка
```

**Общая стоимость: ~$20-30/месяц**

### Вариант 2: Только API (проще в настройке)

```
1. Gemini API - основной (1500 запросов/день)
2. Groq API - резерв (14,400 запросов/день)
3. Hugging Face - для специфических задач
```

**Общая стоимость: $0-50/месяц** (зависит от нагрузки)

## Пример реализации чат-бота на LangChain

### Структура проекта:

```
chatbot/
├── backend/
│   ├── main.py              # FastAPI сервер
│   ├── agent.py             # LangChain агент
│   ├── memory.py            # Управление памятью
│   └── tools.py             # Инструменты агента
├── frontend/
│   └── chat.html            # Простой интерфейс
└── requirements.txt
```

### Код агента (agent.py):

```python
from langchain.agents import AgentExecutor, create_react_agent
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.llms import Ollama  # или другой LLM
from langchain.memory import ConversationBufferMemory
from langchain.tools import Tool
from langchain_core.messages import HumanMessage, AIMessage

class ChatBotAgent:
    def __init__(self):
        # Выбор LLM (можно менять)
        self.llm = Ollama(
            model="mistral",
            base_url="http://localhost:11434",
            temperature=0.7
        )
        
        # Память диалога
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        # Инструменты агента
        self.tools = self._create_tools()
        
        # Промпт для агента
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """Ты полезный помощник для сайта avtozakaz74.
            Помогай пользователям находить автомобили, отвечай на вопросы о ценах,
            доставке и характеристиках. Будь дружелюбным и информативным."""),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
        
        # Создание агента
        self.agent = create_react_agent(
            self.llm,
            self.tools,
            self.prompt
        )
        
        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=self.tools,
            memory=self.memory,
            verbose=True
        )
    
    def _create_tools(self):
        """Создание инструментов для агента"""
        def search_cars(query: str) -> str:
            """Поиск автомобилей по запросу"""
            # Интеграция с вашим API поиска
            # return results
            return "Найдено 15 автомобилей по вашему запросу"
        
        def get_price_info() -> str:
            """Получение информации о ценах"""
            return "Цены включают стоимость автомобиля, таможню и утилизационный сбор"
        
        return [
            Tool(
                name="search_cars",
                func=search_cars,
                description="Поиск автомобилей на сайте. Используй когда пользователь ищет машину."
            ),
            Tool(
                name="get_price_info",
                func=get_price_info,
                description="Информация о ценах и тарифах. Используй для вопросов о стоимости."
            ),
        ]
    
    def chat(self, message: str, user_id: str) -> str:
        """Обработка сообщения пользователя"""
        try:
            response = self.agent_executor.invoke({
                "input": message,
                "chat_history": self.memory.chat_memory.messages
            })
            return response["output"]
        except Exception as e:
            return f"Извините, произошла ошибка: {str(e)}"
```

### Backend API (main.py):

```python
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from agent import ChatBotAgent
import json

app = FastAPI()

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация агента
agent = ChatBotAgent()

@app.get("/")
def read_root():
    return {"status": "ChatBot API is running"}

@app.post("/chat")
async def chat_endpoint(message: dict):
    """HTTP endpoint для чата"""
    user_message = message.get("message", "")
    user_id = message.get("user_id", "anonymous")
    
    response = agent.chat(user_message, user_id)
    
    return {
        "response": response,
        "user_id": user_id
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint для реального времени"""
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            user_message = message_data.get("message", "")
            user_id = message_data.get("user_id", "anonymous")
            
            # Получение ответа от агента
            response = agent.chat(user_message, user_id)
            
            # Отправка ответа
            await websocket.send_json({
                "response": response,
                "user_id": user_id
            })
    except Exception as e:
        await websocket.close()
```

### Простой фронтенд (chat.html):

```html
<!DOCTYPE html>
<html>
<head>
    <title>ИИ Чат-бот</title>
    <style>
        #chat-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        #messages {
            height: 400px;
            overflow-y: auto;
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 10px;
        }
        .message {
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
        }
        .user-message {
            background-color: #007bff;
            color: white;
            text-align: right;
        }
        .bot-message {
            background-color: #f0f0f0;
        }
        #input-container {
            display: flex;
            gap: 10px;
        }
        #message-input {
            flex: 1;
            padding: 10px;
        }
        button {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="chat-container">
        <h1>ИИ Чат-бот Avtozakaz74</h1>
        <div id="messages"></div>
        <div id="input-container">
            <input type="text" id="message-input" placeholder="Введите сообщение...">
            <button onclick="sendMessage()">Отправить</button>
        </div>
    </div>

    <script>
        const ws = new WebSocket('ws://localhost:8000/ws');
        const messagesDiv = document.getElementById('messages');
        const inputField = document.getElementById('message-input');

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            addMessage(data.response, 'bot');
        };

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            messageDiv.textContent = text;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function sendMessage() {
            const message = inputField.value.trim();
            if (message) {
                addMessage(message, 'user');
                ws.send(JSON.stringify({
                    message: message,
                    user_id: 'user_' + Date.now()
                }));
                inputField.value = '';
            }
        }

        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>
```

## Оценка стоимости для 1000 пользователей

### Сценарий использования:
- Активных пользователей: 1000
- Среднее сообщений на пользователя: 3-5/день
- Всего сообщений: ~3000-5000/день
- Токенов на сообщение: ~100-200 (вопрос + ответ)

### Вариант 1: Ollama (локально)
```
VPS сервер: $20/месяц
RAM: 16GB
GPU: опционально (ускоряет в 5-10 раз)
─────────────────────
ИТОГО: $20-30/месяц
```

### Вариант 2: Gemini API
```
Бесплатно: 1500 запросов/день
Платно: $0.075/1M токенов
При 5000 сообщений/день: ~$11-15/месяц
─────────────────────
ИТОГО: $0-15/месяц
```

### Вариант 3: Groq API
```
Бесплатно: 14,400 запросов/день
Платно: $0.10/1M токенов
При 5000 сообщений/день: ~$5-10/месяц
─────────────────────
ИТОГО: $0-10/месяц
```

### Вариант 4: Гибридный (рекомендуется)
```
Ollama (70%): $20/месяц
Gemini API (20%): $0-3/месяц
Groq API (10%): $0-1/месяц
─────────────────────
ИТОГО: $20-25/месяц
```

## Пошаговый план внедрения

### Этап 1: Подготовка (1-2 дня)
1. Выбрать LLM (рекомендую начать с Ollama)
2. Установить зависимости
3. Настроить базовую структуру проекта

### Этап 2: Разработка агента (3-5 дней)
1. Создать LangChain агента
2. Настроить память диалога
3. Добавить инструменты (поиск авто, информация о ценах)
4. Написать промпты для вашей тематики

### Этап 3: Интеграция (2-3 дня)
1. Создать API endpoints
2. Подключить к фронтенду
3. Настроить WebSocket для реального времени

### Этап 4: Тестирование и оптимизация (2-3 дня)
1. Протестировать на реальных вопросах
2. Оптимизировать промпты
3. Настроить мониторинг

**Общее время: 1-2 недели**

## Рекомендации

1. **Начните с Ollama** - полностью бесплатно, приватно, неограниченно
2. **Используйте Gemini/Groq как резерв** - для сложных запросов
3. **Мониторьте использование** - отслеживайте количество запросов
4. **Оптимизируйте промпты** - хороший промпт = меньше токенов = меньше затрат
5. **Кэшируйте ответы** - одинаковые вопросы = один запрос к LLM

## Полезные ресурсы

- LangChain документация: https://docs.langchain.com
- Ollama: https://ollama.com
- Gemini API: https://ai.google.dev
- Groq API: https://groq.com
- Hugging Face: https://huggingface.co
