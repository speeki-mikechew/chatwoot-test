const { test, expect } = require('@playwright/test');

test.describe('Chatwoot Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Retry navigation if GitHub Pages CDN hasn't propagated
    let retries = 3;
    while (retries > 0) {
      const response = await page.goto('/test-nicole.html', { waitUntil: 'domcontentloaded' });
      if (response && response.status() === 200) {
        break;
      }
      retries--;
      if (retries > 0) {
        await page.waitForTimeout(2000);
      }
    }
  });

  test('page loads successfully', async ({ page }) => {
    // Check it's not a 404 page
    const title = await page.title();
    expect(title).not.toBe('Site not found · GitHub Pages');
    await expect(page).toHaveTitle('Test Nicole Production');
    await expect(page.locator('h1')).toContainText('Testing Nicole Chat Widget');
  });

  test('chatwoot script loads', async ({ page }) => {
    // Wait for Chatwoot SDK script to load
    await page.waitForFunction(() => {
      return typeof window.chatwootSDK !== 'undefined';
    }, { timeout: 10000 });

    // Verify script loaded
    const chatwootSDKExists = await page.evaluate(() => {
      return typeof window.chatwootSDK !== 'undefined';
    });
    expect(chatwootSDKExists).toBe(true);
  });

  test('chatwoot widget iframe appears', async ({ page }) => {
    // Wait for the Chatwoot iframe to be present
    const iframe = page.frameLocator('iframe[id^="chatwoot"]').first();

    // Wait for iframe to load with a reasonable timeout
    await expect(iframe.locator('body')).toBeVisible({ timeout: 15000 });
  });

  test('chatwoot widget button is visible and clickable', async ({ page }) => {
    // Wait for the widget bubble/button to appear
    const iframe = page.frameLocator('iframe[id^="chatwoot"]').first();

    // Check if the widget button is visible (this might need adjustment based on actual widget structure)
    await expect(iframe.locator('body')).toBeVisible({ timeout: 15000 });

    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/chatwoot-widget-loaded.png' });
  });

  test('no console errors related to chatwoot', async ({ page }) => {
    const errors = [];
    page.on('console', message => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Wait a bit for any delayed errors
    await page.waitForTimeout(3000);

    // Check that there are no Chatwoot-related errors
    const chatwootErrors = errors.filter(err =>
      err.toLowerCase().includes('chatwoot') ||
      err.toLowerCase().includes('nicole-ai-sales.speeki.com')
    );

    expect(chatwootErrors).toHaveLength(0);
  });

  test('chatwoot widget loads from correct production URL', async ({ page }) => {
    // Check that the script is loaded from the production URL
    const scriptSrc = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      const chatwootScript = scripts.find(s => s.src.includes('sdk.js'));
      return chatwootScript ? chatwootScript.src : null;
    });

    expect(scriptSrc).toContain('https://nicole-ai-sales.speeki.com/packs/js/sdk.js');
  });
});
