$skillsDir = ".agent\skills"
New-Item -ItemType Directory -Force -Path $skillsDir | Out-Null

Write-Host "Installing frontend-design..."
if (!(Test-Path "$env:TEMP\claude-code")) {
    git clone --depth 1 https://github.com/anthropics/claude-code.git "$env:TEMP\claude-code"
}
if (Test-Path "$env:TEMP\claude-code\plugins\frontend-design") {
    Copy-Item -Path "$env:TEMP\claude-code\plugins\frontend-design" -Destination "$skillsDir\frontend-design" -Recurse -Force
}

Write-Host "Installing ui-ux-pro-max..."
if (Test-Path "$skillsDir\ui-ux-pro-max") { Remove-Item -Recurse -Force "$skillsDir\ui-ux-pro-max" }
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git "$skillsDir\ui-ux-pro-max"

Write-Host "Installing claude-seo..."
if (Test-Path "$skillsDir\claude-seo") { Remove-Item -Recurse -Force "$skillsDir\claude-seo" }
git clone --depth 1 https://github.com/AgriciDaniel/claude-seo.git "$skillsDir\claude-seo"

Write-Host "Installing code-review..."
if (Test-Path "$skillsDir\code-review") { Remove-Item -Recurse -Force "$skillsDir\code-review" }
git clone --depth 1 https://github.com/awesome-skills/code-review-skill.git "$skillsDir\code-review"

Write-Host "Installing owasp-security..."
if (Test-Path "$skillsDir\owasp-security") { Remove-Item -Recurse -Force "$skillsDir\owasp-security" }
git clone --depth 1 https://github.com/agamm/claude-code-owasp.git "$skillsDir\owasp-security"

Write-Host "Installing remotion..."
npx -y skills add remotion-dev/skills

# Copy any skills created in .claude/skills to .agent/skills
if (Test-Path ".claude\skills") {
    Copy-Item -Path ".claude\skills\*" -Destination "$skillsDir" -Recurse -Force
}

Write-Host "Cleanup .git folders..."
Get-ChildItem -Path $skillsDir -Recurse -Directory -Filter ".git" | Remove-Item -Recurse -Force

Write-Host "Done!"
