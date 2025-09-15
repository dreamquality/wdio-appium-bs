#!/usr/bin/env node

/**
 * Debug and troubleshooting utilities for the test framework
 */

import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

dotenv.config();

const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME;
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;

const hasCredentials = BROWSERSTACK_USERNAME && BROWSERSTACK_ACCESS_KEY;

if (!hasCredentials && process.argv[2] && !['env', 'help'].includes(process.argv[2])) {
    console.error('❌ BrowserStack credentials not found in .env file');
    console.log('Please set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY');
    console.log('Run "npm run debug:env" to check your environment setup');
    process.exit(1);
}

const auth = hasCredentials ? Buffer.from(`${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}`).toString('base64') : null;

async function checkBrowserStackConnection() {
    if (!hasCredentials) {
        console.log('❌ Cannot check BrowserStack connection - credentials not set');
        return false;
    }
    
    try {
        console.log('🔍 Checking BrowserStack connection...');
        const response = await axios.get('https://api.browserstack.com/app-automate/plan.json', {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        
        console.log('✅ BrowserStack connection successful');
        console.log(`📋 Plan: ${response.data.automate_plan}`);
        console.log(`⏱️  Parallel sessions: ${response.data.parallel_sessions_running}/${response.data.parallel_sessions_max_allowed}`);
        return true;
    } catch (error) {
        console.error('❌ BrowserStack connection failed:', error.response?.data || error.message);
        return false;
    }
}

async function listRecentApps() {
    if (!hasCredentials) {
        console.log('❌ Cannot list apps - credentials not set');
        return;
    }
    
    try {
        console.log('📱 Fetching recent uploaded apps...');
        const response = await axios.get('https://api.browserstack.com/app-automate/recent_apps', {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        
        if (response.data.length === 0) {
            console.log('📭 No apps found. Upload an app first.');
            return;
        }

        console.log('📱 Recent apps:');
        response.data.forEach((app, index) => {
            console.log(`${index + 1}. ${app.app_name} (${app.app_id})`);
            console.log(`   📅 Uploaded: ${new Date(app.uploaded_at).toLocaleString()}`);
            console.log(`   📦 Size: ${(app.app_size / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   🔗 URL: ${app.app_url}`);
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to fetch apps:', error.response?.data || error.message);
    }
}

async function listRecentSessions() {
    if (!hasCredentials) {
        console.log('❌ Cannot list sessions - credentials not set');
        return;
    }
    
    try {
        console.log('📊 Fetching recent test sessions...');
        const response = await axios.get('https://api.browserstack.com/app-automate/builds.json', {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        
        if (response.data.length === 0) {
            console.log('📭 No recent builds found.');
            return;
        }

        console.log('🏗️  Recent builds:');
        response.data.slice(0, 5).forEach((build, index) => {
            console.log(`${index + 1}. ${build.name} (${build.hashed_id})`);
            console.log(`   📅 Created: ${new Date(build.created_at).toLocaleString()}`);
            console.log(`   ⏱️  Duration: ${build.duration || 'N/A'}s`);
            console.log(`   📊 Status: ${build.status}`);
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to fetch sessions:', error.response?.data || error.message);
    }
}

async function checkEnvironment() {
    console.log('🔧 Environment Check');
    console.log('===================');
    
    // Check .env file
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        console.log('✅ .env file found');
    } else {
        console.log('❌ .env file not found');
        console.log('💡 Copy .env.example to .env and fill in your credentials');
    }

    // Check required environment variables
    const requiredVars = ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY'];
    const optionalVars = ['BROWSERSTACK_ANDROID_APP_ID', 'BROWSERSTACK_IOS_APP_ID'];
    
    console.log('\n📋 Required Environment Variables:');
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`✅ ${varName}: ${process.env[varName].substring(0, 10)}...`);
        } else {
            console.log(`❌ ${varName}: Not set`);
        }
    });

    console.log('\n📋 Optional Environment Variables:');
    optionalVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`✅ ${varName}: ${process.env[varName]}`);
        } else {
            console.log(`⚠️  ${varName}: Not set`);
        }
    });

    // Check Node.js version
    console.log(`\n📦 Node.js version: ${process.version}`);
    const majorVersion = parseInt(process.version.substring(1).split('.')[0]);
    if (majorVersion >= 16) {
        console.log('✅ Node.js version is compatible');
    } else {
        console.log('❌ Node.js version is too old. Please upgrade to 16+');
    }

    // Check if dependencies are installed
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
        console.log('✅ node_modules found');
    } else {
        console.log('❌ node_modules not found. Run: npm install');
    }
}

async function main() {
    const command = process.argv[2];
    
    console.log('🧪 WebdriverIO + Appium + BrowserStack Debug Tool');
    console.log('================================================\n');

    if (!command) {
        console.log('Available commands:');
        console.log('  env        - Check environment setup');
        console.log('  connection - Test BrowserStack connection');
        console.log('  apps       - List uploaded apps');
        console.log('  sessions   - List recent test sessions');
        console.log('  all        - Run all checks');
        console.log('\nUsage: node scripts/debug.js <command>');
        return;
    }

    switch (command) {
        case 'env':
            await checkEnvironment();
            break;
        case 'connection':
            await checkBrowserStackConnection();
            break;
        case 'apps':
            await listRecentApps();
            break;
        case 'sessions':
            await listRecentSessions();
            break;
        case 'all':
            await checkEnvironment();
            console.log('\n');
            if (hasCredentials) {
                await checkBrowserStackConnection();
                console.log('\n');
                await listRecentApps();
                console.log('\n');
                await listRecentSessions();
            } else {
                console.log('⚠️  Skipping BrowserStack checks - credentials not configured');
            }
            break;
        default:
            console.log(`❌ Unknown command: ${command}`);
            console.log('Run without arguments to see available commands');
    }
}

main().catch(console.error);