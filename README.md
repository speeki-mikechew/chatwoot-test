# Chatwoot Widget Testing

Automated testing setup for the Nicole AI Sales Chatwoot widget.

## Live Test Page

https://speeki-mikechew.github.io/chatwoot-test/test-nicole.html

## Setup

```bash
npm install
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with browser visible
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# View last test report
npm run test:report
```

## What Gets Tested

- ✅ Page loads successfully
- ✅ Chatwoot SDK script loads from production server
- ✅ Chatwoot widget iframe appears
- ✅ Widget button is visible and clickable
- ✅ No console errors related to Chatwoot
- ✅ Widget loads from correct production URL

## Configuration

- **Production Chatwoot URL:** `https://nicole-ai-sales.speeki.com`
- **Website Token:** `xigeryBg6H2omj8QELYJt7bF`
- **Test Page:** `https://speeki-mikechew.github.io/chatwoot-test/test-nicole.html`

## Troubleshooting

If tests fail with "Site not found":
1. Wait a few minutes for GitHub Pages CDN to update
2. Check GitHub Pages deployment status: `gh api repos/speeki-mikechew/chatwoot-test/pages/builds/latest`
3. Verify page is accessible: `curl -I https://speeki-mikechew.github.io/chatwoot-test/test-nicole.html`

## Test Results

Test results are saved in:
- `test-results/` - Screenshots and traces
- `playwright-report/` - HTML report
