module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 168:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const core = __webpack_require__(450)
const fs = __webpack_require__(747)
const path = __webpack_require__(622)
const S3 = __webpack_require__(947)

const SOURCE = core.getInput('source', {
	required: true
})
const OUT_DIR = core.getInput('out_dir', {
	required: false
})
const SPACE_NAME = core.getInput('space_name', {
	required: true
})
const SPACE_REGION = core.getInput('space_region', {
	required: true
})
const ACCESS_KEY = core.getInput('access_key', {
	required: true
})
const SECRET_KEY = core.getInput('secret_key', {
	required: true
})
const VERSIONING = core.getInput('versioning', {
	required: false
})
const CDN_DOMAIN = core.getInput('cdn_domain', {
	required: false
})
const PERMISSION = core.getInput('permission', {
	required: false
})

const getVersion = function(value) {
	try {
		const pkgPath = (typeof value === 'string' && value !== 'true') ? value : ''
		const raw = fs.readFileSync(path.join(pkgPath, 'package.json')).toString()
		const version = JSON.parse(raw).version
		if (!version) return ''

		return version.charAt(0) !== 'v' ? `v${ version }` : version
	} catch (err) {
		return ''
	}
}

async function run() {
	try {
		const source = path.join(process.cwd(), SOURCE)
		const permission = PERMISSION || 'public-read'

		let outDir = OUT_DIR
		if (VERSIONING !== undefined && VERSIONING !== false) {
			const version = getVersion(VERSIONING)
			core.debug('using version: ' + version)
			outDir = path.join(OUT_DIR, version)
		}

		core.debug(outDir)

		const config = {
			bucket: SPACE_NAME,
			region: SPACE_REGION,
			access_key: ACCESS_KEY,
			secret_key: SECRET_KEY,
			permission: permission
		}
		const s3 = new S3(config)

		const fileStat = await fs.promises.stat(source)
		const isFile = fileStat.isFile()
		if (isFile) {
			const fileName = path.basename(source)
			const s3Path = path.join(outDir, fileName).replace(/\\/g, '/')

			outDir = path.join(outDir, fileName)

			core.debug('Uploading file: ' + s3Path)
			await s3.upload(source, s3Path)
		} else {
			core.debug('Uploading directory')
			const uploadFolder = async (currentFolder) => {
				const files = await fs.promises.readdir(currentFolder)

				files.forEach(async (file) => {
					const fullPath = path.join(currentFolder, file)
					const stat = await fs.promises.stat(fullPath)

					if (stat.isFile()) {
						const s3Path = path.join(outDir, path.relative(source, fullPath)).replace(/\\/g, '/')
						core.debug('Uploading: ' + s3Path)
						await s3.upload(fullPath, s3Path)
					} else {
						uploadFolder(fullPath)
					}
				})
			}

			await uploadFolder(source)
		}

		const outputPath = CDN_DOMAIN ? `https://${ CDN_DOMAIN }/${ outDir }` : `https://${ SPACE_NAME }.${ SPACE_REGION }.digitaloceanspaces.com/${ outDir }`

		core.info(`Files uploaded to ${ outputPath }`)
		core.setOutput('output_url', outputPath)

	} catch (err) {
		core.debug(err)
		core.setFailed(err.message)
	}
}

run()


/***/ }),

/***/ 947:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const AWS = __webpack_require__(661)
const fs = __webpack_require__(747)
const { lookup } = __webpack_require__(946)

class S3Interface {
	constructor(config) {
		this.bucket = config.bucket
		this.permission = config.permission

		const spacesEndpoint = new AWS.Endpoint(`${ config.region }.digitaloceanspaces.com`)
		const s3 = new AWS.S3({
			endpoint: spacesEndpoint,
			accessKeyId: config.access_key,
			secretAccessKey: config.secret_key
		})

		this.s3 = s3
	}

	async upload(file, path) {
		return new Promise((resolve, reject) => {

			const fileStream = fs.createReadStream(file)

			const options = {
				Body: fileStream,
				Bucket: this.bucket,
				Key: path,
				ACL: this.permission,
				ContentType: lookup(file) || 'text/plain'
			}

			this.s3.upload(options, (err, data) => {
				if (err) {
					return reject(err)
				}

				resolve(data)
			})
		})
	}
}

module.exports = S3Interface

/***/ }),

/***/ 450:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 661:
/***/ ((module) => {

module.exports = eval("require")("aws-sdk");


/***/ }),

/***/ 946:
/***/ ((module) => {

module.exports = eval("require")("mime-types");


/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(168);
/******/ })()
;