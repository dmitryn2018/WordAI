/* global Word */

export interface WordApiError {
  message: string;
  code?: string;
}

/**
 * Get currently selected text from the document
 */
export async function getSelectedText(maxChars?: number): Promise<string> {
  try {
    return await Word.run(async (context: Word.RequestContext) => {
      const selection = context.document.getSelection();
      selection.load('text');
      await context.sync();
      
      let text = selection.text || '';
      if (maxChars && text.length > maxChars) {
        text = text.substring(0, maxChars);
      }
      return text;
    });
  } catch (error) {
    console.error('Error getting selected text:', error);
    throw createWordApiError(error);
  }
}

/**
 * Get context around current selection or cursor position
 * If nothing is selected, gets document body text
 */
export async function getContextAroundSelection(maxChars: number): Promise<string> {
  try {
    return await Word.run(async (context: Word.RequestContext) => {
      const selection = context.document.getSelection();
      selection.load('text');
      await context.sync();
      
      // If there's selected text, return it
      if (selection.text && selection.text.trim().length > 0) {
        let text = selection.text;
        if (text.length > maxChars) {
          text = text.substring(0, maxChars);
        }
        return text;
      }
      
      // Otherwise, get the document body text
      const body = context.document.body;
      body.load('text');
      await context.sync();
      
      let text = body.text || '';
      if (text.length > maxChars) {
        // For simplicity, take the first maxChars characters
        // A more sophisticated approach would center around cursor position
        text = text.substring(0, maxChars);
      }
      
      return text;
    });
  } catch (error) {
    console.error('Error getting context:', error);
    throw createWordApiError(error);
  }
}

/**
 * Replace currently selected text with new text
 */
export async function replaceSelectionWithText(newText: string): Promise<void> {
  try {
    await Word.run(async (context: Word.RequestContext) => {
      const selection = context.document.getSelection();
      selection.insertText(newText, Word.InsertLocation.replace);
      await context.sync();
    });
  } catch (error) {
    console.error('Error replacing selection:', error);
    throw createWordApiError(error);
  }
}

/**
 * Insert text at current cursor position
 */
export async function insertTextAtCursor(newText: string): Promise<void> {
  try {
    await Word.run(async (context: Word.RequestContext) => {
      const selection = context.document.getSelection();
      selection.insertText(newText, Word.InsertLocation.end);
      await context.sync();
    });
  } catch (error) {
    console.error('Error inserting text:', error);
    throw createWordApiError(error);
  }
}

/**
 * Check if there's any text selected
 */
export async function hasSelection(): Promise<boolean> {
  try {
    return await Word.run(async (context: Word.RequestContext) => {
      const selection = context.document.getSelection();
      selection.load('text');
      await context.sync();
      return !!(selection.text && selection.text.trim().length > 0);
    });
  } catch (error) {
    console.error('Error checking selection:', error);
    return false;
  }
}

function createWordApiError(error: unknown): WordApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: (error as { code?: string }).code,
    };
  }
  return { message: 'Unknown Office.js error' };
}

