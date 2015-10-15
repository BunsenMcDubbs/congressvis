import glob
import requests
import json
import sys
import argparse

def sendBills(dbname='s', pathToBills='./113/bills/s/', rootURL='http://127.0.0.1:5984/'):
    rootURL = rootURL + dbname + '/'
    pathToBills = pathToBills + "*/data.json"
    billsImported = 0
    for path in glob.iglob(pathToBills):
        with open(path, 'r') as bill:
            billData = bill.read()
            billID = json.loads(billData)['bill_id']
            r = requests.put(rootURL + billID, billData)
            if 'ok' not in r.json():
                print r.json();

        billsImported += 1

        if billsImported % 100 == 0:
            print 'finished ' + str(billsImported)

    print 'finished importing all'

def main(argv):
    parser = argparse.ArgumentParser(description='bulk import data from GovTrack.us to CouchDB')
    parser.add_argument('-d', '--db', help='name of the CouchDB database', required=True)
    parser.add_argument('-u', '--url', nargs='?', help='root url of the database, default: http://127.0.0.1:5984/', default='http://127.0.0.1:5984/')
    parser.add_argument('-p', '--path', nargs='?', help='path to bills or resolutions, default: current directory', default='.')
    args = vars(parser.parse_args(argv))
    if args['url'][:7] != 'http://':
        args['url'] = 'http://' + args['url']
    if args['url'][-1] != '/':
        args['url'] = args['url'] + '/'
    if args['path'][-1] != '/':
        args['path'] = args['path'] + '/'
    sendBills(dbname=args['db'], pathToBills=args['path'], rootURL=args['url'])

if __name__ == '__main__':
    main(sys.argv[1:])
