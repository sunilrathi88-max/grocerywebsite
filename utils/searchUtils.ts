import { Product } from '../types';

/**
 * Calculates the Levenshtein distance between two strings.
 * This measures the minimum number of single-character edits (insertions, deletions or substitutions)
 * required to change one word into the other.
 */
export const calculateLevenshteinDistance = (a: string, b: string): number => {
    const matrix: number[][] = [];

    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Calculate distance
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1,   // insertion
                        matrix[i - 1][j] + 1    // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
};

/**
 * fuzzySearch
 * Returns items that match the query with a certain degree of fuzziness.
 * 
 * @param query The search term
 * @param items The list of products to search
 * @param threshold Max distance allowed (default 2 for short words, 3 for longer)
 */
export const fuzzySearch = (query: string, items: Product[], threshold = 2): Product[] => {
    if (!query) return [];

    const lowerQuery = query.toLowerCase().trim();

    // 1. Exact/Substring match (High Priority)
    const exactMatches = items.filter(item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    );

    // If we have enough exact matches, return them
    if (exactMatches.length >= 3) return exactMatches;

    // 2. Fuzzy match
    const fuzzyMatches = items.filter(item => {
        // Skip if already found in exact matches
        if (exactMatches.find(m => m.id === item.id)) return false;

        const nameDistance = calculateLevenshteinDistance(lowerQuery, item.name.toLowerCase());
        // Allow slightly higher threshold for longer names
        const allowedDistance = item.name.length > 5 ? threshold + 1 : threshold;

        return nameDistance <= allowedDistance;
    });

    return [...exactMatches, ...fuzzyMatches];
};

/**
 * getSuggestions
 * Returns potential "Did you mean?" corrections from a list of strings (e.g. categories or product names).
 */
export const getSuggestions = (query: string, options: string[]): string[] => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();

    return options.filter(option => {
        const distance = calculateLevenshteinDistance(lowerQuery, option.toLowerCase());
        // Distance must be small (<= 2) and less than half the word length to be a valid suggestion
        return distance <= 2 && distance < option.length / 2;
    }).slice(0, 3); // Return top 3
};
