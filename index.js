const _ = require('lodash')
const ipPackage = require('ip')

const acip = () => {
  /**
   * Send an express-like request object into the function, the IP address of the request is returned.
   *
   * If you send req.debugMode = true, you can manually overwrite the IP with a payload parameter "ip"
   *
   * @param req object Express-like request object
   */
  const determineIP = (req) => {
    let ip =  _.get(req, 'headers.x-forwarded-for') || _.get(req, 'ip')
    // allow "overwriting" IP for local testing, but not in production, send X-AdmiralCloud-Header "true"
    if (_.has(req, 'query.ip') && _.indexOf(['development', 'test'], _.get(process, 'env.NODE_ENV', 'development')) > -1) {
      ip = _.get(req, 'query.ip')
    }

    // LEGACY - REMOVE 2019-06-30
    if (req.debugMode && _.has(req, 'query.ip')) ip = _.get(req, 'query.ip')

    if (!ip) return { code: 9000, message: 'acip_determineIP_noIPDetected' }
    // x forwarded for can be a comma or space separated list - z.b. 192.168.24.73, 198.135.124.15
    // X-Forwarded-For: client1, proxy1, proxy2 -> but client1 can be a private IP address
    // AWS (ALB) adds the real client ip to the right of forwarded-for list, therefore take the first non-private IP from the right 
    if (ip.indexOf(',') > -1) {
      // check until we've found a non-private IP address
      let finalIP
      let ipList = _.get(process, 'env.X-Forwarded-For') === 'reverse' ? _.reverse(ip.split(',')) : ip.split(',')
      _.some(ipList, (ipToCheck) => {
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
   * @param params.cidr STRING -> valid cidr block - e.g. 192.168.1.134/26
   * ipsFromCIDR({ cidr: '8.8.8.8/31' })
   * Returns ['8.8.8.8', '8.8.8.9']
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
   * @param params.cb OPT (err, match) -> match is the matching CIDR if ip is given
   *
   * [{
    "cidr": "2001:280::/32",
    "type" "ipv6"
   },...]
   *
   */

  const checkCIDR = (params, cb) => {
    // 1 check if array
    const cidr = _.isArray(params.cidr) && params.cidr.length > 0 && params.cidr
    if (!cidr) {
      if (cb) return cb({ code: 9001, message: 'acip_checkCIDR_listIsEmpty' })
      return { code: 9001, message: 'acip_checkCIDR_listIsEmpty' }
    }

    if (params.ip) {
      let error = { code: 9002, message: 'acip_checkCIDR_ipNotInCIDRrange', statusCode: 420 }
      if (params.noMatchAllowed) error = null

      // check if IP is a match for any of the given CIDR
      let match
      _.some(cidr, (c) => {
        if (ipPackage.cidrSubnet(c.cidr).contains(params.ip)) {
          error = null
          match = c.cidr 
          return true
        }
      })
      if (cb) return cb(error, match)
      return error
    }
    else {
      // check if all cidrs are valid
      let error
      _.some(cidr, c => {
        if (!_.isString(c.cidr)) error = { code: 9003, message: 'acip_checkCIDR_cidrIsNotValid' }
        else if (c.cidr.indexOf('/') < 0) error = { code: 9004, message: 'acip_checkCIDR_thisIsNoCIDR' }
        else if (!c.type || c.type === 'ipv4') {
          // check mask (max is 32)
          let mask = _.last(_.split(_.get(c, 'cidr', ''), '/'))
          if (mask > 32) {
            error = { code: 9005, message: 'acip_checkCIDR_maskInvalid' }
          }
          else if (!ipPackage.isV4Format(ipPackage.cidr(c.cidr))) {
            error = { code: 9006, message: 'acip_checkCIDR_invalid' }
          }
        }
        else if (c.type === 'ipv6') {
          // check mask (max is 128)
          let mask = _.last(_.split(_.get(c, 'cidr', ''), '/'))
          if (mask > 128) {
            error = { code: 9007, message: 'acip_checkCIDR_maskInvalid' }
          }
          else if (!ipPackage.isV6Format(ipPackage.cidr(c.cidr))) {
            error = { code: 9006, message: 'acip_checkCIDR_invalid' }
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

  /**
   * Ingests a list of IPv4 addresses and returns them with the last 2 octets removed/replaced with xxx
   * @param {*} params.ips
   */
  const ipsToPrivacy = (ips) => {
    const regex = /(\d{1,3}\.\d{1,3}\.)(\d{1,3}\.\d{1,3})/
    ips = _.map(_.compact(_.uniq(ips)), ip => {
      return ip.replace(regex, (match, p1) => {
        return p1 + 'x.x'
      })
    })
    return _.uniq(ips)
  }

  const anonymizeIP = (ip, { replacement = 'x' } = {}) => {
    let anonymizedIP
    let splitChar 
    if (ipPackage.isV4Format(ip)) {
      splitChar = '.'
    } 
    else if (ipPackage.isV6Format(ip)) {
      splitChar = ':'
    } 
    else {
      return anonymizedIP
    }

    let ipSegments = ip.split(splitChar)
    ipSegments[ipSegments.length - 2] = replacement
    ipSegments[ipSegments.length - 1] = replacement
    anonymizedIP = ipSegments.join(splitChar)

    return anonymizedIP
  }

  /**
   * Checks is an IP is in an IP list
   * @param params.ip STRING ip IP address to check
   * @param params.ips ARRAY list of ips
   */
  const ipInIPList = (params) => {
    const ip = _.get(params, 'ip')
    const ips = _.uniq(_.get(params, 'ips'))
    return _.indexOf(ips, ip) >= 0
  }

  const isPrivate = (ip) => {
    return ipPackage.isPrivate(_.trim(ip))
  }

  return {
    determineIP,
    checkCIDR,
    ipsFromCIDR,
    ipsToPrivacy,
    ipInIPList,
    isPrivate,
    anonymizeIP
  }
}

module.exports = acip()