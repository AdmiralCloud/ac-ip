const acip = require('../index')
const _ = require('lodash')

const expect = require('chai').expect 


describe('Determine IP from request object', () => {
  it('Test IP', () => {
    const req = { 
      ip: '8.8.8.8'
    }
    const test = acip.determineIP(req)
    expect(test).equal('8.8.8.8')
  })

  it('Test IP in debugMode', () => {
    const req = { 
      debugMode: true,
      query: {
        ip: '8.8.8.8'
      }
    }
    const test = acip.determineIP(req)
    expect(test).equal('8.8.8.8')
  })

  it('Test IP - with no IP', () => {
    const req = {}
    expect(() => acip.determineIP(req))
    .to.throw(Error, 'acip_determineIP_noIPDetected')
    .with.property('code', 9000)
  })

  it('Test Proxy IP - with x-real-ip - should fail', () => {
    const req = { 
      ip: '8.8.8.8',
      headers: {
        'x-real-ip': '4.4.4.4'
      }
    }
    const test = acip.determineIP(req)
    expect(test).equal('8.8.8.8')
  })

  it('Test Proxy IP - with x-forwarded-for', () =>  {
    const req = { 
      ip: '8.8.8.8',
      headers: {
        'x-forwarded-for': '1.1.1.1'
      }
    }
    const test = acip.determineIP(req)
    expect(test).equal('1.1.1.1')
  })

  it('Test Proxy IP - with both headers - ignore x-real-ip', () =>  {
    const req = { 
      ip: '8.8.8.8',
      headers: {
        'x-real-ip': '4.4.4.4',
        'x-forwarded-for': '1.1.1.1'
      }
    }
    const test = acip.determineIP(req)
    expect(test).equal('1.1.1.1')
  })

  it('Test multiple Proxy IP - with x-forwarded-for', () =>  {
    const req = { 
      ip: '8.8.8.8',
      headers: {
        'x-forwarded-for': '1.1.1.1, 4.4.4.4, 1.2.3.4'
      }
    }
    const test = acip.determineIP(req)
    expect(test).equal('1.1.1.1')
  })

  it('Test set ip in test mode', () =>  {
    const req = { 
      query: {
        ip: '5.4.1.2'
      },
      ip: '8.8.8.8',
      headers: {
        'x-real-ip': '4.4.4.4',
        'x-forwarded-for': '1.1.1.1'
      }
    }
    const test = acip.determineIP(req)
    expect(test).equal('5.4.1.2')
  })

})

