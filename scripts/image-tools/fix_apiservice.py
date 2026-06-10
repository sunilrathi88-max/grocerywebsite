import re

FILE_PATH = 'utils/apiService.ts'

def fix_apiservice():
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern: word 'supabase'
    # Negative lookbehind (?<!...) to ensure we don't match 'getSupabase'
    # We want to match 'supabase' but NOT 'getSupabase'
    # Also we must NOT match 'supabase' inside the getSupabase function body: "const { supabase } ="
    
    # Let's do line by line to be safe about the exclusion
    lines = content.splitlines()
    new_lines = []
    
    for line in lines:
        # Skip the definition inside the helper we added (identifier is destructured)
        if "const { supabase } =" in line:
            new_lines.append(line)
            continue
            
        # Regex to find 'supabase' not preceded by 'get', 'const { ', or used as property key '{ supabase: ... }' if any?
        # Simple heuristic: look for 'supabase' as a standalone word.
        # If it's 'getSupabase', regex \bsupabase\b won't match (it matches partial? no \b prevents it?)
        # \bsupabase\b matches 'products' in 'supabase.products'? No, 'supabase' is the word.
        
        # We want to avoid replacing 'getSupabase'
        # \bgetSupabase\b matches getSupabase.
        # \bsupabase\b matches supabase.
        
        # Replace 'supabase' with '(await getSupabase())'
        # BUT check if it was already replaced?
        # Previous script replaced 'supabase.' with '(await getSupabase()).'
        # So 'supabase.' is gone?
        # If line was 'await supabase', it became 'await supabase' (no dot).
        
        # So we just look for 'supabase' word.
        
        def replacement(match):
            # Check context if needed
            return '(await getSupabase())'

        # Use regex sub.
        # \b ensures we don't match 'getSupabase' because 's' start is not boundary for 'getSupabase'.
        # Wait. 'getSupabase' -> 'supabase' starts at index 3. 't' 's'. There is no boundary between t and s?
        # Word characters: [a-zA-Z0-9_]. 'getSupabase' is one word.
        # So \bsupabase\b searches for 'supabase' surrounded by non-word chars.
        # 'getSupabase' does NOT contain \bsupabase\b.
        # 'await supabase' DOES.
        # 'supabase.' DOES.
        
        if 'getSupabase' in line and not 'await' in line: 
             # Safe guard: definition line "const getSupabase = async..."
             # or calls "await getSupabase()" which we just added?
             # If we replaced previously: 'await (await getSupabase()).from...'
             # 'getSupabase' is present.
             new_lines.append(line)
             continue

        # Modify the line
        # Replace \bsupabase\b with (await getSupabase())
        # BUT if it is already replaced? e.g. '(await getSupabase())'
        # The 'supabase' inside 'getSupabase' is NOT matched by \bsupabase\b.
        
        # What if we have 'await supabase'?
        # \bsupabase\b matches.
        # Replaced -> 'await (await getSupabase())'.
        
        new_line = re.sub(r'\bsupabase\b', '(await getSupabase())', line)
        new_lines.append(new_line)

    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
    
    print(f"Fixed {FILE_PATH}")

if __name__ == "__main__":
    fix_apiservice()
