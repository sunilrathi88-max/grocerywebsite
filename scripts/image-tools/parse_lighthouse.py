import json
import os

if not os.path.exists('lighthouse-report.json'):
    print("Report file not found.")
    exit(1)

try:
    with open('lighthouse-report.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    categories = data.get('categories', {})
    performance = categories.get('performance', {})
    score = performance.get('score')
    
    if score is not None:
        print(f"Performance Score: {score * 100}")
        
        # Also print metrics
        audits = data.get('audits', {})
        metrics = ['first-contentful-paint', 'total-blocking-time', 'largest-contentful-paint', 'cumulative-layout-shift', 'speed-index']
        print("\nMetrics:")
        for m in metrics:
            audit = audits.get(m, {})
            print(f"{audit.get('title')}: {audit.get('displayValue')}")
            
        print("\nTop Opportunities:")
        for key, audit in audits.items():
            if audit.get('score') != 1 and audit.get('details', {}).get('type') == 'opportunity':
                 print(f"{audit.get('title')} ({audit.get('displayValue', '')}): {audit.get('score')}")
                 
        print("\nDiagnostics:")
        diagnostics = ['mainthread-work-breakdown', 'script-treemap-data', 'render-blocking-resources', 'unused-javascript']
        for d in diagnostics:
             audit = audits.get(d, {})
             print(f"{audit.get('title')}: {audit.get('displayValue')}")
             if d == 'render-blocking-resources':
                 print(json.dumps(audit.get('details', {}).get('items', []), indent=2))
             if d == 'unused-javascript':
                  # Summarize unused
                  items = audit.get('details', {}).get('items', [])
                  for item in items[:5]: # Top 5
                      print(f"  {item.get('url')}: {item.get('totalBytes')} bytes (Unused: {item.get('wastedBytes')})")

    else:
        print("Performance score not found in report.")
        
except Exception as e:
    print(f"Error parsing report: {e}")
