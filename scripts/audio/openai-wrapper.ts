/**
 * Wrapper for calling OpenAI TTS API from Node.js.
 * Uses the tts-1 model with the 'alloy' voice.
 *
 * Requires OPENAI_API_KEY environment variable.
 */

import { mkdirSync, statSync, existsSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';

// OpenAI TTS configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/audio/speech';
const MODEL = 'tts-1';
const VOICE = 'alloy';
const RESPONSE_FORMAT = 'mp3';

export interface AudioResult {
  duration: number;  // seconds (estimated)
  size: number;      // bytes
}

/**
 * Get the OpenAI API key from environment variable.
 * Throws if not set.
 */
function getApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY environment variable is not set.\n' +
      'Set it with: export OPENAI_API_KEY=your-api-key'
    );
  }
  return apiKey;
}

/**
 * Generate audio file from text using OpenAI TTS API.
 *
 * @param text - The text to convert to speech
 * @param outputPath - Where to save the audio file
 * @returns Audio metadata (duration estimate, size)
 */
export async function generateAudio(text: string, outputPath: string): Promise<AudioResult> {
  const apiKey = getApiKey();

  // Ensure output directory exists
  const outDir = dirname(outputPath);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // Resolve to absolute path for output
  const absoluteOutputPath = resolve(process.cwd(), outputPath);

  // OpenAI TTS has a limit of 4096 characters per request
  // For longer texts, we'd need to chunk - but for now, truncate with warning
  const MAX_CHARS = 4096;
  let inputText = text;
  if (text.length > MAX_CHARS) {
    console.warn(`  Warning: Text truncated from ${text.length} to ${MAX_CHARS} chars`);
    inputText = text.substring(0, MAX_CHARS);
  }

  // Call OpenAI TTS API
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      voice: VOICE,
      input: inputText,
      response_format: RESPONSE_FORMAT,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  // Get the audio data as a buffer
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Write to file
  writeFileSync(absoluteOutputPath, buffer);

  // Get file stats
  const stats = statSync(absoluteOutputPath);

  // Estimate duration from MP3 file size
  // Typical MP3 at 128kbps: duration = size / (128000 / 8) = size / 16000
  // OpenAI uses variable bitrate, but this gives a reasonable estimate
  const estimatedDuration = stats.size / 16000;

  return {
    duration: Math.round(estimatedDuration * 100) / 100,
    size: stats.size,
  };
}

/**
 * Check if OpenAI API is available (API key is set).
 */
export function checkOpenAIAvailable(): boolean {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY environment variable is not set.');
    console.error('Set it with: export OPENAI_API_KEY=your-api-key');
    return false;
  }
  return true;
}

/**
 * Get the current voice being used (for manifest).
 */
export function getVoiceName(): string {
  return `openai-${MODEL}-${VOICE}`;
}
