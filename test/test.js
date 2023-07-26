const acip = require('../index')
const _ = require('lodash')

const expect = require('chai').expect 


describe('Determine IP from request object', () => {
  it('Test IP', done => {
    let req = { 
      ip: '8.8.8.8'
    }
    let test = acip.determineIP(req)
    expect(test).equal('8.8.8.8')
    return done()  
  })

  it('Test Proxy IP - with x-real-ip - should fail', done => {
    let req = { 
      ip: '8.8.8.8',
      headers: {
        'x-real-ip': '4.4.4.4'
      }
    }
    let test = acip.determineIP(req)
    expect(test).equal('8.8.8.8')
    return done()  
  })

  it('Test Proxy IP - with x-forwarded-for', done => {
    let req = { 
      ip: '8.8.8.8',
      headers: {
        'x-forwarded-for': '1.1.1.1'
      }
    }
    let test = acip.determineIP(req)
    expect(test).equal('1.1.1.1')
    return done()  
  })

  it('Test Proxy IP - with both headers - ignore x-real-ip', done => {
    let req = { 
      ip: '8.8.8.8',
      headers: {
        'x-real-ip': '4.4.4.4',
        'x-forwarded-for': '1.1.1.1'
      }
    }
    let test = acip.determineIP(req)
    expect(test).equal('1.1.1.1')
    return done()  
  })

  it('Test multiple Proxy IP - with x-forwarded-for', done => {
    let req = { 
      ip: '8.8.8.8',
      headers: {
        'x-forwarded-for': '1.1.1.1, 4.4.4.4, 1.2.3.4'
      }
    }
    let test = acip.determineIP(req)
    expect(test).equal('1.1.1.1')
    return done()  
  })

  it('Test set ip in test mode', done => {
    let req = { 
      query: {
        ip: '5.4.1.2'
      },
      ip: '8.8.8.8',
      headers: {
        'x-real-ip': '4.4.4.4',
        'x-forwarded-for': '1.1.1.1'
      }
    }
    let test = acip.determineIP(req)
    expect(test).equal('5.4.1.2')
    return done()  
  })

})

describe('Testing CIDR', function () {
  const validCIDRs = [{ cidr: '8.8.0.0/16' }]
  const invalidCIDRs = [{ cidr: '8.8.0.0' }]
  const validv6CIDRs = [{ cidr: '2001:4d20::/32', type: 'ipv6' }]

  let test1 = '85.182.224.128'
  let test2 = [{ 'cidr': '85.182.224.128/26' }, { 'cidr': '62.96.36.146/32' }, { 'cidr': '62.84.220.138/32' }]

  it('Check if CIDR is valid', function(done) {
    let test = acip.checkCIDR({ cidr: validCIDRs })
    expect(test).to.be.undefined
    return done()
  })

  it('Check if CIDR IPv6 is valid', function(done) {
    let test = acip.checkCIDR({ cidr: validv6CIDRs })
    expect(test).to.be.undefined
    return done()
  })

  it('Check if CIDR is invalid', function(done) {
    let test = acip.checkCIDR({ cidr: invalidCIDRs })
    expect(test).eql({ 'additionalInfo': { 'cidr': '8.8.0.0', 'type': 'ipv4' }, code: 9004, 'message': 'acip_checkCIDR_thisIsNoCIDR' })
    return done()
  })

  it('Check if IP is in CIDR ', function(done) {
    let test = acip.checkCIDR({ ip: test1, cidr: test2 })
    expect(test).to.be.null
    return done()
  })

  it('Check if IP is in CIDR using callback ', function(done) {
    acip.checkCIDR({ ip: test1, cidr: test2 }, (err, result) => {
      if (err) return done(err)
      expect(result).equal(_.get(_.first(test2), 'cidr'))
      return done()
    })
  })

  it('Check CIDR without parameter CIDR - fail', function(done) {
    let test = acip.checkCIDR({ ip: test1 })
    expect(test.code).equal(9001)
    expect(test.message).equal("acip_checkCIDR_listIsEmpty")
    return done()
  })

  it('Check CIDR without invalid mask - fail', function(done) {
    let test = acip.checkCIDR({ cidr: [{ cidr: '85.182.224.128/333' }] })
    expect(test.code).equal(9005)
    expect(test.message).equal("acip_checkCIDR_maskInvalid")
    return done()
  })

  it('Check CIDR without invalid mask ipv6 - fail', function(done) {
    let test = acip.checkCIDR({ cidr: [{ cidr: '2001:4d20::/323', type: 'ipv6' }] })
    expect(test.code).equal(9007)
    expect(test.message).equal("acip_checkCIDR_maskInvalid")
    return done()
  })

  it('Check CIDR with invalid cidr - fail', function(done) {
    let test = acip.checkCIDR({ cidr: [{ cidr: '85.182.224.128333/8' }] })
    expect(test.code).equal(9006)
    expect(test.message).equal("acip_checkCIDR_invalid")
    return done()
  })

  /* IP package has possible bug: https://github.com/indutny/node-ip/issues/59
  it('Check CIDR with invalid cidr ipv6 - fail', function(done) {
    let test = acip.checkCIDR({ cidr: [{ cidr: 'a356/64', type: 'ipv6' }] })
    expect(test.code).equal(9006)
    expect(test.message).equal("acip_checkCIDR_invalid")
    return done()
  })
  */

  it('Return IP block from CIDR', function(done) {
    let result = acip.ipsFromCIDR({ cidr: '8.8.8.8/31' })
    expect(result).eql(["8.8.8.8", "8.8.8.9"])
    return done()
  })
})

