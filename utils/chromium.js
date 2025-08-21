/**
 * @module chromium
 * Utilities to detect and select Chromium binary based on environment.
 * Compatible with offline and online modes, ideal for air-gapped or CLI automation environments.
 */
const fs = require("fs");
const { execSync } = require("child_process");
const dns = require("dns");
const puppeteer = require("puppeteer-core");

/**
 * Check if there is an Internet connection by performing a DNS query on google.com.
 * @returns {Promise<boolean>} true if there is a connection, false if not.
 */
function validate_internet_connection(){
	return new Promise((resolve) => {
		dns.lookup("google.com", (err) => resolve(!err))
	});
}

/**
 * Look for the Chromium binary in the operating system.
 * @returns {string|null} RBinary path if found, or null if none exists.
 */
function validate_chromium(){
	try{
		const chromium_path = execSync("which chromium-browser || which chromium", { encoding : "utf-8", stdio: ['pipe', 'pipe', 'ignore'] }).trim();
		if(fs.existsSync(chromium_path)){
			return chromium_path;
		}
		return null;
	}catch{
		return null;
	}
}

/**
 * Determines which version of Puppeteer and which Chromium binary to use based on execution mode.
 * - In offline mode: use the system binary.
 * - In online mode with connection: use standard Puppeteer with internal Chromium.
 * - In offline online mode: try using the local binary as a fallback.
 *
 * @param {Object} options
 * @param {boolean} options.offline_mode - If enabled, forces the use of the local binary.
 * @returns {Promise<{ puppeteer: any, executablePath: string | undefined }>}
 */
async function define_chromium_path({ offline_mode }){
	const chromium_path = validate_chromium();
	if(offline_mode){
		if(chromium_path){
			console.log("\n[*] Offline mode. Using system Chromium: ", chromium_path);
			return{
				puppeteer: require("puppeteer-core"),
				executablePath: chromium_path
			};
		}
		else{
			console.error("\n[*] Offline mode enabled but no Chromium was found on the system");
			process.exit(1);
		}
	}	
	const connected = await validate_internet_connection();
	if(!connected){
		if(chromium_path){
			console.warn("\n[*] Offline. Using Chromium from the system");
			return{
				puppeteer: require("puppeteer-core"),
				executablePath: chromium_path
			};
		}
		else{
			console.error("\n[*] Offline and no local Chromium found");
			process.exit(1);
		}
	}
	console.log("\n[*] Connection available. Using standard Puppeteer with internal Chromium");
	return{
		puppeteer: require("puppeteer"),
		executablePath: undefined
	};
}

module.exports = { define_chromium_path };