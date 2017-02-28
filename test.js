var Properties = require('./');
var must = require('must');
var user;
var o;

describe('property-seek', function() {

    beforeEach(function() {

        o = null;

        user = {
            name: {
                first: 'Joe',
                last: 'M',
                'dot.name': 'Joe.M',
            },
            'dot.value': '...',
            meta: {
                status: {
                    banned: true
                }
            }
        };
    });

    it('should return get the correct value', function() {

        must(Properties.get(user, 'name')).be.an.object();
        must(Properties.get(user, 'name.first')).equal('Joe');
        must(Properties.get(user, 'name.last')).equal('M');
        must(Properties.get(user, 'meta.status.banned')).equal(true);
        must(Properties.get(user, 'meta[status][banned]')).equal(true);
        must(Properties.get(user, '\'dot.value\'')).equal('...');
        must(Properties.get(user, 'name[\'dot.name\']')).equal('Joe.M');
        must(Properties.get(user, 'nam')).be.undefined();
    });

    it('should not mistreat zeros', function() {

        must(Properties.get({
            the: {
                zero: {
                    value: 0
                }
            }
        }, 'the.zero.value')).be(0);

        must(Properties.get({
            the: {
                zero: {
                    value: '0'
                }
            }
        }, 'the.zero.value')).be('0');

    });

    it('should set single values', function() {

        must(Properties.set({}, 'name', 'sana')).eql({
            name: 'sana'
        });

    });

    it('should set nested (1) values', function() {

        o = Properties.set(user, 'name.first', 'Bob');

        must(o).eql({
            name: {
                first: 'Bob',
                last: 'M',
                'dot.name': 'Joe.M',
            },
            'dot.value': '...',
            meta: {
                status: {
                    banned: true
                }
            }
        });

    });

    it('should set nested (2) values', function() {

        o = Properties.set(user, 'meta.status.banned', false);
        must(o).eql({
            name: {
                first: 'Joe',
                last: 'M',
                'dot.name': 'Joe.M',
            },
            'dot.value': '...',
            meta: {
                status: {
                    banned: false
                }
            }
        });

    });

    it('should set new nested values', function() {

        o = Properties.set(user, 'points', 0);

        must(o).eql({
            name: {
                first: 'Joe',
                last: 'M',
                'dot.name': 'Joe.M',
            },
            'dot.value': '...',
            meta: {
                status: {
                    banned: true
                }
            },
            points: 0
        });

    });


});