describe('Testing CIDR', function () {
  const validCIDRs = [{ cidr: '8.8.0.0/16' }]
  const invalidCIDRs = [{ cidr: '8.8.0.0' }]
  const validv6CIDRs = [{ cidr: '2001:4d20::/32', type: 'ipv6' }]

  const test1 = '85.182.224.128'
  const test2 = [{ 'cidr': '85.182.224.128/26' }, { 'cidr': '62.96.36.146/32' }, { 'cidr': '62.84.220.138/32' }]

  it('Check if CIDR is valid - wrong entry style', function() {
    expect(() => acip.checkCIDR({ cidr: [{ contact: true }] }))
      .to.throw(Error, 'acip_checkCIDR_atLeastOneCIDR_invalid')
      .with.property('code', 9008)
  })

  it('Check if CIDR is valid', function() {
    const test = acip.checkCIDR({ cidr: validCIDRs })
    expect(test).to.be.true
  })

  it('Check if CIDR IPv6 is valid', function() {
    const test = acip.checkCIDR({ cidr: validv6CIDRs })
    expect(test).to.be.true
  })

  it('Check if CIDR is invalid', () => {
    expect(() => acip.checkCIDR({ cidr: invalidCIDRs }))
      .to.throw(Error, 'acip_checkCIDR_atLeastOneCIDR_invalid')
      .with.property('code', 9008)
  })


  it('Check if IP is in CIDR', () => {
    const test = acip.checkCIDR({ ip: test1, cidr: test2 })
    expect(test).to.be.true
  })

  it('Check if IP is in CIDR - if not match do not throw an error', () => {
    const match = acip.checkCIDR({ cidr: [{ cidr: '192.168.10.200/32' }], ip: '8.8.8.8', noMatchAllowed: true  })
    expect(match).to.be.null
  })

  it('Check if IP is in CIDR - no match - throw error', () => {
    expect(() => acip.checkCIDR({ cidr: [{ cidr: '192.168.10.200/32' }], ip: '8.8.8.8' }))
      .to.throw(Error, 'acip_checkCIDR_ipNotInCIDRrange')
      .with.property('code', 9002)
  })

  it('Check if IP is in CIDR - invalid IP', () => {
    expect(() => acip.checkCIDR({ ip: '760.0.0.0', cidr: test2 }))
      .to.throw(Error, 'acip_checkCIDR_invalidIP')
      .with.property('code', 9007)
  })

  it('Check if IPv6 is in CIDRv6', () => {
    const test = acip.checkCIDR({ ip: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', cidr: [{ cidr: '2001:0db8:85a3::/64' }] })
    expect(test).to.be.true
  })

  it('Check if IPv4 is in CIDRv6 - should fail', () => {
     expect(() => acip.checkCIDR({ ip: '1.2.3.4', cidr: [{ cidr: '2001:0db8:85a3::/64' }] }))
    .to.throw(Error, 'acip_checkCIDR_ipNotInCIDRrange')
    .with.property('code', 9002)
  })
  
  it('Check CIDR without parameter CIDR - fail', () => {
    expect(() => acip.checkCIDR({ ip: test1 }))
      .to.throw(Error, 'acip_checkCIDR_listIsEmpty')
      .with.property('code', 9001)
  })

  it('Check CIDR without invalid mask - fail', () => {
    expect(() => acip.checkCIDR({ cidr: [{ cidr: '85.182.224.128/333' }] }))
      .to.throw(Error, 'acip_checkCIDR_invalid')
      .with.property('code', 9006)
  })

  it('Check CIDR without invalid mask ipv6 - fail', () => {
    expect(() => acip.checkCIDR({ cidr: [{ cidr: '2001:4d20::/323', type: 'ipv6' }] }))
      .to.throw(Error, 'acip_checkCIDR_invalid')
      .with.property('code', 9006)
  })

  it('Check CIDR with invalid cidr - fail', () => {
    expect(() => acip.checkCIDR({ cidr: [{ cidr: '85.182.224.128333/8' }] }))
      .to.throw(Error, 'acip_checkCIDR_invalid')
      .with.property('code', 9006)
  })
  
  it('Return IP block from CIDR', function() {
    const result = acip.ipsFromCIDR({ cidr: '8.8.8.8/31' })
    expect(result).eql(["8.8.8.8", "8.8.8.9"])
  })

  it('Return IPv4 block from CIDR with high prefix', function() {
    const result = acip.ipsFromCIDR({ cidr: '8.8.8.8/16' })
    expect(result).to.have.lengthOf(16384)
  })

  it('Return IPv6 block from CIDR with high prefix', function() {
    const result = acip.ipsFromCIDR({ cidr: '2001:4d20::/64' })
    expect(result).to.have.lengthOf(65536)
  })
})

describe('IPs to privacy', () => {
  const ips = ['8.8.8.8', '4.4.4.4']

  it('Check that IPs are masked properly', () => {
    const test = acip.ipsToPrivacy(ips)
    expect(test).eql(['8.8.x.x', '4.4.x.x'])
  })
})


describe('Is IP private', () => {
  const privateIPv4 = '127.0.0.1'
  const privateIPv6 = 'fd12:3456:789a:1::1'
  const publicIPv4 = '8.8.8.8'
  const publicIPv6 = '2001:4860:4860::8888'

  it('Check private IPv4 address', () =>  {
    const test = acip.isPrivate(privateIPv4)
    expect(test).equal(true)
  })

  it('Check private IPv6 address', () =>  {
    const test = acip.isPrivateIP(privateIPv6)
    expect(test).equal(true)
  })

  it('Check public IPv4 address', () =>  {
    const test = acip.isPrivateIP(publicIPv4)
    expect(test).equal(false)
  })

  it('Check public IPv6 address', () =>  {
    const test = acip.isPrivateIP(publicIPv6)
    expect(test).equal(false)
  })

})

describe('Use reverse approach for X-Forwarded-For', () => {
  it('Set Environemt', () =>  {
    _.set(process, 'env.X-Forwarded-For', 'reverse')
  })

  it('Test IP', () =>  {
    const req = { 
      headers: {
        'x-forwarded-for': '1.1.1.1, 4.4.4.4, 1.2.3.4'
      }
    }
    const test = acip.determineIP(req)
    expect(test).equal('1.2.3.4')
  })

  it('Test IP behind ALB', () =>  {
    const req = { 
      headers: {
        'x-forwarded-for': '1.1.1.1, 4.4.4.4, 1.2.3.4, 172.30.1.104'
      }
    }
    const test = acip.determineIP(req)
    expect(test).equal('1.2.3.4')
  })

  it('Test IP with real-ip set', () =>  {
    const req = { 
      headers: {
        'x-real-ip': '1.1.1.1',
        'x-forwarded-for': '1.1.1.1, 1.2.3.4, 172.30.1.104'
      }
    }
    const test = acip.determineIP(req)
    expect(test).equal('1.2.3.4')
  })
})

describe('Anonymize IP', () => {
  it('Anonymize IPv4', () =>  {
    const test = acip.anonymizeIP('1.2.1.1')
    expect(test).equal('1.2.x.x')
  })

  it('Anonymize IPv4 with 0 as replacment', () =>  {
    const test = acip.anonymizeIP('1.2.1.1', { replacement: 0 })
    expect(test).equal('1.2.0.0')
  })

  it('Anonymize IPv6', () =>  {
    const test = acip.anonymizeIP('2001:4860:4860::8888')
    expect(test).equal('2001:4860:4860:0:x:x:x:x')
  })

  it('Anonymize non-IP', () =>  {
    const test = acip.anonymizeIP('I am no IP')
    expect(test).to.be.undefined
  })
})

describe('Special IP', () => {
  it('Check private IPv4 address', () =>  {
    const test = acip.isSpecialIP('192.168.1.1')
    expect(test).equal(true)
  })

  it('Check IPv4 loopback address', () =>  {
    const test = acip.isSpecialIP('127.0.0.1')
    expect(test).equal(true)
  })

  it('Check IPv4 link-local address', () =>  {
    const test = acip.isSpecialIP('169.254.0.1')
    expect(test).equal(true)
  })

  it('Check public IPv4 address', () =>  {
    const test = acip.isSpecialIP('8.8.8.8')
    expect(test).equal(false)
  })

  it('Check ULA IPv6 address', () =>  {
    const test = acip.isSpecialIP('fc00::1')
    expect(test).equal(true)
  })

  it('Check loopback IPv6 address', () =>  {
    const test = acip.isSpecialIP('::1')
    expect(test).equal(true)
  })

  it('Check link-local IPv6 address', () =>  {
    const test = acip.isSpecialIP('fe80::1')
    expect(test).equal(true)
  })

  it('Check documentation IPv6 address', () =>  {
    const test = acip.isSpecialIP('2001:db8::1')
    expect(test).equal(true)
  })

  it('Check public IPv6 address', () =>  {
    const test = acip.isSpecialIP('001:4860:4860::8888')
    expect(test).equal(false)
  })

  it('Check invalid IP address', () =>  {
    expect(() => acip.isSpecialIP('thisIsNoIpAddress'))
      .to.throw(Error, 'Invalid IPv4 address')
  })
})
