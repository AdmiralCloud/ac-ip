# AC IP
This is a little helper for IP and network operations.

This is currently just a preliminary version with limited documentation.

## Usage

```
const acts = require('ac-ip')
```

### Determine IP
Determines the IP from the request object
```
const ip = acts.determineIP(req) 
// -> 1.2.3.4
```
Use X-AdmiralCloud-Test "true" to overwrite the real IP with params.ip from request object.

#### AWS Environment
If you are in an AWS environment, the client ip is added to the right of list. In this case set environment variable CLOUDPROVIDER to "aws".


### IP to privacy
Makes the IP GDRP ready by removing the last two octecs of the IP(s)
```
const privacyIP = acts.ipsToPrivacy(['1.2.3.4', ...])
// -> ['1.2.x.x', ...]
```

### Check if IP is private
```
const isPrivate = acts.isPrivate('1.2.3.4')
// -> false

const isPrivate = acts.isPrivate('127.0.0.1')
// -> true
```

# Error codes
All errors have a message, but messages can change. Therefor all error messages now also have an error code:

| Code | Message |
|---|---|
| 9000 | acip_determineIP_noIPDetected |
| 9001 | acip_checkCIDR_listIsEmpty |
| 9002 | acip_checkCIDR_ipNotInCIDRrange |
| 9003 | acip_checkCIDR_cidrIsNotValid |
| 9004 | acip_checkCIDR_thisIsNoCIDR |
| 9005 | acip_checkCIDR_maskInvalid |
| 9006 | acip_checkCIDR_invalid |
| 9007 | acip_checkCIDR_maskInvalid |





## Links
- [Website](https://www.admiralcloud.com/)
- [Twitter (@admiralcloud)](https://twitter.com/admiralcloud)
- [Facebook](https://www.facebook.com/MediaAssetManagement/)

## License
[MIT License](https://opensource.org/licenses/MIT) Copyright © 2009-present, AdmiralCloud, Mark Poepping