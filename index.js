const _ = require('lodash')
const ipPackage = require('ip')

const acip = function() {
  /**
   * Send an express-like request object into the function, the IP address of the request is returned.
   *
   * If you send req.debugMode = true, you can manually overwrite the IP with a payload parameter "ip"
   *
   * @param req object Express-like request object
   */
  const determineIP = function(req) {
    let params = req.params && req.allParams()
    const proxyIP = _.get(req, 'headers.x-real-ip') || _.get(req, 'headers.x-forwarded-for')
    let ip = proxyIP || _.get(req, 'ip')
    if (req.debugMode && _.has(params, 'ip')) ip = params.ip

    if (!ip) return { message: 'noIPDetected' }
    // x forwarded for can be a comma or space separated list - z.b. 192.168.24.73, 198.135.124.15
    // X-Forwarded-For: client1, proxy1, proxy2 -> but client1 can be a private IP address
    if (ip.indexOf(',') > -1) {
      // check until we've found a non-private IP address
      let finalIP
      _.some(ip.split(','), function(ipToCheck) {
        if (!ipPackage.isPrivate(_.trim(ipToCheck))) {
          finalIP = _.trim(ipToCheck)
          return true
        }
      })
      ip = finalIP
    }
    return ip
  }

  /**
   * Returns the list of IP adresses for a given CIDR block
   * @param params.cidr -> valid cidr block - e.g. 192.168.1.134/26
   *
   * Returns ['127.0.0.0', '127.0.0.1']
   */
  const ipsFromCIDR = function(params) {
    const cidr = params.cidr
    const regex = /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})/
    let match = cidr.match(regex)
    const suffix = _.get(match, '[5]')
    if (!suffix || parseInt(suffix) < 24) return []
    // check that cidr is valid (structural check)
    let range = ipPackage.cidrSubnet(cidr)
    let ips = []
    let start = ipPackage.toLong(_.get(range, 'firstAddress')) // 2130706433
    let end = ipPackage.toLong(_.get(range, 'lastAddress')) // 2130706433
    for (let x = start; x <= end; x += 1) {
      ips.push(ipPackage.fromLong(x))
    }
    return ips
  }

  /**
   * Checks an array (list) of CIDR for validity
   *
   * @param params.cidr array of objects containing keys "cidr" and optional "type". If no type => ipv4
   * @param params.ip string ip address to check against the given cidrs -> return true if matching
   * @param params.noMatchAllowed BOOL Only in combination with param.ip - if true, no error if returned if there is no match for the IP in given CIDR
   *
   * @param params.cb OPT (err, match) -> match is true if ip is given and matches CIDR
   *
   * [{
    "cidr": "2001:280::/32",
    "type"; "ipv6"
   },...]
   *
   */

  const checkCIDR = function(params, cb) {
    // 1 check if array
    const cidr = _.isArray(params.cidr) && params.cidr.length > 0 && params.cidr
    if (!cidr) {
      if (cb) return cb({ message: 'acip_checkCIDR_listIsEmpty' })
      return { message: 'acip_checkCIDR_listIsEmpty' }
    }

    if (params.ip) {
      let error = { message: 'acip_checkCIDR_ipNotInCIDRrange' }
      if (params.noMatchAllowed) error = null

      // check if IP is a match for any of the given CIDR
      let match = _.some(cidr, (c) => {
        if (ipPackage.cidrSubnet(c.cidr).contains(params.ip)) {
          error = null
          return true
        }
      })
      if (cb) return cb(error, match)
      return error
    }
    else {
      // check if all cidrs are valid
      let error
      _.some(cidr, function(c) {
        if (!_.isString(c.cidr)) error = { message: 'acip_checkCIDR_cidrIsNotValid' }
        else if (c.cidr.indexOf('/') < 0) error = { message: 'acip_checkCIDR_thisIsNoCIDR' }
        else if (!c.type || c.type === 'ipv4') {
          // check mask (max is 32)
          let mask = _.last(_.split(_.get(c, 'cidr', ''), '/'))
          if (mask > 32) {
            error = { message: 'acip_checkCIDR_maskInvalid' }
          }
          else if (!ipPackage.isV4Format(ipPackage.cidr(c.cidr))) {
            error = { message: 'acip_checkCIDR_invalid' }
          }
        }
        else if (c.type === 'ipv6') {
          // check mask (max is 128)
          let mask = _.last(_.split(_.get(c, 'cidr', ''), '/'))
          if (mask > 128) {
            error = { message: 'acip_checkCIDR_maskInvalid' }
          }
          else if (!ipPackage.isV6Format(ipPackage.cidr(c.cidr))) {
            error = { message: 'acip_checkCIDR_invalid' }
          }
        }

        if (error) {
          _.merge(error, { additionalInfo: { cidr: c.cidr, type: _.get(c, 'type', 'ipv4') } })
        }
        return error
      })
      if (cb) return cb(error)
      return error
    }
  }

  return {
    determineIP,
    checkCIDR,
    ipsFromCIDR
  }
}

module.exports = acip()
