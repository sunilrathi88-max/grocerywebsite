import { supabase } from '../supabaseClient';
import { Product } from './types';

export async function getProducts(filters?: {
    category?: string;
    grade?: string;
    grind?: string;
}) {
    let query = supabase
        .from('products')
        .select('*');

    if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
    }

    if (filters?.grade && filters.grade !== 'all') {
        query = query.eq('grade', filters.grade);
    }

    if (filters?.grind && filters.grind !== 'all') {
        query = query.eq('grind', filters.grind);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data as Product[];
}
