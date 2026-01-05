import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * Test Data Management utility for loading and managing test data
 * Supports JSON, YAML, and environment variables
 */

export interface TestDataConfig {
  baseDir?: string;
  environment?: string;
  useEnvironmentOverrides?: boolean;
}

export interface UserData {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

export interface TestData {
  [key: string]: any;
}

export class TestDataManager {
  private static instance: TestDataManager;
  private dataCache: Map<string, TestData> = new Map();
  private config: TestDataConfig;
  private environment: string;

  private constructor(config: TestDataConfig = {}) {
    this.config = {
      baseDir: config.baseDir || path.join(process.cwd(), 'test', 'data'),
      environment: config.environment || process.env.TEST_ENV || 'default',
      useEnvironmentOverrides: config.useEnvironmentOverrides !== false
    };
    this.environment = this.config.environment!;
  }

  /**
   * Get singleton instance
   */
  static getInstance(config?: TestDataConfig): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager(config);
    }
    return TestDataManager.instance;
  }

  /**
   * Reset instance (useful for testing)
   */
  static resetInstance(): void {
    TestDataManager.instance = null as any;
  }

  /**
   * Load JSON file
   */
  private loadJSON(filePath: string): TestData {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to load JSON file ${filePath}: ${(error as Error).message}`);
    }
  }

  /**
   * Load YAML file
   */
  private loadYAML(filePath: string): TestData {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return yaml.load(content) as TestData;
    } catch (error) {
      throw new Error(`Failed to load YAML file ${filePath}: ${(error as Error).message}`);
    }
  }

  /**
   * Load data file (auto-detect format)
   */
  loadDataFile(fileName: string, useCache: boolean = true): TestData {
    // Check cache first
    if (useCache && this.dataCache.has(fileName)) {
      return this.dataCache.get(fileName)!;
    }

    let filePath: string;
    let data: TestData;

    // Try to find file with different extensions
    const extensions = ['.json', '.yaml', '.yml'];
    const baseDir = this.config.baseDir!;

    for (const ext of extensions) {
      const testPath = path.join(baseDir, fileName + ext);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        break;
      }
    }

    if (!filePath!) {
      // Try without extension
      filePath = path.join(baseDir, fileName);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Data file not found: ${fileName}`);
      }
    }

    // Load based on extension
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.json') {
      data = this.loadJSON(filePath);
    } else if (ext === '.yaml' || ext === '.yml') {
      data = this.loadYAML(filePath);
    } else {
      // Try JSON first, then YAML
      try {
        data = this.loadJSON(filePath);
      } catch {
        data = this.loadYAML(filePath);
      }
    }

    // Apply environment overrides if enabled
    if (this.config.useEnvironmentOverrides) {
      data = this.applyEnvironmentOverrides(data);
    }

    // Cache the data
    if (useCache) {
      this.dataCache.set(fileName, data);
    }

    return data;
  }

  /**
   * Load environment-specific data
   */
  loadEnvironmentData(fileName: string): TestData {
    const envFileName = `${fileName}.${this.environment}`;
    
    try {
      return this.loadDataFile(envFileName, true);
    } catch {
      // Fallback to base file if environment-specific file doesn't exist
      console.log(`Environment-specific file not found, using base: ${fileName}`);
      return this.loadDataFile(fileName, true);
    }
  }

  /**
   * Apply environment variable overrides
   */
  private applyEnvironmentOverrides(data: TestData): TestData {
    const result = { ...data };

    // Check for environment variables that match data keys
    Object.keys(result).forEach(key => {
      const envKey = `TEST_DATA_${key.toUpperCase()}`;
      if (process.env[envKey]) {
        try {
          // Try to parse as JSON first
          result[key] = JSON.parse(process.env[envKey]!);
        } catch {
          // Use as string if not valid JSON
          result[key] = process.env[envKey];
        }
      }
    });

    return result;
  }

  /**
   * Get data by key with optional default
   */
  getData<T = any>(fileName: string, key?: string, defaultValue?: T): T {
    const data = this.loadDataFile(fileName);
    
    if (!key) {
      return data as T;
    }

    // Support nested keys with dot notation
    const keys = key.split('.');
    let result: any = data;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return defaultValue as T;
      }
    }

    return result as T;
  }

  /**
   * Get user data
   */
  getUser(userType: string = 'default'): UserData {
    return this.getData<UserData>('users', userType);
  }

  /**
   * Get test credentials
   */
  getCredentials(credentialType: string = 'default'): { username: string; password: string } {
    return this.getData('credentials', credentialType);
  }

  /**
   * Get configuration value
   */
  getConfig<T = any>(configKey: string, defaultValue?: T): T {
    return this.getData<T>('config', configKey, defaultValue);
  }

  /**
   * Get API endpoint
   */
  getEndpoint(endpointName: string): string {
    return this.getData<string>('endpoints', endpointName);
  }

  /**
   * Get locator
   */
  getLocator(locatorName: string): string {
    return this.getData<string>('locators', locatorName);
  }

  /**
   * Get test data by environment
   */
  getEnvironmentData<T = any>(fileName: string, key?: string): T {
    const data = this.loadEnvironmentData(fileName);
    
    if (!key) {
      return data as T;
    }

    const keys = key.split('.');
    let result: any = data;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return undefined as T;
      }
    }

    return result as T;
  }

  /**
   * Clear cache
   */
  clearCache(fileName?: string): void {
    if (fileName) {
      this.dataCache.delete(fileName);
    } else {
      this.dataCache.clear();
    }
  }

  /**
   * Get current environment
   */
  getEnvironment(): string {
    return this.environment;
  }

  /**
   * Set environment
   */
  setEnvironment(env: string): void {
    this.environment = env;
    this.clearCache(); // Clear cache when environment changes
  }

  /**
   * Check if data file exists
   */
  dataFileExists(fileName: string): boolean {
    const extensions = ['', '.json', '.yaml', '.yml'];
    const baseDir = this.config.baseDir!;

    return extensions.some(ext => {
      const filePath = path.join(baseDir, fileName + ext);
      return fs.existsSync(filePath);
    });
  }

  /**
   * Generate random test data
   */
  static generateRandomEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}_${timestamp}_${random}@test.com`;
  }

  static generateRandomUsername(prefix: string = 'user'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}_${timestamp}_${random}`;
  }

  static generateRandomPassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  static generateRandomPhone(countryCode: string = '+1'): string {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const firstPart = Math.floor(Math.random() * 900) + 100;
    const secondPart = Math.floor(Math.random() * 9000) + 1000;
    return `${countryCode}${areaCode}${firstPart}${secondPart}`;
  }

  /**
   * Merge multiple data sources
   */
  mergeData(...dataSources: TestData[]): TestData {
    return Object.assign({}, ...dataSources);
  }

  /**
   * Get data with fallback chain
   */
  getDataWithFallback<T = any>(fileNames: string[], key?: string, defaultValue?: T): T {
    for (const fileName of fileNames) {
      try {
        const data = this.getData<T>(fileName, key);
        if (data !== undefined) {
          return data;
        }
      } catch {
        continue;
      }
    }
    return defaultValue as T;
  }

  /**
   * Transform data with custom function
   */
  transformData<T = any, R = any>(fileName: string, transformer: (data: T) => R): R {
    const data = this.loadDataFile(fileName) as T;
    return transformer(data);
  }

  /**
   * Validate data against schema
   */
  validateData(fileName: string, validator: (data: TestData) => boolean): boolean {
    const data = this.loadDataFile(fileName);
    return validator(data);
  }

  /**
   * Get base directory
   */
  getBaseDir(): string {
    return this.config.baseDir!;
  }

  /**
   * Set base directory
   */
  setBaseDir(baseDir: string): void {
    this.config.baseDir = baseDir;
    this.clearCache();
  }
}

// Export singleton instance
export default TestDataManager.getInstance();
