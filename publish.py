#!/usr/bin/env python2

import json
import os
import requests
import sys

__BASEDIR = './src'


def main(args):
    branch = 'default'
    if len(args) == 2:
        branch = args[1]

    data = {
        'branch': branch,
        'modules': {},
    }

    for filename in os.listdir(__BASEDIR):
        if filename.endswith('.js'):
            with open(os.path.join(__BASEDIR, filename), 'r') as f:
                data['modules'][filename[:-3]] = f.read()

    result = json.dumps(requests.post('https://screeps.com/api/user/code', json=data,
                                      auth=(os.environ['EMAIL'], os.environ['PASSWORD'])).json(), indent=2)

    if 'error' in result:
        return 1

    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv))
