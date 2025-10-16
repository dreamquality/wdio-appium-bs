#!/usr/bin/env node

/**
 * Appium Server Manager
 * 
 * This script helps manage Appium server connections to prevent
 * the "every second time" connection failure issue.
 */

const { spawn, exec } = require('child_process');
const axios = require('axios');

class AppiumManager {
    constructor() {
        this.port = 4723;
        this.host = 'localhost';
        this.serverProcess = null;
        this.baseUrl = `http://${this.host}:${this.port}`;
    }

    /**
     * Check if Appium server is running and responsive
     */
    async isServerRunning() {
        try {
            const response = await axios.get(`${this.baseUrl}/status`, { timeout: 5000 });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    /**
     * Kill any existing Appium processes
     */
    async killExistingProcesses() {
        return new Promise((resolve) => {
            // Kill processes on the port
            exec(`lsof -ti:${this.port} | xargs kill -9`, (error) => {
                // Ignore errors - process might not exist
                setTimeout(() => {
                    // Also kill by process name
                    exec(`pkill -f appium`, (error) => {
                        // Ignore errors
                        setTimeout(resolve, 2000); // Wait for cleanup
                    });
                }, 1000);
            });
        });
    }

    /**
     * Start Appium server with proper configuration
     */
    async startServer() {
        console.log('Starting Appium server...');
        
        return new Promise((resolve, reject) => {
            const args = [
                '--port', this.port.toString(),
                '--allow-insecure=uiautomator2:chromedriver_autodownload,xcuitest:get_server_logs,xcuitest:chromedriver_autodownload',
                '--relaxed-security',
                '--session-override',
                '--log-level', 'error:info',
                '--log-timestamp',
                '--local-timezone'
            ];

            this.serverProcess = spawn('appium', args, {
                stdio: ['pipe', 'pipe', 'pipe'],
                detached: false
            });

            let serverReady = false;

            this.serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log('Appium:', output.trim());
                
                if (output.includes('Appium REST http interface listener started')) {
                    serverReady = true;
                    resolve();
                }
            });

            this.serverProcess.stderr.on('data', (data) => {
                const output = data.toString();
                console.error('Appium Error:', output.trim());
                
                if (output.includes('EADDRINUSE')) {
                    reject(new Error('Port already in use'));
                }
            });

            this.serverProcess.on('error', (error) => {
                console.error('Failed to start Appium:', error.message);
                reject(error);
            });

            this.serverProcess.on('exit', (code) => {
                if (!serverReady) {
                    reject(new Error(`Appium exited with code ${code}`));
                }
            });

            // Timeout after 30 seconds
            setTimeout(() => {
                if (!serverReady) {
                    this.stopServer();
                    reject(new Error('Appium server startup timeout'));
                }
            }, 30000);
        });
    }

    /**
     * Stop Appium server gracefully
     */
    async stopServer() {
        if (this.serverProcess) {
            console.log('Stopping Appium server...');
            
            return new Promise((resolve) => {
                this.serverProcess.on('exit', () => {
                    this.serverProcess = null;
                    console.log('Appium server stopped');
                    resolve();
                });

                // Try graceful shutdown first
                this.serverProcess.kill('SIGTERM');
                
                // Force kill after 10 seconds
                setTimeout(() => {
                    if (this.serverProcess) {
                        this.serverProcess.kill('SIGKILL');
                        this.serverProcess = null;
                        console.log('Appium server force killed');
                        resolve();
                    }
                }, 10000);
            });
        }
    }

    /**
     * Restart Appium server with clean state
     */
    async restartServer() {
        console.log('Restarting Appium server for clean state...');
        
        // Kill any existing processes
        await this.killExistingProcesses();
        
        // Wait a bit for cleanup
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Start fresh server
        await this.startServer();
        
        // Verify it's working
        let retries = 5;
        while (retries > 0) {
            if (await this.isServerRunning()) {
                console.log('Appium server is ready!');
                return true;
            }
            
            console.log(`Waiting for server to be ready... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            retries--;
        }
        
        throw new Error('Appium server failed to become ready');
    }

    /**
     * Health check and restart if needed
     */
    async ensureHealthyConnection() {
        const isRunning = await this.isServerRunning();
        
        if (!isRunning) {
            console.log('Appium server not responding, restarting...');
            await this.restartServer();
        } else {
            console.log('Appium server is healthy');
        }
    }
}

// CLI interface
async function main() {
    const manager = new AppiumManager();
    const command = process.argv[2];

    try {
        switch (command) {
            case 'start':
                await manager.restartServer();
                break;
                
            case 'stop':
                await manager.killExistingProcesses();
                break;
                
            case 'restart':
                await manager.restartServer();
                break;
                
            case 'status':
                const isRunning = await manager.isServerRunning();
                console.log('Appium server status:', isRunning ? 'RUNNING' : 'NOT RUNNING');
                break;
                
            case 'health':
                await manager.ensureHealthyConnection();
                break;
                
            default:
                console.log('Usage: node appium-manager.js [start|stop|restart|status|health]');
                console.log('');
                console.log('Commands:');
                console.log('  start   - Start Appium server with clean state');
                console.log('  stop    - Stop all Appium processes');
                console.log('  restart - Restart server for clean state');
                console.log('  status  - Check if server is running');
                console.log('  health  - Check health and restart if needed');
                break;
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = AppiumManager;