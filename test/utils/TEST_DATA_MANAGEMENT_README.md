# Test Data Management

Comprehensive test data management system with support for JSON, YAML, environment variables, and multiple environments.

## Features

### Data Loading
- **JSON Support**: Load data from JSON files
- **YAML Support**: Load data from YAML files
- **Auto-Detection**: Automatically detect file format
- **Caching**: Built-in caching for performance
- **Environment-Specific**: Load environment-specific data files

### Environment Management
- **Multiple Environments**: Support for dev, staging, prod, etc.
- **Environment Overrides**: Override data with environment variables
- **Dynamic Switching**: Change environment at runtime

### Data Access
- **Type-Safe**: Generic type support for type-safe data access
- **Nested Keys**: Access nested data with dot notation
- **Default Values**: Specify fallback values
- **Data Merging**: Merge multiple data sources

### Utilities
- **Random Data Generation**: Generate random emails, usernames, passwords
- **Data Validation**: Validate data against custom schemas
- **Data Transformation**: Transform data with custom functions
- **Fallback Chains**: Try multiple data sources in order

## Installation

The TestDataManager utility is already included. Install dependencies:

```bash
npm install --save-dev js-yaml @types/js-yaml
```

## Directory Structure

```
test/
└── data/
    ├── users.json              # User test data
    ├── users.dev.json          # Dev environment users
    ├── users.staging.json      # Staging environment users
    ├── credentials.json        # Login credentials
    ├── config.yaml             # Configuration settings
    ├── endpoints.yaml          # API/URL endpoints
    └── locators.json           # UI element locators
```

## Usage Examples

### Basic Usage

```typescript
import TestDataManager from '../utils/TestDataManager';

// Get singleton instance
const tdm = TestDataManager.getInstance();

// Load entire data file
const allUsers = tdm.loadDataFile('users');

// Get specific user
const defaultUser = tdm.getUser('default');
console.log(defaultUser.username); // testuser@example.com

// Get admin user
const adminUser = tdm.getUser('admin');
```

### Loading Different Formats

```typescript
// JSON file
const users = tdm.loadDataFile('users'); // users.json

// YAML file
const config = tdm.loadDataFile('config'); // config.yaml

// Auto-detect format
const endpoints = tdm.loadDataFile('endpoints'); // endpoints.yaml or endpoints.json
```

### Nested Data Access

```typescript
// Use dot notation for nested data
const shortTimeout = tdm.getData('config', 'timeouts.short'); // 5000
const longTimeout = tdm.getData('config', 'timeouts.long'); // 30000

// Get with default value
const customTimeout = tdm.getData('config', 'timeouts.custom', 15000);

// Type-safe access
const retries = tdm.getData<number>('config', 'retries.default', 3);
```

### Credentials and Users

```typescript
// Get credentials
const creds = tdm.getCredentials('valid');
console.log(creds.username); // validuser@example.com
console.log(creds.password); // ValidPass123!

// Get user data
const premiumUser = tdm.getUser('premium');
console.log(premiumUser.subscriptionType); // premium

// Get guest user
const guestUser = tdm.getUser('guest');
```

### Configuration Values

```typescript
// Get config values
const defaultTimeout = tdm.getConfig<number>('timeouts.default'); // 15000
const enableLogging = tdm.getConfig<boolean>('features.enableLogging'); // true

// Get app config
const packageName = tdm.getConfig<string>('app.packageName');
```

### Endpoints and Locators

```typescript
// Get API endpoints
const loginEndpoint = tdm.getEndpoint('api.login'); // /api/v1/auth/login
const profileEndpoint = tdm.getEndpoint('api.profile');

// Get UI locators
const loginButton = tdm.getLocator('loginButton'); // ~login-button
const usernameField = tdm.getLocator('usernameField');
```

### Environment-Specific Data

```typescript
// Set environment
tdm.setEnvironment('dev');

// Load environment-specific data
const devUser = tdm.getUser('default'); // Loads from users.dev.json

// Switch environment
tdm.setEnvironment('staging');
const stagingUser = tdm.getUser('default'); // Loads from users.staging.json

// Get current environment
const currentEnv = tdm.getEnvironment(); // 'staging'
```

### Environment Variables Override

```typescript
// Set environment variable
// TEST_DATA_USERNAME=override@example.com

// Data will be overridden by environment variable
const user = tdm.getData('users', 'default');
// user.username will be 'override@example.com' if env var is set
```

