import { describe, expect, it } from 'vitest';

import { getServiceName, getServiceVersion } from '../service';

describe('getServiceName', () => {
    it('should produce correct result', () => {
        expect(getServiceName('')).toEqual('');
        expect(getServiceName('FooBar')).toEqual('FooBar');
        expect(getServiceName('Foo Bar')).toEqual('FooBar');
        expect(getServiceName('foo bar')).toEqual('FooBar');
        expect(getServiceName('@fooBar')).toEqual('FooBar');
        expect(getServiceName('$fooBar')).toEqual('FooBar');
        expect(getServiceName('123fooBar')).toEqual('FooBar');
        expect(getServiceName('non-ascii-æøåÆØÅöôêÊ字符串')).toEqual('NonAsciiÆøåÆøÅöôêÊ字符串');
    });
});

describe('getServiceVersion', () => {
    it('should produce correct result', () => {
        expect(getServiceVersion('1.0')).toEqual('1.0');
        expect(getServiceVersion('v1.0')).toEqual('1.0');
        expect(getServiceVersion('V1.0')).toEqual('1.0');
    });
});
