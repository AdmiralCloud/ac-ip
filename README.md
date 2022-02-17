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
Use X-AdmiralCloud-Test "true" to overwrite the IP with params.ip from request object.

Otherwise IP is determined from X-Forwarded-For (if present) or req.ip.

#### AWS Environment
If you are in an AWS environment, the client ip is added to the right of list by ALB. In this you might want to set environment variable X-Forwarded-For to "reverse".


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
- [Twitter (@admiralcloud)](https://twitter.com/admiralcloud)
- [Facebook](https://www.facebook.com/MediaAssetManagement/)

## License
[MIT License](https://opensource.org/licenses/MIT) Copyright © 2009-present, AdmiralCloud, Mark Poepping