### Random Data Generation

```typescript
// Generate random email
const email = TestDataManager.generateRandomEmail('test');
// test_1704484800000_1234@test.com

// Generate random username
const username = TestDataManager.generateRandomUsername('user');
// user_1704484800000_5678

// Generate random password
const password = TestDataManager.generateRandomPassword(16);
// aB3!xYz9@pQr8#mN

// Generate random phone
const phone = TestDataManager.generateRandomPhone('+1');
// +15551234567
```

### Data Merging

```typescript
// Merge multiple data sources
const baseUser = tdm.getData('users', 'default');
const customData = { department: 'Engineering', location: 'Remote' };
const mergedUser = tdm.mergeData(baseUser, customData);
```

### Fallback Chain

```typescript
// Try multiple data sources in order
const user = tdm.getDataWithFallback(
  ['users.custom', 'users.dev', 'users'],
  'default'
);
// Returns first available user from: custom > dev > users
```

### Data Transformation

```typescript
// Transform data with custom function
const uppercaseUsers = tdm.transformData('users', (users) => {
  return Object.keys(users).reduce((acc, key) => {
    acc[key] = {
      ...users[key],
      username: users[key].username.toUpperCase()
    };
    return acc;
  }, {} as any);
});
```

### Data Validation

```typescript
// Validate data against custom schema
const isValid = tdm.validateData('users', (data) => {
  return Object.values(data).every(user => 
    user.username && user.password && user.email
  );
});

if (!isValid) {
  throw new Error('Invalid user data');
}
```

### Cache Management

```typescript
// Clear specific file from cache
tdm.clearCache('users');

// Clear all cache
tdm.clearCache();

// Load without caching
const freshData = tdm.loadDataFile('users', false);
```

## Integration with Tests

### In Page Objects

```typescript
import Page from './page';
import TestDataManager from '../utils/TestDataManager';

class LoginPage extends Page {
  private tdm = TestDataManager.getInstance();

  get usernameField() {
    return this.tdm.getLocator('usernameField');
  }

  get passwordField() {
    return this.tdm.getLocator('passwordField');
  }

  get loginButton() {
    return this.tdm.getLocator('loginButton');
  }

  async loginAsDefault() {
    const user = this.tdm.getUser('default');
    await $(this.usernameField).setValue(user.username);
    await $(this.passwordField).setValue(user.password);
    await $(this.loginButton).click();
  }

  async loginAsAdmin() {
    const admin = this.tdm.getUser('admin');
    await $(this.usernameField).setValue(admin.username);
    await $(this.passwordField).setValue(admin.password);
    await $(this.loginButton).click();
  }

  async loginWithCredentials(credType: string) {
    const creds = this.tdm.getCredentials(credType);
    await $(this.usernameField).setValue(creds.username);
    await $(this.passwordField).setValue(creds.password);
    await $(this.loginButton).click();
  }
}

export default new LoginPage();
```

### In Test Specs

```typescript
import { expect } from '@wdio/globals';
import TestDataManager from '../utils/TestDataManager';
import LoginPage from '../pageobjects/login.page';

describe('Login Tests', () => {
  const tdm = TestDataManager.getInstance();

  it('should login with default user', async () => {
    const user = tdm.getUser('default');
    
    await LoginPage.loginAsDefault();
    
    // Verify login success
    const welcomeMsg = await $('~welcome-message').getText();
    expect(welcomeMsg).toContain(user.firstName);
  });

  it('should login with admin user', async () => {
    const admin = tdm.getUser('admin');
    
    await LoginPage.loginAsAdmin();
    
    // Verify admin access
    const adminPanel = await $('~admin-panel');
    expect(await adminPanel.isDisplayed()).toBe(true);
  });

  it('should fail with invalid credentials', async () => {
    const invalid = tdm.getCredentials('invalid');
    
    await LoginPage.loginWithCredentials('invalid');
    
    // Verify error message
    const errorMsg = await $(tdm.getLocator('errorMessage'));
    expect(await errorMsg.isDisplayed()).toBe(true);
  });

  it('should use random data for registration', async () => {
    const randomUser = {
      email: TestDataManager.generateRandomEmail('new'),
      username: TestDataManager.generateRandomUsername('user'),
      password: TestDataManager.generateRandomPassword(12)
    };

    console.log('Random user:', randomUser);
    // Use in registration flow
  });
});
```

