const _ = require('lodash')
const { Address4, Address6 } = require('ip-address')
const { ACError } = require('ac-custom-error')


const acip = function () {

  const prepIP = ({ ip }) => {
    const AddressClass = ip.includes(':') ? Address6 : Address4
    try {
      const address = new AddressClass(_.trim(ip))
      return address
    }
    catch (e) {
      throw new ACError(e?.message)
    }
  }

  /**
   * Send an express-like request object into the function, the IP address of the request is returned.
   *
   * If you send req.debugMode = true, you can manually overwrite the IP with a payload parameter "ip"
   *
   * @param req object Express-like request object
   */
  const determineIP = (req) => {
    let ip = _.get(req, 'headers.x-forwarded-for') || _.get(req, 'ip')
    // allow "overwriting" IP for local testing, but not in production, send X-AdmiralCloud-Header "true"
    if (_.has(req, 'query.ip') && _.indexOf(['development', 'test'], _.get(process, 'env.NODE_ENV', 'development')) > -1) {
      ip = _.get(req, 'query.ip')
    }

    // LEGACY - REMOVE 2019-06-30
    if (req?.debugMode && _.has(req, 'query.ip')) ip = _.get(req, 'query.ip')

    if (!ip) throw new ACError('acip_determineIP_noIPDetected', 9000)
    // x forwarded for can be a comma or space separated list - z.b. 192.168.24.73, 198.135.124.15
    // X-Forwarded-For: client1, proxy1, proxy2 -> but client1 can be a private IP address
    // AWS (ALB) adds the real client ip to the right of forwarded-for list, therefore take the first non-private IP from the right 
    if (ip.indexOf(',') > -1) {
      // check until we've found a non-private IP address
      let finalIP
      const ipList = _.get(process, 'env.X-Forwarded-For') === 'reverse' ? _.reverse(ip.split(',')) : ip.split(',')
      _.some(ipList, (ipToCheck) => {
        const validIP = prepIP({ ip: ipToCheck })
        if (validIP.isCorrect() && !isSpecialIP(ipToCheck)) {
          finalIP = validIP.address
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
  function ipsFromCIDR({ cidr, maxPrefix = { v4: 18, v6: 112 } }) {
    let address = prepIP({ ip: cidr })
    let maxAddresses

    const prefix = parseInt(cidr.split('/')[1], 10)
    if (address.v4 === true) {
      if (prefix < maxPrefix.v4) {
        console.warn(`ac-ip | ipsFromCIDR | IPv4 CIDR ${cidr} too big. Limited to /${maxPrefix.v4}`)
        address = new Address4(`${address.addressMinusSuffix}/${maxPrefix.v4}`)
      }
      maxAddresses = Math.pow(2, Math.min(32 - prefix, 32 - maxPrefix.v4))
    }
    else if (address.v4 === false) {
      if (prefix < maxPrefix.v6) {
        console.warn(`ac-ip | ipsFromCIDR | IPv6 CIDR ${cidr} too big. Limited to /${maxPrefix.v6}`)
        address = new Address6(`${address.addressMinusSuffix}/${maxPrefix.v6}`)
      }
      maxAddresses = Math.pow(2, Math.min(128 - prefix, 128 - maxPrefix.v6))
    }

    const startAddress = address.startAddress()
    const endAddress = address.endAddress()

    const ipArray = []
    let currentIPBigInt = BigInt(startAddress.bigInteger())

    const endIPBigInt = BigInt(endAddress.bigInteger())
    const maxIPsToGenerate = 1000000n // Begrenzung auf 1 Million IPs

    for (let i = 0n; i < maxAddresses && i < maxIPsToGenerate && currentIPBigInt <= endIPBigInt; i++) {
      const currentIP = address.v4 === false ? Address6.fromBigInteger(currentIPBigInt) : Address4.fromBigInteger(currentIPBigInt)
      ipArray.push(currentIP.address)
      currentIPBigInt++
    }
    return ipArray
  }

  /**
   * Checks an array (list) of CIDR for validity
   * @param params.cidr array of objects containing keys "cidr" and optional "type". If no type => ipv4
   * @param params.ip string ip address to check against the given cidrs -> return true if matching
   * @param params.noMatchAllowed BOOL Only in combination with param.ip - if true, no error if returned if there is no match for the IP in given CIDR
   *
   *
   * [{
    "cidr": "2001:280::/32",
    "type" "ipv6"
   },...]
   *
   */
  const checkCIDR = ({ cidr, ip, noMatchAllowed = false }) => {
    // Check cidr array structure
    if (!Array.isArray(cidr) || cidr.length === 0 ) {
      throw new ACError('acip_checkCIDR_listIsEmpty', 9001)
    }
    // check that every cidr in array is a cidr (address/prefix)
    const check = _.every(cidr, item => {
      if (!item?.cidr) return false
      const [ address, prefix ] = _.split(item.cidr, '/')
      if (!address || !prefix) return false
      return true
    })
    if (!check) {
      throw new ACError('acip_checkCIDR_atLeastOneCIDR_invalid', 9008)    
    }

    // If no ip, check all cidr
    if (!ip) {
      const check = _.every(cidr, item => {
        try {
          const ipToCheck = prepIP({ ip: item.cidr })
          return ipToCheck.isCorrect()
        }
        catch {
          return false
        }
      })
      if (check) return true
      throw new ACError('acip_checkCIDR_invalid', 9006)
    }

    // If IP is given, check if we have a match
    try {
      const ipAddress = ip.includes(':') ? new Address6(ip) : new Address4(ip)
    
      const match = _.some(cidr, item => {
        const cidrAddress = item.cidr.includes(':') ? new Address6(item.cidr) : new Address4(item.cidr);
        if ((ipAddress instanceof Address4 && cidrAddress instanceof Address4) ||
            (ipAddress instanceof Address6 && cidrAddress instanceof Address6)) {
          const isInSubnet = ipAddress.isInSubnet(cidrAddress);
          return isInSubnet;
        } 
        else {
          return false;
        }
      })
  

      if (match) return match
      if (noMatchAllowed) return null
      throw new ACError('acip_checkCIDR_ipNotInCIDRrange', 9002, { ip })
    }
    catch (e) {
      if (e instanceof ACError) throw e
      throw new ACError('acip_checkCIDR_invalidIP', 9007)
    }
  }


  /**
   * Ingests a list of IP addresses and returns them anonymized
   */
  const ipsToPrivacy = (ips, { replacement } = {}) => {
    const privateIps = _.map(_.uniq(ips), ip => {
      return anonymizeIP(ip, { replacement })
    })
    return _.compact(privateIps)
  }

  /**
   * Anonymize IP address 
   */
  const anonymizeIP = (ip, { replacement = 'x' } = {}) => {
    let anonymizedIP

    try {
      const ipToAnonymize = prepIP({ ip })
      const separator = ipToAnonymize.v4 ? '.' : ':'
      const partsToKeep = ipToAnonymize.v4 ? 2 : 4
      const totalParts = ipToAnonymize.v4 ? 4 : 8
      const parts = ipToAnonymize.parsedAddress
      const maskedParts = [
        ...parts.slice(0, partsToKeep),
        ...Array(totalParts - partsToKeep).fill(replacement)
      ]
      anonymizedIP = maskedParts.join(separator)
    }
    catch (e) {
      // just ignore
      console.error('ac-ip | anonymizeIP | ip %s | %s', ip, e?.message)
    }
    return anonymizedIP
  }


  const isPrivateIP = (ip) => {
    const ipToCheck = prepIP({ ip })
    if (ipToCheck.v4 === true) {
      return (
        ipToCheck.isInSubnet(new Address4('10.0.0.0/8')) ||
        ipToCheck.isInSubnet(new Address4('172.16.0.0/12')) ||
        ipToCheck.isInSubnet(new Address4('192.168.0.0/16')) ||
        ipToCheck.isInSubnet(new Address4('127.0.0.0/8'))
      )
    }
    else if (ipToCheck.v4 === false && ipToCheck.isInSubnet(new Address6('fc00::/7'))) {
      return true
    }
    else {
      return false
    }
  }

  const isPrivate = (ip) => {
    console.warn('ac-ip | isPrivate | DEPRECATED: Please use isPrivateIP instead.')
    return isPrivateIP(ip)
  }

  /**
   * Checks private, loopback, link-local and other reserved or special IP addresses
   */
  const isSpecialIP = (ip) => {
    const ipToCheck = prepIP({ ip })
  
    if (ipToCheck.v4 === true) {
      return (
        // Private IPv4
        ipToCheck.isInSubnet(new Address4('10.0.0.0/8')) ||
        ipToCheck.isInSubnet(new Address4('172.16.0.0/12')) ||
        ipToCheck.isInSubnet(new Address4('192.168.0.0/16')) ||
        // Loopback IPv4
        ipToCheck.isInSubnet(new Address4('127.0.0.0/8')) ||
        // Link-local IPv4
        ipToCheck.isInSubnet(new Address4('169.254.0.0/16')) ||
        // Other special IPv4 ranges
        ipToCheck.isInSubnet(new Address4('0.0.0.0/8')) ||
        ipToCheck.isInSubnet(new Address4('224.0.0.0/4')) ||
        ipToCheck.isInSubnet(new Address4('240.0.0.0/4'))
      )
    } 
    else if (ipToCheck.v4 === false) {
      return (
        // Unique Local Address (private) IPv6
        ipToCheck.isInSubnet(new Address6('fc00::/7')) ||
        // Loopback IPv6
        ipToCheck.isInSubnet(new Address6('::1/128')) ||
        // Link-local IPv6
        ipToCheck.isInSubnet(new Address6('fe80::/10')) ||
        // Other special IPv6 ranges
        ipToCheck.isInSubnet(new Address6('::/128')) ||
        ipToCheck.isInSubnet(new Address6('::ffff:0:0/96')) || // IPv4-mapped
        ipToCheck.isInSubnet(new Address6('100::/64')) ||
        ipToCheck.isInSubnet(new Address6('2001::/32')) || // Teredo
        ipToCheck.isInSubnet(new Address6('2001:20::/28')) || // ORCHIDv2
        ipToCheck.isInSubnet(new Address6('2001:db8::/32')) || // Documentation
        ipToCheck.isInSubnet(new Address6('ff00::/8')) // Multicast
      )
    }
  }

  return {
    determineIP,
    checkCIDR,
    ipsFromCIDR,
    ipsToPrivacy,
    anonymizeIP,
    isPrivateIP,
    isSpecialIP,
    // deprecated
    isPrivate
  }
}

module.exports = acip()