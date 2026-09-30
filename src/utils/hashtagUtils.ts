import { CommunityPost, PublicUserProfile } from '../types/community';

export interface HashtagInfo {
  tag: string;
  count: number;
  isTrending: boolean;
}

// Convert English numbers to Bengali numerals
export const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => bnDigits[parseInt(d, 10)]);
};

// Curated default popular hashtags for Khulna division
export const DEFAULT_KHULNA_HASHTAGS: string[] = [
  '#SmartKhulna',
  '#KhulnaCity',
  '#KhulnaNews',
  '#Sundarbans',
  '#RupshaBridge',
  '#HospitalHelp',
  '#BloodDonation',
  '#EmergencyKhulna',
  '#KUET',
  '#KhulnaUniversity',
  '#KhulnaTraffic',
  '#TouristSpots',
  '#KhulnaFood',
  '#SportsKhulna',
  '#Jessore',
  '#Satkhira',
  '#Bagerhat',
  '#Kushtia',
  '#Jhenaidah',
  '#স্মার্টখুলনা',
  '#খুলনা',
  '#সুন্দরবন',
  '#রূপসা',
  '#রক্তদান',
  '#জরুরি_সেবা',
  '#স্বাস্থ্যসেবা',
  '#যানজট',
  '#শিক্ষা',
  '#চাকরি',
  '#লাইভ_আপডেট'
];

/**
 * Dynamically aggregates hashtag counts from all posts in real-time.
 */
export const calculateHashtagsWithCounts = (posts: CommunityPost[]): HashtagInfo[] => {
  const countMap = new Map<string, { displayTag: string; count: number }>();

  // Process all posts
  posts.forEach(post => {
    // Exclude removed or hidden posts from public counts
    if (post.status === 'removed' || post.status === 'hidden') return;

    const postTags = new Set<string>();

    // 1. From post.hashtags array
    if (Array.isArray(post.hashtags)) {
      post.hashtags.forEach(tag => {
        if (!tag) return;
        const clean = tag.trim().replace(/^#+/, '');
        if (clean.length > 0) {
          postTags.add(clean);
        }
      });
    }

    // 2. From post.content
    if (post.content) {
      const matches = post.content.match(/#[A-Za-z0-9_\u0980-\u09FF]+/g);
      if (matches) {
        matches.forEach(m => {
          const clean = m.replace(/^#+/, '');
          if (clean.length > 0) {
            postTags.add(clean);
          }
        });
      }
    }

    // 3. From post.title
    if (post.title) {
      const matches = post.title.match(/#[A-Za-z0-9_\u0980-\u09FF]+/g);
      if (matches) {
        matches.forEach(m => {
          const clean = m.replace(/^#+/, '');
          if (clean.length > 0) {
            postTags.add(clean);
          }
        });
      }
    }

    // Increment count per unique tag in this post
    postTags.forEach(cleanTag => {
      const key = cleanTag.toLowerCase();
      const existing = countMap.get(key);
      if (existing) {
        existing.count += 1;
        // Keep the version with more uppercase or nicer formatting if applicable
        if (cleanTag !== cleanTag.toLowerCase()) {
          existing.displayTag = '#' + cleanTag;
        }
      } else {
        countMap.set(key, {
          displayTag: '#' + cleanTag,
          count: 1
        });
      }
    });
  });

  // Ensure default Khulna tags are present (with count 0 if no posts yet, or existing count)
  DEFAULT_KHULNA_HASHTAGS.forEach(defaultTag => {
    const clean = defaultTag.replace(/^#+/, '');
    const key = clean.toLowerCase();
    if (!countMap.has(key)) {
      countMap.set(key, {
        displayTag: defaultTag,
        count: 0
      });
    }
  });

  // Convert to array and sort: highest count first, then alphabetical
  const result: HashtagInfo[] = Array.from(countMap.values()).map(item => ({
    tag: item.displayTag,
    count: item.count,
    isTrending: item.count >= 3
  }));

  result.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.tag.localeCompare(b.tag);
  });

  return result;
};

/**
 * Filter hashtags matching a user query (case-insensitive, matching with or without #)
 */
export const searchHashtags = (
  query: string,
  allHashtags: HashtagInfo[],
  limit = 10
): HashtagInfo[] => {
  const cleanQuery = query.replace(/^#+/, '').trim().toLowerCase();

  if (!cleanQuery) {
    // Return top tags sorted by count
    return allHashtags.slice(0, limit);
  }

  // Exact startsWith first, then includes
  const startsWithList: HashtagInfo[] = [];
  const includesList: HashtagInfo[] = [];

  allHashtags.forEach(item => {
    const cleanTag = item.tag.replace(/^#+/, '').toLowerCase();
    if (cleanTag === cleanQuery) {
      startsWithList.unshift(item); // Top priority
    } else if (cleanTag.startsWith(cleanQuery)) {
      startsWithList.push(item);
    } else if (cleanTag.includes(cleanQuery)) {
      includesList.push(item);
    }
  });

  return [...startsWithList, ...includesList].slice(0, limit);
};

/**
 * Search users for mention suggestions
 */
export const searchUsersForMention = (
  query: string,
  users: PublicUserProfile[],
  limit = 8
): PublicUserProfile[] => {
  const cleanQuery = query.replace(/^@+/, '').trim().toLowerCase();

  if (!cleanQuery) {
    return users.slice(0, limit);
  }

  return users
    .filter(u => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const district = (u.district || '').toLowerCase();
      const profession = (u.profession || '').toLowerCase();
      return (
        name.includes(cleanQuery) ||
        email.includes(cleanQuery) ||
        district.includes(cleanQuery) ||
        profession.includes(cleanQuery)
      );
    })
    .slice(0, limit);
};

/**
 * Parse cursor position in textarea or input to find if user is currently typing a hashtag (#...) or mention (@...)
 */
export interface TriggerContext {
  trigger: '#' | '@' | null;
  query: string;
  startIndex: number;
  endIndex: number;
}

export const getTriggerWordAtCursor = (text: string, cursorPos: number): TriggerContext => {
  if (cursorPos < 0 || cursorPos > text.length) {
    return { trigger: null, query: '', startIndex: -1, endIndex: -1 };
  }

  // Look back to find the boundary of the current token
  const textBeforeCursor = text.slice(0, cursorPos);
  const lastWhitespaceIndex = Math.max(
    textBeforeCursor.lastIndexOf(' '),
    textBeforeCursor.lastIndexOf('\n'),
    textBeforeCursor.lastIndexOf('\t')
  );

  const wordStartIndex = lastWhitespaceIndex + 1;
  const currentWord = textBeforeCursor.slice(wordStartIndex);

  if (currentWord.startsWith('#')) {
    return {
      trigger: '#',
      query: currentWord.slice(1),
      startIndex: wordStartIndex,
      endIndex: cursorPos
    };
  }

  if (currentWord.startsWith('@')) {
    return {
      trigger: '@',
      query: currentWord.slice(1),
      startIndex: wordStartIndex,
      endIndex: cursorPos
    };
  }

  return { trigger: null, query: '', startIndex: -1, endIndex: -1 };
};

/**
 * Inserts selected hashtag or mention into the text at given indices
 */
export const insertTriggerReplacement = (
  text: string,
  startIndex: number,
  endIndex: number,
  replacement: string
): { newText: string; newCursorPos: number } => {
  const before = text.slice(0, startIndex);
  const after = text.slice(endIndex);

  // Add trailing space so user can continue typing effortlessly
  const inserted = replacement + ' ';
  const newText = before + inserted + after;
  const newCursorPos = before.length + inserted.length;

  return { newText, newCursorPos };
};