### With Environment Configuration

```typescript
describe('Environment-Specific Tests', () => {
  const tdm = TestDataManager.getInstance();

  before(() => {
    // Set environment from env variable or default
    const env = process.env.TEST_ENV || 'dev';
    tdm.setEnvironment(env);
  });

  it('should use environment-specific user', async () => {
    const user = tdm.getUser('default');
    // Uses users.dev.json, users.staging.json, or users.json
    console.log(`Testing with ${tdm.getEnvironment()} user:`, user.email);
  });

  it('should use environment-specific endpoints', async () => {
    const baseUrl = tdm.getConfig(`urls.${tdm.getEnvironment()}`);
    console.log(`Base URL for ${tdm.getEnvironment()}:`, baseUrl);
  });
});
```

## Configuration

### Initialize with Custom Config

```typescript
import { TestDataManager } from '../utils/TestDataManager';

const tdm = TestDataManager.getInstance({
  baseDir: '/custom/data/path',
  environment: 'production',
  useEnvironmentOverrides: true
});
```

### Set Base Directory

```typescript
// Change data directory at runtime
tdm.setBaseDir('/path/to/other/data');

// Get current base directory
const baseDir = tdm.getBaseDir();
```

## Best Practices

### 1. Use Type-Safe Access

```typescript
// ✅ Good - Type-safe
interface UserData {
  username: string;
  password: string;
  email: string;
}

const user = tdm.getData<UserData>('users', 'default');
console.log(user.username); // TypeScript knows this exists

// ❌ Avoid - No type safety
const user = tdm.getData('users', 'default');
```

### 2. Use Default Values

```typescript
// ✅ Good - Provides fallback
const timeout = tdm.getConfig('timeouts.custom', 15000);

// ❌ Avoid - Could be undefined
const timeout = tdm.getConfig('timeouts.custom');
```

### 3. Environment-Specific Files

```typescript
// ✅ Good - Environment-specific file structure
users.json          // Default/common users
users.dev.json      // Dev environment users
users.staging.json  // Staging environment users
users.prod.json     // Production environment users
```

### 4. Sensitive Data

```typescript
// ✅ Good - Use environment variables for secrets
// .env file:
// TEST_DATA_PASSWORD=SecretPass123!

// Data will be overridden automatically
const user = tdm.getData('users', 'default');

// ❌ Avoid - Hardcoding secrets in files
// users.json: { "password": "SecretPass123!" }
```

### 5. Cache Management

```typescript
// ✅ Good - Clear cache when data changes
tdm.clearCache('users');
const updatedUsers = tdm.loadDataFile('users');

// ✅ Good - Disable cache for dynamic data
const freshData = tdm.loadDataFile('dynamic-data', false);
```

## Environment Variables

Override any data value with environment variables:

```bash
# Override username
export TEST_DATA_USERNAME="override@example.com"

# Override timeout
export TEST_DATA_TIMEOUT="20000"

# Override nested value (JSON format)
export TEST_DATA_CONFIG='{"feature":"value"}'
```

## File Format Examples

### JSON Format

```json
{
  "user1": {
    "username": "user1@example.com",
    "password": "Pass123!"
  },
  "user2": {
    "username": "user2@example.com",
    "password": "Pass456!"
  }
}
```

### YAML Format

```yaml
user1:
  username: user1@example.com
  password: Pass123!
  
user2:
  username: user2@example.com
  password: Pass456!
```

## Troubleshooting

### File Not Found

```typescript
// Check if file exists
if (tdm.dataFileExists('custom-data')) {
  const data = tdm.loadDataFile('custom-data');
} else {
  console.log('File not found, using defaults');
}
```

### Invalid Format

```typescript
// Validate data after loading
try {
  const data = tdm.loadDataFile('users');
  const isValid = tdm.validateData('users', (data) => {
    return typeof data === 'object' && data !== null;
  });
} catch (error) {
  console.error('Invalid data format:', error.message);
}
```

### Cache Issues

```typescript
// Force reload from disk
tdm.clearCache('users');
const freshUsers = tdm.loadDataFile('users');
```

## Additional Resources

- [JSON Format Guide](https://www.json.org/)
- [YAML Format Guide](https://yaml.org/)
- [js-yaml Documentation](https://github.com/nodeca/js-yaml)
