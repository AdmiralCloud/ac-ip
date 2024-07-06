# AC IP
This is a little helper for IP and network operations.

[![Node.js CI](https://github.com/AdmiralCloud/ac-ip/actions/workflows/node.js.yml/badge.svg)](https://github.com/AdmiralCloud/ac-ip/actions/workflows/node.js.yml)

# BREAKING CHANGE Version 4
+ package ip is no longer maintained, therefore we now use ip-address instead
+ all functions are synchronous
+ all errors are thrown and no longer returned as string, make sure to handle them in your code (try/catch)

## Usage

```
const acts = require('ac-ip')
```

### determineIP
Determines the IP from the (ExpressJS) request object
```
const ip = acts.determineIP(req) 
// -> 1.2.3.4
```
Use X-AdmiralCloud-Test "true" to overwrite the IP with params.ip from request object.

Otherwise IP is determined from X-Forwarded-For (if present) or req.ip.

#### AWS Environment
If you are in an AWS environment, the client ip is added to the right of list by ALB. In this you might want to set environment variable X-Forwarded-For to "reverse".

### ipsFromCIDR
Ingests a cidr and returns a list of valid IP addresses for the cidr. 

```
const list = acts.ipsFromCIDR({ cidr: '192.168.10.0/29' })

const list = acts.ipsFromCIDR({ cidr: '2001:db8::/120' })
```

### checkCIDR
Ingests a cidr array, optional ip and noMatchAllowed.

```
// If no ip is given, the function checks if all cidr in array are valid

acts.checkCIDR({ cidr: [{ cidr: '192.168.10.200/32' }] })
// return true, if all are valid 
// throws an error if one cidr is invalid
```

```
// If  ip is given, the function checks if the ip is in range of cidr

acts.checkCIDR({ 
  cidr: [{ cidr: '192.168.10.0/29' }], 
  ip: 192.168.10.1 
})
// return true, if ip is in range of cidr
// throws an error if ip is not in range

acts.checkCIDR({ 
  cidr: [{ cidr: '192.168.10.0/29' }], 
  ip: 192.168.10.1, 
  noMatchAllowed: true 
})
// return true, if ip is in range of cidr
// returns null, if ip is not in range
```

*Breaking changes:* 
+ checkCIDR returns true instead of undefined if CIDRs are valid

### ipsToPrivacy
Ingests a list of IPs an return them anonymized (see anonymizeIP) and GDPR ready. Invalid IPs are ignores and not returned.

```
const privacyIP = acts.ipsToPrivacy('1.2.3', '8.8.8.8', '2001:db8:85a3:7942:1a2f:3e4c:7890:5def'])
// -> ['8.8.x.x', ''2001:db8:85a3:7942:x:x:x:x'']
```
Breaking changes: This function worked with IPv4 only in version < 4.

### anonymizeIP
Anonymize single IP addresses (IPv4 or IPv6 addresses). If you send an invalid IP address the function returns undefined.

```
const anonymizedIP = acts.anonymizeIP('1.2.3.4') -> 1.2.x.x
const anonymizedIP = acts.anonymizeIP('2001:4860:4860::8888') -> 2001:4860:4860:x:x

// optional replacement
const anonymizedIP = acts.anonymizeIP('1.2.3.4', { replacement: 0 }) -> 1.2.0.0
```

### isPrivateIP
Checks is a function is a private IP. Please checkout isSpecialIP function - it is more generic.

```
const isPrivate = acts.isPrivate('1.2.3.4')
// -> false

const isPrivate = acts.isPrivate('127.0.0.1')
// -> true
```

*Breaking change:* Function is now isPrivateIP insteand of isPrivate.

### isSpecialIP
Check if given IP is a special IP (e.g. private, loopback, link-local, etc)

```
const isSpecial = acts.isSpecial('127.0.0.1') // true
const isSpecial = acts.isSpecial('8.8.8.8') // false
```

# Deprecated functions
Function *ipInIPList* no longer exists. Use checkCIDR instead.

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


# Nginx
If you have a node application behind an NGINX proxy (which is recommended) and this NGINX proxy behind another proxy (e.g. AWS load balancer) use a config like this:
```
set_real_ip_from 172.0.0.0/16; // range from AWS Load balancer 
real_ip_header X-Forwarded-For;
real_ip_recursive on;

server {
	listen 80 default_server;
	listen [::]:80 default_server;

  location / {
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto 'https'; #$scheme;
		proxy_pass http://127.0.0.1:8080;
		proxy_set_header Host $http_host;
		proxy_read_timeout 300;
	}
}
```



## Links
- [Website](https://www.admiralcloud.com/)

## License
[MIT License](https://opensource.org/licenses/MIT) Copyright © 2009-present, AdmiralCloud AG, Mark Poepping