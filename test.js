var property = require('./').default;  
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

    it('should only work with object', function() {

        must(function() {
            property('name', null);
        }).throw(TypeError);

    });

    it('should return get the correct value', function() {

        must(property('name', user)).be.an.object();
        must(property('name.first', user)).equal('Joe');
        must(property('name.last', user)).equal('M');
        must(property('meta.status.banned', user)).equal(true);
        must(property('meta[status][banned]', user)).equal(true);
        must(property('\'dot.value\'', user)).equal('...');
        must(property('name[\'dot.name\']', user)).equal('Joe.M');
        must(property('nam', user)).be.undefined();
    });

    it('should not mistreat zeros', function() {

        must(property('the.zero.value', {
            the: {
                zero: {
                    value: 0
                }
            }
        })).be(0);

        must(property('the.zero.value', {
            the: {
                zero: {
                    value: '0'
                }
            }
        })).be('0');

    });

    it('should set single values', function() {

        must(property('name', 'sana', {})).eql({
            name: 'sana'
        });

    });

    it('should set nested (1) values', function() {

        o = property('name.first', 'Bob', user);

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

        o = property('meta.status.banned', false, user);
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

        o = property('points', 0, user);

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

    it('should properly clone', function() {

        var o = {
            a: 1,
            b: 'c',
            d: {
                __CLONE__: function(f) {
                    return {
                        aa: f(11)
                    };
                }
            }
        };

        must(property('e', 40, o)).eql({
            a: 1,
            b: 'c',
            d: {
                aa: 11
            },
            e: 40
        });

    });

    it('should properly clone arrays', function() {

        must(property('name', 'Justin', {
            name: 'Agnes',
            meta: {
                hits: [1, 1, 0, {
                    c: {
                        n: []
                    }
                }]
            }
        })).eql({
            name: 'Justin',
            meta: {
                hits: [1, 1, 0, {
                    c: {
                        n: []
                    }
                }]
            }
        });

    });

});
