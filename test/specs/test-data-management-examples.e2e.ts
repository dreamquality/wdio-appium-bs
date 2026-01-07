import { expect } from '@wdio/globals';
import TestDataManager, { TestDataManager as TDMClass } from '../utils/TestDataManager';

/**
 * Example tests demonstrating Test Data Management functionality
 * These examples show how to load and use test data in your tests
 */

describe('Test Data Management Examples', () => {
  const tdm = TestDataManager;

  it('Example 1: Load User Data', async () => {
    // Get default user
    const defaultUser = tdm.getUser('default');
    console.log('Default user:', defaultUser);
    
    expect(defaultUser.username).toBeTruthy();
    expect(defaultUser.password).toBeTruthy();
    expect(defaultUser.email).toBeTruthy();
  });

  it('Example 2: Get Specific Users', async () => {
    // Get different user types
    const adminUser = tdm.getUser('admin');
    const guestUser = tdm.getUser('guest');
    const premiumUser = tdm.getUser('premium');

    console.log('Admin user:', adminUser.username);
    console.log('Guest user:', guestUser.username);
    console.log('Premium user:', premiumUser.username);

    expect(adminUser.role).toBe('admin');
    expect(guestUser.role).toBe('guest');
    expect(premiumUser.subscriptionType).toBe('premium');
  });

  it('Example 3: Load Credentials', async () => {
    // Get different credential types
    const validCreds = tdm.getCredentials('valid');
    const invalidCreds = tdm.getCredentials('invalid');

    console.log('Valid credentials:', validCreds);
    console.log('Invalid credentials:', invalidCreds);

    expect(validCreds.username).toBeTruthy();
    expect(invalidCreds.username).toBeTruthy();
  });

  it('Example 4: Load Configuration', async () => {
    // Get config values
    const defaultTimeout = tdm.getConfig<number>('timeouts.default');
    const shortTimeout = tdm.getConfig<number>('timeouts.short');
    const enableLogging = tdm.getConfig<boolean>('features.enableLogging');

    console.log('Default timeout:', defaultTimeout);
    console.log('Short timeout:', shortTimeout);
    console.log('Enable logging:', enableLogging);

    expect(defaultTimeout).toBe(15000);
    expect(shortTimeout).toBe(5000);
    expect(enableLogging).toBe(true);
  });

  it('Example 5: Load Endpoints', async () => {
    // Get API endpoints
    const loginEndpoint = tdm.getEndpoint('api.login');
    const profileEndpoint = tdm.getEndpoint('api.profile');
    const usersEndpoint = tdm.getEndpoint('api.users');

    console.log('Login endpoint:', loginEndpoint);
    console.log('Profile endpoint:', profileEndpoint);
    console.log('Users endpoint:', usersEndpoint);

    expect(loginEndpoint).toContain('/login');
    expect(profileEndpoint).toContain('/profile');
  });

  it('Example 6: Load Locators', async () => {
    // Get UI locators
    const loginButton = tdm.getLocator('loginButton');
    const usernameField = tdm.getLocator('usernameField');
    const passwordField = tdm.getLocator('passwordField');

    console.log('Login button:', loginButton);
    console.log('Username field:', usernameField);
    console.log('Password field:', passwordField);

    expect(loginButton).toBeTruthy();
    expect(usernameField).toBeTruthy();
    expect(passwordField).toBeTruthy();
  });

  it('Example 7: Nested Data Access', async () => {
    // Access nested configuration
    const shortTimeout = tdm.getData('config', 'timeouts.short');
    const apiRetries = tdm.getData('config', 'retries.api');
    const baseUrl = tdm.getData('config', 'urls.base');

    console.log('Short timeout:', shortTimeout);
    console.log('API retries:', apiRetries);
    console.log('Base URL:', baseUrl);

    expect(shortTimeout).toBe(5000);
    expect(apiRetries).toBe(5);
    expect(baseUrl).toBeTruthy();
  });

  it('Example 8: Default Values', async () => {
    // Get with default value
    const customTimeout = tdm.getData('config', 'timeouts.custom', 12000);
    const missingValue = tdm.getData('config', 'nonexistent.key', 'default');

    console.log('Custom timeout (with default):', customTimeout);
    console.log('Missing value (with default):', missingValue);

    expect(customTimeout).toBe(12000);
    expect(missingValue).toBe('default');
  });

  it('Example 9: Load Entire File', async () => {
    // Load entire data file
    const allUsers = tdm.loadDataFile('users');
    const allConfig = tdm.loadDataFile('config');

    console.log('All users:', Object.keys(allUsers));
    console.log('All config keys:', Object.keys(allConfig));

    expect(Object.keys(allUsers)).toContain('default');
    expect(Object.keys(allUsers)).toContain('admin');
    expect(Object.keys(allConfig)).toContain('timeouts');
    expect(Object.keys(allConfig)).toContain('retries');
  });

  it('Example 10: Random Data Generation', async () => {
    // Generate random test data
    const randomEmail = TDMClass.generateRandomEmail('test');
    const randomUsername = TDMClass.generateRandomUsername('user');
    const randomPassword = TDMClass.generateRandomPassword(12);
    const randomPhone = TDMClass.generateRandomPhone('+1');

    console.log('Random email:', randomEmail);
    console.log('Random username:', randomUsername);
    console.log('Random password:', randomPassword);
    console.log('Random phone:', randomPhone);

    expect(randomEmail).toContain('@test.com');
    expect(randomUsername).toContain('user_');
    expect(randomPassword.length).toBe(12);
    expect(randomPhone).toContain('+1');
  });

  it('Example 11: Data Merging', async () => {
    // Merge multiple data sources
    const baseUser = tdm.getUser('default');
    const customData = {
      department: 'Engineering',
      location: 'Remote',
      startDate: '2024-01-01'
    };

    const mergedUser = tdm.mergeData(baseUser, customData);

    console.log('Merged user:', mergedUser);

    expect(mergedUser.username).toBe(baseUser.username);
    expect(mergedUser.department).toBe('Engineering');
    expect(mergedUser.location).toBe('Remote');
  });

  it('Example 12: Type-Safe Access', async () => {
    // Type-safe data access
    interface UserData {
      username: string;
      password: string;
      email: string;
      role?: string;
    }

    const user = tdm.getData<UserData>('users', 'admin');
    
    console.log('Type-safe user:', user);
    console.log('Username:', user.username);
    console.log('Role:', user.role);

    expect(user.username).toBeTruthy();
    expect(user.email).toBeTruthy();
  });

  it('Example 13: Environment Switching', async () => {
    // Get current environment
    const currentEnv = tdm.getEnvironment();
    console.log('Current environment:', currentEnv);

    // Set environment
    tdm.setEnvironment('dev');
    console.log('Switched to:', tdm.getEnvironment());

    // Load environment-specific data
    const devUser = tdm.getUser('default');
    console.log('Dev user:', devUser.email);

    // Switch back
    tdm.setEnvironment('default');
  });

  it('Example 14: Cache Management', async () => {
    // Load data (cached)
    const users1 = tdm.loadDataFile('users');
    console.log('First load (from file)');

    // Load again (from cache)
    const users2 = tdm.loadDataFile('users');
    console.log('Second load (from cache)');

    expect(users1).toEqual(users2);

    // Clear cache
    tdm.clearCache('users');
    console.log('Cache cleared');

    // Load fresh
    tdm.loadDataFile('users');
    console.log('Third load (fresh from file)');
  });

  it('Example 15: Check File Existence', async () => {
    // Check if files exist
    const usersExist = tdm.dataFileExists('users');
    const configExist = tdm.dataFileExists('config');
    const fakeExist = tdm.dataFileExists('nonexistent');

    console.log('users.json exists:', usersExist);
    console.log('config.yaml exists:', configExist);
    console.log('nonexistent exists:', fakeExist);

    expect(usersExist).toBe(true);
    expect(configExist).toBe(true);
    expect(fakeExist).toBe(false);
  });

  it('Example 16: Data Transformation', async () => {
    // Transform data
    const uppercaseUsers = tdm.transformData('users', (users: any) => {
      return Object.keys(users).reduce((acc: any, key) => {
        acc[key] = {
          ...users[key],
          username: users[key].username.toUpperCase()
        };
        return acc;
      }, {} as any);
    });

    console.log('Original admin:', tdm.getUser('admin').username);
    console.log('Uppercase admin:', uppercaseUsers.admin.username);

    expect(uppercaseUsers.admin.username).toContain('@');
  });

  it('Example 17: Data Validation', async () => {
    // Validate data structure
    const isValid = tdm.validateData('users', (data: any) => {
      return Object.values(data).every((user: any) => 
        user.username && user.password && user.email
      );
    });

    console.log('Users data valid:', isValid);
    expect(isValid).toBe(true);

    // Validate config structure
    const configValid = tdm.validateData('config', (data: any) => {
      return data.timeouts && data.retries && data.urls;
    });

    console.log('Config data valid:', configValid);
    expect(configValid).toBe(true);
  });

  it('Example 18: Fallback Chain', async () => {
    // Try multiple sources in order
    const user = tdm.getDataWithFallback(
      ['users.custom', 'users.dev', 'users'],
      'default'
    );

    console.log('User from fallback chain:', user.email);
    expect(user).toBeTruthy();
  });

  it('Example 19: Get Base Directory', async () => {
    // Get data directory path
    const baseDir = tdm.getBaseDir();
    console.log('Data directory:', baseDir);

    expect(baseDir).toContain('test');
    expect(baseDir).toContain('data');
  });

  it('Example 20: Complete Login Flow Example', async () => {
    // Simulate complete login flow with test data
    const user = tdm.getUser('default');
    const timeout = tdm.getConfig<number>('timeouts.default');
    const loginEndpoint = tdm.getEndpoint('mobile.login');
    const usernameLocator = tdm.getLocator('usernameField');
    const passwordLocator = tdm.getLocator('passwordField');
    const loginButtonLocator = tdm.getLocator('loginButton');

    console.log('Login flow data:');
    console.log('- User:', user.username);
    console.log('- Timeout:', timeout);
    console.log('- Endpoint:', loginEndpoint);
    console.log('- Username field:', usernameLocator);
    console.log('- Password field:', passwordLocator);
    console.log('- Login button:', loginButtonLocator);

    expect(user.username).toBeTruthy();
    expect(timeout).toBeGreaterThan(0);
    expect(loginEndpoint).toBeTruthy();
  });

  it('Example 21: Random User Registration', async () => {
    // Create random user for registration
    const newUser = {
      username: TDMClass.generateRandomUsername('newuser'),
      email: TDMClass.generateRandomEmail('newuser'),
      password: TDMClass.generateRandomPassword(16),
      phone: TDMClass.generateRandomPhone('+1'),
      firstName: 'Test',
      lastName: 'User'
    };

    console.log('Generated random user for registration:', newUser);

    expect(newUser.username).toContain('newuser_');
    expect(newUser.email).toContain('@test.com');
    expect(newUser.password.length).toBe(16);
    expect(newUser.phone).toContain('+1');
  });

  it('Example 22: Multi-Environment Config', async () => {
    // Get config for different environments
    const config = tdm.loadDataFile('config');
    
    console.log('URLs:');
    console.log('- Base:', config.urls.base);
    console.log('- API:', config.urls.api);
    console.log('- Staging:', config.urls.staging);

    expect(config.urls.base).toBeTruthy();
    expect(config.urls.api).toBeTruthy();
  });

  it('Example 23: Load without Cache', async () => {
    // Force load from disk without cache
    const freshUsers = tdm.loadDataFile('users', false);
    console.log('Loaded fresh users (no cache):', Object.keys(freshUsers));

    expect(freshUsers).toBeTruthy();
    expect(Object.keys(freshUsers).length).toBeGreaterThan(0);
  });

  it('Example 24: Complex Data Structure', async () => {
    // Work with complex nested data
    const config = tdm.loadDataFile('config');
    
    // Access all timeouts
    const timeouts = config.timeouts;
    console.log('All timeouts:', timeouts);

    // Access all retries
    const retries = config.retries;
    console.log('All retries:', retries);

    // Access all features
    const features = config.features;
    console.log('All features:', features);

    expect(Object.keys(timeouts).length).toBeGreaterThan(0);
    expect(Object.keys(retries).length).toBeGreaterThan(0);
    expect(Object.keys(features).length).toBeGreaterThan(0);
  });
});
