import * as chrono from 'chrono-node';
import * as chronoPt from 'chrono-node/pt';
import { TaskTag, TagType, TAG_PRESETS } from '@/types';

export interface ParsedTask {
  title: string;
  deadline: Date;
  tags: TaskTag[];
  confidence: 'high' | 'medium' | 'low';
  rawDeadlineText?: string;
}

export interface ParseResult {
  success: boolean;
  task?: ParsedTask;
  error?: string;
  warning?: string;
}

// Map common hashtags to our tag types (English + Portuguese)
const HASHTAG_MAP: Record<string, TagType> = {
  // Management (EN)
  'management': 'management',
  'mgmt': 'management',
  'work': 'management',
  'meeting': 'management',
  'admin': 'management',
  // Management (PT)
  'gestao': 'management',
  'trabalho': 'management',
  'reuniao': 'management',
  // Design (EN)
  'design': 'design',
  'ui': 'design',
  'ux': 'design',
  'figma': 'design',
  // Development (EN)
  'development': 'development',
  'dev': 'development',
  'code': 'development',
  'coding': 'development',
  'bug': 'development',
  'feature': 'development',
  // Development (PT)
  'codigo': 'development',
  'programacao': 'development',
  // Research (EN)
  'research': 'research',
  'learn': 'research',
  'study': 'research',
  'read': 'research',
  // Research (PT)
  'pesquisa': 'research',
  'estudo': 'research',
  'aprender': 'research',
  'ler': 'research',
  // Marketing (EN)
  'marketing': 'marketing',
  'mktg': 'marketing',
  'social': 'marketing',
  'content': 'marketing',
  // Marketing (PT)
  'conteudo': 'marketing',
  'redes': 'marketing',
};

/**
 * Extract hashtags from message and map them to TaskTags
 */
export function extractTags(message: string): { tags: TaskTag[]; cleanMessage: string; unknownTags: string[] } {
  const tagRegex = /#(\w+)/g;
  const tags: TaskTag[] = [];
  const unknownTags: string[] = [];
  const seenTypes = new Set<TagType>();

  let match;
  while ((match = tagRegex.exec(message)) !== null) {
    const hashtag = match[1].toLowerCase();
    const tagType = HASHTAG_MAP[hashtag];

    if (tagType && !seenTypes.has(tagType)) {
      seenTypes.add(tagType);
      const preset = TAG_PRESETS[tagType];
      tags.push({
        id: tagType,
        label: preset.label,
        type: tagType,
      });
    } else if (!tagType) {
      unknownTags.push(hashtag);
    }
  }

  // Remove hashtags from message
  const cleanMessage = message.replace(/#\w+/g, '').trim().replace(/\s+/g, ' ');

  return { tags, cleanMessage, unknownTags };
}

/**
 * Parse a Telegram message into a task
 */
export function parseTaskMessage(message: string, referenceDate?: Date): ParseResult {
  // Validate message length
  if (!message || message.trim().length < 3) {
    return {
      success: false,
      error: 'Message too short. Please describe your task.',
    };
  }

  const trimmedMessage = message.trim();

  // Extract tags first
  const { tags, cleanMessage, unknownTags } = extractTags(trimmedMessage);

  if (!cleanMessage || cleanMessage.length < 2) {
    return {
      success: false,
      error: 'Please provide a task title (not just tags).',
    };
  }

  // Parse date/time using chrono-node (try both English and Portuguese)
  const ref = referenceDate || new Date();
  const parsedEn = chrono.parse(cleanMessage, ref, { forwardDate: true });
  const parsedPt = chronoPt.parse(cleanMessage, ref, { forwardDate: true });

  // Use whichever parser found a result (prefer the one with longer match for accuracy)
  const parsed = parsedEn.length > 0 && parsedPt.length > 0
    ? (parsedEn[0].text.length >= parsedPt[0].text.length ? parsedEn : parsedPt)
    : (parsedEn.length > 0 ? parsedEn : parsedPt);

  let deadline: Date;
  let title: string;
  let confidence: 'high' | 'medium' | 'low';
  let rawDeadlineText: string | undefined;

  if (parsed.length > 0) {
    // Date was found
    const result = parsed[0];
    deadline = result.start.date();
    rawDeadlineText = result.text;

    // Extract title by removing the date text
    title = cleanMessage.replace(result.text, '').trim();

    // Clean up common prepositions left behind (English + Portuguese)
    title = title
      .replace(/\b(by|on|at|for|until|before|due|para|ate|até|em|no|na|às|as)\s*$/i, '')
      .replace(/^\s*(by|on|at|for|until|before|due|para|ate|até|em|no|na|às|as)\b/i, '')
      .trim()
      .replace(/\s+/g, ' ');

    // If title is empty after removing date, use the whole message
    if (!title) {
      title = cleanMessage;
    }

    // Determine confidence based on how specific the date was
    if (result.start.isCertain('day') && result.start.isCertain('month')) {
      confidence = 'high';
    } else if (result.start.isCertain('day')) {
      confidence = 'medium';
    } else {
      confidence = 'medium';
    }
  } else {
    // No date found - default to end of today
    title = cleanMessage;
    deadline = new Date(ref);
    deadline.setHours(23, 59, 59, 999);
    confidence = 'low';
  }

  // Check for past dates
  let warning: string | undefined;
  const now = new Date();
  if (deadline < now) {
    const isToday = deadline.toDateString() === now.toDateString();
    if (isToday) {
      // If today but time has passed, set to end of day
      deadline.setHours(23, 59, 59, 999);
    } else {
      warning = 'Note: This deadline is in the past';
    }
  }

  // Add warning about unknown tags
  if (unknownTags.length > 0) {
    const tagWarning = `Unknown tag${unknownTags.length > 1 ? 's' : ''}: #${unknownTags.join(', #')}`;
    warning = warning ? `${warning}. ${tagWarning}` : tagWarning;
  }

  return {
    success: true,
    task: {
      title,
      deadline,
      tags,
      confidence,
      rawDeadlineText,
    },
    warning,
  };
}

/**
 * Determine the column type based on deadline
 */
export function getColumnForDeadline(deadline: Date): 'today' | 'this_week' | 'later' {
  const now = new Date();

  // Reset time to compare dates only
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlineDay = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

  const diffTime = deadlineDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'today';
  } else if (diffDays <= 7) {
    return 'this_week';
  } else {
    return 'later';
  }
}
