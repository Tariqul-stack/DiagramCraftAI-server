import Groq from 'groq-sdk';
import { env } from '../config/env';
import { buildSystemPrompt } from './prompt.service';

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

// @desc  Generate Mermaid diagram code from a user prompt
export const generateDiagram = async (
  diagramType: string,
  prompt: string
): Promise<string> => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 2000,
    messages: [
      { role: 'system', content: buildSystemPrompt(diagramType) },
      { role: 'user', content: prompt },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? '';

  // Strip any markdown fences the model might add despite instructions
  const cleaned = raw
    .replace(/```[\w]*\n?/g, '')  // remove opening fence (```mermaid, ```, etc.)
    .replace(/```/g, '')           // remove closing fence
    .trim();

  return cleaned;
};

// @desc  Chat about an existing diagram with history context
export const chatWithDiagram = async (
  diagramCode: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> => {
  const systemContent =
    `You are a helpful diagram assistant. The user is working with this Mermaid.js diagram code:\n\n` +
    `${diagramCode}\n\n` +
    `Help them understand, improve, or modify their diagram. ` +
    `If they ask to modify the diagram, return the complete updated Mermaid code.`;

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemContent },
    ...history.map((msg) => ({ role: msg.role, content: msg.content })),
    { role: 'user', content: userMessage },
  ];

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 2000,
    messages,
  });

  return response.choices[0]?.message?.content ?? '';
};
