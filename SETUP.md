# Together AI Integration Setup

## Prerequisites

1. **Together AI Account**: Sign up at [https://together.ai/](https://together.ai/)
2. **API Key**: Get your API key from the Together AI dashboard

## Environment Configuration

Create a `.env.local` file in your project root and add:

```bash
NEXT_PUBLIC_TOGETHER_API_KEY=your_actual_api_key_here
```

## Installation

Install the required dependency:

```bash
npm install together-ai
```

## Usage

The AI integration will automatically:

- Use the DeepSeek-R1-Distill-Llama-70B-free model
- Generate personalized meal plans based on user inputs
- Display responses below the form
- Handle errors gracefully

## Features

- **Smart Prompting**: System prompt optimized for nutrition expertise
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Smooth loading animations during AI generation
- **Responsive Design**: Mobile-friendly response display
- **Token Usage**: Shows token consumption for transparency

## API Limits

- Model: `deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free`
- Max Tokens: 1000
- Temperature: 0.7 (balanced creativity and consistency)
