/*
* Copyright © 2017 VMware, Inc. All Rights Reserved.
* SPDX-License-Identifier: BSD-2-Clause
*/

"use strict";

exports.root = function (req, res) {
    const base = `${protocol(req)}://${host(req)}`;
    const body = {
        image: {href: `${base}/images/connector.png`},
        test_auth: {href: `${base}/test-auth`},
        config: {
            foo: {
                default: 'bar',
                type: 'STRING',
                label: {
                    'en-US': 'Foo',
                    'es-ES': 'Foo'
                },
                description: {
                    'en-US': 'This ...',
                    'es-ES': 'Este ...'
                },
                validators: [
                    {
                        type: 'required',
                        description: {
                            'en-US': 'Foo is required',
                            'es-ES': '...'
                        }
                    },
                    {
                        type: 'regex',
                        value: '^\\w+$',
                        description: {
                            'en-US': 'Foo must be only letters and number',
                            'es-ES': '...'
                        }
                    },
                    {
                        type: 'max_length',
                        value: '10',
                        description: {
                            'en-US': 'Foo must not be more than 10 characters',
                            'es-ES': '...'
                        }
                    }
                ]
            }
        },
        actions: {
            clear: {
                url: {
                    href: `${base}/clear`
                },
                user_input: [],
                request: {},
                label: 'Clear Reported Data',
                type: 'POST',
                action_key: 'DIRECT'
            }
        },
        object_types: {
            card: {
                doc: {href: "https://github.com/vmware-samples/card-connectors-guide/wiki/Card-Responses"},
                fields: {
                    zip: {capture_group: 1, regex: "([0-9]{5})(?:[- ][0-9]{4})?"}
                },
                endpoint: {href: `${base}/cards/requests`}
            }
        }
    };
    res.json(body);
};

function protocol(req) {
    // Express looks for X-Forwarded-Proto
    return req.protocol;
}

function host(req) {
    // request.hostname is broken in Express 4 so we have to deal with the X-Forwarded- headers ourselves
    const forwardedHost = req.headers['x-forwarded-host'];
    const forwardedPort = req.headers['x-forwarded-port'];
    if (forwardedHost && forwardedPort) {
        return forwardedHost + ':' + forwardedPort;
    } else {
        return req.headers.host;
    }
}
