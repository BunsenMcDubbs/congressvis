import glob
import requests
import json
import sys
import argparse

def sendVotes(hrdbname='hr-votes', sdbname='s-votes', pathToVotes='./113/votes/', rootURL='http://127.0.0.1:5984/'):
    rootURLHR = rootURL + hrdbname + '/'
    rootURLS = rootURL + sdbname + '/'
    pathToVotes = pathToVotes + "*/*/data.json"
    votesImported = 0
    for path in glob.iglob(pathToVotes):
        with open(path, 'r') as vote:
            voteData = vote.read()
            voteID = json.loads(voteData)['vote_id']
            if voteID[0] == 'h':
                r = requests.put(rootURLHR + voteID, voteData)
            else:
                r = requests.put(rootURLS + voteID, voteData)
            if 'ok' not in r.json():
                print r.json();

        votesImported += 1

        if votesImported % 100 == 0:
            print 'finished ' + str(votesImported)

    print 'finished importing all'

def main(argv):
    parser = argparse.ArgumentParser(description='bulk import data from GovTrack.us to CouchDB')
    # parser.add_argument('-d', '--db', help='name of the CouchDB database', required=True)
    parser.add_argument('-u', '--url', nargs='?', help='root url of the database, default: http://127.0.0.1:5984/', default='http://127.0.0.1:5984/')
    parser.add_argument('-p', '--path', nargs='?', help='path to votes, default: current directory', default='.')
    args = vars(parser.parse_args(argv))
    if args['url'][:7] != 'http://':
        args['url'] = 'http://' + args['url']
    if args['url'][-1] != '/':
        args['url'] = args['url'] + '/'
    if args['path'][-1] != '/':
        args['path'] = args['path'] + '/'
    # sendVotes(dbname=args['db'], pathToVotes=args['path'], rootURL=args['url'])
    sendVotes(pathToVotes=args['path'], rootURL=args['url'])

if __name__ == '__main__':
    main(sys.argv[1:])
