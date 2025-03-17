
## [4.1.3](https://github.com/mmpro/ac-ip/compare/v4.1.2..v4.1.3) (2025-03-17 19:40:38)


### Bug Fix

* **App:** Minor updates after changes in ip-address package | MP | [2e2cd0c341d400103619292faa7e5266a7408228](https://github.com/mmpro/ac-ip/commit/2e2cd0c341d400103619292faa7e5266a7408228)    
Minor updates after changes in ip-address package  
Related issues:
### Chores

* **App:** Updated packages | MP | [261e795e52bf5716b41cf8d0d2877382d8569d72](https://github.com/mmpro/ac-ip/commit/261e795e52bf5716b41cf8d0d2877382d8569d72)    
Updated packages  
Related issues:
<a name="4.1.2"></a>

## [4.1.2](https://github.com/mmpro/ac-ip/compare/v4.1.1..v4.1.2) (2024-07-24 09:12:53)


### Bug Fix

* **App:** Set maxPrefix to 18 for IPv4 CIDR | MP | [f6d3f87bad1ceb802e37d60d25762c07dd5d2dc8](https://github.com/mmpro/ac-ip/commit/f6d3f87bad1ceb802e37d60d25762c07dd5d2dc8)    
Make current version more backwards compatible by using 18 instead of 24 as maxPrefix for CIDR.  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Chores

* **App:** Updated packages | MP | [0ebefd754d5dd69234d76d4ad2e56fe1c506b59a](https://github.com/mmpro/ac-ip/commit/0ebefd754d5dd69234d76d4ad2e56fe1c506b59a)    
Updated packages  
Related issues: [undefined/undefined#master](undefined/browse/master)
<a name="4.1.1"></a>

## [4.1.1](https://github.com/mmpro/ac-ip/compare/v4.1.0..v4.1.1) (2024-07-06 19:10:34)


### Bug Fix

* **App:** Use isSpecialIp in determineIP | MP | [4fd437cfa032fa2e6aa4eb1fddcfd62acef06d9c](https://github.com/mmpro/ac-ip/commit/4fd437cfa032fa2e6aa4eb1fddcfd62acef06d9c)    
Replaced isPrivateIP with isSpecialIP  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Documentation

* **App:** Added documentation for isSpecialIP | MP | [2fddaf7469454eb0ca3aa57ecdcb40d99c6edfbb](https://github.com/mmpro/ac-ip/commit/2fddaf7469454eb0ca3aa57ecdcb40d99c6edfbb)    
Added documentation for isSpecialIP  
Related issues: [undefined/undefined#master](undefined/browse/master)
<a name="4.1.0"></a>
 
# [4.1.0](https://github.com/mmpro/ac-ip/compare/v4.0.0..v4.1.0) (2024-07-06 18:43:59)


### Feature

* **App:** Add new function isSpecialIP | MP | [d4a09f6bdc839779f87383a20a7e2c5f663cd721](https://github.com/mmpro/ac-ip/commit/d4a09f6bdc839779f87383a20a7e2c5f663cd721)    
Function isSpecialIP is an enhanced verrsion of isPrivateIP. isSpecialIP detects also loop-back etc.  
Related issues: [undefined/undefined#master](undefined/browse/master)
<a name="4.0.0"></a>
 
# [4.0.0](https://github.com/mmpro/ac-ip/compare/v3.1.1..v4.0.0) (2024-07-06 12:06:03)


### Feature

* **App:** Refactored version | MP | [13cf19708d8a192d7c7aafd17dc7ea835f558df7](https://github.com/mmpro/ac-ip/commit/13cf19708d8a192d7c7aafd17dc7ea835f558df7)    
Refactored version - please read README  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Chores

* **App:** Updated Github CI settings | MP | [74a2fb547301afeeb6fd3062528a7fc65638d6a0](https://github.com/mmpro/ac-ip/commit/74a2fb547301afeeb6fd3062528a7fc65638d6a0)    
Updated Github CI settings  
Related issues: [undefined/undefined#master](undefined/browse/master)
## BREAKING CHANGES
* **App:** all functions are synchronous, errors are thrown
<a name="3.1.1"></a>

## [3.1.1](https://github.com/mmpro/ac-ip/compare/v3.1.0..v3.1.1) (2024-02-26 07:32:26)


### Bug Fix

* **App:** Package updates | MP | [528a88a4bf314025098d19934dbc1a7bfcbabd8b](https://github.com/mmpro/ac-ip/commit/528a88a4bf314025098d19934dbc1a7bfcbabd8b)    
Package updates  
Related issues: [undefined/undefined#master](undefined/browse/master)
<a name="3.1.0"></a>
 
# [3.1.0](https://github.com/mmpro/ac-ip/compare/v3.0.2..v3.1.0) (2023-07-26 12:09:22)


### Feature

* **App:** Add new function to anonymizeIP | MP | [b73bcaa6c7d08abbb4902e87ef5a1ec6527a23a2](https://github.com/mmpro/ac-ip/commit/b73bcaa6c7d08abbb4902e87ef5a1ec6527a23a2)    
You can now anonymize single IPv4 or IPv6 addresses  
Related issues: [/issues#undefined](https://github.com//issues/undefined)
<a name="3.0.2"></a>

## [3.0.2](https://github.com/mmpro/ac-ip/compare/v3.0.1..v3.0.2) (2023-07-26 06:19:08)


### Bug Fix

* **App:** Package updates | MP | [9052aba0fc2729b488e64a740362e3ddfe105c17](https://github.com/mmpro/ac-ip/commit/9052aba0fc2729b488e64a740362e3ddfe105c17)    
Including replacement of nyc with c8.  
Related issues: [/issues#undefined](https://github.com//issues/undefined)
<a name="3.0.1"></a>
 
# [3.0.1](https://github.com/mmpro/ac-ip/compare/v3.0.0..v3.0.1) (2023-01-02 20:23:00)

Manual release after package updates.

<a name="3.0.0"></a>
 
# [3.0.0](https://github.com/mmpro/ac-ip/compare/v2.0.0..v3.0.0) (2022-12-18 09:58:28)


### Tests

* **App:** Use chai/expect for test | MP | [10b1c1e3250cd01e3348a4ab5c4fa5273e6c48c3](https://github.com/mmpro/ac-ip/commit/10b1c1e3250cd01e3348a4ab5c4fa5273e6c48c3)    
Use chai/expect for test  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Chores

* **App:** Updated packages | MP | [71c6efe0d2183718915863aa0eb8d2b40155a3b7](https://github.com/mmpro/ac-ip/commit/71c6efe0d2183718915863aa0eb8d2b40155a3b7)    
Updated packages  
Related issues: [/issues#undefined](https://github.com//issues/undefined)
## BREAKING CHANGES
* **App:** Node 16+ required
<a name="2.0.0"></a>
 
# [2.0.0](https://github.com/mmpro/ac-ip/compare/v1.3.7..v2.0.0) (2022-02-17 11:16:58)


### Bug Fix

* **App:** Do not use X-Real-IP header any longer | MP | [1c8fe63777771bb918fe0f68234cc25db978689d](https://github.com/mmpro/ac-ip/commit/1c8fe63777771bb918fe0f68234cc25db978689d)    
X-Real-IP header can easily be spoofed and should not be used.
### Chores

* **App:** Updated packages | MP | [15d62105b189647c1376f2ad3fa96c99af7bfd28](https://github.com/mmpro/ac-ip/commit/15d62105b189647c1376f2ad3fa96c99af7bfd28)    
Updated packages
## BREAKING CHANGES
* **App:** X-Real-IP header is now ignored
<a name="1.3.7"></a>

## [1.3.7](https://github.com/mmpro/ac-ip/compare/v1.3.6..v1.3.7) (2022-02-10 20:06:59)


### Bug Fix

* **App:** Add option to detect IP in AWS environment. See README for details. | MP | [9f1f1e54984f383ea953a9782ab50df4604b0372](https://github.com/mmpro/ac-ip/commit/9f1f1e54984f383ea953a9782ab50df4604b0372)    
Add option to detect IP in AWS environment. See README for details.
### Chores

* **App:** Updated packages | MP | [2f3f45f0470ab3d7c17d0e781ad4efc93d3acbbc](https://github.com/mmpro/ac-ip/commit/2f3f45f0470ab3d7c17d0e781ad4efc93d3acbbc)    
Updated packages
<a name="1.3.6"></a>

## [1.3.6](https://github.com/mmpro/ac-ip/compare/v1.3.5..v1.3.6) (2021-10-09 10:12:28)


### Bug Fix

* **App:** Package updates | MP | [24f70a12ed3e4465ad88c2cd4e4a86ab6fd1a485](https://github.com/mmpro/ac-ip/commit/24f70a12ed3e4465ad88c2cd4e4a86ab6fd1a485)    
Package updates
<a name="1.3.5"></a>

## [1.3.5](https://github.com/mmpro/ac-ip/compare/v1.3.4..v1.3.5) (2021-05-08 07:22:35)


### Bug Fix

* **App:** Force version bump | MP | [0cae9b46eb613b86bd6471fe8940fd9c9c4f1a30](https://github.com/mmpro/ac-ip/commit/0cae9b46eb613b86bd6471fe8940fd9c9c4f1a30)    
Force version bump
### Tests

* **Misc:** Added test | MP | [9093f7b0bb5c4cf58fb0ce9f41fa708a3f406220](https://github.com/mmpro/ac-ip/commit/9093f7b0bb5c4cf58fb0ce9f41fa708a3f406220)    
Test coverage is now ~99%
### Chores

* **App:** Updated gitignore | MP | [29748cfe061af03bd162e39f388b1e4537b60c6f](https://github.com/mmpro/ac-ip/commit/29748cfe061af03bd162e39f388b1e4537b60c6f)    
Updated gitignore
### Chores

* **Misc:** Updated packages | MP | [f4ace7c58b7c1d60b01c1c6634cf816b4bceadf8](https://github.com/mmpro/ac-ip/commit/f4ace7c58b7c1d60b01c1c6634cf816b4bceadf8)    
Updated packages
<a name="1.3.4"></a>

## [1.3.4](https://github.com/mmpro/ac-ip/compare/v1.3.3..v1.3.4) (2020-05-12 08:50:47)


### Bug Fix

* **App:** Add error codes | MP | [3e70c7818554c3837ce4ebeec768fe95352212b4](https://github.com/mmpro/ac-ip/commit/3e70c7818554c3837ce4ebeec768fe95352212b4)    
Add error codes in addition to error message
### Tests

* **App:** Fixed test | MP | [cf5a8d8399e597ad4d8e1a0e6b1dde43255941f2](https://github.com/mmpro/ac-ip/commit/cf5a8d8399e597ad4d8e1a0e6b1dde43255941f2)    
Add code to error response
### Chores

* **App:** Updated packages | MP | [83c937eeed2eab9bba89974277b87fd52ef79885](https://github.com/mmpro/ac-ip/commit/83c937eeed2eab9bba89974277b87fd52ef79885)    
Updated packages
* **undefined:** Updated packages | MP | [18845753d849c612113a9a6b0a74bd5454db0da8](https://github.com/mmpro/ac-ip/commit/18845753d849c612113a9a6b0a74bd5454db0da8)    
Updated packages
<a name="1.3.3"></a>

## [1.3.3](https://github.com/mmpro/ac-ip/compare/v1.3.2..v1.3.3) (2020-04-03 10:14:20)


### Bug Fix

* **App:** Fallback to development environment if none set | MP | [83c11ce93938ff00e2e70e0972bd9746fe032abd](https://github.com/mmpro/ac-ip/commit/83c11ce93938ff00e2e70e0972bd9746fe032abd)    
If process has not set any environment via NODE_ENV, then fallback to development
<a name="1.3.2"></a>

## [1.3.2](https://github.com/mmpro/ac-ip/compare/v1.3.1..v1.3.2) (2020-04-01 09:10:16)


### Bug Fix

* **App:** Use statusCode 420 in message if ip is not in range | MP | [995b22dd92a4914fc6272a5e24af588e3c328982](https://github.com/mmpro/ac-ip/commit/995b22dd92a4914fc6272a5e24af588e3c328982)    
IP no in range is not typcical error, but more like a preconditon fail. That's why we now use statusCode 420 in addition to the error message. This way you can decide whether you want to treat it as error or as warning.
<a name="1.3.1"></a>

## [1.3.1](https://github.com/mmpro/ac-ip/compare/v1.3.0..v1.3.1) (2020-03-29 14:04:57)


### Bug Fix

* **App:** Prepare repository for AC semantic release  | MP | [30dadc928a5ed428d73b01ea0efe1afc1dffc94c](https://github.com/mmpro/ac-ip/commit/30dadc928a5ed428d73b01ea0efe1afc1dffc94c)    
Cleaned up repository and use ac-semantic-release
<a name="1.3.0"></a>
# [1.3.0](https://github.com/mmpro/ac-ip/compare/v1.2.0...v1.3.0) (2020-03-18 11:05)


### Features

* **Misc:** checkCIDR now returns the matching CIDR instead of true | MP ([8a34f26c328d666ae803f5bef3b6aa5f14677051](https://github.com/mmpro/ac-ip/commit/8a34f26c328d666ae803f5bef3b6aa5f14677051))    
  checkCIDR now returns the matching CIDR instead of true



<a name="1.2.0"></a>
# [1.2.0](https://github.com/mmpro/ac-ip/compare/v1.1.4...v1.2.0) (2019-11-08 10:32)


### Features

* **Misc:** CHeck if IP is private | MP ([a83311517acfa828c1ca6f2fe9dc42a0d986a955](https://github.com/mmpro/ac-ip/commit/a83311517acfa828c1ca6f2fe9dc42a0d986a955))    
  New function "isPrivate" to check if a given IP is public or private



<a name="1.1.4"></a>
## [1.1.4](https://github.com/mmpro/ac-ip/compare/v1.1.3...v1.1.4) (2019-10-06 12:53)


### Bug Fixes

* **Misc:** Send IP as parameter if not in production mode | MP ([2a5725c](https://github.com/mmpro/ac-ip/commit/2a5725c))    
  For easier debugging it is now possible to just send the IP address as query parameter.



<a name="1.1.3"></a>
## [1.1.3](https://github.com/mmpro/ac-ip/compare/v1.1.2...v1.1.3) (2019-10-06 09:15)


### Bug Fixes

* **Misc:** Updated packages / Security fix | MP ([8e4c21c](https://github.com/mmpro/ac-ip/commit/8e4c21c))    
  Updated packages / Security fix



<a name="1.1.2"></a>
## [1.1.2](https://github.com/mmpro/ac-ip/compare/v1.1.1...v1.1.2) (2019-07-24 19:28)


### Bug Fixes

* **Misc:** Updated packages | MP ([8cec625](https://github.com/mmpro/ac-ip/commit/8cec625))    
  Updated packages



<a name="1.1.1"></a>
## [1.1.1](https://github.com/mmpro/ac-ip/compare/v1.1.0...v1.1.1) (2019-07-03 15:56)


### Bug Fixes

* **Misc:** Return unique array for ipsToPrivacy | MP ([c51318f](https://github.com/mmpro/ac-ip/commit/c51318f))    
  Make sure to group ips



<a name="1.1.0"></a>
# [1.1.0](https://github.com/mmpro/ac-ip/compare/v1.0.4...v1.1.0) (2019-07-03 15:20)


### Features

* **Misc:** New functions to make IPs GDPR ready and to check IPs against a list of IPs | MP ([40c2e24](https://github.com/mmpro/ac-ip/commit/40c2e24))    
  New functions to make IPs GDPR ready and to check IPs against a list of IPs



<a name="1.0.4"></a>
## [1.0.4](https://github.com/mmpro/ac-ip/compare/v1.0.3...v1.0.4) (2019-06-09 17:16)


### Bug Fixes

* **Misc:** Do not user req.allParams | MP ([57e5e4e](https://github.com/mmpro/ac-ip/commit/57e5e4e))    
  req.allParams is not available for non-sails APIs



<a name="1.0.3"></a>
## [1.0.3](https://github.com/mmpro/ac-ip/compare/v1.0.2...v1.0.3) (2019-04-09 16:22)


### Bug Fixes

* **Misc:** Allow custom IP with X-AdmiralCloud-Test header | MP ([89cc08c](https://github.com/mmpro/ac-ip/commit/89cc08c))    
  If you want to set a custom IP for testing or development, use X-AdmiralCloud-Test header as true
and send ip with request params.



<a name="1.0.2"></a>
## [1.0.2](https://github.com/mmpro/ac-ip/compare/v1.0.1...v1.0.2) (2019-01-20 10:54)


### Bug Fixes

* **Misc:** Minor code cleanup | MP ([a65b674](https://github.com/mmpro/ac-ip/commit/a65b674))    
  Minor code cleanup



<a name="1.0.1"></a>
## [1.0.1](https://github.com/mmpro/ac-ip/compare/v1.0.0...v1.0.1) (2018-09-22 10:27)


### Bug Fixes

* **Misc:** Updated packages | MP ([6c6014d](https://github.com/mmpro/ac-ip/commit/6c6014d))    
  Updated packages



<a name="1.0.0"></a>
# 1.0.0 (2018-08-22 15:39)


### Features

* **Misc:** Added methods for IP detection and IPs from CIDR | MP ([64377dc](https://github.com/mmpro/ac-ip/commit/64377dc))    
  + Detect IPs from Express-like request object
* **Misc:** First commit | MP ([617d724](https://github.com/mmpro/ac-ip/commit/617d724))    
  First commit



