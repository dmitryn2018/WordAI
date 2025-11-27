import { Mode, LLMRequestPayload, Settings } from '../types';

const SYSTEM_PROMPTS: Record<Mode, (legalStyle: boolean) => string> = {
  chat: (legalStyle) => legalStyle
    ? `Ты юридический ассистент. Отвечай на вопросы строго по тексту документа. Если информации нет в предоставленном тексте — явно говори об этом. Будь точен и конкретен в ответах.`
    : `Ты полезный ассистент. Отвечай на вопросы по тексту документа. Если информации нет в предоставленном тексте — скажи об этом.`,

  rewrite: (legalStyle) => legalStyle
    ? `Переформулируй выделенный текст, сохраняя смысл и юридическую точность. Используй деловой юридический русский язык. Сохраняй все юридически значимые термины и формулировки.`
    : `Переформулируй выделенный текст, сохраняя смысл. Адаптируй стиль согласно пожеланиям пользователя, если они указаны.`,

  compress: (legalStyle) => legalStyle
    ? `Сократи текст до 30-50% от оригинала, сохранив все ключевые юридически значимые элементы: стороны, предмет, сроки, суммы, обязательства, ответственность. Не теряй важные условия.`
    : `Сократи текст до 30-50% от оригинала, сохранив ключевую информацию и основной смысл.`,

  expand: (legalStyle) => legalStyle
    ? `Расширь текст, добавив уточнения и типичные юридические формулировки. Не меняй смысл, позиции сторон и существенные условия. Добавь необходимые оговорки и уточнения.`
    : `Расширь текст, добавив детали и уточнения. Сохрани основной смысл и тон документа.`,

  summarize: (legalStyle) => legalStyle
    ? `Сделай краткое структурированное резюме текста в формате списка. Выдели: 
- Предмет документа/договора
- Стороны (если применимо)
- Ключевые условия
- Сроки и суммы
- Обязательства сторон
- Риски и важные оговорки
Если какой-то пункт не применим — пропусти его.`
    : `Сделай краткое структурированное резюме текста. Выдели ключевые пункты и основные идеи в формате списка.`,

  generate_section: (legalStyle) => legalStyle
    ? `Сгенерируй текст раздела юридического документа по описанию пользователя. Соблюдай стиль и структуру соседних разделов, если они переданы в контексте. Используй стандартные юридические формулировки.`
    : `Сгенерируй текст раздела документа по описанию пользователя. Соблюдай стиль документа, если контекст предоставлен.`,
};

export function getSystemPrompt(mode: Mode, legalStyle: boolean): string {
  return SYSTEM_PROMPTS[mode](legalStyle);
}

export function buildPayload(
  mode: Mode,
  context: string,
  userPrompt: string,
  settings: Settings
): LLMRequestPayload {
  const systemPrompt = getSystemPrompt(mode, settings.legalStyleEnabled);
  
  return {
    mode,
    systemPrompt,
    context: context.substring(0, settings.maxContextChars),
    userPrompt,
    options: {
      temperature: mode === 'chat' ? 0.3 : 0.2,
      maxTokens: mode === 'summarize' ? 1000 : 2000,
    },
  };
}

export function formatContextInfo(context: string, isSelection: boolean): string {
  const chars = context.length;
  const source = isSelection ? 'выделения' : 'документа';
  return `Контекст: ${chars} символов из ${source}`;
}