describe('IPs to privacy', () => {
  const ips = ['8.8.8.8', '4.4.4.4']

  it('Check that IPs are masked properly', (done) => {
    let test = acip.ipsToPrivacy(ips)
    expect(test).eql(['8.8.x.x', '4.4.x.x'])
    return done()
  })
})

describe('IP in IP list', () => {
  const ip = '4.4.x.x'
  const ipFail = '1.1.x.x'
  const ips = ['8.8.x.x', '4.4.x.x']

  it('Check that IP is in list', (done) => {
    let test = acip.ipInIPList({ ips, ip })
    expect(test).equal(true)
    return done()
  })

  it('Check that IP is not in list', (done) => {
    let test = acip.ipInIPList({ ips, ipFail })
    expect(test).equal(false)
    return done()
  })
})

describe('Is IP private', () => {
  const privateIPv4 = '127.0.0.1'
  const privateIPv6 = '::ffff:172.31.7.78'
  const publicIPv4 = '8.8.8.8'
  const publicIPv6 = '2001:4860:4860::8888'

  it('Check private IPv4 address', done => {
    let test = acip.isPrivate(privateIPv4)
    expect(test).equal(true)
    return done()
  })

  it('Check private IPv6 address', done => {
    let test = acip.isPrivate(privateIPv6)
    expect(test).equal(true)
    return done()
  })

  it('Check public IPv4 address', done => {
    let test = acip.isPrivate(publicIPv4)
    expect(test).equal(false)
    return done()
  })

  it('Check public IPv6 address', done => {
    let test = acip.isPrivate(publicIPv6)
    expect(test).equal(false)
    return done()
  })

})

describe('Use reverse approach for X-Forwarded-For', () => {
  it('Set Environemt', done => {
    _.set(process, 'env.X-Forwarded-For', 'reverse')
    return done()
  })

  it('Test IP', done => {
    let req = { 
      headers: {
        'x-forwarded-for': '1.1.1.1, 4.4.4.4, 1.2.3.4'
      }
    }
    let test = acip.determineIP(req)
    expect(test).equal('1.2.3.4')
    return done()  
  })

  it('Test IP behind ALB', done => {
    let req = { 
      headers: {
        'x-forwarded-for': '1.1.1.1, 4.4.4.4, 1.2.3.4, 172.30.1.104'
      }
    }
    let test = acip.determineIP(req)
    expect(test).equal('1.2.3.4')
    return done()  
  })

  it('Test IP with real-ip set', done => {
    let req = { 
      headers: {
        'x-real-ip': '1.1.1.1',
        'x-forwarded-for': '1.1.1.1, 1.2.3.4, 172.30.1.104'
      }
    }
    let test = acip.determineIP(req)
    expect(test).equal('1.2.3.4')
    return done()  
  })
})

describe('Anonymize IP', () => {
  it('Anonymize IPv4', done => {
    let test = acip.anonymizeIP('1.2.1.1')
    expect(test).equal('1.2.x.x')
    done()
  })

  it('Anonymize IPv4 with 0 as replacment', done => {
    let test = acip.anonymizeIP('1.2.1.1', { replacement: 0 })
    expect(test).equal('1.2.0.0')
    done()
  })

  it('Anonymize IPv6', done => {
    let test = acip.anonymizeIP('2001:4860:4860::8888')
    expect(test).equal('2001:4860:4860:x:x')
    done()
  })

  it('Anonymize non-IP', done => {
    let test = acip.anonymizeIP('I am no IP')
    expect(test).to.be.undefined
    done()
  })
})
