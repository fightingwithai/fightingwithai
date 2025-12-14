/**
 * Wrapper for calling Piper TTS from Node.js.
 * Uses the existing piper-poc setup with its venv and model.
 */

import { execSync } from 'child_process';
import { mkdirSync, statSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';

// Path to the piper-poc directory relative to project root
const PIPER_DIR = resolve(process.cwd(), 'piper-poc');

export interface AudioResult {
  duration: number;  // seconds
  size: number;      // bytes
}

/**
 * Generate audio file from text using Piper TTS.
 *
 * @param text - The text to convert to speech
 * @param outputPath - Where to save the WAV file
 * @returns Audio metadata (duration, size)
 */
export async function generateAudio(text: string, outputPath: string): Promise<AudioResult> {
  // Ensure output directory exists
  const outDir = dirname(outputPath);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // Write text to temp file to handle special characters safely
  const tempTextFile = `/tmp/tts-input-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`;

  try {
    writeFileSync(tempTextFile, text, 'utf-8');

    // Resolve to absolute path for output
    const absoluteOutputPath = resolve(process.cwd(), outputPath);

    // Call the tts.sh script
    execSync(`./tts.sh "${tempTextFile}" "${absoluteOutputPath}"`, {
      cwd: PIPER_DIR,
      stdio: 'pipe',
    });

    // Get file stats
    const stats = statSync(absoluteOutputPath);

    // Calculate duration from WAV file
    // WAV at 22050 Hz, 16-bit mono: bytes = samples * 2, duration = samples / 22050
    // Subtract 44 bytes for WAV header
    const dataBytes = stats.size - 44;
    const samples = dataBytes / 2;
    const duration = samples / 22050;

    return {
      duration: Math.round(duration * 100) / 100,
      size: stats.size,
    };
  } finally {
    // Cleanup temp file
    try {
      unlinkSync(tempTextFile);
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Check if Piper is available and properly set up.
 */
export function checkPiperAvailable(): boolean {
  const venvPath = resolve(PIPER_DIR, 'venv');
  const modelPath = resolve(PIPER_DIR, 'en_US-lessac-medium.onnx');

  if (!existsSync(venvPath)) {
    console.error('Piper venv not found at:', venvPath);
    console.error('Run the piper-poc setup first.');
    return false;
  }

  if (!existsSync(modelPath)) {
    console.error('Piper model not found at:', modelPath);
    console.error('Download the model first.');
    return false;
  }

  return true;
}
