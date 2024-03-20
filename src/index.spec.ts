import { afterEach, describe, expect, it, vi } from 'vitest';

import { createClient, parseOpenApiSpecification } from './index';
import * as parseV2 from './openApi/v2';
import * as parseV3 from './openApi/v3';

describe('index', () => {
    it('parses v2 without issues', async () => {
        await createClient({
            input: './test/spec/v2.json',
            output: './generated/v2/',
            write: false,
        });
    });

    it('parses v3 without issues', async () => {
        await createClient({
            input: './test/spec/v3.json',
            output: './generated/v3/',
            write: false,
        });
    });

    it('downloads and parses v2 without issues', async () => {
        await createClient({
            input: 'https://raw.githubusercontent.com/ferdikoomen/openapi-typescript-codegen/master/test/spec/v2.json',
            output: './generated/v2-downloaded/',
            write: false,
        });
    });

    it('downloads and parses v3 without issues', async () => {
        await createClient({
            input: 'https://raw.githubusercontent.com/ferdikoomen/openapi-typescript-codegen/master/test/spec/v3.json',
            output: './generated/v3-downloaded/',
            write: false,
        });
    });
});

describe('parseOpenApiSpecification', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    const options: Parameters<typeof parseOpenApiSpecification>[1] = {
        client: 'fetch',
        enums: true,
        exportCore: true,
        exportModels: true,
        exportSchemas: true,
        exportServices: true,
        format: true,
        input: '',
        lint: false,
        operationId: true,
        output: '',
        postfixModels: '',
        postfixServices: '',
        serviceResponse: 'body',
        useDateType: false,
        useOptions: true,
        write: false,
    };

    it('uses v2 parser', () => {
        const spy = vi.spyOn(parseV2, 'parse');

        const spec: Parameters<typeof parseOpenApiSpecification>[0] = {
            info: {
                title: 'dummy',
                version: '1.0',
            },
            paths: {},
            swagger: '2',
        };
        parseOpenApiSpecification(spec, options);
        expect(spy).toHaveBeenCalledWith(spec, options);

        const spec2: Parameters<typeof parseOpenApiSpecification>[0] = {
            info: {
                title: 'dummy',
                version: '1.0',
            },
            paths: {},
            swagger: '2.0',
        };
        parseOpenApiSpecification(spec2, options);
        expect(spy).toHaveBeenCalledWith(spec2, options);
    });

    it('uses v3 parser', () => {
        const spy = vi.spyOn(parseV3, 'parse');

        const spec: Parameters<typeof parseOpenApiSpecification>[0] = {
            info: {
                title: 'dummy',
                version: '1.0',
            },
            openapi: '3',
            paths: {},
        };
        parseOpenApiSpecification(spec, options);
        expect(spy).toHaveBeenCalledWith(spec, options);

        const spec2: Parameters<typeof parseOpenApiSpecification>[0] = {
            info: {
                title: 'dummy',
                version: '1.0',
            },
            openapi: '3.0',
            paths: {},
        };
        parseOpenApiSpecification(spec2, options);
        expect(spy).toHaveBeenCalledWith(spec2, options);

        const spec3: Parameters<typeof parseOpenApiSpecification>[0] = {
            info: {
                title: 'dummy',
                version: '1.0',
            },
            openapi: '3.1.0',
            paths: {},
        };
        parseOpenApiSpecification(spec3, options);
        expect(spy).toHaveBeenCalledWith(spec3, options);
    });

    it('throws on unknown version', () => {
        // @ts-ignore
        expect(() => parseOpenApiSpecification({ foo: 'bar' }, options)).toThrow(
            `Unsupported Open API specification: ${JSON.stringify({ foo: 'bar' }, null, 2)}`
        );
    });
});
