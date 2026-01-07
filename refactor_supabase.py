import os
import re

FILE_PATH = 'utils/apiService.ts'
IMPORT_LINE_PART = "from '../supabaseClient';"
HELPER_FUNC = """/**
 * Lazy load Supabase client to avoid eager bundle loading
 */
const getSupabase = async () => {
  const { supabase } = await import('../supabaseClient');
  return supabase;
};"""

def refactor():
    if not os.path.exists(FILE_PATH):
        print(f"File not found: {FILE_PATH}")
        return

    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    import_removed = False

    for line in lines:
        if "from '../supabaseClient';" in line and 'import' in line and 'supabase' in line:
            # Found the import line. Replace it with the helper function.
            # We add the helper function and skip this line.
            new_lines.append(HELPER_FUNC + "\n")
            import_removed = True
            continue
        
        # Replace 'supabase.' usage
        # We use simple string replacement because 'supabase.' is unique enough in this file context
        # based on our analysis.
        if 'supabase.' in line:
            # Check if it's not inside a comment (basic check)
            if not line.strip().startswith('//') and not line.strip().startswith('*'):
                line = line.replace('supabase.', '(await getSupabase()).')
        
        new_lines.append(line)

    if not import_removed:
        print("Warning: Import line not found or removed.")
    
    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"Successfully refactored {FILE_PATH}")

if __name__ == "__main__":
    refactor()
