import sys
import yaml
import json
import argparse
import requests

def importMembers(filename, rootURL='http://127.0.0.1:5984/', dbname='members'):
    rootURL = rootURL + dbname + '/'
    membersFile = open(filename, 'r')
    data = yaml.load(membersFile)
    for person in data:
        thomasID = person['id']['thomas']
        r = requests.put(rootURL + thomasID, json.dumps(person))
        if 'ok' not in r.json():
            print r.json()
        print thomasID

def main(argv):
    parser = argparse.ArgumentParser(description="import congressional membership data")
    parser.add_argument('-p', '--path', nargs='?', help='path to membership file, default: \'legislators-current.yaml\'', default='legislators-current.yaml')
    args = vars(parser.parse_args(argv))
    importMembers(args['path'])

if __name__ == "__main__":
    main(sys.argv[1:])
